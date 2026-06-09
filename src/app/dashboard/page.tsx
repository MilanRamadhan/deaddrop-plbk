export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <p className="mt-2 text-gray-500">Overview of your secure messages.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-4">
        <StatCard title="Total" value="0" />

        <StatCard title="Opened" value="0" />

        <StatCard title="Pending" value="0" />

        <StatCard title="Destroyed" value="0" />
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-500">{title}</p>

      <h2 className="mt-2 text-3xl font-bold">{value}</h2>
    </div>
  );
}
