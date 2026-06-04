"use server";

import { revalidatePath } from "next/cache";

import { hasAdminSession } from "@/lib/admin-auth";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import type { LeadNote, LeadSourceType, LeadStatus, SubmissionResult } from "@/types";

const missingServiceRoleMessage = "Správa leadů vyžaduje serverový Supabase klíč.";
const missingSessionMessage = "Administrace vyžaduje platné přihlášení.";
const leadStatuses: LeadStatus[] = [
  "new",
  "contacted",
  "scheduled",
  "offer_sent",
  "waiting_decision",
  "closed",
  "rejected",
];
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function updateCrmLeadStatusAction({
  leadType,
  leadId,
  status,
}: {
  leadType: LeadSourceType;
  leadId: string;
  status: LeadStatus;
}): Promise<SubmissionResult> {
  const authError = await assertLeadMutationAllowed();
  if (authError) return authError;

  if (!isValidLeadType(leadType) || !isUuid(leadId) || !leadStatuses.includes(status)) {
    return { ok: false, configured: true, error: "Neplatná změna statusu leadu." };
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { ok: false, configured: false, error: missingServiceRoleMessage };
  }

  const tableName = leadType === "appointment" ? "appointment_requests" : "inquiries";

  try {
    const { data: currentLead, error: currentError } = await supabase
      .from(tableName)
      .select("status")
      .eq("id", leadId)
      .maybeSingle();

    if (currentError) {
      return { ok: false, configured: true, error: currentError.message };
    }

    if (!currentLead) {
      return { ok: false, configured: true, error: "Lead nebyl nalezen." };
    }

    const fromStatus = normalizeLeadStatus(String(currentLead.status ?? ""));

    let { error: updateError } = await supabase
      .from(tableName)
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", leadId);

    if (updateError && isMissingColumnError(updateError.message, "updated_at")) {
      const fallbackUpdate = await supabase
        .from(tableName)
        .update({ status })
        .eq("id", leadId);
      updateError = fallbackUpdate.error;
    }

    if (updateError) {
      return { ok: false, configured: true, error: updateError.message };
    }

    const { error: historyError } = await supabase.from("lead_status_history").insert({
      lead_type: leadType,
      lead_id: leadId,
      from_status: fromStatus,
      to_status: status,
      note: "Změna statusu v administraci DriveAuto.",
    });

    if (historyError) {
      return {
        ok: true,
        configured: true,
        message: "Status byl uložen. Historie statusu zatím není dostupná, zkontrolujte CRM migraci.",
        leadStatus: status,
      };
    }

    revalidatePath("/admin");

    return {
      ok: true,
      configured: true,
      message: "Status leadu byl uložen.",
      leadStatus: status,
    };
  } catch (error) {
    return {
      ok: false,
      configured: true,
      error: error instanceof Error ? error.message : "Změna statusu se nepodařila.",
    };
  }
}

export async function addLeadNoteAction({
  leadType,
  leadId,
  note,
}: {
  leadType: LeadSourceType;
  leadId: string;
  note: string;
}): Promise<SubmissionResult> {
  const authError = await assertLeadMutationAllowed();
  if (authError) return authError;

  if (!isValidLeadType(leadType) || !isUuid(leadId)) {
    return { ok: false, configured: true, error: "Neplatný lead pro uložení poznámky." };
  }

  const normalizedNote = note.trim();

  if (normalizedNote.length < 2) {
    return { ok: false, configured: true, error: "Poznámka musí obsahovat text." };
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { ok: false, configured: false, error: missingServiceRoleMessage };
  }

  try {
    const { data, error } = await supabase
      .from("lead_notes")
      .insert({
        lead_type: leadType,
        lead_id: leadId,
        note: normalizedNote,
      })
      .select("id,note,created_at")
      .single();

    if (error) {
      return { ok: false, configured: true, error: error.message };
    }

    const leadNote: LeadNote = {
      id: data.id,
      text: data.note || normalizedNote,
      createdAt: formatDateTime(data.created_at),
    };

    revalidatePath("/admin");

    return {
      ok: true,
      configured: true,
      message: "Poznámka byla uložena.",
      leadNote,
    };
  } catch (error) {
    return {
      ok: false,
      configured: true,
      error: error instanceof Error ? error.message : "Uložení poznámky se nepodařilo.",
    };
  }
}

async function assertLeadMutationAllowed(): Promise<SubmissionResult | null> {
  if (!(await hasAdminSession())) {
    return { ok: false, configured: true, error: missingSessionMessage };
  }

  return null;
}

function isValidLeadType(value: string): value is LeadSourceType {
  return value === "inquiry" || value === "appointment";
}

function isUuid(value?: string) {
  return Boolean(value && uuidPattern.test(value));
}

function normalizeLeadStatus(status: string): LeadStatus {
  if (status === "completed") return "closed";
  if (leadStatuses.includes(status as LeadStatus)) return status as LeadStatus;
  return "new";
}

function isMissingColumnError(message: string, column: string) {
  return message.toLowerCase().includes(column.toLowerCase());
}

function formatDateTime(value?: string | null) {
  if (!value) return "Neuvedeno";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
