import { ImagePlus, UploadCloud, X } from "lucide-react";

function DropZone({ onFiles }) {
  const handleDrop = (event) => {
    event.preventDefault();
    onFiles("front", Array.from(event.dataTransfer.files || []));
  };

  return (
    <label
      className="group flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-[18px] border border-dashed border-brand/20 bg-gradient-to-br from-white to-sky-50/60 p-6 text-center transition hover:-translate-y-1 hover:border-accent/100 hover:shadow-soft"
      htmlFor="card-upload"
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white shadow-soft transition group-hover:scale-105">
        <ImagePlus className="h-6 w-6" />
      </span>
      <span className="text-sm font-bold text-ink">Upload Card Images</span>
      <span className="mt-1 max-w-[260px] text-sm leading-6 text-brand/60">Upload business card images to scan.</span>
      <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-brand shadow-sm ring-1 ring-brand/10">
        <UploadCloud className="h-4 w-4" />
        Choose files
      </span>
      <input
        accept="image/png,image/jpeg"
        className="sr-only"
        id="card-upload"
        multiple
        onChange={(event) => onFiles("front", Array.from(event.target.files || []))}
        type="file"
      />
    </label>
  );
}

export function UploadGrid({
  cards,
  error,
  onFiles,
  onRemoveCard,
  onStartProcessing,
  onClearCards,
  isProcessing,
}) {
  const hasCards = cards.length > 0;
  const hasPendingCards = cards.some((card) => card.status === "Pending");
  const hasFailedCards = cards.some((card) => card.status === "Failed");
  const canProcess = hasPendingCards || hasFailedCards;

  return (
    <section className="premium-panel min-w-0 overflow-hidden rounded-[18px] p-5">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-ink">Bulk Upload</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-brand/60">
            Supports English, Hindi, Gujarati cards. Upload clear images for best results.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-2xl border border-brand/10 bg-white px-4 py-2.5 text-sm font-semibold text-brand transition hover:-translate-y-0.5 hover:shadow-sm disabled:opacity-50"
            disabled={!hasCards || isProcessing}
            onClick={onClearCards}
            type="button"
          >
            Clear
          </button>
          <button
            className="gradient-button rounded-2xl px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
            disabled={!canProcess || isProcessing}
            onClick={onStartProcessing}
            type="button"
          >
            {isProcessing ? "Processing..." : hasFailedCards && !hasPendingCards ? "Retry Failed" : "Upload & Process"}
          </button>
        </div>
      </div>

      {error ? (
        <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 break-words">
          {error}
        </div>
      ) : null}

      <DropZone onFiles={onFiles} />

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-ink">Uploaded files</h3>
          <span className="text-xs font-semibold text-brand/50">{cards.length} card records</span>
        </div>

        {hasCards ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
              <article
                className="group rounded-[18px] border border-brand/10 bg-white/75 p-3 shadow-sm transition hover:-translate-y-1 hover:border-accent/25 hover:shadow-soft"
                key={card.id}
              >
                <div className="relative aspect-[1.58/1] overflow-hidden rounded-2xl bg-brand/[0.04]">
                  {card.front ? (
                    <img
                      alt={card.front.name}
                      className="h-full w-full object-cover"
                      src={card.front.url}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs font-semibold text-brand/40">
                      No image
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">
                      {card.front?.name || card.back?.name || "Uploaded card"}
                    </p>
                    <p className="text-xs text-brand/50">{card.language} detection · {card.status}</p>
                  </div>
                  <button
                    className="rounded-full p-2 text-brand/50 transition hover:bg-red-50 hover:text-red-600"
                    onClick={() => onRemoveCard(card.id)}
                    type="button"
                    aria-label="Remove card"
                    disabled={isProcessing}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[18px] border border-brand/10 bg-white/75 p-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="skeleton h-24 rounded-2xl" />
              <div className="skeleton h-24 rounded-2xl" />
              <div className="skeleton h-24 rounded-2xl" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
