export class CloseApiService {
  private static getHeaders() {
    const API_KEY = import.meta.env.VITE_CLOSE_API_KEY;
    
    return {
      'Authorization': `Basic ${btoa(API_KEY + ':')}`, // Basic auth with empty password
      'Content-Type': 'application/json',
    };
  }

  static async getOpportunities(params?: Record<string, string>) {
    const defaultParams = {
      _limit: '100',
      _skip: '0'
    };

    const queryParams = new URLSearchParams({ ...defaultParams, ...params });
    
    // Always use the serverless function (works for both localhost and production)
    const url = `/api/close-proxy/lead?${queryParams}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Close API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Close API Response:', data);
    
    const flattenedOpportunities = data.data.flatMap((lead: any) => 
      (lead.opportunities || []).map((opp: any) => ({
        ...opp,
        lead_name: lead.name,
        lead_contacts: lead.contacts
      }))
    );
    
    return {
      data: flattenedOpportunities,
      has_more: data.has_more,
      total_results: data.total_results
    };
  }
}
