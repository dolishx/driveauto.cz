"use client";

import { CalendarClock, Clock, Mail, MessageSquare, Phone, User, X } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { updateInquiryStatus } from "@/lib/data";
import type { AppointmentRequest, Inquiry, LeadStatus } from "@/types";

const statusLabels: Record<LeadStatus, string> = {
  new: "Nová",
  contacted: "Kontaktováno",
  scheduled: "Naplánováno",
  completed: "Dokončeno",
  closed: "Uzavřeno",
};

const statusOptions: LeadStatus[] = ["new", "contacted", "scheduled", "completed", "closed"];

type SelectedLead =
  | { kind: "inquiry"; item: Inquiry }
  | { kind: "appointment"; item: AppointmentRequest };

export function LeadManagement({
  inquiries,
  appointmentRequests,
}: {
  inquiries: Inquiry[];
  appointmentRequests: AppointmentRequest[];
}) {
  const [localInquiries, setLocalInquiries] = useState(inquiries);
  const [localAppointments, setLocalAppointments] = useState(appointmentRequests);
  const [selected, setSelected] = useState<SelectedLead | null>(() => {
    if (inquiries[0]) return { kind: "inquiry", item: inquiries[0] };
    if (appointmentRequests[0]) return { kind: "appointment", item: appointmentRequests[0] };
    return null;
  });
  const [notice, setNotice] = useState<string | null>(null);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const leadCounts = useMemo(
    () => ({
      inquiries: localInquiries.length,
      appointments: localAppointments.length,
      newItems:
        localInquiries.filter((item) => item.status === "new").length +
        localAppointments.filter((item) => item.status === "new").length,
    }),
    [localAppointments, localInquiries],
  );

  async function handleStatusChange(kind: SelectedLead["kind"], id: string, status: LeadStatus) {
    const key = `${kind}-${id}`;
    setPendingKey(key);
    setNotice(null);

    if (kind === "inquiry") {
      setLocalInquiries((items) => updateStatus(items, id, status));
      setSelected((current) =>
        current?.kind === "inquiry" && current.item.id === id
          ? { kind, item: { ...current.item, status } }
          : current,
      );
    } else {
      setLocalAppointments((items) => updateStatus(items, id, status));
      setSelected((current) =>
        current?.kind === "appointment" && current.item.id === id
          ? { kind, item: { ...current.item, status } }
          : current,
      );
    }

    const result = await updateInquiryStatus({
      id,
      status,
      entity: kind === "appointment" ? "appointment" : "inquiry",
    });

    setPendingKey(null);

    if (!result.ok) {
      setNotice(result.error || "Změna statusu je zatím pouze v UI.");
      return;
    }

    setNotice("Status byl uložen do Supabase.");
  }

  return (
    <section id="poptavky" className="mt-7 rounded-2xl border border-brand-line bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-brand-blue">Poptávky</p>
              <h2 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-brand-navy">
                Lead management
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-brand-muted">
                Jednoduchý přehled kontaktních poptávek a žádostí o prohlídku. Změny statusu jsou připravené pro Supabase, ale mohou být blokované RLS.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-brand-muted">
              <Metric value={leadCounts.inquiries} label="Poptávky" />
              <Metric value={leadCounts.appointments} label="Prohlídky" />
              <Metric value={leadCounts.newItems} label="Nové" />
            </div>
          </div>

          {notice ? (
            <p
              aria-live="polite"
              className={
                notice.includes("uložen")
                  ? "mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
                  : "mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800"
              }
            >
              {notice}
            </p>
          ) : null}

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <LeadList
              title="Kontaktní poptávky"
              description="Dotazy z kontaktního formuláře a poptávky k vozům."
              emptyText="Zatím nejsou k dispozici žádné kontaktní poptávky."
            >
              {localInquiries.map((item) => (
                <InquiryCard
                  key={item.id}
                  inquiry={item}
                  isPending={pendingKey === `inquiry-${item.id}`}
                  onOpen={() => setSelected({ kind: "inquiry", item })}
                  onStatusChange={(status) => handleStatusChange("inquiry", item.id, status)}
                />
              ))}
            </LeadList>

            <LeadList
              title="Žádosti o prohlídku"
              description="Termíny vybrané přes formulář pro osobní prohlídku."
              emptyText="Zatím nejsou k dispozici žádné žádosti o prohlídku."
            >
              {localAppointments.map((item) => (
                <AppointmentCard
                  key={item.id}
                  appointment={item}
                  isPending={pendingKey === `appointment-${item.id}`}
                  onOpen={() => setSelected({ kind: "appointment", item })}
                  onStatusChange={(status) => handleStatusChange("appointment", item.id, status)}
                />
              ))}
            </LeadList>
          </div>
        </div>

        <LeadDetailPanel selected={selected} onClose={() => setSelected(null)} />
      </div>
    </section>
  );
}

function LeadList({
  title,
  description,
  emptyText,
  children,
}: {
  title: string;
  description: string;
  emptyText: string;
  children: ReactNode;
}) {
  const isEmpty = Array.isArray(children) && children.length === 0;

  return (
    <section className="min-w-0 rounded-2xl border border-brand-line bg-brand-soft/45 p-4">
      <h3 className="text-lg font-bold text-brand-navy">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-brand-muted">{description}</p>
      <div className="mt-4 grid gap-3">
        {isEmpty ? (
          <p className="rounded-xl border border-brand-line bg-white px-4 py-5 text-sm text-brand-muted">
            {emptyText}
          </p>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

function InquiryCard({
  inquiry,
  isPending,
  onOpen,
  onStatusChange,
}: {
  inquiry: Inquiry;
  isPending: boolean;
  onOpen: () => void;
  onStatusChange: (status: LeadStatus) => void;
}) {
  return (
    <article className="rounded-xl border border-brand-line bg-white p-4 shadow-sm">
      <LeadCardHeader
        title={inquiry.name}
        subtitle={inquiry.vehicleName}
        status={inquiry.status}
        createdAt={inquiry.createdAt}
      />
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-brand-muted">{inquiry.message}</p>
      <LeadCardFooter
        status={inquiry.status}
        isPending={isPending}
        onOpen={onOpen}
        onStatusChange={onStatusChange}
      />
    </article>
  );
}

function AppointmentCard({
  appointment,
  isPending,
  onOpen,
  onStatusChange,
}: {
  appointment: AppointmentRequest;
  isPending: boolean;
  onOpen: () => void;
  onStatusChange: (status: LeadStatus) => void;
}) {
  return (
    <article className="rounded-xl border border-brand-line bg-white p-4 shadow-sm">
      <LeadCardHeader
        title={appointment.name}
        subtitle={appointment.vehicleName}
        status={appointment.status}
        createdAt={appointment.createdAt}
      />
      <div className="mt-3 grid gap-2 text-sm text-brand-muted sm:grid-cols-2">
        <p className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-brand-blue" />
          {appointment.preferredDate}
        </p>
        <p className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-brand-blue" />
          {appointment.preferredTime}
        </p>
      </div>
      <LeadCardFooter
        status={appointment.status}
        isPending={isPending}
        onOpen={onOpen}
        onStatusChange={onStatusChange}
      />
    </article>
  );
}

function LeadCardHeader({
  title,
  subtitle,
  status,
  createdAt,
}: {
  title: string;
  subtitle: string;
  status: LeadStatus;
  createdAt: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h4 className="truncate font-bold text-brand-navy">{title}</h4>
        <p className="mt-1 truncate text-sm text-brand-muted">{subtitle}</p>
        <p className="mt-1 text-xs font-semibold text-brand-muted">{createdAt}</p>
      </div>
      <StatusBadge status={status} />
    </div>
  );
}

function LeadCardFooter({
  status,
  isPending,
  onOpen,
  onStatusChange,
}: {
  status: LeadStatus;
  isPending: boolean;
  onOpen: () => void;
  onStatusChange: (status: LeadStatus) => void;
}) {
  return (
    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value as LeadStatus)}
        className="h-10 rounded-lg border border-brand-line bg-white px-3 text-sm font-semibold text-brand-navy outline-none focus:border-brand-blue"
        disabled={isPending}
        aria-label="Změnit status"
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
  );
}

function LeadDetailPanel({ selected, onClose }: { selected: SelectedLead | null; onClose: () => void }) {
  if (!selected) {
    return (
      <aside className="rounded-2xl border border-brand-line bg-brand-soft/50 p-5 text-sm leading-6 text-brand-muted lg:sticky lg:top-24">
        Vyberte poptávku nebo žádost o prohlídku pro zobrazení detailu.
      </aside>
    );
  }

  const isInquiry = selected.kind === "inquiry";
  const item = selected.item;

  return (
    <aside className="rounded-2xl border border-brand-line bg-white p-5 shadow-sm lg:sticky lg:top-24">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-brand-blue">
            {isInquiry ? "Detail poptávky" : "Detail prohlídky"}
          </p>
          <h3 className="mt-2 text-xl font-bold tracking-[-0.03em] text-brand-navy">
            {item.name}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-line text-brand-muted hover:bg-brand-soft"
          aria-label="Zavřít detail"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 grid gap-3">
        <DetailLine icon={<User className="h-4 w-4" />} label="Jméno" value={item.name} />
        <DetailLine icon={<Phone className="h-4 w-4" />} label="Telefon" value={item.phone} />
        <DetailLine icon={<Mail className="h-4 w-4" />} label="E-mail" value={item.email} />
        <DetailLine icon={<MessageSquare className="h-4 w-4" />} label="Vůz" value={item.vehicleName} />
        <DetailLine label="Vytvořeno" value={item.createdAt} />
        <DetailLine label="Status" value={statusLabels[item.status]} />
        {isInquiry ? (
          <>
            <DetailLine label="Typ" value={(item as Inquiry).type} />
            <DetailLine label="Zdroj" value={(item as Inquiry).sourcePage} />
            <DetailText label="Zpráva" value={(item as Inquiry).message} />
          </>
        ) : (
          <>
            <DetailLine label="Preferované datum" value={(item as AppointmentRequest).preferredDate} />
            <DetailLine label="Preferovaný čas" value={(item as AppointmentRequest).preferredTime} />
            <DetailText label="Poznámka" value={(item as AppointmentRequest).note} />
          </>
        )}
      </div>
    </aside>
  );
}

function DetailLine({ icon, label, value }: { icon?: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-brand-line bg-white px-3 py-3">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-muted">
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
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">{label}</p>
      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-brand-navy">{value || "Neuvedeno"}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const className =
    status === "closed"
      ? "bg-slate-100 text-slate-700"
      : status === "completed"
        ? "bg-emerald-50 text-emerald-700"
        : status === "scheduled"
          ? "bg-blue-50 text-brand-blue"
          : status === "contacted"
            ? "bg-amber-50 text-amber-800"
            : "bg-brand-soft text-brand-blue";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${className}`}>
      {statusLabels[status]}
    </span>
  );
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <span className="rounded-xl border border-brand-line bg-white px-3 py-2">
      <span className="block text-lg font-bold text-brand-navy">{value}</span>
      <span className="block">{label}</span>
    </span>
  );
}

function updateStatus<T extends { id: string; status: LeadStatus }>(items: T[], id: string, status: LeadStatus) {
  return items.map((item) => (item.id === id ? { ...item, status } : item));
}
