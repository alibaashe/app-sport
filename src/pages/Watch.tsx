import { useParams, Link, useNavigate } from 'react-router-dom';
import { CHANNELS, MATCHES } from '../data';
import { VideoPlayer } from '../components/VideoPlayer';
import { MatchCard } from '../components/MatchCard';
import { ArrowLeft, MonitorPlay, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

export function Watch() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const channel = CHANNELS.find(c => c.id === id);
  const relatedMatches = MATCHES.filter(m => m.channelId === id && m.status !== 'FINISHED');

  // Scroll to top on channel change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!channel) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in">
        <AlertCircle className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Channel Not Found</h2>
        <p className="text-gray-400 mb-6">The channel you are looking for does not exist or is offline.</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-[#1C1F2A] border border-[#2D313E] rounded-full hover:bg-[#252a3a] transition-colors">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top bar */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      {/* Player Section */}
      <div className="bg-[#161821] border border-[#242731] p-2 md:p-3 rounded-2xl shadow-2xl">
         <VideoPlayer url={channel.streamUrl} poster={channel.logo} />
         
         <div className="p-4 md:p-6 flex items-center justify-between border-t border-[#242731] mt-2">
            <div className="flex items-center gap-4">
              <img src={channel.logo} alt={channel.name} className="w-12 h-12 rounded-full border border-[#2D313E] bg-white/5 object-contain" />
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  {channel.name}
                  <span className="flex h-2 w-2 relative ml-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                </h1>
                <p className="text-sm text-gray-400">Live Broadcast</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-full border border-red-500/20 text-sm font-semibold">
              <MonitorPlay className="w-4 h-4" />
              HD Stream
            </div>
         </div>
      </div>

      {/* Channel Information / Matches */}
      {relatedMatches.length > 0 && (
        <div className="pt-6">
          <h3 className="text-lg font-bold mb-4">Programming on {channel.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {relatedMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
