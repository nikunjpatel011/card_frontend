import { Languages, ToggleRight } from "lucide-react";
import { ScanWorkflow } from "./ScanWorkflow.jsx";
import { EditableForm } from "./EditableForm.jsx";
import { ProcessingQueue } from "./ProcessingQueue.jsx";
import { UploadGrid } from "./UploadGrid.jsx";

export function ScanCardsPage({ scanner }) {
  const usagePercent = scanner.dailyLimit
    ? Math.min(100, Math.round((scanner.usage / scanner.dailyLimit) * 100))
    : 0;

  return (
    <div className="space-y-6 fade-slide">
      <ScanWorkflow queueStats={scanner.queueStats} />

      <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
        <div className="premium-panel rounded-[18px] p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1.5 text-xs font-bold text-brand">
              <Languages className="h-4 w-4" />
              Multi-language support: EN | HI | GU
            </span>
            <button
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                scanner.languageAssist ? "bg-accent/20 text-brand" : "bg-brand/10 text-brand/50"
              }`}
              onClick={() => scanner.setLanguageAssist((current) => !current)}
              type="button"
            >
              <ToggleRight className="h-4 w-4" />
              Auto detect {scanner.languageAssist ? "on" : "off"}
            </button>
          </div>
        </div>

        <div className="premium-panel rounded-[18px] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand/50">Free Plan</p>
          <p className="mt-1 text-sm font-bold text-brand">{scanner.dailyLimit} scans/day</p>
        </div>

        <div className="premium-panel rounded-[18px] px-4 py-3">
          <div className="mb-2 flex justify-between gap-6 text-xs font-semibold text-brand/60">
            <span>{scanner.usage} / {scanner.dailyLimit} scans used</span>
            <span>{usagePercent}%</span>
          </div>
          <div className="h-1.5 w-44 overflow-hidden rounded-full bg-brand/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-brand"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>
      </div>

      <UploadGrid
        cards={scanner.cards}
        error={scanner.workflowError}
        isProcessing={scanner.isProcessing}
        onClearCards={scanner.clearCards}
        onFiles={scanner.addFiles}
        onRemoveCard={scanner.removeCard}
        onStartProcessing={scanner.processCards}
      />

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <ProcessingQueue
          cards={scanner.cards}
          onSelectCard={scanner.setSelectedCardId}
          progressLabel={scanner.progressLabel}
          selectedCardId={scanner.selectedCardId}
        />
        <EditableForm
          card={scanner.selectedCard}
        />
      </div>
    </div>
  );
}
