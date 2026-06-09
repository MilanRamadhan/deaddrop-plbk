"use client";

import { useState } from "react";
import {
  Plus,
  Unlock,
  Clock,
  Flame,
  MapPin,
  MapPinOff,
  ClipboardList,
} from "lucide-react";

type EventType =
  | "message.created"
  | "message.opened"
  | "message.expired"
  | "message.destroyed"
  | "location.verified"
  | "location.failed";

type EventStatus = "success" | "failed";

interface LogEntry {
  id: string;
  eventType: EventType;
  status: EventStatus;
  messageId: string;
  detail: string;
  timestamp: string;
}

const DUMMY_LOGS: LogEntry[] = [
  {
    id: "log-001",
    eventType: "location.failed",
    status: "failed",
    messageId: "a1b2c3d4-0000-0000-0000-111111111111",
    detail: "Verifikasi lokasi gagal. Jarak terlalu jauh: 4.2km dari titik drop.",
    timestamp: "2026-06-10T07:45:12",
  },
  {
    id: "log-002",
    eventType: "location.verified",
    status: "success",
    messageId: "e5f6g7h8-0000-0000-0000-222222222222",
    detail: "Pesan dibuka dari koordinat -7.7956, 110.3695. Jarak: 23m dari titik drop.",
    timestamp: "2026-06-10T07:30:05",
  },
  {
    id: "log-003",
    eventType: "message.opened",
    status: "success",
    messageId: "e5f6g7h8-0000-0000-0000-222222222222",
    detail: "Pesan berhasil dibuka oleh penerima 'Siti Rahayu'. Self-destruct diaktifkan.",
    timestamp: "2026-06-10T07:30:06",
  },
  {
    id: "log-004",
    eventType: "message.destroyed",
    status: "success",
    messageId: "m3n4o5p6-0000-0000-0000-444444444444",
    detail: "Pesan dihapus permanen setelah dibuka. Tidak dapat dipulihkan.",
    timestamp: "2026-06-09T21:02:33",
  },
  {
    id: "log-005",
    eventType: "message.expired",
    status: "success",
    messageId: "i9j0k1l2-0000-0000-0000-333333333333",
    detail: "Pesan untuk 'Agus Wijaya' kadaluarsa. Tidak bisa dibuka lagi.",
    timestamp: "2026-06-09T09:00:01",
  },
  {
    id: "log-006",
    eventType: "message.created",
    status: "success",
    messageId: "q7r8s9t0-0000-0000-0000-555555555555",
    detail: "Pesan berhasil dibuat untuk 'Rudi Hermawan'. Kadaluarsa: 20 Jun 2026.",
    timestamp: "2026-06-08T11:00:44",
  },
  {
    id: "log-007",
    eventType: "location.failed",
    status: "failed",
    messageId: "q7r8s9t0-0000-0000-0000-555555555555",
    detail: "Akses GPS ditolak oleh pengguna. Verifikasi tidak dapat dilanjutkan.",
    timestamp: "2026-06-08T14:22:10",
  },
  {
    id: "log-008",
    eventType: "message.created",
    status: "success",
    messageId: "u1v2w3x4-0000-0000-0000-666666666666",
    detail: "Pesan berhasil dibuat untuk 'Maya Putri'. Kadaluarsa: 25 Jun 2026.",
    timestamp: "2026-06-07T16:45:00",
  },
];

const TODAY = new Date().toDateString();

const EVENT_CONFIG: Record<
  EventType,
  {
    label: string;
    badgeClass: string;
    iconClass: string;
    Icon: React.ElementType;
  }
> = {
  "message.created": {
    label: "message.created",
    badgeClass: "bg-blue-100 text-blue-700 border-blue-200",
    iconClass: "bg-green-50 text-green-600",
    Icon: Plus,
  },
  "message.opened": {
    label: "message.opened",
    badgeClass: "bg-green-100 text-green-700 border-green-200",
    iconClass: "bg-green-50 text-green-600",
    Icon: Unlock,
  },
  "message.expired": {
    label: "message.expired",
    badgeClass: "bg-gray-100 text-gray-600 border-gray-200",
    iconClass: "bg-gray-100 text-gray-400",
    Icon: Clock,
  },
  "message.destroyed": {
    label: "message.destroyed",
    badgeClass: "bg-red-100 text-red-600 border-red-200",
    iconClass: "bg-red-50 text-red-500",
    Icon: Flame,
  },
  "location.verified": {
    label: "location.verified",
    badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-200",
    iconClass: "bg-emerald-50 text-emerald-600",
    Icon: MapPin,
  },
  "location.failed": {
    label: "location.failed",
    badgeClass: "bg-orange-100 text-orange-700 border-orange-200",
    iconClass: "bg-orange-50 text-orange-500",
    Icon: MapPinOff,
  },
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function shortId(id: string) {
  return id.split("-")[0] + "…";
}

const totalEvents = DUMMY_LOGS.length;
const todayEvents = DUMMY_LOGS.filter(
  (l) => new Date(l.timestamp).toDateString() === TODAY
).length;
const failedEvents = DUMMY_LOGS.filter((l) => l.status === "failed").length;

export default function LogsPage() {
  const [filterEvent, setFilterEvent] = useState<"all" | EventType>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | EventStatus>("all");
  const [searchId, setSearchId] = useState("");

  const filtered = DUMMY_LOGS.filter((log) => {
    const matchEvent = filterEvent === "all" || log.eventType === filterEvent;
    const matchStatus = filterStatus === "all" || log.status === filterStatus;
    const matchId = log.messageId.toLowerCase().includes(searchId.toLowerCase());
    return matchEvent && matchStatus && matchId;
  });

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Audit Log</h1>
          <p className="mt-1 text-sm text-gray-500">Rekam jejak semua aktivitas pesan</p>
        </div>
        <span className="flex-shrink-0 rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          Read Only
        </span>
      </div>

      {/* STATS ROW */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatMini label="Total Events" value={totalEvents} />
        <StatMini label="Today's Events" value={todayEvents} />
        <StatMini label="Failed Events" value={failedEvents} accent />
      </div>

      {/* FILTER BAR */}
      <div className="mb-5 flex flex-wrap gap-3">
        <select
          value={filterEvent}
          onChange={(e) => setFilterEvent(e.target.value as "all" | EventType)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
        >
          <option value="all">Semua Tipe Event</option>
          <option value="message.created">message.created</option>
          <option value="message.opened">message.opened</option>
          <option value="message.expired">message.expired</option>
          <option value="message.destroyed">message.destroyed</option>
          <option value="location.verified">location.verified</option>
          <option value="location.failed">location.failed</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as "all" | EventStatus)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
        >
          <option value="all">Semua Status</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
        </select>

        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Cari message ID..."
          className="min-w-[200px] flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
        />
      </div>

      {/* LOG LIST */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
              <ClipboardList className="h-7 w-7 text-gray-400" />
            </div>
            <p className="font-medium text-gray-700">Belum ada aktivitas tercatat</p>
            <p className="mt-1 text-sm text-gray-400">Coba ubah filter atau kata kunci pencarian.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((log) => {
              const cfg = EVENT_CONFIG[log.eventType];
              const IconComp = cfg.Icon;
              return (
                <li
                  key={log.id}
                  className="flex items-start gap-4 px-5 py-4 transition hover:bg-gray-50"
                >
                  {/* Icon */}
                  <div
                    className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${cfg.iconClass}`}
                  >
                    <IconComp className="h-4 w-4" strokeWidth={2} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Event badge */}
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 font-mono text-xs font-medium ${cfg.badgeClass}`}
                      >
                        {cfg.label}
                      </span>

                      {/* Message ID */}
                      <code
                        className="font-mono text-xs text-gray-400"
                        title={log.messageId}
                      >
                        {shortId(log.messageId)}
                      </code>

                      {/* Status dot */}
                      <span
                        className={`ml-auto flex-shrink-0 text-xs font-medium ${
                          log.status === "failed" ? "text-red-500" : "text-green-600"
                        }`}
                      >
                        {log.status === "failed" ? "● failed" : "● success"}
                      </span>
                    </div>

                    {/* Detail */}
                    <p className="mt-1 text-sm text-gray-500">{log.detail}</p>

                    {/* Timestamp */}
                    <p className="mt-1 text-xs text-gray-400">{formatDateTime(log.timestamp)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatMini({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent ? "text-red-600" : "text-black"}`}>
        {value}
      </p>
    </div>
  );
}
