"use client";

import { useState } from "react";
import { MapPin, Copy, Check, RotateCcw, Send, Navigation, AlertCircle } from "lucide-react";

interface FormState {
  recipient: string;
  message: string;
  expiresAt: string;
  selfDestruct: boolean;
  latitude: string;
  longitude: string;
  radius: string;
}

const defaultForm: FormState = {
  recipient: "",
  message: "",
  expiresAt: "",
  selfDestruct: false,
  latitude: "",
  longitude: "",
  radius: "100",
};

export default function CreatePage() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [dropId, setDropId] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleGeolocate() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setField("latitude", pos.coords.latitude.toFixed(6));
        setField("longitude", pos.coords.longitude.toFixed(6));
        setLocating(false);
      },
      () => setLocating(false),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientName: form.recipient,
          content: form.message,
          latitude: parseFloat(form.latitude),
          longitude: parseFloat(form.longitude),
          radius: parseFloat(form.radius),
          expiresAt: form.expiresAt,
          selfDestruct: form.selfDestruct,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Gagal membuat pesan");
      setDropId(data.message._id);
      setLinkCopied(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setForm(defaultForm);
    setDropId("");
    setError("");
  }

  const dropLink =
    typeof window !== "undefined" ? `${window.location.origin}/drop/${dropId}` : `/drop/${dropId}`;

  async function copyLink() {
    await navigator.clipboard.writeText(dropLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }

  const hasCoords = form.latitude !== "" && form.longitude !== "";
  const submitted = !!dropId;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">Buat Pesan Baru</h1>
        <p className="mt-1 text-sm text-gray-500">
          Pesan terenkripsi yang hanya bisa dibuka di lokasi tertentu.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 md:grid-cols-2">
          {/* ── KOLOM KIRI ── */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-400">
                Isi Pesan
              </h2>

              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Nama Penerima
                </label>
                <input
                  type="text"
                  required
                  minLength={2}
                  value={form.recipient}
                  onChange={(e) => setField("recipient", e.target.value)}
                  placeholder="Untuk siapa pesan ini?"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Isi Pesan</label>
                <textarea
                  rows={6}
                  required
                  value={form.message}
                  onChange={(e) => setField("message", e.target.value)}
                  placeholder="Tulis pesan rahasiamu..."
                  className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div className="mb-5">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Waktu Kadaluarsa
                </label>
                <input
                  type="datetime-local"
                  required
                  value={form.expiresAt}
                  onChange={(e) => setField("expiresAt", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Self Destruct</p>
                  <p className="text-xs text-gray-400">Pesan terhapus setelah dibuka</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.selfDestruct}
                  onClick={() => setField("selfDestruct", !form.selfDestruct)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                    form.selfDestruct ? "bg-red-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                      form.selfDestruct ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* ── KOLOM KANAN ── */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-400">
                Kunci Lokasi GPS
              </h2>

              <div className="mb-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Latitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    required
                    value={form.latitude}
                    onChange={(e) => setField("latitude", e.target.value)}
                    placeholder="-6.200000"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Longitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    required
                    value={form.longitude}
                    onChange={(e) => setField("longitude", e.target.value)}
                    placeholder="106.816666"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Radius (meter) — min 50, max 1000
                </label>
                <input
                  type="number"
                  min="50"
                  max="1000"
                  required
                  value={form.radius}
                  onChange={(e) => setField("radius", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                />
              </div>

              <button
                type="button"
                onClick={handleGeolocate}
                disabled={locating}
                className="mb-5 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition hover:border-red-300 hover:text-red-600 disabled:opacity-50"
              >
                <Navigation className="h-4 w-4" />
                {locating ? "Mendapatkan lokasi..." : "Gunakan Lokasi Saya Sekarang"}
              </button>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Koordinat Drop
                  </span>
                </div>
                {hasCoords ? (
                  <div className="space-y-1 text-sm text-gray-700">
                    <p>
                      <span className="text-gray-400">Lat:</span>{" "}
                      <span className="font-mono font-medium">{form.latitude}</span>
                    </p>
                    <p>
                      <span className="text-gray-400">Lng:</span>{" "}
                      <span className="font-mono font-medium">{form.longitude}</span>
                    </p>
                    <p>
                      <span className="text-gray-400">Radius:</span>{" "}
                      <span className="font-mono font-medium">{form.radius} m</span>
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">
                    Belum ada koordinat. Isi manual atau gunakan tombol di atas.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Submit */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-3.5 font-medium text-white transition hover:bg-red-700 disabled:opacity-60 active:scale-[0.99]"
          >
            <Send className="h-4 w-4" />
            {submitting ? "Mengirim..." : "Kirim Pesan"}
          </button>
        </div>
      </form>

      {/* ── RESULT CARD ── */}
      {submitted && (
        <div className="mt-6 rounded-2xl border border-green-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Pesan berhasil dibuat!</h3>
          </div>

          <p className="mb-2 text-sm text-gray-500">Bagikan link berikut ke penerima:</p>

          <div className="mb-4 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <code className="flex-1 break-all font-mono text-xs text-gray-700">{dropLink}</code>
            <button
              onClick={copyLink}
              title="Copy link"
              className="ml-2 flex-shrink-0 rounded-md p-1.5 text-gray-400 transition hover:bg-gray-200 hover:text-gray-700"
            >
              {linkCopied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
          >
            <RotateCcw className="h-4 w-4" />
            Buat Pesan Baru
          </button>
        </div>
      )}
    </div>
  );
}
