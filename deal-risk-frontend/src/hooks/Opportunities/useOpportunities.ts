import { useState, useEffect } from "react";
import { CloseApiService } from "../../services/api/closeOpportunity";
import { CloseOpportunity, OpportunitiesResponse } from "../../types";

export const useOpportunities = () => {
    const [opportunities, setOpportunities] = useState<CloseOpportunity[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOpportunities = async (params?: Record<string, string>) => {
        try {
            setLoading(true);
            setError(null);
            const response: OpportunitiesResponse = await CloseApiService.getOpportunities(params);
            setOpportunities(response.data);
        } catch (err) {
            setError((err as Error).message);
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
        refetch: fetchOpportunities,
    }
}