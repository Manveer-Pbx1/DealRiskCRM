import React from "react";
import { EnhancedDeal } from "../../types";

interface DealDetailsDrawerProps {
  deal: EnhancedDeal | null;
  onClose: () => void;
  onRetryAnalysis?: () => void;
  isAnalyzing?: boolean;
}

export const DealDetailsDrawer: React.FC<DealDetailsDrawerProps> = ({
  deal,
  onClose,
  onRetryAnalysis,
  isAnalyzing = false,
}) => {
  if (!deal) return null;

  return (
    <div className="fixed inset-0 flex justify-end z-40">
        <div className="absolute inset-0 bg-[rgb(var(--bg))] opacity-90" onClick={onClose}></div>
      <div className="relative z-50 w-full text-[rgb(var(--textCards))] sm:w-[400px] bg-[rgb(var(--bgCards))] shadow-md h-full overflow-y-auto p-6 pointer-events-auto shadow-blue-950">
        <button
          onClick={onClose}
          className="text-gray-500 cursor-pointer font-extrabold hover:text-red-800 float-right"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-2 mt-4">{deal.name}</h2>
        <p className="text-gray-500 mb-4">{deal.company}</p>

        <div className="mb-4">
          <p className="text-sm text-[rgb(var(--text))]">Owner: {deal.owner}</p>
          <p className="text-sm text-[rgb(var(--text))]">
            Last Contact: {new Date(deal.lastContact).toLocaleDateString()}
          </p>
          <p className="text-sm text-[rgb(var(--text))]">
            Risk Level:{" "}
            <span
              className={`font-medium ${
                deal.riskLevel === "High"
                  ? "text-red-600"
                  : deal.riskLevel === "Medium"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {deal.riskLevel}
            </span>
          </p>
        </div>

        {deal.aiAnalysis && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[rgb(var(--text))] mb-1">
              Risk Score
            </h3>
            <div className="h-3 bg-gray-200 rounded-full">
              <div
                className={`h-3 rounded-full ${
                  deal.aiAnalysis.riskScore > 70
                    ? "bg-red-500"
                    : deal.aiAnalysis.riskScore > 40
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${deal.aiAnalysis.riskScore}%` }}
              />
            </div>
            <p className="text-xs text-[rgb(var(--text))] mt-1">
              {deal.aiAnalysis.riskScore}% likelihood of deal loss
            </p>
          </div>
        )}

        {/* AI Analysis Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-[rgb(var(--text))]">
              AI Risk Analysis
            </h3>
            {!deal.isAnalyzed && onRetryAnalysis && (
              <button
                onClick={onRetryAnalysis}
                disabled={isAnalyzing}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  isAnalyzing
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
              </button>
            )}
          </div>

          {deal.aiAnalysis ? (
            <div className="bg-[rgb(var(--bgCards))] p-4 rounded-lg border border-[rgb(var(--text))] border-opacity-20">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-[rgb(var(--text))]">Analysis Results</h4>
                <span className="px-2 py-1 bg-[rgb(var(--bg))] text-[rgb(var(--text))] text-xs font-bold rounded">
                  AI Score: {deal.aiAnalysis.riskScore}
                </span>
              </div>
              
              <div className="mb-4">
                <h5 className="text-sm font-semibold text-[rgb(var(--text))] mb-2">AI Assessment:</h5>
                <p className="text-sm text-[rgb(var(--textCards))]">{deal.aiAnalysis.reason}</p>
              </div>

              {deal.aiAnalysis.recommendations.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-[rgb(var(--text))] mb-2">AI Recommendations:</h5>
                  <ul className="list-disc list-inside text-sm text-[rgb(var(--textCards))] space-y-1">
                    {deal.aiAnalysis.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {onRetryAnalysis && (
                <button
                  onClick={onRetryAnalysis}
                  disabled={isAnalyzing}
                  className={`mt-3 w-full py-2 px-3 text-sm font-medium rounded transition-colors ${
                    isAnalyzing
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isAnalyzing ? "Re-analyzing..." : "Re-analyze with AI"}
                </button>
              )}
            </div>
          ) : isAnalyzing ? (
            <div className="bg-[rgb(var(--bgCards))] p-4 rounded-lg border border-yellow-500">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
                <span className="text-[rgb(var(--text))] text-sm">Analyzing deal with AI...</span>
              </div>
            </div>
          ) : (
            <div className="bg-[rgb(var(--bgCards))] p-4 rounded-lg text-center border border-[rgb(var(--text))] border-opacity-20">
              <p className="text-[rgb(var(--textCards))] text-sm mb-3">No AI analysis available for this deal</p>
              {onRetryAnalysis && (
                <button
                  onClick={onRetryAnalysis}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                >
                  Start AI Analysis
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[rgb(var(--text))] mb-2">
            Why this deal is risky
          </h3>
          <p className="text-sm text-gray-600">{deal.reason}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[rgb(var(--text))] mb-2">
            Recommended Actions
          </h3>
          <ol className="list-decimal list-inside text-sm text-[rgb(var(--textActions))] space-y-1">
            {deal.actions.map((action, idx) => (
              <li key={idx}>{action}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};
