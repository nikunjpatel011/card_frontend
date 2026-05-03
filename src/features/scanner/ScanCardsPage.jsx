import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { ProcessingQueue } from "./ProcessingQueue.jsx";
import { UploadGrid } from "./UploadGrid.jsx";

function CompletionModal({ cardCount, onClose }) {
  return (
    <div
      aria-labelledby="completion-modal-title"
      aria-modal="true"
      className="completion-modal-backdrop fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
    >
      <div className="completion-modal relative w-full max-w-md rounded-[18px] bg-white px-8 py-9 text-center shadow-2xl">
        <div className="completion-sparkles" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => (
            <span key={index} />
          ))}
        </div>

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white shadow-soft">
          <Check className="h-8 w-8 stroke-[3]" />
        </div>

        <h2 id="completion-modal-title" className="mt-6 text-xl font-extrabold text-ink">
          Cards Scanned Successfully!
        </h2>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-brand/60">
          {cardCount === 1 ? "Your card has been processed successfully." : `${cardCount} cards have been processed successfully.`}
        </p>

        <button
          className="gradient-button mt-7 inline-flex min-w-28 items-center justify-center rounded-2xl px-6 py-2.5 text-sm font-bold text-white"
          onClick={onClose}
          type="button"
        >
          OK
        </button>
      </div>
    </div>
  );
}

export function ScanCardsPage({ scanner }) {
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const wasProcessing = useRef(false);

  useEffect(() => {
    const finishedProcessing = wasProcessing.current && !scanner.isProcessing;
    wasProcessing.current = scanner.isProcessing;

    const allCardsCompleted =
      scanner.cards.length > 0 && scanner.cards.every((card) => card.status === "Completed");

    if (finishedProcessing && allCardsCompleted) {
      setShowCompletionModal(true);
    }
  }, [scanner.cards, scanner.isProcessing]);

  return (
    <div className="space-y-6 fade-slide">
      {showCompletionModal ? (
        <CompletionModal
          cardCount={scanner.cards.length}
          onClose={() => setShowCompletionModal(false)}
        />
      ) : null}

      <UploadGrid
        cards={scanner.cards}
        error={scanner.workflowError}
        isProcessing={scanner.isProcessing}
        onClearCards={scanner.clearCards}
        onFiles={scanner.addFiles}
        onRemoveCard={scanner.removeCard}
        onStartProcessing={scanner.processCards}
      />

      <div className="min-w-0">
        <ProcessingQueue
          cards={scanner.cards}
          onSelectCard={scanner.setSelectedCardId}
          progressLabel={scanner.progressLabel}
          selectedCardId={scanner.selectedCardId}
        />
      </div>
    </div>
  );
}
