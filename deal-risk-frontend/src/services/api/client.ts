// Example: central place to configure API base URL
export const API_BASE_URL = "http://localhost:8000/api"

export async function fetchData(endpoint: string) {
  const res = await fetch(\`\${API_BASE_URL}/\${endpoint}\`)
  if (!res.ok) throw new Error("Network response was not ok")
  return res.json()
}
