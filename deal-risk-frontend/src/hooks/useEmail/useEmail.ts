import { useState } from 'react';
import { GeminiRiskAnalyzerService } from '../../services/ai/gemini';
import { CloseOpportunity } from '../../types';

interface EmailData {
  to: string;
  subject: string;
  body: string;
}

export const useEmail = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateEmailContent = async (deal: CloseOpportunity) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const emailBody = await GeminiRiskAnalyzerService.generateEmailContent(deal);
      return emailBody;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate email';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const sendEmail = async (emailData: EmailData) => {
    setIsSending(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.DEV 
        ? 'http://localhost:3001/api/send-email'
        : 'https://deal-risk-backend.onrender.com/api/send-email';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send email');
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send email';
      setError(errorMessage);
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  return {
    isGenerating,
    isSending,
    error,
    generateEmailContent,
    sendEmail,
    clearError: () => setError(null),
  };
};
