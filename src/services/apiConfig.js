function getDefaultApiBaseUrl() {
  if (typeof window === "undefined") {
    return "http://localhost:5000";
  }

  return `${window.location.protocol}//${window.location.hostname}:5000`;
}

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || getDefaultApiBaseUrl();
