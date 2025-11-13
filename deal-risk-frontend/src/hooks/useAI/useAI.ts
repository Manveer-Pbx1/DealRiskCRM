import { useMemo } from 'react';
import { useOpportunities } from '../Opportunities/useOpportunities';
import { useAIRisk } from '../../contexts/aiRisk/AIRiskContext';
import { EnhancedDeal } from '../../types';
import { ALLOWED_USERS } from '../../constants/allowedUsers';

export const useEnhancedDeals = (selectedUserId?: string) => {
  const { opportunities, loading: opportunitiesLoading, error, requiresApiKey, refetch } = useOpportunities();
  const { analyzeOpportunity, getAnalysis, isAnalyzing, getError } = useAIRisk();

  const filteredOpportunities = useMemo(() => {
    if (!selectedUserId) return opportunities;
    return opportunities.filter(opp => 
      opp.user_id === selectedUserId || opp.user_name === selectedUserId
    );
  }, [opportunities, selectedUserId]);

  const enhancedDeals: EnhancedDeal[] = useMemo(() => {
    return filteredOpportunities.map(opp => {
      const analysis = getAnalysis(opp.id);
      const analyzing = isAnalyzing(opp.id);
      const aiError = getError(opp.id);

      const dealName = opp.lead_name || 'Unknown Company';

      return {
        id: opp.id,
        closeOpportunityId: opp.id,
        name: dealName,
        company: opp.lead_email || 'No email available',
        owner: opp.user_name || 'Unknown Owner',
        lastContact: opp.date_updated,
        engagementScore: opp.confidence || 50,
        pipelineName: opp.pipeline_name || 'Unknown Pipeline',
        statusLabel: opp.status_label || 'Unknown Status',
        confidence: opp.confidence || 50,
        dateCreated: opp.date_created,
        dateUpdated: opp.date_updated,
        contactName: opp.contact_name || 'Unknown Contact',
        riskLevel: analysis ? (
          analysis.riskScore <= 30 ? "Low" : 
          analysis.riskScore <= 70 ? "Medium" : "High"
        ) : "Medium",
        reason: analysis?.reason || (analyzing ? "Analyzing risk..." : aiError ? "Analysis failed" : ""),
        riskScore: analysis?.riskScore || 50,
        actions: analysis?.recommendations || [],
        aiAnalysis: analysis,
        isAnalyzing: analyzing,
        isAnalyzed: !!analysis,
      };
    });
  }, [filteredOpportunities, getAnalysis, isAnalyzing, getError]);

  return {
    deals: enhancedDeals,
    loading: opportunitiesLoading,
    error,
    requiresApiKey,
    refetch,
    getOpportunityById: (opportunityId: string) => {
      return filteredOpportunities.find(opp => opp.id === opportunityId);
    },
    retryAnalysis: (opportunityId: string) => {
      const opportunity = filteredOpportunities.find(opp => opp.id === opportunityId);
      if (opportunity) {
        analyzeOpportunity(opportunity);
      }
    },
    analyzeDeal: (opportunityId: string) => {
      const opportunity = filteredOpportunities.find(opp => opp.id === opportunityId);
      if (opportunity) {
        analyzeOpportunity(opportunity);
      }
    },
  };
};