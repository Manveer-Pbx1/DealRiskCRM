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