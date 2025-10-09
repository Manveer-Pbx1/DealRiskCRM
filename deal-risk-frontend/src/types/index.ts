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
