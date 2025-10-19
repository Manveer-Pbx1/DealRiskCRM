import { DealCard } from "../../components/common/DealCard";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { DealDetailsDrawer } from "../../components/modals/DealDetailDrawer";
import { useState } from "react";
import { useEnhancedDeals } from "../../hooks/useAI/useAI";
import { EnhancedDeal } from "../../types";
import { useAIRisk } from "../../contexts/aiRisk/AIRiskContext";

export default function Dashboard() {
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const { deals, loading, error, retryAnalysis, analyzeDeal } = useEnhancedDeals();
  
  const { isAnalyzing } = useAIRisk();

  const selectedDeal = selectedDealId ? deals.find(d => d.id === selectedDealId) || null : null;

  const handleAnalyzeDeal = (deal: EnhancedDeal) => {
    analyzeDeal(deal.closeOpportunityId);
    setSelectedDealId(deal.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[rgb(var(--bg))] dashboard-root p-6 flex items-center justify-center">
        <div className="text-[rgb(var(--text))] text-lg">Loading opportunities...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[rgb(var(--bg))] dashboard-root p-6 flex items-center justify-center">
        <div className="text-red-600 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] dashboard-root p-6 text-gray-800">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-6xl text-[rgb(var(--text))] -tracking-widest font-bold">CRM Dashboard</h1>
        <p className="text-[rgb(var(--text))] inline-flex items-center font-bold ">
          Welcome back <Emoji unified="1f60a" size={18} emojiStyle={EmojiStyle.APPLE} />
        </p>
      </header>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-family text-[rgb(var(--textActive))] font-normal">
            Active Deals ({deals.length})
          </h2>
          <div className="text-sm text-[rgb(var(--text))]">
            AI-Enhanced Risk Analysis
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <div 
              key={deal.id} 
              onClick={() => !selectedDeal && setSelectedDealId(deal.id)}
              className={selectedDeal ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            >
              <DealCard 
                deal={deal} 
                onRetryAnalysis={() => handleAnalyzeDeal(deal)}
              />
            </div>
          ))}
        </div>
      </section>

      {selectedDeal && (
        <DealDetailsDrawer 
          deal={selectedDeal} 
          onClose={() => setSelectedDealId(null)} 
          onRetryAnalysis={() => retryAnalysis(selectedDeal.closeOpportunityId)}
          isAnalyzing={isAnalyzing(selectedDeal.id)}
        />
      )}
    </div>
  );
}
