"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Copy, SearchX } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type MessageStatus = "pending" | "opened" | "expired" | "destroyed";

interface Message {
  _id: string;
  recipientName: string;
  cipherText: string | null;
  status: MessageStatus;
  latitude: number;
  longitude: number;
  radius: number;
  selfDestruct: boolean;
  createdAt: string;
  expiresAt: string;
}

const STATUS_CONFIG: Record<MessageStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  opened: { label: "Opened", className: "bg-green-100 text-green-700 border-green-200" },
  expired: { label: "Expired", className: "bg-gray-100 text-gray-600 border-gray-200" },
  destroyed: { label: "Destroyed", className: "bg-red-100 text-red-600 border-red-200" },
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

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max) + "…" : str;
}

function getDropLink(id: string) {
  if (typeof window === "undefined") return `/drop/${id}`;
  return `${window.location.origin}/drop/${id}`;
}

export default function MessagesPage() {
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | MessageStatus>("all");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [modalLinkCopied, setModalLinkCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/messages");
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Gagal memuat pesan");
        setAllMessages(data.messages);
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = allMessages.filter((msg) => {
    const matchSearch = msg.recipientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "all" || msg.status === filterStatus;
    return matchSearch && matchStatus;
  });

  async function handleCopyLink(id: string) {
    await navigator.clipboard.writeText(getDropLink(id));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function openModal(msg: Message) {
    setSelectedMessage(msg);
    setModalLinkCopied(false);
    setIsModalOpen(true);
  }

  async function handleModalCopy() {
    if (!selectedMessage) return;
    await navigator.clipboard.writeText(getDropLink(selectedMessage._id));
    setModalLinkCopied(true);
    setTimeout(() => setModalLinkCopied(false), 2000);
  }

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Pesan Terkirim</h1>
          <p className="mt-1 text-sm text-gray-500">Semua pesan yang pernah kamu buat</p>
        </div>
        <Link
          href="/dashboard/create"
          className="flex-shrink-0 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Buat Pesan Baru
        </Link>
      </div>

      {/* FILTER BAR */}
      <div className="mb-5 flex flex-wrap gap-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama penerima..."
          className="min-w-[180px] flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as "all" | MessageStatus)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
        >
          <option value="all">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="opened">Opened</option>
          <option value="expired">Expired</option>
          <option value="destroyed">Destroyed</option>
        </select>
      </div>

      {/* TABLE / STATES */}
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
              <SearchX className="h-7 w-7 text-gray-400" />
            </div>
            <p className="mb-1 font-medium text-gray-700">Tidak ada pesan ditemukan</p>
            <p className="mb-5 text-sm text-gray-400">Coba ubah kata kunci atau filter status.</p>
            <button
              onClick={() => { setSearchQuery(""); setFilterStatus("all"); }}
              className="rounded-lg border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 transition hover:border-red-300 hover:text-red-600"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <th className="w-10 px-4 py-3">No</th>
                  <th className="px-4 py-3">Penerima</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Lokasi</th>
                  <th className="px-4 py-3">Kadaluarsa</th>
                  <th className="px-4 py-3 text-center">S.D.</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((msg, idx) => {
                  const status = STATUS_CONFIG[msg.status] ?? STATUS_CONFIG.pending;
                  const isCopied = copiedId === msg._id;
                  return (
                    <tr key={msg._id} className="transition hover:bg-gray-50">
                      <td className="px-4 py-3.5 text-gray-400">{idx + 1}</td>
                      <td className="px-4 py-3.5 font-medium text-gray-800">{msg.recipientName}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <code className="font-mono text-xs text-gray-500">
                          {msg.latitude.toFixed(4)}, {msg.longitude.toFixed(4)}
                        </code>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-gray-500">
                        {formatDate(msg.expiresAt)}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {msg.selfDestruct ? (
                          <Check className="mx-auto h-4 w-4 text-green-500" />
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyLink(msg._id)}
                            className="flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:border-red-300 hover:text-red-600"
                          >
                            {isCopied ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                            Salin Link
                          </button>
                          <button
                            onClick={() => openModal(msg)}
                            className="rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                          >
                            Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle>Detail Pesan</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <InfoRow label="Penerima" value={selectedMessage.recipientName} />
                  <InfoRow
                    label="Status"
                    value={
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_CONFIG[selectedMessage.status]?.className}`}>
                        {STATUS_CONFIG[selectedMessage.status]?.label}
                      </span>
                    }
                  />
                  <InfoRow label="Dibuat" value={formatDate(selectedMessage.createdAt)} />
                  <InfoRow label="Kadaluarsa" value={formatDate(selectedMessage.expiresAt)} />
                  <InfoRow
                    label="Koordinat"
                    value={
                      <code className="font-mono text-xs">
                        {selectedMessage.latitude.toFixed(6)}, {selectedMessage.longitude.toFixed(6)}
                      </code>
                    }
                  />
                  <InfoRow label="Radius" value={`${selectedMessage.radius} meter`} />
                  <InfoRow
                    label="Self Destruct"
                    value={
                      selectedMessage.selfDestruct ? (
                        <span className="font-medium text-red-600">Aktif</span>
                      ) : (
                        <span className="text-gray-400">Tidak</span>
                      )
                    }
                  />
                </div>
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Status Enkripsi
                  </p>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="font-mono text-sm text-gray-500">
                      {selectedMessage.status === "destroyed"
                        ? "⚠ Pesan telah dihapus permanen."
                        : "🔒 Isi pesan terenkripsi — hanya bisa dibuka di lokasi yang ditentukan."}
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  Tutup
                </button>
                <button
                  onClick={handleModalCopy}
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                >
                  {modalLinkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {modalLinkCopied ? "Tersalin!" : "Salin Link Drop"}
                </button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <div className="mt-0.5 text-sm font-medium text-gray-700">{value}</div>
    </div>
  );
}
