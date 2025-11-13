import React from 'react';
import { Emoji, EmojiStyle } from "emoji-picker-react";

interface FilterAnalyticsProps {
  totalLeads: number;
  className?: string;
}

export const FilterAnalytics: React.FC<FilterAnalyticsProps> = ({ 
  totalLeads, 
  className = ""
}) => {
  return (
    <div className={`inline-flex items-center gap-2 text-sm ${className}`}>
      <Emoji unified="1f4ca" size={16} emojiStyle={EmojiStyle.APPLE} />
      <span className="text-[rgb(var(--text))]">
        {totalLeads} filtered leads
      </span>
    </div>
  );
};