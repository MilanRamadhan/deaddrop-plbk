import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-3xl">
          <span className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600">Secure Location-Based Messaging</span>

          <h1 className="mt-8 text-5xl font-bold tracking-tight text-black md:text-7xl">DEADDROP</h1>

          <p className="mt-6 text-xl text-gray-600">Secure messages bound to place and time.</p>

          <p className="mt-4 max-w-2xl text-gray-500">Create encrypted messages that can only be opened at a specific location, within a specific radius, before expiration.</p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/dashboard" className="rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition hover:bg-red-700">
              Open Dashboard
            </Link>

            <Link href="/dashboard/create" className="rounded-lg border border-gray-200 px-6 py-3 font-medium">
              Create Message
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3">
          <FeatureCard title="End-to-End Encryption" description="AES-256-GCM encryption with PBKDF2 key derivation." />

          <FeatureCard title="GPS Locked" description="Messages only open inside authorized locations." />

          <FeatureCard title="Self Destruct" description="Destroy messages permanently after opening." />
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h3 className="text-lg font-semibold">{title}</h3>

      <p className="mt-3 text-gray-600">{description}</p>
    </div>
  );
}
