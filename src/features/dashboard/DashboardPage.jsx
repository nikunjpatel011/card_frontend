import {
  ArrowUpRight,
  ContactRound,
  MoreHorizontal,
  ScanLine,
  Target,
} from "lucide-react";

const confidenceTicks = Array.from({ length: 28 }, (_, index) => index);

export function DashboardPage({ contacts, cards, dailyLimit, stats, usage }) {
  const completedToday = cards.filter((card) => card.status === "Completed").length;
  const usagePercent = dailyLimit ? Math.min(100, Math.round((usage / dailyLimit) * 100)) : 0;
  const savedThisWeek = contacts.slice(0, 4);
  const reviewedPercent = cards.length
    ? Math.min(100, Math.round((contacts.length / cards.length) * 100))
    : 0;
  const statusData = ["Pending", "Processing", "Completed", "Failed"].map((status) => ({
    label: status,
    value: cards.filter((card) => card.status === status).length,
  }));
  const maxStatusCount = Math.max(...statusData.map((item) => item.value), 1);

  return (
    <div className="fade-slide space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-normal text-brand sm:text-4xl">
            Scan Overview
          </h1>
          <p className="mt-2 text-sm font-medium text-brand/60">
            Analyze scans, OCR quality, and saved business card contacts.
          </p>
        </div>
      </div>

      <section className="grid gap-4 xl:grid-cols-[1.08fr_1fr_1fr]">
        <article className="dashboard-card overflow-hidden bg-accent p-5 text-brand">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-brand/70">Total Cards Scanned</p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-normal">{stats.totalScanned.toLocaleString()}</h2>
            </div>
            <button className="rounded-full bg-white/60 p-2 text-brand">
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          <div className="inline-flex rounded-full bg-brand px-3 py-1.5 text-xs font-bold text-white">
            {completedToday} completed this session
          </div>
        </article>

        <article className="dashboard-card p-5">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-brand/60">Total Contacts</p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-normal text-brand">
                {stats.totalContacts.toLocaleString()}
              </h2>
            </div>
            <button className="rounded-full border border-brand/10 bg-white p-2 text-brand">
              <ContactRound className="h-4 w-4" />
            </button>
          </div>
          <div className="inline-flex rounded-full bg-accent/40 px-3 py-1.5 text-xs font-bold text-brand">
            {savedThisWeek.length} saved contacts loaded
          </div>
        </article>

        <article className="dashboard-card p-5">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-brand/60">Daily Scan Target</p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-normal text-brand">{usage} / {dailyLimit}</h2>
            </div>
            <button className="rounded-full border border-brand/10 bg-white p-2 text-brand">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2">
            <div className="h-3 overflow-hidden rounded-full bg-brand/10">
              <div
                className="h-full rounded-full bg-brand"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-bold text-brand/50">
              <span>Used</span>
              <span>Remaining</span>
              <span>Target</span>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.85fr_1.65fr]">
        <article className="dashboard-card p-5">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h2 className="text-base font-extrabold text-brand">Review Progress</h2>
              <p className="mt-1 text-xs font-semibold text-brand/50">Completed cards ready for verification</p>
            </div>
            <MoreHorizontal className="h-5 w-5 text-brand/50" />
          </div>

          <div className="relative mx-auto h-36 w-64 max-w-full">
            <div className="absolute inset-x-4 bottom-0 h-32">
              {confidenceTicks.map((tick) => {
                const angle = -82 + tick * 6.1;
                const active = tick < Math.round((reviewedPercent / 100) * confidenceTicks.length);
                return (
                  <span
                    className={`absolute left-1/2 top-1/2 h-9 w-2 origin-[50%_78px] rounded-full ${
                      active ? "bg-brand" : "bg-brand/10"
                    }`}
                    key={tick}
                    style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
                  />
                );
              })}
            </div>
            <div className="absolute inset-x-0 bottom-0 text-center">
              <p className="text-4xl font-extrabold text-brand">{reviewedPercent}%</p>
              <p className="mt-1 text-xs font-bold text-brand/50">Saved after review</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 text-center">
            {["EN", "HI", "GU"].map((language) => (
              <div className="rounded-2xl bg-brand/[0.04] px-3 py-2" key={language}>
                <p className="text-xs font-extrabold text-brand">{language}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="dashboard-card p-5">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-extrabold text-brand">Queue Statistics</h2>
              <p className="mt-1 text-xs font-semibold text-brand/50">Live status from this browser session</p>
            </div>
          </div>

          <div className="flex h-72 items-end gap-3 rounded-[22px] bg-[#f7f8f3] px-4 py-5">
            {statusData.map((item) => (
              <div className="relative flex h-full flex-1 flex-col justify-end gap-3" key={item.label}>
                <div className="flex flex-1 items-end">
                  <div
                    className="w-full rounded-t-2xl bg-[repeating-linear-gradient(-45deg,#9AF36D_0,#9AF36D_5px,#88da5f_5px,#88da5f_10px)]"
                    style={{ height: `${Math.max(8, (item.value / maxStatusCount) * 100)}%` }}
                  />
                </div>
                <span className="text-center text-[11px] font-bold text-brand/50">{item.label}</span>
                <span className="text-center text-sm font-extrabold text-brand">{item.value}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="dashboard-card p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-2xl bg-accent/40 p-3 text-brand">
              <ScanLine className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-brand">Queue Health</h2>
              <p className="text-xs font-semibold text-brand/50">Cards move through pending, processing, completed.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {["Pending", "Processing", "Completed", "Failed"].map((status) => (
              <div className="rounded-2xl bg-[#f7f8f3] p-4 text-center" key={status}>
                <p className="text-2xl font-extrabold text-brand">
                  {cards.filter((card) => card.status === status).length}
                </p>
                <p className="mt-1 text-xs font-bold text-brand/50">{status}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="dashboard-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-brand">Recent Contacts</h2>
              <p className="text-xs font-semibold text-brand/50">Latest saved business cards</p>
            </div>
            <Target className="h-5 w-5 text-brand/50" />
          </div>
          <div className="space-y-2">
            {savedThisWeek.length > 0 ? savedThisWeek.map((contact) => (
              <div className="flex items-center gap-3 rounded-2xl bg-[#f7f8f3] p-3" key={contact.id}>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                  {contact.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold text-brand">{contact.name}</p>
                  <p className="truncate text-xs font-semibold text-brand/50">{contact.company}</p>
                </div>
                <span className="rounded-full bg-accent/50 px-2.5 py-1 text-[11px] font-extrabold text-brand">
                  {contact.language}
                </span>
              </div>
            )) : (
              <div className="rounded-2xl border border-dashed border-brand/15 bg-[#f7f8f3] p-4 text-sm font-semibold text-brand/50">
                No saved contacts yet.
              </div>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
