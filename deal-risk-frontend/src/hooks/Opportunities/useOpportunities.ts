import { useState, useEffect } from "react";
import { CloseApiService } from "../../services/api/closeOpportunity";
import { CloseOpportunity, OpportunitiesResponse } from "../../types";

export const useOpportunities = () => {
    const [opportunities, setOpportunities] = useState<CloseOpportunity[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [requiresApiKey, setRequiresApiKey] = useState<boolean>(false);

    const fetchOpportunities = async (params?: Record<string, string>) => {
        try {
            setLoading(true);
            setError(null);
            setRequiresApiKey(false);
            const response: OpportunitiesResponse = await CloseApiService.getOpportunities(params);
            setOpportunities(response.data);
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to fetch opportunities';
            setError(errorMessage);
            
            if (err.message?.includes('API key') || err.message?.includes('401')) {
                setRequiresApiKey(true);
            }
        }   finally {   
            setLoading(false);
        }

    };
    useEffect(() => {
        fetchOpportunities();
    }, []);

    return {
        opportunities,
        loading,
        error,
        requiresApiKey,
        refetch: fetchOpportunities,
    }
}