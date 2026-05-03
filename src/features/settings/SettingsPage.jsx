import { CheckCircle2, ShieldCheck } from "lucide-react";

export function SettingsPage({ limit, usage }) {
  const remaining = Math.max(0, limit - usage);
  const usagePercent = limit ? Math.min(100, Math.round((usage / limit) * 100)) : 0;

  return (
    <div className="grid gap-6 xl:grid-cols-1 fade-slide">
      <aside className="space-y-6">
        <section className="premium-panel rounded-[18px] p-5">
          <div className="mb-5 flex items-center gap-3">
            <span className="rounded-2xl bg-brand/10 p-3 text-brand">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-ink">Plan Limit</h2>
              <p className="text-sm text-brand/60">Free Plan: {limit} scans/day</p>
            </div>
          </div>
          <div className="flex justify-between text-sm font-semibold text-brand/60">
            <span>{usage} scans used</span>
            <span>{remaining} remaining</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-brand/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-brand"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </section>

        <section className="premium-panel rounded-[18px] p-5">
          <h2 className="text-lg font-bold text-ink">Enabled Languages</h2>
          <div className="mt-4 space-y-3">
            {["English", "Hindi", "Gujarati"].map((language) => (
              <div className="flex items-center justify-between rounded-2xl bg-white/75 p-3" key={language}>
                <span className="text-sm font-semibold text-brand/100">{language}</span>
                <CheckCircle2 className="h-5 w-5 text-accent" />
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
