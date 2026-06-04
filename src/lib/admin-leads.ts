import "server-only";

import { appointmentRequests as fallbackAppointments } from "@/data/appointment-requests";
import { inquiries as fallbackInquiries } from "@/data/inquiries";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import type {
  AppointmentRequest,
  CrmLead,
  Inquiry,
  LeadNote,
  LeadSourceType,
  LeadStatus,
  LeadStatusHistoryEntry,
} from "@/types";

type RelatedVehicleRow = {
  id: string | null;
  slug: string | null;
  brand: string | null;
  model: string | null;
  title: string | null;
  status: string | null;
};

type RelatedVehicleValue = RelatedVehicleRow | RelatedVehicleRow[] | null;

type InquiryLeadRow = {
  id: string;
  type: string | null;
  name: string | null;
  phone: string | null;
  email: string | null;
  vehicle_id: string | null;
  message: string | null;
  status: string | null;
  source_page: string | null;
  created_at: string | null;
  updated_at?: string | null;
  vehicle?: RelatedVehicleValue;
};

type AppointmentLeadRow = {
  id: string;
  vehicle_id: string | null;
  name: string | null;
  phone: string | null;
  email: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  note: string | null;
  status: string | null;
  created_at: string | null;
  updated_at?: string | null;
  vehicle?: RelatedVehicleValue;
};

type LeadNoteRow = {
  id: string;
  lead_type: LeadSourceType;
  lead_id: string;
  note: string | null;
  created_at: string | null;
};

type LeadStatusHistoryRow = {
  id: string;
  lead_type: LeadSourceType;
  lead_id: string;
  from_status: string | null;
  to_status: string | null;
  note: string | null;
  created_at: string | null;
};

const crmLeadStatuses: LeadStatus[] = [
  "new",
  "contacted",
  "scheduled",
  "offer_sent",
  "waiting_decision",
  "closed",
  "rejected",
];

const inquirySelectWithUpdatedAt =
  "id,type,name,phone,email,vehicle_id,message,status,source_page,created_at,updated_at,vehicle:vehicles(id,slug,brand,model,title,status)";
const inquirySelect =
  "id,type,name,phone,email,vehicle_id,message,status,source_page,created_at,vehicle:vehicles(id,slug,brand,model,title,status)";
const appointmentSelectWithUpdatedAt =
  "id,vehicle_id,name,phone,email,preferred_date,preferred_time,note,status,created_at,updated_at,vehicle:vehicles(id,slug,brand,model,title,status)";
const appointmentSelect =
  "id,vehicle_id,name,phone,email,preferred_date,preferred_time,note,status,created_at,vehicle:vehicles(id,slug,brand,model,title,status)";

export async function getCrmLeads(): Promise<CrmLead[]> {
  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    return fallbackCrmLeads();
  }

  try {
    const [inquiryRows, appointmentRows] = await Promise.all([
      fetchInquiryRows(),
      fetchAppointmentRows(),
    ]);
    const baseLeads = [
      ...inquiryRows.map(mapInquiryLeadRow),
      ...appointmentRows.map(mapAppointmentLeadRow),
    ].sort(sortLeadsByCreatedAt);
    const [notesByLead, historyByLead] = await Promise.all([
      fetchLeadNotes(),
      fetchLeadStatusHistory(),
    ]);

    return baseLeads.map((lead) => {
      const key = leadKey(lead.sourceType, lead.sourceId);
      const notes = notesByLead.get(key) ?? [];
      const statusHistory = historyByLead.get(key) ?? [
        {
          id: `${lead.id}-current-status`,
          toStatus: lead.status,
          note: "Aktuální status leadu.",
          createdAt: lead.updatedAt,
        },
      ];

      return {
        ...lead,
        notes,
        statusHistory,
      };
    });
  } catch (error) {
    warnAdminLeadFallback(getErrorMessage(error));
    return fallbackCrmLeads();
  }
}

async function fetchInquiryRows() {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return [] as InquiryLeadRow[];

  const response = await supabase
    .from("inquiries")
    .select(inquirySelectWithUpdatedAt)
    .order("created_at", { ascending: false });

  if (!response.error) {
    return (response.data ?? []) as unknown as InquiryLeadRow[];
  }

  if (!isMissingColumnError(response.error.message, "updated_at")) {
    throw new Error(response.error.message);
  }

  const fallbackResponse = await supabase
    .from("inquiries")
    .select(inquirySelect)
    .order("created_at", { ascending: false });

  if (fallbackResponse.error) {
    throw new Error(fallbackResponse.error.message);
  }

  return (fallbackResponse.data ?? []) as unknown as InquiryLeadRow[];
}

async function fetchAppointmentRows() {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return [] as AppointmentLeadRow[];

  const response = await supabase
    .from("appointment_requests")
    .select(appointmentSelectWithUpdatedAt)
    .order("created_at", { ascending: false });

  if (!response.error) {
    return (response.data ?? []) as unknown as AppointmentLeadRow[];
  }

  if (!isMissingColumnError(response.error.message, "updated_at")) {
    throw new Error(response.error.message);
  }

  const fallbackResponse = await supabase
    .from("appointment_requests")
    .select(appointmentSelect)
    .order("created_at", { ascending: false });

  if (fallbackResponse.error) {
    throw new Error(fallbackResponse.error.message);
  }

  return (fallbackResponse.data ?? []) as unknown as AppointmentLeadRow[];
}

async function fetchLeadNotes() {
  const supabase = getSupabaseServiceClient();
  const notesByLead = new Map<string, LeadNote[]>();

  if (!supabase) return notesByLead;

  const { data, error } = await supabase
    .from("lead_notes")
    .select("id,lead_type,lead_id,note,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    warnAdminLeadFallback(`lead notes: ${error.message}`);
    return notesByLead;
  }

  for (const row of (data ?? []) as unknown as LeadNoteRow[]) {
    const key = leadKey(row.lead_type, row.lead_id);
    const currentNotes = notesByLead.get(key) ?? [];
    currentNotes.push({
      id: row.id,
      text: row.note || "Bez poznámky",
      createdAt: formatDateTime(row.created_at),
    });
    notesByLead.set(key, currentNotes);
  }

  return notesByLead;
}

async function fetchLeadStatusHistory() {
  const supabase = getSupabaseServiceClient();
  const historyByLead = new Map<string, LeadStatusHistoryEntry[]>();

  if (!supabase) return historyByLead;

  const { data, error } = await supabase
    .from("lead_status_history")
    .select("id,lead_type,lead_id,from_status,to_status,note,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    warnAdminLeadFallback(`lead status history: ${error.message}`);
    return historyByLead;
  }

  for (const row of (data ?? []) as unknown as LeadStatusHistoryRow[]) {
    const key = leadKey(row.lead_type, row.lead_id);
    const currentHistory = historyByLead.get(key) ?? [];
    currentHistory.push({
      id: row.id,
      fromStatus: normalizeLeadStatus(row.from_status),
      toStatus: normalizeLeadStatus(row.to_status),
      note: row.note ?? undefined,
      createdAt: formatDateTime(row.created_at),
    });
    historyByLead.set(key, currentHistory);
  }

  return historyByLead;
}

function mapInquiryLeadRow(row: InquiryLeadRow): CrmLead {
  const vehicle = normalizeRelatedVehicle(row.vehicle);

  return {
    id: leadKey("inquiry", row.id),
    sourceId: row.id,
    sourceType: "inquiry",
    leadId: `INQ-${row.id.slice(0, 8).toUpperCase()}`,
    name: row.name || "Bez jména",
    phone: row.phone || "Bude doplněno",
    email: row.email || "Bude doplněno",
    vehicleId: row.vehicle_id ?? undefined,
    vehicleName: relatedVehicleName(vehicle) || "Bez vybraného vozu",
    vehicleSlug: vehicle?.slug ?? undefined,
    source: row.source_page || row.type || "Kontaktní formulář",
    status: normalizeLeadStatus(row.status),
    notes: [],
    statusHistory: [],
    message: row.message || "Bez zprávy",
    createdAt: formatDateTime(row.created_at),
    updatedAt: formatDateTime(row.updated_at ?? row.created_at),
  };
}

function mapAppointmentLeadRow(row: AppointmentLeadRow): CrmLead {
  const vehicle = normalizeRelatedVehicle(row.vehicle);

  return {
    id: leadKey("appointment", row.id),
    sourceId: row.id,
    sourceType: "appointment",
    leadId: `APP-${row.id.slice(0, 8).toUpperCase()}`,
    name: row.name || "Bez jména",
    phone: row.phone || "Bude doplněno",
    email: row.email || "Bude doplněno",
    vehicleId: row.vehicle_id ?? undefined,
    vehicleName: relatedVehicleName(vehicle) || "Bez vybraného vozu",
    vehicleSlug: vehicle?.slug ?? undefined,
    source: "Domluvit prohlídku",
    status: normalizeLeadStatus(row.status),
    notes: [],
    statusHistory: [],
    appointmentDate: row.preferred_date || "Neuvedeno",
    appointmentTime: row.preferred_time || "Neuvedeno",
    appointmentNote: row.note || "Bez poznámky",
    createdAt: formatDateTime(row.created_at),
    updatedAt: formatDateTime(row.updated_at ?? row.created_at),
  };
}

function fallbackCrmLeads() {
  return [
    ...fallbackInquiries.map(mapFallbackInquiry),
    ...fallbackAppointments.map(mapFallbackAppointment),
  ].sort(sortLeadsByCreatedAt);
}

function mapFallbackInquiry(inquiry: Inquiry): CrmLead {
  return {
    id: leadKey("inquiry", inquiry.id),
    sourceId: inquiry.id,
    sourceType: "inquiry",
    leadId: `INQ-${inquiry.id.replace(/[^a-z0-9]/gi, "").slice(0, 8).toUpperCase()}`,
    name: inquiry.name,
    phone: inquiry.phone,
    email: inquiry.email,
    vehicleId: inquiry.vehicleId,
    vehicleName: inquiry.vehicleName,
    source: inquiry.sourcePage,
    status: normalizeLeadStatus(inquiry.status),
    notes: [],
    statusHistory: [
      {
        id: `${inquiry.id}-fallback-status`,
        toStatus: normalizeLeadStatus(inquiry.status),
        note: "Lokální fallback záznam.",
        createdAt: inquiry.createdAt,
      },
    ],
    message: inquiry.message,
    createdAt: inquiry.createdAt,
    updatedAt: inquiry.createdAt,
  };
}

function mapFallbackAppointment(appointment: AppointmentRequest): CrmLead {
  return {
    id: leadKey("appointment", appointment.id),
    sourceId: appointment.id,
    sourceType: "appointment",
    leadId: `APP-${appointment.id.replace(/[^a-z0-9]/gi, "").slice(0, 8).toUpperCase()}`,
    name: appointment.name,
    phone: appointment.phone,
    email: appointment.email,
    vehicleId: appointment.vehicleId,
    vehicleName: appointment.vehicleName,
    source: "Domluvit prohlídku",
    status: normalizeLeadStatus(appointment.status),
    notes: [],
    statusHistory: [
      {
        id: `${appointment.id}-fallback-status`,
        toStatus: normalizeLeadStatus(appointment.status),
        note: "Lokální fallback záznam.",
        createdAt: appointment.createdAt,
      },
    ],
    appointmentDate: appointment.preferredDate,
    appointmentTime: appointment.preferredTime,
    appointmentNote: appointment.note,
    createdAt: appointment.createdAt,
    updatedAt: appointment.createdAt,
  };
}

export function leadKey(leadType: LeadSourceType, leadId: string) {
  return `${leadType}-${leadId}`;
}

function sortLeadsByCreatedAt(left: CrmLead, right: CrmLead) {
  return parseDateTime(right.createdAt) - parseDateTime(left.createdAt);
}

function normalizeRelatedVehicle(vehicle?: RelatedVehicleValue) {
  if (!vehicle) return null;
  return Array.isArray(vehicle) ? vehicle[0] ?? null : vehicle;
}

function relatedVehicleName(vehicle: RelatedVehicleRow | null) {
  if (!vehicle) return "";
  return [vehicle.brand, vehicle.model, vehicle.title].filter(Boolean).join(" ");
}

function normalizeLeadStatus(status: string | null | undefined): LeadStatus {
  if (status === "completed") {
    return "closed";
  }

  if (status && crmLeadStatuses.includes(status as LeadStatus)) {
    return status as LeadStatus;
  }

  return "new";
}

function formatDateTime(value?: string | null) {
  if (!value) return "Neuvedeno";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function parseDateTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function isMissingColumnError(message: string, column: string) {
  return message.toLowerCase().includes(column.toLowerCase());
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown Supabase CRM error";
}

function warnAdminLeadFallback(message?: string) {
  console.warn(`[Supabase admin CRM] ${message || "using local fallback"}`);
}
