import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight text-black">
            DEADDROP
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-600 transition hover:text-black"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/create"
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Create Message
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* HERO */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-3xl">
            <span className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
              Secure Location-Based Messaging
            </span>

            <h1 className="mt-8 text-5xl font-bold tracking-tight text-black md:text-7xl">
              DEADDROP
            </h1>

            <p className="mt-6 text-xl text-gray-600">Secure messages bound to place and time.</p>

            <p className="mt-3 max-w-2xl text-gray-500">
              Pesan yang hanya bisa dibuka di tempat yang tepat, pada waktu yang tepat.
            </p>

            <p className="mt-4 max-w-2xl text-gray-500">
              Create encrypted messages that can only be opened at a specific location, within a
              specific radius, before expiration.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/dashboard/create"
                className="rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition hover:bg-red-700"
              >
                Buat Pesan
              </Link>

              <Link
                href="/dashboard"
                className="rounded-lg border border-gray-200 px-6 py-3 font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
              >
                Lihat Dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="border-t border-gray-100 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="mb-12 text-2xl font-bold text-black">How It Works</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <StepCard
                number="01"
                title="Tulis Pesan & Set Lokasi GPS"
                description="Enkripsi pesanmu dan tentukan koordinat GPS beserta radius di mana pesan bisa dibuka."
              />
              <StepCard
                number="02"
                title="Bagikan Link ke Penerima"
                description="Kirim link unik ke penerima. Link tidak mengandung data lokasi — hanya token terenkripsi."
              />
              <StepCard
                number="03"
                title="Penerima Buka di Lokasi yang Tepat"
                description="Pesan hanya terbuka jika penerima berada dalam radius GPS yang sudah ditentukan."
              />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="bg-gray-50 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="mb-12 text-2xl font-bold text-black">Features</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                title="End-to-End Encryption"
                description="AES-256-GCM encryption with PBKDF2 key derivation."
              />
              <FeatureCard
                title="GPS Locked"
                description="Messages only open inside authorized locations."
              />
              <FeatureCard
                title="Self Destruct"
                description="Destroy messages permanently after opening."
              />
              <FeatureCard
                title="Anonymous"
                description="No personal data required. Token-based identity keeps you private."
              />
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 py-6">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} DEADDROP &mdash; Built for Component-Based Software
            Engineering
          </p>
        </div>
      </footer>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <span className="text-4xl font-bold text-red-600">{number}</span>
      <h3 className="mt-4 text-lg font-semibold text-black">{title}</h3>
      <p className="mt-3 text-gray-500">{description}</p>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-black">{title}</h3>
      <p className="mt-3 text-gray-500">{description}</p>
    </div>
  );
}
