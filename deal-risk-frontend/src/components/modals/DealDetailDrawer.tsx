import React from "react";
import { Deal } from "../../types";

interface DealDetailsDrawerProps {
  deal: Deal | null;
  onClose: () => void;
}

export const DealDetailsDrawer: React.FC<DealDetailsDrawerProps> = ({
  deal,
  onClose,
}) => {
  if (!deal) return null;

  return (
    <div className="fixed inset-0 flex justify-end z-40 pointer-events-none">
        <div className="absolute inset-0 bg-[rgb(var(--bg))] opacity-90"></div>
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

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[rgb(var(--text))] mb-1">
            Risk Score
          </h3>
          <div className="h-3 bg-gray-200 rounded-full">
            <div
              className={`h-3 rounded-full ${
                deal.riskScore > 70
                  ? "bg-red-500"
                  : deal.riskScore > 40
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${deal.riskScore}%` }}
            />
          </div>
          <p className="text-xs text-[rgb(var(--text))] mt-1">
            {deal.riskScore}% likelihood of deal loss
          </p>
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
