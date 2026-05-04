import { API_BASE_URL } from "./apiConfig";

const AUTH_CHECK_TIMEOUT_MS = 6000;

function getAuthHeaders() {
  const sessionId = localStorage.getItem("sessionId");
  if (sessionId) {
    return {
      "X-Session-Id": sessionId,
    };
  }
  return {};
}

async function fetchWithTimeout(url, options = {}, timeoutMs = AUTH_CHECK_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: options.signal || controller.signal,
    });
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function parseResponse(response) {
  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  // Handle 401 Unauthorized - clear session and reload
  if (response.status === 401) {
    localStorage.removeItem("sessionId");
    localStorage.removeItem("username");
    
    // Only reload if not already on login page
    if (window.location.pathname !== '/login') {
      window.location.reload();
    }
    
    throw new Error("Session expired. Please login again.");
  }

  if (!response.ok || payload?.success === false) {
    const message = payload?.error?.message || `Request failed with ${response.status}`;
    throw new Error(message);
  }

  return payload;
}

export async function getBackendStatus() {
  const response = await fetch(`${API_BASE_URL}/status`, {
    headers: getAuthHeaders(),
  });
  return parseResponse(response);
}

export async function getJobStatus(jobId) {
  const response = await fetch(`${API_BASE_URL}/status?jobId=${encodeURIComponent(jobId)}`, {
    headers: getAuthHeaders(),
  });
  return parseResponse(response);
}

export async function getResults() {
  const response = await fetch(`${API_BASE_URL}/results`, {
    headers: getAuthHeaders(),
  });
  return parseResponse(response);
}

export async function getResultsStats() {
  const response = await fetch(`${API_BASE_URL}/results/stats`, {
    headers: getAuthHeaders(),
  });
  return parseResponse(response);
}

export async function getRecentResults(limit = 10) {
  const response = await fetch(`${API_BASE_URL}/results/recent?limit=${limit}`, {
    headers: getAuthHeaders(),
  });
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
    headers: getAuthHeaders(),
    body: formData,
  });

  return parseResponse(response);
}

export async function getDailyStats() {
  const response = await fetch(`${API_BASE_URL}/daily-stats`, {
    headers: getAuthHeaders(),
  });
  return parseResponse(response);
}

export async function checkAuth() {
  const response = await fetchWithTimeout(`${API_BASE_URL}/auth/check`, {
    headers: getAuthHeaders(),
  });
  return parseResponse(response);
}

export async function logout() {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  
  localStorage.removeItem("sessionId");
  localStorage.removeItem("username");
  
  return parseResponse(response);
}
