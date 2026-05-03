import {
  BarChart3,
  LayoutDashboard,
  ScanLine,
  Settings,
  X,
} from "lucide-react";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "scan", label: "Scan Cards", icon: ScanLine },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({ activePage, onNavigate, mobileOpen, onClose, usage, limit }) {
  const percent = limit ? Math.min(100, Math.round((usage / limit) * 100)) : 0;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-brand/45 backdrop-blur-sm transition-opacity lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`app-sidebar fixed inset-y-0 left-0 z-50 flex w-72 flex-col px-4 py-4 text-brand transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between">
          <button
            className="flex min-w-0 flex-1 items-center justify-center rounded-2xl px-1 text-left transition hover:opacity-90"
            onClick={() => onNavigate("dashboard")}
            type="button"
            aria-label="Go to dashboard"
          >
            <img
              alt="Nimkro"
              className="h-16 w-auto max-w-[230px] object-contain"
              src="/nimkro.webp"
            />
          </button>
          <button
            className="rounded-full border border-brand/10 bg-white p-2 text-brand shadow-sm transition hover:bg-brand hover:text-white lg:hidden"
            onClick={onClose}
            type="button"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 py-6">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.id;

              return (
                <button
                  key={item.id}
                  className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                    active
                      ? "bg-gradient-to-r from-accent to-brand text-white shadow-sm shadow-brand/10"
                      : "text-brand/65 hover:bg-accent/10 hover:text-brand"
                  }`}
                  onClick={() => onNavigate(item.id)}
                  type="button"
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="space-y-3 pb-1">
          <div className="rounded-3xl border border-brand/10 bg-white/70 p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase text-brand/50">
              <ScanLine className="h-4 w-4 text-brand" />
              Daily scans
            </div>
            <div className="flex items-end justify-between gap-3">
              <p className="text-2xl font-extrabold text-brand">
                {usage} / {limit}
              </p>
              <p className="pb-1 text-sm font-extrabold text-brand/55">{percent}%</p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-brand/10">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
