import { PlaylistParser } from "../components/PlaylistParser";
import { VideoPlayer } from "../components/VideoPlayer";
import { useState } from "react";
import { FileText, MonitorPlay } from "lucide-react";

export function PlaylistPage() {
  const [activeUrl, setActiveUrl] = useState<string | null>(null);

  const handlePlayUrl = (url: string) => {
    setActiveUrl(url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <FileText className="w-6 h-6 text-red-500" />
          M3U Playlist Importer
        </h1>
        <p className="text-gray-400">
          Paste your custom .m3u or .m3u8 files here to parse their channels and watch instantly.
        </p>
      </div>

      {activeUrl && (
        <div className="bg-[#161821] border border-[#242731] p-2 md:p-3 rounded-2xl shadow-2xl mb-6">
           <VideoPlayer url={activeUrl} />
           <div className="p-4 md:p-6 flex items-center justify-between border-t border-[#242731] mt-2">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full border border-[#2D313E] bg-[#1C1F2A] flex items-center justify-center">
                 <MonitorPlay className="w-5 h-5 text-gray-500" />
               </div>
               <div>
                  <h1 className="text-xl font-bold flex items-center gap-2">
                    Custom Stream Playing
                    <span className="flex h-2 w-2 relative ml-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  </h1>
                  <p className="text-sm text-gray-400">{activeUrl}</p>
               </div>
             </div>
           </div>
        </div>
      )}

      <PlaylistParser onPlayUrl={handlePlayUrl} />
    </div>
  );
}
