import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers - allow both production and local
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://deal-risk-analyst.vercel.app',
    'http://localhost:5173',
    'http://localhost:4173'
  ];
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-close-api-key');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Parse the query string from the request
    const queryString = req.url?.split('?')[1] || '';
    const path = req.query.path || 'lead';
    
    // Build the Close.io API URL
    const url = `https://api.close.com/api/v1/${path}${queryString ? `?${queryString}` : ''}`;
    
    console.log('Proxying request to:', url);

    const customApiKey = req.headers['x-close-api-key'] as string;
    const apiKey = customApiKey || process.env.VITE_CLOSE_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }
    
    const auth = Buffer.from(apiKey + ':').toString('base64');

    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' && req.body ? JSON.stringify(req.body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Close API error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: `Close API Error: ${response.status}`,
        details: errorText 
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Proxy server error',
      message: error.message 
    });
  }
}
