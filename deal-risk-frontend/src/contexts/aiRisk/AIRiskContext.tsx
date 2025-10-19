import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AIAnalysisState, AIRiskAnalysis, CloseOpportunity } from '../../types';
import { GeminiRiskAnalyzerService } from '../../services/ai/gemini';

interface AIRiskContextType {
  state: AIAnalysisState;
  analyzeOpportunity: (opportunity: CloseOpportunity) => Promise<void>;
  getAnalysis: (opportunityId: string) => AIRiskAnalysis | undefined;
  isAnalyzing: (opportunityId: string) => boolean;
  getError: (opportunityId: string) => string | undefined;
  clearError: (opportunityId: string) => void;
}

const AIRiskContext = createContext<AIRiskContextType | undefined>(undefined);

type AIRiskAction =
  | { type: 'ANALYSIS_START'; payload: { id: string } }
  | { type: 'ANALYSIS_SUCCESS'; payload: { id: string; analysis: AIRiskAnalysis } }
  | { type: 'ANALYSIS_ERROR'; payload: { id: string; error: string } }
  | { type: 'CLEAR_ERROR'; payload: { id: string } };

const initialState: AIAnalysisState = {
  analyses: {},
  loading: {},
  errors: {},
};

function aiRiskReducer(state: AIAnalysisState, action: AIRiskAction): AIAnalysisState {
  switch (action.type) {
    case 'ANALYSIS_START':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.id]: true },
        errors: { ...state.errors, [action.payload.id]: undefined },
      };
    
    case 'ANALYSIS_SUCCESS':
      return {
        ...state,
        analyses: { ...state.analyses, [action.payload.id]: action.payload.analysis },
        loading: { ...state.loading, [action.payload.id]: false },
      };
    
    case 'ANALYSIS_ERROR':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.id]: false },
        errors: { ...state.errors, [action.payload.id]: action.payload.error },
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.payload.id]: undefined },
      };
    
    default:
      return state;
  }
}

export function AIRiskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(aiRiskReducer, initialState);

  const analyzeOpportunity = async (opportunity: CloseOpportunity) => {
    if (state.loading[opportunity.id]) {
      return;
    }

    dispatch({ type: 'ANALYSIS_START', payload: { id: opportunity.id } });

    try {
      console.log('Starting analysis for:', opportunity.id);
      const analysis = await GeminiRiskAnalyzerService.analyzeRisk(opportunity);
      console.log('Analysis result:', analysis);
      dispatch({ 
        type: 'ANALYSIS_SUCCESS', 
        payload: { id: opportunity.id, analysis } 
      });
    } catch (error) {
      console.error('Analysis error:', error);
      dispatch({ 
        type: 'ANALYSIS_ERROR', 
        payload: { 
          id: opportunity.id, 
          error: error instanceof Error ? error.message : 'Analysis failed' 
        } 
      });
    }
  };

  const getAnalysis = (opportunityId: string) => state.analyses[opportunityId];
  const isAnalyzing = (opportunityId: string) => state.loading[opportunityId] || false;
  const getError = (opportunityId: string) => state.errors[opportunityId];
  const clearError = (opportunityId: string) => {
    dispatch({ type: 'CLEAR_ERROR', payload: { id: opportunityId } });
  };

  return (
    <AIRiskContext.Provider value={{
      state,
      analyzeOpportunity,
      getAnalysis,
      isAnalyzing,
      getError,
      clearError,
    }}>
      {children}
    </AIRiskContext.Provider>
  );
}

export function useAIRisk() {
  const context = useContext(AIRiskContext);
  if (!context) {
    throw new Error('useAIRisk must be used within AIRiskProvider');
  }
  return context;
}