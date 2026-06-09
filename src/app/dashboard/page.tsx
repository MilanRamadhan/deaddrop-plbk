"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, Unlock, Clock, Flame, Inbox, Copy, Check } from "lucide-react";

type MessageStatus = "pending" | "opened" | "expired" | "destroyed";

interface Message {
  _id: string;
  recipientName: string;
  status: MessageStatus;
  latitude: number;
  longitude: number;
  expiresAt: string;
}

interface Stats {
  total: number;
  opened: number;
  pending: number;
  destroyed: number;
}

const STATUS_CONFIG: Record<MessageStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-50 text-yellow-700 border border-yellow-200" },
  opened: { label: "Opened", className: "bg-green-50 text-green-700 border border-green-200" },
  expired: { label: "Expired", className: "bg-gray-100 text-gray-500 border border-gray-200" },
  destroyed: { label: "Destroyed", className: "bg-red-50 text-red-600 border border-red-200" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, msgsRes] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/messages"),
        ]);
        const statsData = await statsRes.json();
        const msgsData = await msgsRes.json();
        if (statsData.success) setStats(statsData.stats);
        if (msgsData.success) setMessages(msgsData.messages.slice(0, 5)); // show 5 most recent
      } catch {
        setError("Gagal memuat data dashboard.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your secure messages.</p>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="mb-10 grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total"
          value={loading ? "—" : String(stats?.total ?? 0)}
          icon={<MessageSquare className="h-5 w-5" />}
        />
        <StatCard
          title="Opened"
          value={loading ? "—" : String(stats?.opened ?? 0)}
          icon={<Unlock className="h-5 w-5" />}
        />
        <StatCard
          title="Pending"
          value={loading ? "—" : String(stats?.pending ?? 0)}
          icon={<Clock className="h-5 w-5" />}
        />
        <StatCard
          title="Destroyed"
          value={loading ? "—" : String(stats?.destroyed ?? 0)}
          icon={<Flame className="h-5 w-5" />}
        />
      </div>

      {/* ── RECENT MESSAGES ── */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="font-semibold text-black">Pesan Terbaru</h2>
          <Link
            href="/dashboard/messages"
            className="text-sm font-medium text-red-600 transition hover:text-red-700"
          >
            Lihat Semua →
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-red-600" />
          </div>
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-500">{error}</div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
              <Inbox className="h-7 w-7 text-gray-400" />
            </div>
            <p className="mb-1 font-medium text-gray-700">Belum ada pesan</p>
            <p className="mb-6 text-sm text-gray-400">
              Mulai dengan membuat pesan terenkripsi pertamamu.
            </p>
            <Link
              href="/dashboard/create"
              className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Buat Pesan Pertama
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <th className="px-6 py-3">Penerima</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Lokasi</th>
                  <th className="px-6 py-3">Kadaluarsa</th>
                  <th className="px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {messages.map((msg) => (
                  <TableRow key={msg._id} msg={msg} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500">
          {icon}
        </span>
      </div>
      <h2 className="text-3xl font-bold text-black">{value}</h2>
    </div>
  );
}

function TableRow({ msg }: { msg: Message }) {
  const status = STATUS_CONFIG[msg.status] ?? STATUS_CONFIG.pending;
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(`${window.location.origin}/drop/${msg._id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <tr className="transition hover:bg-gray-50">
      <td className="px-6 py-4 font-medium text-gray-800">{msg.recipientName}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>
          {status.label}
        </span>
      </td>
      <td className="px-6 py-4">
        <code className="font-mono text-xs text-gray-500">
          {msg.latitude.toFixed(4)}, {msg.longitude.toFixed(4)}
        </code>
      </td>
      <td className="px-6 py-4 text-gray-500">{formatDate(msg.expiresAt)}</td>
      <td className="px-6 py-4">
        <button
          onClick={copyLink}
          className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-red-300 hover:text-red-600"
        >
          {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
          Salin Link
        </button>
      </td>
    </tr>
  );
}
