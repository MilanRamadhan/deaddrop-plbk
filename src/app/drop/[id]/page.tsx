"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { MapPin, ShieldX, Unlock, AlertCircle } from "lucide-react";

type ViewState = "idle" | "loading" | "error-denied" | "error-location" | "error-expired" | "error-server" | "success";

interface OpenResult {
  content: string;
  distance: number;
  selfDestruct: boolean;
}

function formatDateTime(date: Date) {
  return date.toLocaleString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DropPage() {
  const params = useParams();
  const id = params?.id as string;

  const [viewState, setViewState] = useState<ViewState>("idle");
  const [openedAt, setOpenedAt] = useState<Date | null>(null);
  const [result, setResult] = useState<OpenResult | null>(null);
  const [serverError, setServerError] = useState("");

  function handleVerify() {
    if (!navigator.geolocation) {
      setViewState("error-denied");
      return;
    }

    setViewState("loading");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`/api/messages/${id}/open`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            }),
          });
          const data = await res.json();

          if (res.status === 403) {
            setViewState("error-location");
            return;
          }
          if (res.status === 400 && data.error === "Message expired") {
            setViewState("error-expired");
            return;
          }
          if (!res.ok || !data.success) {
            setServerError(data.error || "Terjadi kesalahan server");
            setViewState("error-server");
            return;
          }

          setResult({
            content: data.content,
            distance: data.distance,
            selfDestruct: data.selfDestruct ?? false,
          });
          setOpenedAt(new Date());
          setViewState("success");
        } catch {
          setServerError("Tidak dapat terhubung ke server.");
          setViewState("error-server");
        }
      },
      () => {
        setViewState("error-denied");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md">

        {/* ── STATE 1: IDLE ── */}
        {viewState === "idle" && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
              <MapPin className="h-8 w-8 text-red-600" strokeWidth={1.75} />
            </div>
            <h1 className="text-2xl font-bold text-black">Ada Pesan Untukmu</h1>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              Pesan ini terkunci secara GPS. Kamu harus berada di lokasi yang tepat untuk membukanya.
            </p>
            <p className="mt-2 font-mono text-xs text-gray-400">ID: {id}</p>
            <button
              onClick={handleVerify}
              className="mt-8 w-full rounded-lg bg-red-600 py-3.5 font-medium text-white transition hover:bg-red-700 active:scale-[0.98]"
            >
              Verifikasi Lokasiku
            </button>
          </div>
        )}

        {/* ── STATE 2: LOADING ── */}
        {viewState === "loading" && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600" />
            </div>
            <p className="font-medium text-gray-800">Memverifikasi lokasi kamu...</p>
            <p className="mt-2 text-sm text-gray-400">Pastikan GPS aktif</p>
          </div>
        )}

        {/* ── STATE 3a: ERROR — GPS DENIED ── */}
        {viewState === "error-denied" && (
          <ErrorCard
            message="Kamu harus mengizinkan akses lokasi."
            onRetry={() => setViewState("idle")}
          />
        )}

        {/* ── STATE 3b: ERROR — WRONG LOCATION ── */}
        {viewState === "error-location" && (
          <ErrorCard
            message="Kamu tidak berada di lokasi yang benar."
            onRetry={() => setViewState("idle")}
          />
        )}

        {/* ── STATE 3c: ERROR — EXPIRED ── */}
        {viewState === "error-expired" && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
              <AlertCircle className="h-8 w-8 text-gray-400" strokeWidth={1.75} />
            </div>
            <h2 className="text-xl font-bold text-black">Pesan Kadaluarsa</h2>
            <p className="mt-3 text-sm text-gray-500">
              Waktu akses pesan ini telah habis dan tidak bisa dibuka lagi.
            </p>
          </div>
        )}

        {/* ── STATE 3d: ERROR — SERVER ── */}
        {viewState === "error-server" && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
              <ShieldX className="h-8 w-8 text-red-600" strokeWidth={1.75} />
            </div>
            <h2 className="text-xl font-bold text-black">Terjadi Kesalahan</h2>
            <p className="mt-3 text-sm text-gray-500">{serverError}</p>
            <button
              onClick={() => setViewState("idle")}
              className="mt-8 w-full rounded-lg border border-gray-200 py-3 font-medium text-gray-700 transition hover:border-red-300 hover:text-red-600"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* ── STATE 4: SUCCESS ── */}
        {viewState === "success" && result && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-green-50">
                <Unlock className="h-6 w-6 text-green-600" strokeWidth={1.75} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-black">Pesan Terbuka</h1>
                {openedAt && (
                  <p className="text-xs text-gray-400">{formatDateTime(openedAt)}</p>
                )}
              </div>
            </div>

            {result.distance !== undefined && (
              <p className="mb-3 text-xs text-gray-400">
                📍 Jarak dari titik drop:{" "}
                <span className="font-mono font-medium">
                  {result.distance < 1000
                    ? `${Math.round(result.distance)}m`
                    : `${(result.distance / 1000).toFixed(2)}km`}
                </span>
              </p>
            )}

            {/* Message content */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <p className="text-sm leading-relaxed text-gray-700">{result.content}</p>
            </div>

            {/* Self destruct badge */}
            {result.selfDestruct && (
              <>
                <div className="mt-4 flex items-center gap-2">
                  <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                    🔥 Self Destruct Active
                  </span>
                </div>
                <p className="mt-3 text-xs text-gray-400">
                  Pesan ini telah dihapus permanen dari server setelah kamu membukanya.
                </p>
              </>
            )}

            <div className="mt-6 border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400">
                Powered by <span className="font-semibold text-black">DEADDROP</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
        <ShieldX className="h-8 w-8 text-red-600" strokeWidth={1.75} />
      </div>
      <h2 className="text-xl font-bold text-black">Akses Ditolak</h2>
      <p className="mt-3 text-sm text-gray-500">{message}</p>
      <button
        onClick={onRetry}
        className="mt-8 w-full rounded-lg border border-gray-200 py-3 font-medium text-gray-700 transition hover:border-red-300 hover:text-red-600"
      >
        Coba Lagi
      </button>
    </div>
  );
}
