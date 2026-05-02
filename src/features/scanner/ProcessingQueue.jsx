import { AlertCircle, CheckCircle2, Clock3, Loader2, ScanText } from "lucide-react";

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700 ring-amber-100",
  Processing: "bg-sky-50 text-sky-700 ring-sky-100",
  Completed: "bg-sky-50 text-sky-700 ring-sky-100",
  Failed: "bg-red-50 text-red-700 ring-red-100",
};

const statusIcons = {
  Pending: Clock3,
  Processing: Loader2,
  Completed: CheckCircle2,
  Failed: AlertCircle,
};

function getCardMessage(card) {
  if (!card.error) {
    return `${card.front?.name || card.back?.name || "Waiting for image"} · ${card.language}`;
  }

  if (/billing is not enabled|requires billing/i.test(card.error)) {
    return "Google Vision billing is not enabled. Enable billing in Google Cloud, then scan again.";
  }

  return card.error;
}

export function ProcessingQueue({ cards, selectedCardId, onSelectCard, progressLabel }) {
  return (
    <section className="premium-panel min-w-0 overflow-hidden rounded-[18px] p-5">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-ink">Processing Queue</h2>
          <p className="mt-1 text-sm text-brand/60">{progressLabel}</p>
        </div>
        <span className="rounded-full bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand">
          OCR pipeline
        </span>
      </div>

      <div className="max-h-[640px] space-y-3 overflow-y-auto pr-1">
        {cards.length > 0 ? (
          cards.map((card, index) => {
            const Icon = statusIcons[card.status] || Clock3;
            const selected = selectedCardId === card.id;
            const message = getCardMessage(card);

            return (
              <button
                className={`flex w-full min-w-0 items-center gap-3 rounded-[18px] border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-soft ${
                  selected
                    ? "border-accent/50 bg-sky-50/100"
                    : "border-brand/10 bg-white/75 hover:border-accent/25"
                }`}
                key={card.id}
                onClick={() => onSelectCard(card.id)}
                type="button"
              >
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-2xl bg-brand/[0.04]">
                  {card.front?.url || card.back?.url ? (
                    <img
                      alt="Business card preview"
                      className="h-full w-full object-cover"
                      src={card.front?.url || card.back?.url}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-brand/40">
                      <ScanText className="h-5 w-5" />
                    </div>
                  )}
                  {card.status === "Processing" ? (
                    <span className="absolute inset-0 bg-brand/30 backdrop-blur-[1px]" />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-bold text-ink">Card #{index + 1}</p>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${statusStyles[card.status]}`}
                    >
                      {card.status === "Processing" ? (
                        <span className="scan-loader h-3.5 w-3.5 border-[1.5px]" />
                      ) : (
                        <Icon className="h-3.5 w-3.5" />
                      )}
                      {card.status}
                    </span>
                  </div>
                  <p className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-brand/50" title={card.error || message}>
                    {message}
                  </p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-brand/10">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        card.status === "Failed" ? "bg-red-500" : "bg-gradient-to-r from-accent to-brand"
                      }`}
                      style={{
                        width:
                          card.status === "Completed"
                            ? "100%"
                            : card.status === "Failed"
                              ? "100%"
                            : card.status === "Processing"
                              ? "58%"
                              : "8%",
                      }}
                    />
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="rounded-[18px] border border-dashed border-brand/20 bg-white/60 p-8 text-center">
            <ScanText className="mx-auto h-8 w-8 text-brand/40" />
            <p className="mt-3 text-sm font-semibold text-brand/70">No cards in queue</p>
            <p className="mt-1 text-sm text-brand/50">Upload front images to begin bulk processing.</p>
          </div>
        )}
      </div>
    </section>
  );
}
