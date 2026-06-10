import { MATCHES, CATEGORIES, CHANNELS } from '../data';
import { MatchCard } from '../components/MatchCard';
import { Link } from 'react-router-dom';
import { ChevronRight, PlayCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export function Home() {
  const liveMatches = MATCHES.filter(m => m.status === 'LIVE');
  const upcomingMatches = MATCHES.filter(m => m.status === 'UPCOMING');

  return (
    <div className="space-y-10 pb-8 animate-in fade-in duration-500">
      
      {/* Featured Live Match (Hero) */}
      {liveMatches.length > 0 && (
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1E212E] to-[#12141D] border border-[#2D313E] shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 to-transparent mix-blend-overlay z-0"></div>
          <div className="relative z-10 p-6 md:p-10 flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-500 text-xs font-bold tracking-widest mb-6 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> MATCH OF THE DAY
            </span>
            
            <div className="flex items-center justify-center gap-6 md:gap-16 w-full mb-8">
               <div className="flex flex-col items-center gap-4">
                 <img src={liveMatches[0].homeTeam.logo} alt="Home" className="w-20 h-20 md:w-32 md:h-32 object-contain drop-shadow-2xl" />
                 <span className="font-bold text-lg md:text-2xl">{liveMatches[0].homeTeam.name}</span>
               </div>

               <div className="flex flex-col items-center">
                  <div className="bg-black/20 backdrop-blur-md border border-[#2D313E] px-6 py-4 rounded-2xl flex items-center justify-center gap-4 shadow-xl">
                    <span className="text-4xl md:text-5xl font-black">{liveMatches[0].homeTeam.score}</span>
                    <span className="text-gray-500 text-2xl">-</span>
                    <span className="text-4xl md:text-5xl font-black">{liveMatches[0].awayTeam.score}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-red-500 mt-4 animate-pulse">LIVE 72:15</span>
               </div>

               <div className="flex flex-col items-center gap-4">
                 <img src={liveMatches[0].awayTeam.logo} alt="Away" className="w-20 h-20 md:w-32 md:h-32 object-contain drop-shadow-2xl" />
                 <span className="font-bold text-lg md:text-2xl">{liveMatches[0].awayTeam.name}</span>
               </div>
            </div>

            <Link 
              to={`/watch/${liveMatches[0].channelId}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 transition-colors border border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest text-white mt-4"
            >
              Watch Broadcast
            </Link>
          </div>
        </section>
      )}

      {/* Live Channels Ribbon */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Top Channels <span className="text-red-500">â</span>
          </h2>
          <Link to="/channels" className="text-sm text-red-500 hover:text-red-400 flex items-center gap-1 font-medium">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
          {CHANNELS.slice(0, 6).map((channel) => (
            <Link 
              key={channel.id} 
              to={`/watch/${channel.id}`}
              className="min-w-[120px] snap-center flex flex-col items-center gap-3 p-4 bg-[#161821] border border-[#242731] rounded-2xl hover:border-red-600/50 transition-colors group cursor-pointer"
            >
              <img src={channel.logo} alt={channel.name} className="w-16 h-16 rounded bg-white/5 object-contain" />
              <span className="text-xs font-bold text-center text-white line-clamp-2">{channel.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Up Next / Upcoming matches */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Upcoming Matches</h2>
          <Link to="/matches" className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
            Schedule <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {upcomingMatches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>

    </div>
  );
}
