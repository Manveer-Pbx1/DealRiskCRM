export const API_CLIENTS = {
  internal: "http://localhost:8000/api",
  close: import.meta.env.VITE_CLOSE_API_BASE_URL,
};

export async function fetchWithAuth(endpoint: string, apiKey?: string) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const res = await fetch(endpoint, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}