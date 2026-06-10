import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { Match } from '../types';
import { format, parseISO } from 'date-fns';
import { cn } from '../lib/utils';
import { CHANNELS } from '../data';

interface MatchCardProps {
  match: Match;
  key?: string | number;
}

export function MatchCard({ match }: MatchCardProps) {
  const channel = CHANNELS.find(c => c.id === match.channelId);
  const isLive = match.status === 'LIVE';

  return (
    <div className="bg-gradient-to-br from-[#1E212E] to-[#12141D] border border-[#2D313E] rounded-3xl overflow-hidden hover:border-[#333745] transition-all group shadow-sm hover:shadow-xl hover:-translate-y-1 duration-300 relative">
      {/* Date & League Header */}
      <div className="bg-black/20 px-4 py-2 border-b border-[#2D313E] flex justify-between items-center text-xs font-medium text-gray-400">
        <span className="truncate">{match.league}</span>
        <span className={cn(
          "px-2 py-0.5 rounded text-[10px] font-bold tracking-wider flex items-center gap-1",
          isLive ? "bg-red-500 text-white" : "bg-[#1C1F2A] text-gray-400"
        )}>
          {isLive && <span className="w-1 h-1 bg-white rounded-full animate-pulse"></span>}
          {isLive ? 'LIVE' : format(parseISO(match.startTime), 'HH:mm')}
        </span>
      </div>

      {/* Teams Container */}
      <div className="p-5 flex items-center justify-between relative">
        {/* Background ambient glow if live */}
        {isLive && <div className="absolute inset-0 bg-red-500/5 blur-xl pointer-events-none" />}

        {/* Home Team */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center p-2">
            <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-full h-full object-contain drop-shadow-lg" />
          </div>
          <span className="font-bold text-sm text-center line-clamp-1">{match.homeTeam.name}</span>
        </div>

        {/* Score or VS */}
        <div className="flex flex-col items-center justify-center flex-1 px-2 z-10">
          {(isLive || match.status === 'FINISHED') ? (
             <div className="flex flex-col items-center">
               <span className="text-2xl font-black text-white">{match.homeTeam.score || 0} - {match.awayTeam.score || 0}</span>
               {isLive && <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1">LIVE</span>}
             </div>
          ) : (
             <span className="text-lg font-bold text-gray-500 italic">VS</span>
          )}
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center p-2">
            <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-full h-full object-contain drop-shadow-lg" />
          </div>
          <span className="font-bold text-sm text-center line-clamp-1">{match.awayTeam.name}</span>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="p-4 pt-1 border-t border-[#2D313E]/50 flex items-center justify-between gap-4 mt-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 truncate">
            {channel?.name || 'Broadband'}
          </p>
          {match.commentator && (
            <p className="text-[10px] text-gray-500 truncate flex items-center gap-1 mt-0.5">
              🎙️ {match.commentator}
            </p>
          )}
        </div>
        
        {match.channelId ? (
          <Link 
            to={`/watch/${match.channelId}`}
            className={cn(
              "py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-widest border transition-colors whitespace-nowrap",
              isLive 
                ? "bg-red-600 hover:bg-red-500 text-white border-transparent shadow-[0_4px_12px_rgba(220,38,38,0.2)]" 
                : "bg-white/5 hover:bg-white/10 border-white/5 text-white"
            )}
          >
            Watch
          </Link>
        ) : (
          <div className="px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider text-gray-500 bg-[#1C1F2A] border border-[#2D313E]">
            No Stream
          </div>
        )}
      </div>
    </div>
  );
}
