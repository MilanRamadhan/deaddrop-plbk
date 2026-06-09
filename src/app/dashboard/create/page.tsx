"use client";

import { useState } from "react";
import { MapPin, Copy, Check, RotateCcw, Send, Navigation } from "lucide-react";

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
  const [submitted, setSubmitted] = useState(false);
  const [dropId, setDropId] = useState("");
  const [copied, setCopied] = useState(false);
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = crypto.randomUUID();
    setDropId(id);
    setSubmitted(true);
    setCopied(false);
    setLinkCopied(false);
  }

  function handleReset() {
    setForm(defaultForm);
    setSubmitted(false);
    setDropId("");
  }

  const dropLink =
    typeof window !== "undefined" ? `${window.location.origin}/drop/${dropId}` : `/drop/${dropId}`;

  async function copyLink() {
    await navigator.clipboard.writeText(dropLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }

  const hasCoords = form.latitude !== "" && form.longitude !== "";

  return (
    <div>
      {/* Page header */}
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

              {/* Recipient */}
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Nama Penerima
                </label>
                <input
                  type="text"
                  value={form.recipient}
                  onChange={(e) => setField("recipient", e.target.value)}
                  placeholder="Untuk siapa pesan ini?"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                />
              </div>

              {/* Message */}
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Isi Pesan</label>
                <textarea
                  rows={6}
                  value={form.message}
                  onChange={(e) => setField("message", e.target.value)}
                  placeholder="Tulis pesan rahasiamu..."
                  className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                />
              </div>

              {/* Expiry */}
              <div className="mb-5">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Waktu Kadaluarsa
                </label>
                <input
                  type="datetime-local"
                  value={form.expiresAt}
                  onChange={(e) => setField("expiresAt", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                />
              </div>

              {/* Self Destruct toggle */}
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

              {/* Lat / Lng */}
              <div className="mb-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={form.latitude}
                    onChange={(e) => setField("latitude", e.target.value)}
                    placeholder="-6.200000"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={form.longitude}
                    onChange={(e) => setField("longitude", e.target.value)}
                    placeholder="106.816666"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />
                </div>
              </div>

              {/* Radius */}
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Radius (meter)
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.radius}
                  onChange={(e) => setField("radius", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                />
              </div>

              {/* Geolocate button */}
              <button
                type="button"
                onClick={handleGeolocate}
                disabled={locating}
                className="mb-5 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition hover:border-red-300 hover:text-red-600 disabled:opacity-50"
              >
                <Navigation className="h-4 w-4" />
                {locating ? "Mendapatkan lokasi..." : "Gunakan Lokasi Saya Sekarang"}
              </button>

              {/* Coords preview */}
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

        {/* Submit button */}
        <div className="mt-8">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-3.5 font-medium text-white transition hover:bg-red-700 active:scale-[0.99]"
          >
            <Send className="h-4 w-4" />
            Kirim Pesan
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

          <p className="mb-2 text-sm text-gray-500">
            Bagikan link berikut ke penerima:
          </p>

          {/* Link box */}
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
