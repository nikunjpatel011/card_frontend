import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getBackendStatus,
  getJobStatus,
  getResults,
  uploadCardImages,
} from "../services/scannerApi.js";
import {
  attachBackImages,
  buildFrontCards,
  getProgressLabel,
  getQueueStats,
} from "../utils/scannerUtils.js";

const DEFAULT_DAILY_LIMIT = 200;
const POLL_INTERVAL_MS = 1500;

const statusMap = {
  pending: "Pending",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
};

function normalizeUsage(usage) {
  if (!usage) {
    return {
      used: 0,
      limit: DEFAULT_DAILY_LIMIT,
    };
  }

  return {
    used: Number(usage.processed || 0) + Number(usage.reserved || 0),
    limit: Number(usage.limit || DEFAULT_DAILY_LIMIT),
  };
}

function detectLanguageFromText(text = "") {
  if (/[\u0A80-\u0AFF]/.test(text)) return "GU";
  if (/[\u0900-\u097F]/.test(text)) return "HI";
  return "EN";
}

function resultToContact(record) {
  const data = record.result || {};

  return {
    id: `contact-${record.jobId}`,
    jobId: record.jobId,
    name: data.name || "Unnamed Contact",
    phones: Array.isArray(data.phones) ? data.phones : [],
    email: data.email || "",
    company: data.company || "",
    location: data.address || data.location || "",
    state: data.state || "",
    city: data.city || "",
    language: detectLanguageFromText(record.rawText),
    scannedAt: record.savedAt ? new Date(record.savedAt).toLocaleDateString() : "Saved",
  };
}

function revokeCardUrls(card) {
  if (card.front?.url) URL.revokeObjectURL(card.front.url);
  if (card.back?.url) URL.revokeObjectURL(card.back.url);
}

export function useScannerWorkflow() {
  const [contacts, setContacts] = useState([]);
  const [cards, setCards] = useState([]);
  const [usage, setUsage] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(DEFAULT_DAILY_LIMIT);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [languageAssist, setLanguageAssist] = useState(true);
  const [workflowError, setWorkflowError] = useState("");
  const pollingStopped = useRef(false);

  const selectedCard = cards.find((card) => card.id === selectedCardId) || null;
  const queueStats = useMemo(() => getQueueStats(cards), [cards]);
  const progressLabel = useMemo(() => getProgressLabel(queueStats), [queueStats]);

  const stats = useMemo(
    () => ({
      totalScanned:
        contacts.length + cards.filter((card) => card.status === "Completed" && !card.saved).length,
      todayUsage: usage,
      totalContacts: contacts.length,
    }),
    [cards, contacts.length, usage],
  );

  const refreshBackendState = useCallback(async () => {
    try {
      const [statusResponse, resultsResponse] = await Promise.all([
        getBackendStatus(),
        getResults(),
      ]);

      const normalizedUsage = normalizeUsage(statusResponse.usage);
      setUsage(normalizedUsage.used);
      setDailyLimit(normalizedUsage.limit);

      const savedContacts = (resultsResponse.results || [])
        .filter((record) => record.savedAt)
        .map(resultToContact)
        .reverse();

      setContacts(savedContacts);
      setWorkflowError("");
    } catch (error) {
      setWorkflowError(error.message || "Backend is not reachable.");
    }
  }, []);

  useEffect(() => {
    pollingStopped.current = false;
    refreshBackendState();

    return () => {
      pollingStopped.current = true;
    };
  }, [refreshBackendState]);

  const addFiles = (type, files) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (!imageFiles.length) return;

    setWorkflowError("");
    setCards((current) => {
      if (type === "front") {
        return [...current, ...buildFrontCards(imageFiles, current.length)];
      }

      return attachBackImages(current, imageFiles);
    });
  };

  const removeCard = (cardId) => {
    setCards((current) => {
      const card = current.find((item) => item.id === cardId);
      if (card) revokeCardUrls(card);
      return current.filter((item) => item.id !== cardId);
    });

    if (selectedCardId === cardId) {
      setSelectedCardId(null);
    }
  };

  const clearCards = () => {
    setCards((current) => {
      current.forEach(revokeCardUrls);
      return [];
    });
    setSelectedCardId(null);
    setWorkflowError("");
  };

  const applyJobUpdate = (cardId, job) => {
    const nextStatus = statusMap[job.status] || "Pending";

    setCards((current) =>
      current.map((card) => {
        if (card.id !== cardId) return card;

        return {
          ...card,
          status: nextStatus,
          extracted: job.result || card.extracted,
          language: job.rawText ? detectLanguageFromText(job.rawText) : card.language,
          saved: Boolean(job.saved),
          error: job.error?.message || "",
        };
      }),
    );

    if (nextStatus === "Completed") {
      setSelectedCardId((current) => current || cardId);
      refreshBackendState();
    }
  };

  const pollJobUntilDone = async (cardId, jobId) => {
    while (!pollingStopped.current) {
      const response = await getJobStatus(jobId);
      const job = response.job;
      applyJobUpdate(cardId, job);

      if (["completed", "failed"].includes(job.status)) {
        return job;
      }

      await new Promise((resolve) => window.setTimeout(resolve, POLL_INTERVAL_MS));
    }

    return null;
  };

  const processCards = async () => {
    if (isProcessing) return;

    const processableCards = cards.filter((card) => ["Pending", "Failed"].includes(card.status));
    if (!processableCards.length) return;

    setIsProcessing(true);
    setWorkflowError("");

    try {
      for (const card of processableCards) {
        setSelectedCardId(card.id);
        setCards((current) =>
          current.map((item) =>
            item.id === card.id
              ? { ...item, status: "Processing", error: "", extracted: null }
              : item,
          ),
        );

        const uploadResponse = await uploadCardImages(card);
        const job = uploadResponse.jobs?.[0];

        if (!job?.jobId) {
          throw new Error("Backend did not return a processing job.");
        }

        setCards((current) =>
          current.map((item) =>
            item.id === card.id
              ? { ...item, jobId: job.jobId, status: "Pending" }
              : item,
          ),
        );

        await pollJobUntilDone(card.id, job.jobId);
        await refreshBackendState();
      }
    } catch (error) {
      setWorkflowError(error.message || "Processing failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const updateContact = (updatedContact) => {
    setContacts((current) =>
      current.map((contact) => (contact.id === updatedContact.id ? updatedContact : contact)),
    );
  };

  const deleteContact = (contactId) => {
    setContacts((current) => current.filter((contact) => contact.id !== contactId));
  };

  const skipCard = (cardId) => {
    const currentIndex = cards.findIndex((card) => card.id === cardId);
    const nextCompleted = cards.find(
      (card, index) => index > currentIndex && card.status === "Completed" && card.id !== cardId,
    );
    setSelectedCardId(nextCompleted?.id || null);
  };

  return {
    cards,
    contacts,
    dailyLimit,
    isProcessing,
    languageAssist,
    progressLabel,
    queueStats,
    selectedCard,
    selectedCardId,
    stats,
    usage,
    workflowError,
    addFiles,
    clearCards,
    deleteContact,
    processCards,
    removeCard,
    setLanguageAssist,
    setSelectedCardId,
    skipCard,
    updateContact,
  };
}
