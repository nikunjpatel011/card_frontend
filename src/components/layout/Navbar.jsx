import {
  Bell,
  CalendarDays,
  ChevronDown,
  Menu,
  Search,
  Zap,
} from "lucide-react";

export function Navbar({ onOpenSidebar, usage, limit }) {
  const percent = limit ? Math.min(100, Math.round((usage / limit) * 100)) : 0;

  return (
    <header className="dashboard-topbar sticky top-3 z-30">
      <div className="flex min-h-[72px] items-center justify-between gap-3 px-4 py-3 lg:px-5">
        <div className="flex items-center gap-3 lg:hidden">
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full border border-brand/10 bg-white text-brand shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            onClick={onOpenSidebar}
            type="button"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="flex items-center gap-2 rounded-2xl px-1 text-left">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-brand shadow-sm">
              <Zap className="h-5 w-5 fill-brand/10" />
            </span>
            <span className="text-lg font-extrabold tracking-normal text-brand">
              CardCRM
            </span>
          </span>
        </div>

        <div className="hidden flex-1 items-center justify-end gap-2 lg:flex">
          <div className="flex items-center rounded-full border border-brand/10 bg-white px-3 py-2 text-sm text-brand/50 shadow-sm">
            <Search className="mr-2 h-4 w-4" />
            <input
              className="w-64 bg-transparent outline-none placeholder:text-brand/40 xl:w-72"
              placeholder="Search"
            />
          </div>
          <div className="rounded-full border border-brand/10 bg-white px-3 py-2 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-brand">
              <span>
                {usage} / {limit}
              </span>
              <span className="text-brand/50">{percent}%</span>
            </div>
          </div>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-brand/10 bg-white text-brand shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            type="button"
            aria-label="Calendar"
          >
            <CalendarDays className="h-4 w-4" />
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-brand/10 bg-white text-brand shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            type="button"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>
          <button
            className="flex items-center gap-2 rounded-full border border-brand/10 bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            type="button"
            aria-label="User profile"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#111815,#9AF36D)] text-xs font-bold text-white">
              NS
            </span>
            <ChevronDown className="h-4 w-4 text-brand/60" />
          </button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-brand/10 bg-white text-brand shadow-sm"
            type="button"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-brand/10 bg-white text-brand shadow-sm"
            type="button"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
