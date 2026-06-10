import { useState } from "react";
import { Link as LinkIcon, Search, Play, FileText, AlertCircle } from "lucide-react";

export interface ParsedChannel {
  name: string;
  logo: string;
  group: string;
  url: string;
}

export function parseM3U(m3uContent: string): ParsedChannel[] {
  const lines = m3uContent.split('\n');
  const channels: ParsedChannel[] = [];
  let currentChannel: Partial<ParsedChannel> = {};

  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('#EXTINF:')) {
      const nameMatch = line.match(/,(.+)$/);
      const logoMatch = line.match(/tvg-logo="([^"]+)"/);
      const groupMatch = line.match(/group-title="([^"]+)"/);
      
      currentChannel = {
        name: nameMatch ? nameMatch[1].trim() : 'Unknown Channel',
        logo: logoMatch ? logoMatch[1] : '',
        group: groupMatch ? groupMatch[1] : 'Uncategorized',
      };
    } else if (line.startsWith('http')) {
      if (currentChannel.name) {
        channels.push({
          name: currentChannel.name,
          logo: currentChannel.logo || '',
          group: currentChannel.group || 'Uncategorized',
          url: line,
        });
        currentChannel = {}; // Reset for next channel
      }
    }
  }
  return channels;
}

export function PlaylistParser({ onPlayUrl }: { onPlayUrl: (url: string) => void }) {
  const [playlistInput, setPlaylistInput] = useState("");
  const [channels, setChannels] = useState<ParsedChannel[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleParse = async () => {
    if (!playlistInput.trim()) return;
    
    setLoading(true);
    setError(null);
    setChannels([]);

    try {
      let contentToParse = playlistInput;

      // If it looks like a URL, fetch it via proxy
      if (playlistInput.startsWith("http")) {
        const response = await fetch(`/api/proxy?url=${encodeURIComponent(playlistInput)}`);
        if (!response.ok) {
          throw new Error("Failed to fetch playlist. Ensure the URL is valid or CORS is not blocking it.");
        }
        contentToParse = await response.text();
      }

      // Parse the content (either RAW text or fetched text)
      const parsedChannels = parseM3U(contentToParse);
      
      if (parsedChannels.length === 0) {
         setError("No channels found. Ensure it is a valid .m3u or .m3u8 playlist format.");
      } else {
         setChannels(parsedChannels);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred parsing the playlist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 w-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-red-600/20 p-2 rounded-lg">
          <FileText className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">M3U Playlist Parser</h2>
          <p className="text-sm text-gray-400">Parse any raw M3U text or M3U URL (like globocom/m3u8 python parser)</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Quick Test:</span>
          <button 
            onClick={() => {
              setPlaylistInput("https://raw.githubusercontent.com/iptv-org/iptv/master/streams/sports.m3u");
            }}
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-gray-300 px-2 py-1 rounded transition-colors"
          >
            IPTV-org Sports (Includes beIN XTRA)
          </button>
          <button 
            onClick={() => {
              setPlaylistInput("https://raw.githubusercontent.com/iptv-org/iptv/master/streams/us.m3u");
            }}
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-gray-300 px-2 py-1 rounded transition-colors"
          >
            US Channels
          </button>
        </div>
        <textarea
          value={playlistInput}
          onChange={(e) => setPlaylistInput(e.target.value)}
          placeholder="Paste full M3U file text or an M3U link here (e.g., https://raw.github.../channels.m3u)"
          className="w-full h-24 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-gray-300 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
        />
        <button
          onClick={handleParse}
          disabled={loading}
          className="self-end bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? "Parsing..." : "Parse Playlist"}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {channels.length > 0 && (
        <div className="mt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3 border-b border-zinc-800 pb-4">
            <h3 className="text-white font-semibold">Found {channels.length} Channels</h3>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search for World Cup channels (e.g. beIN, Fox)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-600 w-full md:w-64"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2 pb-2">
             {channels
               .filter(ch => ch.name.toLowerCase().includes(searchQuery.toLowerCase()) || ch.group.toLowerCase().includes(searchQuery.toLowerCase()))
               .map((ch, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded p-2 hover:border-zinc-600 transition-colors">
                  <div className="w-10 h-10 bg-zinc-900 rounded flex items-center justify-center shrink-0">
                    {ch.logo ? (
                      <img src={ch.logo} alt={ch.name} className="max-w-full max-h-full object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    ) : (
                      <Play className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{ch.name}</p>
                    <p className="text-xs text-gray-500 truncate">{ch.group}</p>
                  </div>
                  <button
                    onClick={() => onPlayUrl(ch.url)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                    title="Play Stream"
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
}
