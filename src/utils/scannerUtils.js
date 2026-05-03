export const languageCycle = ["EN", "HI", "GU"];
export const MAX_UPLOAD_CARDS = 5;

export const createPreview = (file) => ({
  file,
  name: file.name,
  size: file.size,
  url: URL.createObjectURL(file),
});

export const wait = (duration) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });

export const buildFrontCards = (files, existingCount) =>
  files.map((file, index) => ({
    id: crypto.randomUUID(),
    front: createPreview(file),
    back: null,
    status: "Pending",
    language: languageCycle[(existingCount + index) % languageCycle.length],
    extracted: null,
    saved: false,
    createdAt: Date.now() + index,
  }));

export const attachBackImages = (currentCards, files, maxCards = MAX_UPLOAD_CARDS) => {
  const nextCards = [...currentCards];
  let fileIndex = 0;

  for (let cardIndex = 0; cardIndex < nextCards.length && fileIndex < files.length; cardIndex += 1) {
    if (!nextCards[cardIndex].back) {
      nextCards[cardIndex] = {
        ...nextCards[cardIndex],
        back: createPreview(files[fileIndex]),
      };
      fileIndex += 1;
    }
  }

  while (fileIndex < files.length && nextCards.length < maxCards) {
    nextCards.push({
      id: crypto.randomUUID(),
      front: null,
      back: createPreview(files[fileIndex]),
      status: "Pending",
      language: languageCycle[nextCards.length % languageCycle.length],
      extracted: null,
      saved: false,
      createdAt: Date.now() + fileIndex,
    });
    fileIndex += 1;
  }

  return nextCards;
};

export const getQueueStats = (cards) => ({
  completed: cards.filter((card) => card.status === "Completed").length,
  processing: cards.filter((card) => card.status === "Processing").length,
  pending: cards.filter((card) => card.status === "Pending").length,
  failed: cards.filter((card) => card.status === "Failed").length,
  total: cards.length,
});

export const getProgressLabel = ({ completed, failed, processing, total }) => {
  if (total === 0) return "Upload cards to start the OCR pipeline.";
  if (processing > 0) return `Processing ${Math.min(completed + 1, total)} of ${total} cards...`;
  if (failed > 0) return `${completed} completed, ${failed} failed.`;
  return `${completed} of ${total} cards completed.`;
};
