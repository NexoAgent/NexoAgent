import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Inicio", icon: "⬡" },
  { href: "/dashboard/empresas", label: "Empresas", icon: "⬡" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-60 bg-slate-900 flex flex-col fixed h-full">
        <div className="px-6 py-6 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">N</span>
            </div>
            <span className="text-white font-semibold text-sm tracking-wide">NexoAgent</span>
          </div>
          <p className="text-slate-400 text-xs mt-1 ml-9">Panel administrativo</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider px-3 py-2">General</p>
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Inicio
          </Link>
          <Link href="/dashboard/empresas" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            Empresas
          </Link>
        </nav>

        <div className="px-4 py-4 border-t border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-600 flex items-center justify-center">
              <span className="text-slate-300 text-xs">A</span>
            </div>
            <div>
              <p className="text-slate-300 text-xs font-medium">Admin</p>
              <p className="text-slate-500 text-xs">nexoagent.onrender.com</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-60">
        <div className="max-w-6xl mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
