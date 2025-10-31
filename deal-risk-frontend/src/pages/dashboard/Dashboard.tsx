import { DealCard } from "../../components/common/DealCard";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { DealDetailsDrawer } from "../../components/modals/DealDetailDrawer";
import { useState, useMemo } from "react";
import { useEnhancedDeals } from "../../hooks/useAI/useAI";
import { EnhancedDeal } from "../../types";
import { useAIRisk } from "../../contexts/aiRisk/AIRiskContext";

type SortOption = 'newest' | 'oldest' | 'risk-high' | 'risk-low';

export default function Dashboard() {
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [showApiInput, setShowApiInput] = useState<boolean>(false);
  const { deals, loading, error, requiresApiKey, retryAnalysis, analyzeDeal, getOpportunityById } = useEnhancedDeals();
  
  const { isAnalyzing } = useAIRisk();

  const sortedDeals = useMemo(() => {
    const dealsCopy = [...deals];
    switch (sortBy) {
      case 'newest':
        return dealsCopy.sort((a, b) => new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime());
      case 'oldest':
        return dealsCopy.sort((a, b) => new Date(a.dateUpdated).getTime() - new Date(b.dateUpdated).getTime());
      case 'risk-high':
        return dealsCopy.sort((a, b) => b.riskScore - a.riskScore);
      case 'risk-low':
        return dealsCopy.sort((a, b) => a.riskScore - b.riskScore);
      default:
        return dealsCopy;
    }
  }, [deals, sortBy]);

  const handleApiKeySubmit = () => {
    if (customApiKey.trim()) {
      localStorage.setItem('CUSTOM_CLOSE_API_KEY', customApiKey);
      window.location.reload();
    }
  };

  const selectedDeal = selectedDealId ? sortedDeals.find(d => d.id === selectedDealId) || null : null;

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
        <div className="max-w-md w-full">
          <div className="text-red-600 text-lg mb-4 text-center">{error}</div>
          {requiresApiKey && (
            <div className="bg-[rgb(var(--bgCards))] p-6 rounded-lg border border-gray-300">
              <h3 className="text-[rgb(var(--text))] font-semibold mb-3">Configure API Key</h3>
              <p className="text-sm text-[rgb(var(--text))] mb-4 opacity-70">
                Please enter your Close CRM API key to access your deals.
              </p>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  value={customApiKey}
                  onChange={(e) => setCustomApiKey(e.target.value)}
                  placeholder="Enter Close API Key"
                  className="px-3 py-2 text-sm bg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleApiKeySubmit}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Connect
                </button>
              </div>
            </div>
          )}
        </div>
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
          <h2 className="text-lg font-family text-[rgb(var(--textActive))] font-bold">
            Active Deals ({sortedDeals.length})
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowApiInput(!showApiInput)}
              className="px-3 py-1.5 text-sm bg-yellow-300 text-black font-extrabold rounded-md hover:bg-yellow-700 transition-colors"
            >
              {showApiInput ? 'Hide' : 'Add Account'}
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-1.5 text-sm bg-[rgb(var(--bgCards))] text-[rgb(var(--text))] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="risk-high">Highest Risk</option>
              <option value="risk-low">Lowest Risk</option>
            </select>
            <div className="text-sm text-[rgb(var(--text))]">
              AI-Enhanced Risk Analysis
            </div>
          </div>
        </div>

        {showApiInput && (
          <div className="mb-6 p-4 bg-[rgb(var(--bgCards))] rounded-lg border border-gray-300">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                placeholder="Enter Close API Key"
                className="flex-1 px-3 py-2 text-sm bg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleApiKeySubmit}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Connect
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDeals.map((deal) => (
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
          opportunityData={getOpportunityById(selectedDeal.closeOpportunityId)}
        />
      )}
    </div>
  );
}
