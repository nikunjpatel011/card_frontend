import { BarChart3, Globe2, ScanSearch } from "lucide-react";

export function AnalyticsPage({ contacts, cards, usage }) {
  const languageTotals = ["EN", "HI", "GU"].map((language) => ({
    language,
    count: contacts.filter((contact) => contact.language === language).length,
  }));
  const queueTotals = ["Pending", "Processing", "Completed", "Failed"].map((status) => ({
    status,
    count: cards.filter((card) => card.status === status).length,
  }));

  const maxLanguage = Math.max(...languageTotals.map((item) => item.count), 1);
  const maxQueue = Math.max(...queueTotals.map((item) => item.count), usage, 1);

  return (
    <div className="space-y-6 fade-slide">
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <section className="premium-panel rounded-[18px] p-5">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-ink">Scan Volume</h2>
              <p className="mt-1 text-sm text-brand/60">Live queue and usage data.</p>
            </div>
            <span className="rounded-2xl bg-brand/10 p-3 text-brand">
              <BarChart3 className="h-5 w-5" />
            </span>
          </div>
          <div className="flex h-72 items-end gap-3">
            {[...queueTotals, { status: "Used Today", count: usage }].map((item) => (
              <div className="flex flex-1 flex-col items-center gap-3" key={item.status}>
                <div className="flex h-56 w-full items-end rounded-2xl bg-brand/[0.045] p-1.5">
                  <div
                    className="w-full rounded-xl bg-gradient-to-t from-brand to-accent shadow-soft transition hover:scale-[1.02]"
                    style={{ height: `${Math.max(8, (item.count / maxQueue) * 100)}%` }}
                  />
                </div>
                <span className="text-center text-xs font-bold text-brand/50">{item.status}</span>
                <span className="text-sm font-extrabold text-brand">{item.count}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="premium-panel rounded-[18px] p-5">
          <div className="mb-6 flex items-center gap-3">
            <span className="rounded-2xl bg-sky-50 p-3 text-sky-700">
              <Globe2 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-ink">Language Mix</h2>
              <p className="text-sm text-brand/60">Saved contact language profiles.</p>
            </div>
          </div>
          <div className="space-y-4">
            {languageTotals.map((item) => (
              <div key={item.language}>
                <div className="mb-2 flex justify-between text-sm font-semibold text-brand/75">
                  <span>{item.language}</span>
                  <span>{item.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-brand/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-brand"
                    style={{ width: `${(item.count / maxLanguage) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="premium-panel rounded-[18px] p-5">
        <div className="mb-5 flex items-center gap-3">
          <span className="rounded-2xl bg-amber-50 p-3 text-amber-700">
            <ScanSearch className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-ink">Processing Breakdown</h2>
            <p className="text-sm text-brand/60">Current session queue by state.</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          {["Pending", "Processing", "Completed", "Failed"].map((status) => (
            <div className="rounded-[18px] border border-brand/10 bg-white/70 p-5" key={status}>
              <p className="text-sm font-semibold text-brand/50">{status}</p>
              <p className="mt-2 text-3xl font-bold text-ink">
                {cards.filter((card) => card.status === status).length}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
