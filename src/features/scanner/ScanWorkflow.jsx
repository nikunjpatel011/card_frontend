import { CheckCircle2, FileImage, ScanLine, Table2 } from "lucide-react";

const steps = [
  { label: "Upload", icon: FileImage },
  { label: "Process", icon: ScanLine },
  { label: "Sheet", icon: Table2 },
  { label: "Done", icon: CheckCircle2 },
];

export function ScanWorkflow({ queueStats }) {
  const activeIndex =
    queueStats.completed > 0
      ? 3
      : queueStats.processing > 0
        ? 1
        : queueStats.total > 0
          ? 0
          : -1;

  return (
    <section className="premium-panel rounded-[18px] p-4">
      <div className="grid gap-3 sm:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= activeIndex;

          return (
            <div
              className={`flex items-center gap-3 rounded-2xl border p-3 transition ${
                isActive
                  ? "border-accent/30 bg-accent/10 text-ink"
                  : "border-brand/10 bg-white/100 text-brand/50"
              }`}
              key={step.label}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  isActive ? "bg-gradient-to-br from-accent to-brand text-white" : "bg-brand/10"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-current/60">
                  Step {index + 1}
                </p>
                <p className="truncate text-sm font-bold">{step.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
