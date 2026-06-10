import { useState } from 'react';
import { MATCHES } from '../data';
import { MatchCard } from '../components/MatchCard';
import { MatchStatus } from '../types';
import { cn } from '../lib/utils';
import { Calendar } from 'lucide-react';

const TABS: { id: MatchStatus | 'ALL', label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'LIVE', label: 'Live Now' },
  { id: 'UPCOMING', label: 'Upcoming' },
  { id: 'FINISHED', label: 'Finished' },
];

export function Matches() {
  const [activeTab, setActiveTab] = useState<MatchStatus | 'ALL'>('ALL');

  const filteredMatches = MATCHES.filter(m => activeTab === 'ALL' || m.status === activeTab);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-[#1C1F2A] border border-[#2D313E] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.2)]">
          <Calendar className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Match Schedule</h1>
          <p className="text-sm text-gray-500">All your favorite games in one place</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap",
              activeTab === tab.id 
                ? "bg-red-600 text-white font-bold shadow-[0_4px_12px_rgba(220,38,38,0.2)]" 
                : "bg-[#1C1F2A] text-gray-400 border border-[#2D313E] hover:bg-[#252a3a] hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-4">
        {filteredMatches.length > 0 ? (
          filteredMatches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-500 flex flex-col items-center">
             <Calendar className="w-12 h-12 mx-auto opacity-20 mb-4" />
             <p>No matches found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
