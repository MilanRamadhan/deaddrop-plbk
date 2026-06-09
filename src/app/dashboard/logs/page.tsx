"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Unlock,
  Clock,
  Flame,
  MapPin,
  MapPinOff,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";

// Mapping dari action string backend → UI config
type EventType =
  | "MESSAGE_CREATED"
  | "MESSAGE_OPENED"
  | "MESSAGE_EXPIRED"
  | "MESSAGE_DESTROYED"
  | "LOCATION_VERIFIED"
  | "LOCATION_FAILED"
  | "UNKNOWN";

interface LogEntry {
  _id: string;
  messageId: string;
  actorId: string;
  action: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

const EVENT_CONFIG: Record<
  EventType,
  { label: string; badgeClass: string; iconClass: string; Icon: React.ElementType }
> = {
  MESSAGE_CREATED: {
    label: "message.created",
    badgeClass: "bg-blue-100 text-blue-700 border-blue-200",
    iconClass: "bg-green-50 text-green-600",
    Icon: Plus,
  },
  MESSAGE_OPENED: {
    label: "message.opened",
    badgeClass: "bg-green-100 text-green-700 border-green-200",
    iconClass: "bg-green-50 text-green-600",
    Icon: Unlock,
  },
  MESSAGE_EXPIRED: {
    label: "message.expired",
    badgeClass: "bg-gray-100 text-gray-600 border-gray-200",
    iconClass: "bg-gray-100 text-gray-400",
    Icon: Clock,
  },
  MESSAGE_DESTROYED: {
    label: "message.destroyed",
    badgeClass: "bg-red-100 text-red-600 border-red-200",
    iconClass: "bg-red-50 text-red-500",
    Icon: Flame,
  },
  LOCATION_VERIFIED: {
    label: "location.verified",
    badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-200",
    iconClass: "bg-emerald-50 text-emerald-600",
    Icon: MapPin,
  },
  LOCATION_FAILED: {
    label: "location.failed",
    badgeClass: "bg-orange-100 text-orange-700 border-orange-200",
    iconClass: "bg-orange-50 text-orange-500",
    Icon: MapPinOff,
  },
  UNKNOWN: {
    label: "event",
    badgeClass: "bg-gray-100 text-gray-500 border-gray-200",
    iconClass: "bg-gray-100 text-gray-400",
    Icon: ShieldCheck,
  },
};

function normalizeAction(action: string): EventType {
  const map: Record<string, EventType> = {
    MESSAGE_CREATED: "MESSAGE_CREATED",
    MESSAGE_OPENED: "MESSAGE_OPENED",
    MESSAGE_EXPIRED: "MESSAGE_EXPIRED",
    MESSAGE_DESTROYED: "MESSAGE_DESTROYED",
    LOCATION_VERIFIED: "LOCATION_VERIFIED",
    LOCATION_FAILED: "LOCATION_FAILED",
  };
  return map[action.toUpperCase()] ?? "UNKNOWN";
}

function buildDetail(log: LogEntry): string {
  const action = normalizeAction(log.action);
  const meta = log.metadata ?? {};
  const msgId = shortId(String(log.messageId));

  switch (action) {
    case "MESSAGE_OPENED":
      return `Pesan ${msgId} berhasil dibuka. Jarak: ${meta.distance != null ? formatDist(Number(meta.distance)) : "—"}.`;
    case "MESSAGE_CREATED":
      return `Pesan baru dibuat.`;
    case "MESSAGE_DESTROYED":
      return `Pesan ${msgId} dihapus permanen (self-destruct).`;
    case "MESSAGE_EXPIRED":
      return `Pesan ${msgId} kadaluarsa dan tidak bisa dibuka lagi.`;
    case "LOCATION_VERIFIED":
      return `Verifikasi lokasi berhasil. Jarak: ${meta.distance != null ? formatDist(Number(meta.distance)) : "—"}.`;
    case "LOCATION_FAILED":
      return `Verifikasi lokasi gagal. Jarak terlalu jauh: ${meta.distance != null ? formatDist(Number(meta.distance)) : "—"}.`;
    default:
      return `Event: ${log.action}`;
  }
}

function formatDist(meters: number): string {
  return meters < 1000 ? `${Math.round(meters)}m` : `${(meters / 1000).toFixed(2)}km`;
}

function shortId(id: string): string {
  return id.length > 8 ? id.slice(0, 8) + "…" : id;
}

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

const TODAY = new Date().toDateString();

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [filterAction, setFilterAction] = useState<"all" | EventType>("all");
  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/audit");
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Gagal memuat audit log");
        setLogs(data.logs);
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = logs.filter((log) => {
    const matchAction =
      filterAction === "all" || normalizeAction(log.action) === filterAction;
    const matchId = String(log.messageId)
      .toLowerCase()
      .includes(searchId.toLowerCase());
    return matchAction && matchId;
  });

  const totalEvents = logs.length;
  const todayEvents = logs.filter(
    (l) => new Date(l.createdAt).toDateString() === TODAY,
  ).length;
  const failedEvents = logs.filter((l) =>
    ["LOCATION_FAILED"].includes(l.action.toUpperCase()),
  ).length;

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
        <StatMini label="Total Events" value={loading ? "—" : totalEvents} />
        <StatMini label="Today's Events" value={loading ? "—" : todayEvents} />
        <StatMini label="Failed Events" value={loading ? "—" : failedEvents} accent />
      </div>

      {/* FILTER BAR */}
      <div className="mb-5 flex flex-wrap gap-3">
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value as "all" | EventType)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
        >
          <option value="all">Semua Tipe Event</option>
          <option value="MESSAGE_CREATED">message.created</option>
          <option value="MESSAGE_OPENED">message.opened</option>
          <option value="MESSAGE_EXPIRED">message.expired</option>
          <option value="MESSAGE_DESTROYED">message.destroyed</option>
          <option value="LOCATION_VERIFIED">location.verified</option>
          <option value="LOCATION_FAILED">location.failed</option>
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
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-red-600" />
          </div>
        ) : fetchError ? (
          <div className="py-16 text-center text-sm text-red-500">{fetchError}</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
              <ClipboardList className="h-7 w-7 text-gray-400" />
            </div>
            <p className="font-medium text-gray-700">Belum ada aktivitas tercatat</p>
            <p className="mt-1 text-sm text-gray-400">
              Log akan muncul saat ada pesan yang dibuka atau gagal diverifikasi.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((log) => {
              const eventType = normalizeAction(log.action);
              const cfg = EVENT_CONFIG[eventType];
              const IconComp = cfg.Icon;
              return (
                <li
                  key={log._id}
                  className="flex items-start gap-4 px-5 py-4 transition hover:bg-gray-50"
                >
                  <div
                    className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${cfg.iconClass}`}
                  >
                    <IconComp className="h-4 w-4" strokeWidth={2} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 font-mono text-xs font-medium ${cfg.badgeClass}`}
                      >
                        {cfg.label}
                      </span>
                      <code
                        className="font-mono text-xs text-gray-400"
                        title={String(log.messageId)}
                      >
                        {shortId(String(log.messageId))}
                      </code>
                    </div>

                    <p className="mt-1 text-sm text-gray-500">{buildDetail(log)}</p>
                    <p className="mt-1 text-xs text-gray-400">{formatDateTime(log.createdAt)}</p>
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
  value: number | string;
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
