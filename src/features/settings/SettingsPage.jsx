import { CheckCircle2, ShieldCheck, FileImage, Upload, Calendar } from "lucide-react";

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

        <section className="premium-panel rounded-[18px] p-5">
          <div className="mb-5 flex items-center gap-3">
            <span className="rounded-2xl bg-brand/10 p-3 text-brand">
              <FileImage className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-ink">Upload Rules</h2>
              <p className="text-sm text-brand/60">File upload restrictions and limits</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="rounded-2xl bg-white/75 p-4">
              <div className="flex items-center gap-3 mb-3">
                <Upload className="h-4 w-4 text-accent" />
                <h3 className="text-sm font-bold text-ink">File Size & Quantity</h3>
              </div>
              <div className="space-y-2 text-sm text-brand/80">
                <div className="flex justify-between">
                  <span>Max File Size:</span>
                  <span className="font-semibold text-ink">8 MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Files upload at one time:</span>
                  <span className="font-semibold text-ink">5 files</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/75 p-4">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="h-4 w-4 text-accent" />
                <h3 className="text-sm font-bold text-ink">Daily Limits</h3>
              </div>
              <div className="space-y-2 text-sm text-brand/80">
                <div className="flex justify-between">
                  <span>Daily Card Limit:</span>
                  <span className="font-semibold text-ink">200 cards</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/75 p-4">
              <div className="flex items-center gap-3 mb-3">
                <FileImage className="h-4 w-4 text-accent" />
                <h3 className="text-sm font-bold text-ink">Supported Formats</h3>
              </div>
              <div className="text-sm text-brand/80">
                <p className="mb-2">File extensions accepted:</p>
                <div className="flex flex-wrap gap-2">
                  {['.jpg', '.jpeg', '.png'].map((ext) => (
                    <span 
                      key={ext}
                      className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent"
                    >
                      {ext}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-brand/60">
                  <strong>Note:</strong> Only image files are supported. Upload clear, high-quality images for best OCR results.
                </p>
              </div>
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
}
