"use client";

import {
  CalendarClock,
  Car,
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  MessageSquare,
  Phone,
  StickyNote,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

import { addLeadNoteAction, updateCrmLeadStatusAction } from "@/app/admin/lead-actions";
import { Button } from "@/components/ui/button";
import type { CrmLead, LeadNote, LeadStatus, LeadStatusHistoryEntry } from "@/types";

const statusLabels: Record<LeadStatus, string> = {
  new: "Nový",
  contacted: "Kontaktován",
  scheduled: "Schůzka domluvena",
  offer_sent: "Nabídka odeslána",
  waiting_decision: "Čeká na rozhodnutí",
  closed: "Uzavřeno",
  rejected: "Zamítnuto",
};

const statusOptions: LeadStatus[] = [
  "new",
  "contacted",
  "scheduled",
  "offer_sent",
  "waiting_decision",
  "closed",
  "rejected",
];

const pipelineFilters: Array<{ id: LeadStatus | "all"; label: string }> = [
  { id: "all", label: "Vše" },
  ...statusOptions.map((status) => ({ id: status, label: statusLabels[status] })),
];

export function LeadManagement({ leads }: { leads: CrmLead[] }) {
  const [localLeads, setLocalLeads] = useState(leads);
  const [selected, setSelected] = useState<CrmLead | null>(leads[0] ?? null);
  const [activeStatus, setActiveStatus] = useState<LeadStatus | "all">("all");
  const [notice, setNotice] = useState<string | null>(null);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const stats = useMemo(() => getLeadStats(localLeads), [localLeads]);
  const filteredLeads = useMemo(
    () => localLeads.filter((lead) => activeStatus === "all" || lead.status === activeStatus),
    [activeStatus, localLeads],
  );
  const statusCounts = useMemo(() => getStatusCounts(localLeads), [localLeads]);

  async function handleStatusChange(lead: CrmLead, status: LeadStatus) {
    if (lead.status === status) return;

    const key = `status-${lead.id}`;
    setPendingKey(key);
    setNotice(null);

    const result = await updateCrmLeadStatusAction({
      leadType: lead.sourceType,
      leadId: lead.sourceId,
      status,
    });

    setPendingKey(null);

    if (!result.ok) {
      setNotice(result.error || "Změna statusu se nepodařila.");
      return;
    }

    const historyEntry: LeadStatusHistoryEntry = {
      id: `${lead.id}-${lead.status}-${status}-local`,
      fromStatus: lead.status,
      toStatus: status,
      note: "Změna statusu v administraci DriveAuto.",
      createdAt: "Právě teď",
    };

    updateLead(lead.id, (item) => ({
      ...item,
      status,
      updatedAt: "Právě teď",
      statusHistory: [historyEntry, ...item.statusHistory],
    }));
    setNotice(result.message || "Status leadu byl uložen.");
  }

  async function handleAddNote(lead: CrmLead) {
    const normalizedNote = noteText.trim();

    if (!normalizedNote) {
      setNotice("Poznámka musí obsahovat text.");
      return;
    }

    const key = `note-${lead.id}`;
    setPendingKey(key);
    setNotice(null);

    const result = await addLeadNoteAction({
      leadType: lead.sourceType,
      leadId: lead.sourceId,
      note: normalizedNote,
    });

    setPendingKey(null);

    if (!result.ok || !result.leadNote) {
      setNotice(result.error || "Uložení poznámky se nepodařilo.");
      return;
    }

    updateLead(lead.id, (item) => ({
      ...item,
      notes: [result.leadNote as LeadNote, ...item.notes],
      updatedAt: "Právě teď",
    }));
    setNoteText("");
    setNotice(result.message || "Poznámka byla uložena.");
  }

  function updateLead(leadId: string, updater: (lead: CrmLead) => CrmLead) {
    setLocalLeads((items) => items.map((item) => (item.id === leadId ? updater(item) : item)));
    setSelected((current) => (current?.id === leadId ? updater(current) : current));
  }

  return (
    <section id="poptavky" className="mt-7 rounded-2xl border border-brand-line bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-bold uppercase text-brand-blue">CRM leady</p>
          <h2 className="mt-2 text-2xl font-bold text-brand-navy">
            Obchodní pipeline DriveAuto
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-brand-muted">
            Sjednocený přehled kontaktních poptávek, dotazů k vozům a žádostí o prohlídku.
            Interní poznámky a historie statusů jsou viditelné pouze v administraci.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center text-xs font-semibold text-brand-muted md:grid-cols-4">
          <Metric value={stats.newLeads} label="Nové" />
          <Metric value={stats.openLeads} label="Otevřené" />
          <Metric value={stats.closedLeads} label="Uzavřené" />
          <Metric value={`${stats.conversionRate}%`} label="Konverze" />
        </div>
      </div>

      {notice ? (
        <p
          aria-live="polite"
          className={
            notice.includes("uložen") || notice.includes("uložena")
              ? "mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
              : "mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800"
          }
        >
          {notice}
        </p>
      ) : null}

      <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
        {pipelineFilters.map((filter) => {
          const count = filter.id === "all" ? localLeads.length : statusCounts[filter.id];
          const isActive = activeStatus === filter.id;

          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveStatus(filter.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${
                isActive
                  ? "border-brand-blue bg-brand-blue text-white"
                  : "border-brand-line bg-white text-brand-navy hover:border-brand-blue/35 hover:bg-brand-soft"
              }`}
            >
              {filter.label}
              <span className={isActive ? "ml-2 text-white/80" : "ml-2 text-brand-muted"}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="grid min-w-0 gap-3">
          {filteredLeads.length ? (
            filteredLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                isActive={selected?.id === lead.id}
                isPending={pendingKey === `status-${lead.id}`}
                onOpen={() => setSelected(lead)}
                onStatusChange={(status) => handleStatusChange(lead, status)}
              />
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-brand-line bg-brand-soft/45 px-4 py-8 text-center text-sm text-brand-muted">
              Pro vybraný status zatím nejsou žádné leady.
            </p>
          )}
        </div>

        <LeadDetailPanel
          selected={selected}
          noteText={noteText}
          isNotePending={selected ? pendingKey === `note-${selected.id}` : false}
          onClose={() => setSelected(null)}
          onNoteChange={setNoteText}
          onAddNote={() => selected && handleAddNote(selected)}
        />
      </div>
    </section>
  );
}

function LeadCard({
  lead,
  isActive,
  isPending,
  onOpen,
  onStatusChange,
}: {
  lead: CrmLead;
  isActive: boolean;
  isPending: boolean;
  onOpen: () => void;
  onStatusChange: (status: LeadStatus) => void;
}) {
  return (
    <article
      className={`rounded-2xl border bg-white p-4 shadow-sm transition ${
        isActive ? "border-brand-blue/50 ring-4 ring-brand-blue/10" : "border-brand-line hover:border-brand-blue/35"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <button type="button" onClick={onOpen} className="min-w-0 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-blue">
              {lead.leadId}
            </span>
            <StatusBadge status={lead.status} />
          </div>
          <h3 className="mt-3 text-lg font-bold text-brand-navy">{lead.name}</h3>
          <p className="mt-1 text-sm text-brand-muted">{lead.source}</p>
        </button>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            value={lead.status}
            onChange={(event) => onStatusChange(event.target.value as LeadStatus)}
            className="h-10 rounded-lg border border-brand-line bg-white px-3 text-sm font-semibold text-brand-navy outline-none focus:border-brand-blue"
            disabled={isPending}
            aria-label="Změnit status leadu"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {statusLabels[option]}
              </option>
            ))}
          </select>
          <Button type="button" variant="secondary" className="h-10" onClick={onOpen}>
            Detail
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-brand-muted md:grid-cols-3">
        <InlineInfo icon={<Phone className="h-4 w-4" />} value={lead.phone} />
        <InlineInfo icon={<Mail className="h-4 w-4" />} value={lead.email} />
        <InlineInfo icon={<Car className="h-4 w-4" />} value={lead.vehicleName} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-brand-muted">
        <span>Vytvořeno: {lead.createdAt}</span>
        <span>Upraveno: {lead.updatedAt}</span>
        <span>Poznámky: {lead.notes.length}</span>
      </div>
    </article>
  );
}

function LeadDetailPanel({
  selected,
  noteText,
  isNotePending,
  onClose,
  onNoteChange,
  onAddNote,
}: {
  selected: CrmLead | null;
  noteText: string;
  isNotePending: boolean;
  onClose: () => void;
  onNoteChange: (value: string) => void;
  onAddNote: () => void;
}) {
  if (!selected) {
    return (
      <aside className="rounded-2xl border border-brand-line bg-brand-soft/50 p-5 text-sm leading-6 text-brand-muted xl:sticky xl:top-24">
        Vyberte lead pro zobrazení detailu, poznámek a historie statusů.
      </aside>
    );
  }

  return (
    <aside className="rounded-2xl border border-brand-line bg-white p-5 shadow-sm xl:sticky xl:top-24">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase text-brand-blue">{selected.leadId}</p>
          <h3 className="mt-2 text-xl font-bold text-brand-navy">{selected.name}</h3>
          <p className="mt-1 text-sm text-brand-muted">{selected.source}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-line text-brand-muted hover:bg-brand-soft"
          aria-label="Zavřít detail leadu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 grid gap-3">
        <DetailLine icon={<User className="h-4 w-4" />} label="Jméno" value={selected.name} />
        <DetailLine icon={<Phone className="h-4 w-4" />} label="Telefon" value={selected.phone} />
        <DetailLine icon={<Mail className="h-4 w-4" />} label="E-mail" value={selected.email} />
        <DetailLine label="Status" value={statusLabels[selected.status]} />
        <DetailVehicle lead={selected} />
        {selected.appointmentDate || selected.appointmentTime ? (
          <div className="grid gap-2 sm:grid-cols-2">
            <DetailLine icon={<CalendarClock className="h-4 w-4" />} label="Datum prohlídky" value={selected.appointmentDate ?? "Neuvedeno"} />
            <DetailLine icon={<Clock className="h-4 w-4" />} label="Čas prohlídky" value={selected.appointmentTime ?? "Neuvedeno"} />
          </div>
        ) : null}
        <DetailText label={selected.sourceType === "appointment" ? "Poznámka z formuláře" : "Zpráva"} value={selected.appointmentNote ?? selected.message ?? "Bez zprávy"} />
      </div>

      <section className="mt-5 rounded-2xl border border-brand-line bg-brand-soft/45 p-4">
        <h4 className="flex items-center gap-2 font-bold text-brand-navy">
          <StickyNote className="h-4 w-4 text-brand-blue" />
          Interní poznámky
        </h4>
        <textarea
          value={noteText}
          onChange={(event) => onNoteChange(event.currentTarget.value)}
          className="mt-3 min-h-24 w-full rounded-lg border border-brand-line bg-white p-3 text-sm outline-none focus:border-brand-blue"
          placeholder="Např. voláno zákazníkovi, čekáme na rozhodnutí, prohlídka proběhla..."
        />
        <Button type="button" className="mt-3 h-10" disabled={isNotePending} onClick={onAddNote}>
          <MessageSquare className="h-4 w-4" />
          {isNotePending ? "Ukládám..." : "Přidat poznámku"}
        </Button>

        <div className="mt-4 grid gap-2">
          {selected.notes.length ? (
            selected.notes.map((note) => (
              <div key={note.id} className="rounded-xl border border-brand-line bg-white px-3 py-3">
                <p className="text-sm leading-6 text-brand-navy">{note.text}</p>
                <p className="mt-1 text-xs font-semibold text-brand-muted">{note.createdAt}</p>
              </div>
            ))
          ) : (
            <p className="rounded-xl border border-dashed border-brand-line bg-white px-3 py-4 text-sm text-brand-muted">
              Zatím nejsou uložené žádné interní poznámky.
            </p>
          )}
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-brand-line bg-white p-4">
        <h4 className="flex items-center gap-2 font-bold text-brand-navy">
          <CheckCircle2 className="h-4 w-4 text-brand-blue" />
          Historie statusů
        </h4>
        <div className="mt-4 grid gap-3">
          {selected.statusHistory.map((entry) => (
            <div key={entry.id} className="rounded-xl bg-brand-soft/55 px-3 py-3 text-sm">
              <p className="font-bold text-brand-navy">
                {entry.fromStatus ? `${statusLabels[entry.fromStatus]} → ` : ""}
                {statusLabels[entry.toStatus]}
              </p>
              {entry.note ? <p className="mt-1 leading-6 text-brand-muted">{entry.note}</p> : null}
              <p className="mt-1 text-xs font-semibold text-brand-muted">{entry.createdAt}</p>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}

function DetailVehicle({ lead }: { lead: CrmLead }) {
  return (
    <div className="rounded-xl border border-brand-line bg-white px-3 py-3">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase text-brand-muted">
        <Car className="h-4 w-4 text-brand-blue" />
        Vůz
      </p>
      <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="break-words font-bold text-brand-navy">{lead.vehicleName || "Bez vybraného vozu"}</p>
        {lead.vehicleSlug ? (
          <Link
            href={`/nabidka-vozu/${lead.vehicleSlug}`}
            className="inline-flex items-center gap-1 text-sm font-bold text-brand-blue hover:text-brand-blue-dark"
          >
            Otevřít vůz
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function InlineInfo({ icon, value }: { icon: ReactNode; value: string }) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <span className="shrink-0 text-brand-blue">{icon}</span>
      <span className="truncate">{value || "Neuvedeno"}</span>
    </span>
  );
}

function DetailLine({ icon, label, value }: { icon?: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-brand-line bg-white px-3 py-3">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase text-brand-muted">
        {icon ? <span className="text-brand-blue">{icon}</span> : null}
        {label}
      </p>
      <p className="mt-1 break-words font-bold text-brand-navy">{value || "Neuvedeno"}</p>
    </div>
  );
}

function DetailText({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-brand-line bg-white px-3 py-3">
      <p className="text-xs font-semibold uppercase text-brand-muted">{label}</p>
      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-brand-navy">{value || "Neuvedeno"}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const className =
    status === "closed"
      ? "bg-emerald-50 text-emerald-700"
      : status === "rejected"
        ? "bg-rose-50 text-rose-700"
        : status === "waiting_decision"
          ? "bg-amber-50 text-amber-800"
          : status === "offer_sent"
          ? "bg-brand-soft text-brand-blue"
            : status === "scheduled"
              ? "bg-indigo-50 text-indigo-700"
              : status === "contacted"
                ? "bg-slate-100 text-slate-700"
                : "bg-brand-soft text-brand-blue";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${className}`}>
      {statusLabels[status]}
    </span>
  );
}

function Metric({ value, label }: { value: number | string; label: string }) {
  return (
    <span className="rounded-xl border border-brand-line bg-white px-3 py-2">
      <span className="block text-lg font-bold text-brand-navy">{value}</span>
      <span className="block">{label}</span>
    </span>
  );
}

function getStatusCounts(leads: CrmLead[]) {
  return leads.reduce<Record<LeadStatus, number>>(
    (counts, lead) => {
      counts[lead.status] += 1;
      return counts;
    },
    {
      new: 0,
      contacted: 0,
      scheduled: 0,
      offer_sent: 0,
      waiting_decision: 0,
      closed: 0,
      rejected: 0,
    },
  );
}

function getLeadStats(leads: CrmLead[]) {
  const newLeads = leads.filter((lead) => lead.status === "new").length;
  const closedLeads = leads.filter((lead) => lead.status === "closed").length;
  const rejectedLeads = leads.filter((lead) => lead.status === "rejected").length;
  const openLeads = leads.length - closedLeads - rejectedLeads;
  const conversionRate = leads.length ? Math.round((closedLeads / leads.length) * 100) : 0;

  return {
    newLeads,
    openLeads,
    closedLeads,
    conversionRate,
  };
}
