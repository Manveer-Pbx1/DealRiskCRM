import React from "react";
import { DealCardProps } from "../../types";
import {Emoji, EmojiStyle} from "emoji-picker-react"

export const DealCard: React.FC<DealCardProps> = ({ deal, onRetryAnalysis }) => {
  const riskColor =
    deal.riskLevel === "High"
      ? "bg-red-100 text-red-700"
      : deal.riskLevel === "Medium"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700";

  const showRiskBadge = deal.isAnalyzed && deal.aiAnalysis;

  return (
    <div className="bg-[rgb(var(--bgCards))] p-4 rounded-lg shadow-sm hover:shadow-md
    shadow-blue-950 transition-all cursor-pointer">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-[rgb(var(--text))] text-lg">{deal.name}</h3>
        {showRiskBadge ? (
          <span className={`text-xs px-3 items-center inline-flex py-1 font-bold rounded-full ${riskColor}`}>
            {deal.riskLevel} <Emoji unified={deal.riskLevel === "High" ? "1f4a3" : deal.riskLevel === "Medium" ? "1f610" : "1f525"} size={14} emojiStyle={EmojiStyle.APPLE}/>
          </span>
        ) : (
          <span className="text-xs px-3 items-center inline-flex py-1 font-bold rounded-full bg-gray-100 text-gray-700">
            Risk <Emoji unified="1f914" size={14} emojiStyle={EmojiStyle.APPLE}/>
          </span>
        )}
      </div>
      <p className="text-sm text-[rgb(var(--text))] mb-1">Owner: {deal.owner}</p>
      <p className="text-sm text-[rgb(var(--text))] mb-1">Contact: {deal.contactName}</p>
      <p className="text-sm text-[rgb(var(--text))] mb-1">Pipeline: {deal.pipelineName}</p>
      <p className="text-sm text-[rgb(var(--text))] mb-1">Status: {deal.statusLabel}</p>
      <p className="text-sm text-[rgb(var(--text))] mb-1">
        Last Contact: {new Date(deal.lastContact).toLocaleDateString()}
      </p>

      {deal.isAnalyzing && (
        <div className="mt-3 p-2 bg-yellow-50 rounded-md flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
          <span className="text-yellow-800 text-xs">Analyzing...</span>
        </div>
      )}

      {!deal.isAnalyzed && !deal.isAnalyzing && onRetryAnalysis && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRetryAnalysis();
          }}
          className="mt-3 w-full py-2 px-3 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
        >
          Analyze with AI
        </button>
      )}
    </div>
  );
};
