"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Copy, Check, ArrowRight } from "lucide-react";

type Tab = "create" | "existing";

export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("create");

  // Tab A — generate
  const [generatedToken, setGeneratedToken] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generateError, setGenerateError] = useState("");

  // Tab B — login
  const [inputToken, setInputToken] = useState("");
  const [logging, setLogging] = useState(false);
  const [loginError, setLoginError] = useState("");

  async function handleGenerate() {
    setGenerating(true);
    setGenerateError("");
    try {
      const res = await fetch("/api/auth/identity", { method: "GET" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Gagal generate token");
      setGeneratedToken(data.user.identityToken);
      setCopied(false);
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setGenerating(false);
    }
  }

  async function handleCopy() {
    if (!generatedToken) return;
    await navigator.clipboard.writeText(generatedToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!inputToken.trim()) return;
    setLogging(true);
    setLoginError("");
    try {
      const res = await fetch("/api/auth/identity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: inputToken.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Token tidak valid");
      router.push("/dashboard");
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLogging(false);
    }
  }

  return (
    <div className="min-h-screen bg-white px-4">
      <div className="mx-auto max-w-md pt-8">
        <a href="/" className="text-sm font-medium text-gray-400 transition hover:text-black">
          ← DEADDROP
        </a>
      </div>

      <div className="mx-auto mt-10 max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <KeyRound className="h-7 w-7 text-red-600" strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl font-bold text-black">Identitas Anonim</h1>
          <p className="mt-2 text-sm text-gray-500">
            Tidak ada akun. Tidak ada email. Hanya token.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex rounded-lg border border-gray-200 bg-gray-50 p-1">
          <button
            onClick={() => setActiveTab("create")}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
              activeTab === "create"
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Buat Baru
          </button>
          <button
            onClick={() => setActiveTab("existing")}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
              activeTab === "existing"
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Punya Token
          </button>
        </div>

        {/* TAB A — Buat Baru */}
        {activeTab === "create" && (
          <div className="space-y-4">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full rounded-lg bg-red-600 py-3 font-medium text-white transition hover:bg-red-700 disabled:opacity-60 active:scale-[0.98]"
            >
              {generating ? "Membuat token..." : "Generate Token"}
            </button>

            {generateError && (
              <p className="text-xs font-medium text-red-600">{generateError}</p>
            )}

            {generatedToken && (
              <>
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <code className="flex-1 break-all font-mono text-xs text-gray-700">
                    {generatedToken}
                  </code>
                  <button
                    onClick={handleCopy}
                    title="Copy token"
                    className="ml-2 flex-shrink-0 rounded-md p-1.5 text-gray-400 transition hover:bg-gray-200 hover:text-gray-700"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <p className="text-xs font-medium text-red-600">
                  ⚠ Simpan token ini. Tidak bisa dipulihkan.
                </p>

                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-3 font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                >
                  Lanjut ke Dashboard
                  <ArrowRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        )}

        {/* TAB B — Punya Token */}
        {activeTab === "existing" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Token kamu</label>
              <input
                type="text"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                placeholder="Masukkan token kamu"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 font-mono text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
              />
            </div>

            {loginError && (
              <p className="text-xs font-medium text-red-600">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={!inputToken.trim() || logging}
              className="w-full rounded-lg bg-red-600 py-3 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
            >
              {logging ? "Masuk..." : "Masuk"}
            </button>
          </form>
        )}
      </div>

      <p className="mx-auto mt-6 max-w-md text-center text-xs text-gray-400">
        Token adalah satu-satunya identitasmu di DeadDrop.
      </p>
    </div>
  );
}
