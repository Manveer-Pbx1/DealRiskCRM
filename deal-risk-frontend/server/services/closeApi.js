import { config } from '../config/index.js';

export const fetchLeads = async (queryParams, apiKey) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const url = `${config.CLOSE_API_BASE_URL}/lead?${queryString}`;
  
  if (!apiKey) {
    const error = new Error('API key required');
    error.status = 401;
    error.details = { requiresApiKey: true, message: 'Please configure an API key to access Close CRM data' };
    throw error;
  }
  
  const auth = Buffer.from(apiKey + ':').toString('base64');
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    
    const error = new Error(`Close API Error: ${response.status}`);
    error.status = response.status;
    error.details = errorText;
    throw error;
  }
  
  const data = await response.json();
  
  return data;
};

export const fetchEmailActivity = async (queryParams, apiKey) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const url = `${config.CLOSE_API_BASE_URL}/activity/email?${queryString}`;
  
  logger.info('Fetching email activity from Close API:', url);
  
  if (!apiKey) {
    const error = new Error('API key required');
    error.status = 401;
    error.details = { requiresApiKey: true, message: 'Please configure an API key to access Close CRM data' };
    throw error;
  }
  
  const auth = Buffer.from(apiKey + ':').toString('base64');
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    logger.error('Close API error:', response.status, errorText);
    
    const error = new Error(`Close API Error: ${response.status}`);
    error.status = response.status;
    error.details = errorText;
    throw error;
  }
  
  const data = await response.json();
  logger.info(`Fetched ${data.data?.length || 0} email activities from Close API`);
  
  return data;
};
