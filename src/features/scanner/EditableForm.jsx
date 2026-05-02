import { useEffect, useState } from "react";
import { CheckCircle2, Edit3 } from "lucide-react";

const emptyDraft = {
  name: "",
  phones: [""],
  email: "",
  company: "",
  location: "",
  state: "",
  city: "",
};

export function EditableForm({ card }) {
  const [draft, setDraft] = useState(emptyDraft);

  useEffect(() => {
    if (!card?.extracted) {
      setDraft(emptyDraft);
      return;
    }

    setDraft({
      name: card.extracted.name || "",
      phones: card.extracted.phones?.length ? card.extracted.phones : [""],
      email: card.extracted.email || "",
      company: card.extracted.company || "",
      location: card.extracted.location || card.extracted.address || "",
      state: card.extracted.state || "",
      city: card.extracted.city || "",
    });
  }, [card]);

  // No card selected
  if (!card) {
    return (
      <section className="premium-panel rounded-[18px] p-5">
        <div className="rounded-[18px] border border-dashed border-brand/20 bg-white/60 p-8 text-center">
          <Edit3 className="mx-auto h-8 w-8 text-brand/40" />
          <h2 className="mt-3 text-lg font-bold text-ink">Extracted Data</h2>
          <p className="mt-1 text-sm text-brand/50">
            Card scan થાય એટલે અહીં data દેખાશે.
          </p>
        </div>
      </section>
    );
  }

  const completed = card.status === "Completed";
  const failed = card.status === "Failed";
  const processing = card.status === "Processing" || card.status === "Pending";
  const helperText = completed
    ? card.saved
      ? "Card scan થઈ ગઈ અને Google Sheet માં auto-save થઈ ગઈ."
      : "Card scan complete થઈ ગઈ. Sheet save status update થઈ રહ્યું છે."
    : failed
      ? "OCR failed. Error fix કરીને card ફરી scan કરો."
      : processing
        ? "OCR processing ચાલુ છે..."
        : "OCR results appear after processing.";

  return (
    <section className="premium-panel min-w-0 overflow-hidden rounded-[18px] p-5">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-ink">Extracted Data</h2>
          <p className="mt-1 text-sm text-brand/60">{helperText}</p>
        </div>

        {/* Status badge */}
        {completed && card.saved && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 ring-1 ring-green-100">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Sheet માં Saved ✓
          </span>
        )}
        {completed && !card.saved && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1.5 text-xs font-bold text-yellow-700 ring-1 ring-yellow-100">
            <Edit3 className="h-3.5 w-3.5" />
            Sheet pending
          </span>
        )}
      </div>

      {/* Failed state */}
      {failed && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {card.error || "OCR processing failed for this card."}
        </div>
      )}

      {/* Processing skeleton */}
      {processing && (
        <div className="space-y-4">
          <div className="skeleton h-12 rounded-2xl" />
          <div className="skeleton h-12 rounded-2xl" />
          <div className="skeleton h-12 rounded-2xl" />
          <div className="skeleton h-28 rounded-2xl" />
        </div>
      )}

      {/* Completed result */}
      {completed && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.16em] text-brand/50" htmlFor="card-name">Name</label>
              <input
                className="w-full rounded-2xl border border-brand/10 bg-white px-4 py-3 text-sm font-semibold text-ink outline-none ring-accent/20 transition focus:ring-4 disabled:bg-brand/[0.025]"
                id="card-name"
                readOnly
                value={draft.name}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.16em] text-brand/50" htmlFor="card-email">Email</label>
              <input
                className="w-full rounded-2xl border border-brand/10 bg-white px-4 py-3 text-sm font-semibold text-ink outline-none ring-accent/20 transition focus:ring-4 disabled:bg-brand/[0.025]"
                id="card-email"
                readOnly
                type="email"
                value={draft.email}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-brand/50">
              Phone(s)
              </span>
            </div>
            {draft.phones.map((phone, index) => (
              <div
                key={index}
                className="flex gap-2"
              >
                <input
                  className="min-w-0 flex-1 rounded-2xl border border-brand/10 bg-white px-4 py-3 text-sm font-semibold text-ink outline-none ring-accent/20 transition focus:ring-4 disabled:bg-brand/[0.025]"
                  readOnly
                  value={phone}
                />
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.16em] text-brand/50" htmlFor="card-company">Company</label>
              <input
                className="w-full rounded-2xl border border-brand/10 bg-white px-4 py-3 text-sm font-semibold text-ink outline-none ring-accent/20 transition focus:ring-4 disabled:bg-brand/[0.025]"
                id="card-company"
                readOnly
                value={draft.company}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.16em] text-brand/50" htmlFor="card-state">State</label>
                <input
                  className="w-full rounded-2xl border border-brand/10 bg-white px-4 py-3 text-sm font-semibold text-ink outline-none ring-accent/20 transition focus:ring-4 disabled:bg-brand/[0.025]"
                  id="card-state"
                  readOnly
                  value={draft.state}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.16em] text-brand/50" htmlFor="card-city">City</label>
                <input
                  className="w-full rounded-2xl border border-brand/10 bg-white px-4 py-3 text-sm font-semibold text-ink outline-none ring-accent/20 transition focus:ring-4 disabled:bg-brand/[0.025]"
                  id="card-city"
                  readOnly
                  value={draft.city}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.16em] text-brand/50" htmlFor="card-address">Address</label>
            <textarea
              className="min-h-[104px] w-full resize-none rounded-2xl border border-brand/10 bg-white px-4 py-3 text-sm font-semibold text-ink outline-none ring-accent/20 transition focus:ring-4 disabled:bg-brand/[0.025]"
              id="card-address"
              readOnly
              value={draft.location}
            />
          </div>

          {card.saved && (
            <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
              આ card ની information scan complete થતાં જ Google Sheet માં auto-save થઈ ગઈ છે.
            </div>
          )}
        </div>
      )}
    </section>
  );
}
