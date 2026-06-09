"use client";

import Link from "next/link";
import { LayoutDashboard, MessageSquare, Plus, Shield } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-72 border-r border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-red-600">DEADDROP</h1>

        <p className="mt-1 text-sm text-gray-500">Secure messages bound to place and time.</p>
      </div>

      <nav className="space-y-2 p-4">
        <SidebarLink href="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />

        <SidebarLink href="/dashboard/messages" icon={<MessageSquare size={18} />} label="Messages" />

        <SidebarLink href="/dashboard/create" icon={<Plus size={18} />} label="Create Message" />

        <SidebarLink href="/dashboard/logs" icon={<Shield size={18} />} label="Audit Logs" />
      </nav>
    </aside>
  );
}

function SidebarLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition hover:bg-red-50 hover:text-red-600">
      {icon}
      {label}
    </Link>
  );
}
