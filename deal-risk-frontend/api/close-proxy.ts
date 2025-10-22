import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow requests from your frontend
  res.setHeader('Access-Control-Allow-Origin', 'https://deal-risk-analyst.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get the path from the URL (everything after /api/close-proxy)
    const urlPath = req.url?.replace('/api/close-proxy', '') || '';
    const url = `https://api.close.com/api/v1${urlPath}`;

    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Authorization': req.headers.authorization || '',
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error: any) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: error.message });
  }
}
