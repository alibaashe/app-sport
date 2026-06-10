import { CATEGORIES, CHANNELS } from '../data';
import { Link } from 'react-router-dom';
import { MonitorPlay } from 'lucide-react';
import { cn } from '../lib/utils';

export function Channels() {
  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-[#1C1F2A] border border-[#2D313E] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.2)]">
          <MonitorPlay className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Live TV Channels</h1>
          <p className="text-sm text-gray-500">Stream your favorite sports and shows</p>
        </div>
      </div>

      <div className="space-y-12">
        {CATEGORIES.map(category => {
          const categoryChannels = CHANNELS.filter(c => c.categoryId === category.id);
          
          if (categoryChannels.length === 0) return null;

          return (
            <section key={category.id} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className={cn("w-3 h-3 rounded-full", category.color || "bg-red-500")} />
                <h2 className="text-xl font-bold">{category.name}</h2>
                <div className="h-px bg-[#242731] flex-1 ml-4" />
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {categoryChannels.map(channel => (
                  <Link
                    key={channel.id}
                    to={`/watch/${channel.id}`}
                    className="bg-[#161821] border border-[#242731] p-4 rounded-2xl flex flex-col items-center gap-4 hover:bg-[#1C1F2A] hover:border-red-600/50 transition-all group hover:-translate-y-1 hover:shadow-xl relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0E]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0" />
                    
                    <div className="relative z-10 p-3 bg-white/5 rounded-full ring-4 ring-transparent group-hover:ring-red-500/20 transition-all">
                      <img src={channel.logo} alt={channel.name} className="w-14 h-14 object-contain rounded-full bg-white/5" />
                    </div>
                    
                    <span className="text-sm font-semibold text-center text-gray-300 group-hover:text-white relative z-10">
                      {channel.name}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
