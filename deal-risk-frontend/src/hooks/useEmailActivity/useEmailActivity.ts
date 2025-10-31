import { useState, useEffect } from 'react';
import { CloseApiService } from '../../services/api/closeOpportunity';
import { EmailActivity } from '../../types';

export const useEmailActivity = (leadId: string | undefined) => {
  const [lastEmail, setLastEmail] = useState<EmailActivity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!leadId) {
      setLastEmail(null);
      return;
    }

    const fetchLastEmail = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await CloseApiService.getEmailActivity(leadId);
        
        if (response.data && response.data.length > 0) {
          const outgoingEmails = response.data.filter(
            (email: EmailActivity) => email.direction === 'outgoing'
          );
          setLastEmail(outgoingEmails[0] || null);
        } else {
          setLastEmail(null);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch email activity';
        setError(errorMessage);
        setLastEmail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLastEmail();
  }, [leadId]);

  return { lastEmail, loading, error };
};
