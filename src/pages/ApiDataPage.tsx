import { useState } from "react";
import { Database, Network, Key, AlertCircle } from "lucide-react";

export function ApiDataPage() {
  const [apiToken, setApiToken] = useState("yv5cNCeoT4XBiq1bkNuwkoHHdBWCwX5jsmFZF1VaKYHJRlhdm8UKOJVwYcXT");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSportmonks = async (url: string) => {
    if (!apiToken.trim()) {
      setError("Please enter a valid Sportmonks API Token");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
      const json = await res.json();
      
      if (!res.ok || json.error) {
        throw new Error(json.message || json.error?.message || "Failed to fetch from Sportmonks. Check if your token is valid.");
      }

      setData(json);
    } catch (err: any) {
      setError(err.message || "An error occurred fetching the data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWorldCupLeague = () => fetchSportmonks(`https://api.sportmonks.com/v3/football/leagues/1?api_token=${apiToken}`);
  const fetchWorldCupLiveScores = () => fetchSportmonks(`https://api.sportmonks.com/v3/football/livescores?api_token=${apiToken}&filters=fixtureLeagues:1&include=participants;events`);
  const fetchWorldCupStandings = () => fetchSportmonks(`https://api.sportmonks.com/v3/football/standings/leagues/1?api_token=${apiToken}`);
  const fetchAvailableLeagues = () => fetchSportmonks(`https://api.sportmonks.com/v3/football/leagues?api_token=${apiToken}`);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Database className="w-6 h-6 text-red-500" />
          Sportmonks API Tester
        </h1>
        <p className="text-gray-400 leading-relaxed">
          Test the Sportmonks <span className="text-white font-mono bg-zinc-800 px-1 rounded">TV Stations</span> and <span className="text-white font-mono bg-zinc-800 px-1 rounded">World Cup</span> endpoints. 
          Sportmonks API provides deep metadata, statistics, and live scores, but <strong>does not provide actual video streams</strong>.
        </p>
      </div>

      <div className="bg-[#161821] border border-[#242731] rounded-2xl p-6">
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Key className="w-4 h-4" /> Sportmonks API Token
            </label>
            <input
              type="text"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              placeholder="YOUR_TOKEN"
              className="w-full bg-[#1C1F2A] border border-[#2D313E] rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={fetchWorldCupLeague}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex-1 md:flex-none disabled:opacity-50"
            >
              <Database className="w-5 h-5" />
              {loading ? "Testing..." : "WC League Details"}
            </button>

            <button
              onClick={fetchWorldCupLiveScores}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex-1 md:flex-none disabled:opacity-50"
            >
              <Network className="w-5 h-5" />
              {loading ? "Testing..." : "WC Live Scores"}
            </button>

            <button
              onClick={fetchWorldCupStandings}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex-1 md:flex-none disabled:opacity-50"
            >
              <Network className="w-5 h-5" />
              {loading ? "Testing..." : "WC Standings"}
            </button>

            <button
              onClick={fetchAvailableLeagues}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex-1 md:flex-none disabled:opacity-50"
            >
              <Database className="w-5 h-5" />
              {loading ? "Testing..." : "Check My Available Leagues"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
            <p className="text-sm text-red-400 font-medium leading-relaxed">{error}</p>
          </div>
        )}

        {data && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#242731] pb-2">
              <h3 className="text-lg font-bold text-white">JSON Response</h3>
              <span className="text-xs text-gray-500">Total items: {data.data?.length || 0}</span>
            </div>
            
            <div className="bg-[#0A0B0E] rounded-lg p-4 max-h-[500px] overflow-y-auto border border-[#242731]">
              <pre className="text-xs font-mono text-green-400 whitespace-pre-wrap word-break">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
