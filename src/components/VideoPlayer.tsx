import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { AlertCircle, Link } from "lucide-react";

interface VideoPlayerProps {
  url: string;
  poster?: string;
}

export function VideoPlayer({ url, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [customUrl, setCustomUrl] = useState<string>("");
  const [activeUrl, setActiveUrl] = useState<string>(url);

  useEffect(() => {
    setActiveUrl(url);
    setCustomUrl("");
  }, [url]);

  const handleCustomApply = () => {
    if (customUrl.trim()) {
      if (customUrl.trim().endsWith('.m3u')) {
        setError("You pasted an .m3u playlist. Please go to the 'Playlist' tab on the left to parse this file, or paste a direct .m3u8 video stream here.");
      } else {
        setActiveUrl(customUrl.trim());
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setError(null);
    let hls: Hls | null = null;

    // Automatically route through our proxy to avoid CORS
    const proxiedUrl = `/api/proxy?url=${encodeURIComponent(activeUrl)}`;

    if (Hls.isSupported()) {
      hls = new Hls({
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
      });
      hls.loadSource(proxiedUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((err) => console.log("Autoplay prevented:", err));
      });

      hls.on(Hls.Events.ERROR, function (event, data) {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error(
                "fatal network error encountered, try to recover",
                data,
              );
              setError(
                "This stream is currently offline, protected by DRM, or unreachable. Try another channel.",
              );
              hls?.destroy();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error(
                "fatal media error encountered, try to recover",
                data,
              );
              hls?.recoverMediaError();
              break;
            default:
              console.error("fatal error encountered", data);
              setError("An unrecoverable error occurred playing this stream.");
              hls?.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // For Safari, which bears native HLS support
      video.src = proxiedUrl;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch((err) => console.log("Autoplay prevented:", err));
      });
      video.addEventListener("error", () => {
        setError("Network error or stream unavailable.");
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [activeUrl]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center border border-zinc-800">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-10 text-center px-4">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-white font-medium mb-1">Playback Error</p>
            <p className="text-sm text-gray-400">{error}</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            controls
            poster={poster}
            className="absolute inset-0 w-full h-full object-contain"
            playsInline
          />
        )}
      </div>

      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
        <label className="text-xs text-uppercase font-semibold tracking-wider text-gray-400 mb-2 block flex items-center gap-2">
          <Link className="w-4 h-4" />
          Use Custom Stream (.m3u8)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Paste your private IPTV / m3u8 link here..."
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
          />
          <button
            onClick={handleCustomApply}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            Play Custom
          </button>
        </div>
      </div>
    </div>
  );
}
