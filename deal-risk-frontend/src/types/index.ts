export interface Deal {
  id: string;
  name: string;
  company: string;
  owner: string;
  lastContact: string;
  engagementScore: number;
  riskLevel: "Low" | "Medium" | "High";
  reason: string;
  riskScore: number; 
  actions: string[]; 
}

export interface DealCardProps {
  deal: EnhancedDeal;
  onRetryAnalysis: () => void; // Add this property
}

export interface CloseOpportunity{
  id: string;
  name?: string;
  value: number;
  status_label: string;
  date_updated: string;
  date_created: string;
  date_lost?: string | null;
  date_won?: string | null;
  lead_id: string;
  lead_name: string;
  contact_id: string;
  contact_name: string;
  user_id: string;
  user_name: string;
  pipeline_id: string;
  pipeline_name: string;
  status_type: string;
  note: string;
  confidence: number;
  custom_fields?: Record<string, any>;
  lead_email?: string | null;
  lead_phone?: string | null;
  lead_description?: string | null;
  lead_url?: string | null;
  lead_custom_fields?: Record<string, any> | null;
  full_lead_data?: any;
}

export interface OpportunitiesResponse {
  data: CloseOpportunity[];
  has_more: boolean;
  total_results: number;
}

export interface AIRiskAnalysis {
  riskScore: number;
  reason: string;
  recommendations: string[];
}

export interface EnhancedDeal extends Deal {
  closeOpportunityId: string;
  pipelineName: string;
  statusLabel: string;
  confidence: number;
  dateCreated: string;
  dateUpdated: string;
  contactName: string;
  aiAnalysis?: AIRiskAnalysis;
  isAnalyzed: boolean;
  isAnalyzing?: boolean;
}

export interface AIAnalysisState{
  analyses: Record<string, AIRiskAnalysis>;
  loading: Record<string, boolean>;
  errors: Record<string, string | undefined>;
}

export interface EmailActivity {
  id: string;
  _type: string;
  organization_id: string;
  lead_id: string;
  contact_id: string;
  date_created: string;
  date_updated: string;
  direction: 'incoming' | 'outgoing';
  user_id: string;
  user_name: string;
  sender: string;
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  body_text: string;
  body_html?: string;
  status: string;
  opens: any[];
  attachments: Array<{
    url: string;
    filename: string;
    size: number;
    content_type: string;
  }>;
}

export interface EmailActivityResponse {
  has_more: boolean;
  data: EmailActivity[];
}