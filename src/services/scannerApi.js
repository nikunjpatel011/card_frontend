const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function parseResponse(response) {
  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok || payload?.success === false) {
    const message = payload?.error?.message || `Request failed with ${response.status}`;
    throw new Error(message);
  }

  return payload;
}

export async function getBackendStatus() {
  const response = await fetch(`${API_BASE_URL}/status`);
  return parseResponse(response);
}

export async function getJobStatus(jobId) {
  const response = await fetch(`${API_BASE_URL}/status?jobId=${encodeURIComponent(jobId)}`);
  return parseResponse(response);
}

export async function getResults() {
  const response = await fetch(`${API_BASE_URL}/results`);
  return parseResponse(response);
}

export async function uploadCardImages(card) {
  const formData = new FormData();

  if (card.front?.file) {
    formData.append("front", card.front.file);
  }

  if (card.back?.file) {
    formData.append("back", card.back.file);
  }

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  return parseResponse(response);
}
