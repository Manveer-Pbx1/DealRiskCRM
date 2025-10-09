import { mockDeals } from "../../data/mockData";
import { DealCard } from "../../components/common/DealCard";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { DealDetailsDrawer } from "../../components/modals/DealDetailDrawer";
import { Deal } from "../../types";
import { useState } from "react";

export default function Dashboard() {
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] dashboard-root p-6 text-gray-800">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-6xl text-[rgb(var(--text))] -tracking-widest font-bold">CRM Dashboard</h1>
        <p className="text-[rgb(var(--text))] inline-flex items-center font-bold ">Welcome back <Emoji unified="1f60a" size={18} emojiStyle={EmojiStyle.APPLE} /></p>
      </header>

      <section>
        <h2 className="text-lg font-family text-[rgb(var(--textActive))] font-normal mb-4">Active Deals</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockDeals.map((deal) => (
            <div key={deal.id} onClick={() => setSelectedDeal(deal)}>
              <DealCard deal={deal} />
            </div>
          ))}
        </div>
      </section>

      {selectedDeal && (
        <DealDetailsDrawer deal={selectedDeal} onClose={() => setSelectedDeal(null)} />
      )}
    </div>
  );
}
