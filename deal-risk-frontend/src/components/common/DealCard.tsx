import React from "react";
import { Deal } from "../../types";
import {Emoji, EmojiStyle} from "emoji-picker-react"
interface DealCardProps {
  deal: Deal;
}

export const DealCard: React.FC<DealCardProps> = ({ deal }) => {
  const riskColor =
    deal.riskLevel === "High"
      ? "bg-red-100 text-red-700"
      : deal.riskLevel === "Medium"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700";

  return (
    <div className="bg-[rgb(var(--bgCards))] p-4 rounded-lg shadow-sm hover:shadow-md
    shadow-blue-950 transition-all cursor-pointer">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-[rgb(var(--text))] text-lg">{deal.name}</h3>
        <span className={`text-xs px-3 items-center inline-flex py-1 font-bold rounded-full ${riskColor}`}>
          {deal.riskLevel} <Emoji unified={deal.riskLevel === "High" ? "1f4a3" : deal.riskLevel === "Medium" ? "1f610" : "1f525"} size={14} emojiStyle={EmojiStyle.APPLE}/>
        </span>
      </div>
      <p className="text-sm text-[rgb(var(--text))] mb-1">Company: {deal.company}</p>
      <p className="text-sm text-[rgb(var(--text))] mb-1">Owner: {deal.owner}</p>
      <p className="text-sm text-[rgb(var(--text))] mb-1">
        Last Contact: {new Date(deal.lastContact).toLocaleDateString()}
      </p>

      <div className="mt-2">
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className={`h-2 rounded-full ${
              deal.engagementScore > 70
                ? "bg-green-500"
                : deal.engagementScore > 40
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${deal.engagementScore}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Engagement Score: {deal.engagementScore}%
        </p>
      </div>

      <p className="text-sm text-[rgb(var(--textCards))] mt-3">{deal.reason}</p>
    </div>
  );
};
