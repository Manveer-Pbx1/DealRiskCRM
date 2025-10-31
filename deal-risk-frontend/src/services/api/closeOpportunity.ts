export class CloseApiService {
  private static getApiUrl() {
    // In production (Vercel), use the serverless function
    // In local dev, use the local dev server
    const isDev = import.meta.env.DEV;
    return isDev ? 'http://localhost:3001' : '';
  }

  static async getOpportunities(params?: Record<string, string>) {
    const defaultParams = {
      _limit: '100',
      _skip: '0'
    };

    const queryParams = new URLSearchParams({ ...defaultParams, ...params });
    const baseUrl = this.getApiUrl();
    const url = `${baseUrl}/api/close-proxy/lead?${queryParams}`;
    
    console.log('Fetching opportunities from:', url);
    
    const customApiKey = localStorage.getItem('CUSTOM_CLOSE_API_KEY');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (customApiKey) {
      headers['x-close-api-key'] = customApiKey;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Close API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Close API Response:', data);
    
    const flattenedOpportunities = data.data.flatMap((lead: any) => 
      (lead.opportunities || []).map((opp: any) => ({
        ...opp,
        lead_name: lead.display_name || lead.name,
        lead_contacts: lead.contacts,
        lead_email: lead.contacts?.[0]?.emails?.[0]?.email || null,
        lead_phone: lead.contacts?.[0]?.phones?.[0]?.phone_formatted || null,
        lead_description: lead.description || null,
        lead_url: lead.url || null,
        lead_custom_fields: lead.custom || null,
        full_lead_data: lead
      }))
    );
    
    return {
      data: flattenedOpportunities,
      has_more: data.has_more,
      total_results: data.total_results
    };
  }

  static async getEmailActivity(leadId: string) {
    const baseUrl = this.getApiUrl();
    const queryParams = new URLSearchParams({
      lead_id: leadId,
      _limit: '1',
      _order_by: '-date_created'
    });
    const url = `${baseUrl}/api/close-proxy/activity/email?${queryParams}`;
    
    console.log('Fetching email activity from:', url);
    
    const customApiKey = localStorage.getItem('CUSTOM_CLOSE_API_KEY');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (customApiKey) {
      headers['x-close-api-key'] = customApiKey;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Close API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Email Activity Response:', data);
    
    return data;
  }
}
