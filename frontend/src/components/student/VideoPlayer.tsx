"use client";
import { useEffect, useRef, useState } from "react";
import { CheckCircle } from "lucide-react";

// ── YouTube IFrame API loader (singleton) ──────────────────────────────────
let ytLoading = false;
let ytReady = false;
const ytQueue: Array<() => void> = [];

function ensureYT(cb: () => void) {
  if (ytReady && (window as any).YT?.Player) { cb(); return; }
  ytQueue.push(cb);
  if (!ytLoading) {
    ytLoading = true;
    (window as any).onYouTubeIframeAPIReady = () => {
      ytReady = true;
      ytQueue.forEach(fn => fn());
      ytQueue.length = 0;
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(s);
  }
}

interface VideoPlayerProps {
  videoId: string;
  title: string;
  onComplete?: () => void;
  playerHeight?: string;
  maxWidth?: string;
}

export function VideoPlayer({
  videoId,
  title,
  onComplete,
  playerHeight = "clamp(560px, calc(100vh - 185px), 760px)",
  maxWidth = "1180px",
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef    = useRef<any>(null);
  const cbRef        = useRef(onComplete);
  cbRef.current = onComplete;
  const [watched, setWatched] = useState(false);

  useEffect(() => {
    setWatched(false);
    let alive = true;

    const init = () => {
      if (!alive || !containerRef.current) return;
      // Destroy previous player
      try { playerRef.current?.destroy(); } catch {}
      playerRef.current = null;
      // Clear container and inject a fresh mount point
      containerRef.current.innerHTML = "";
      const mount = document.createElement("div");
      containerRef.current.appendChild(mount);

      playerRef.current = new (window as any).YT.Player(mount, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: { rel: 0, modestbranding: 1, color: "white", autoplay: 0 },
        events: {
          onStateChange(e: any) {
            // 0 = YT.PlayerState.ENDED
            if (e.data === 0 && alive) {
              setWatched(true);
              cbRef.current?.();
            }
          },
        },
      });
    };

    ensureYT(init);

    return () => {
      alive = false;
      try { playerRef.current?.destroy(); } catch {}
      playerRef.current = null;
    };
  }, [videoId]);

  return (
    <div style={{ width: "100%", maxWidth, margin: "0 auto", background: "#000", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(17,19,34,0.08)" }}>
      <div style={{ position: "relative", width: "100%", height: playerHeight, minHeight: "500px", maxHeight: "calc(100vh - 165px)" }}>
        <div ref={containerRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
      </div>
      {/* Info bar */}
      <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(17,19,34,0.04)", borderTop: "1px solid rgba(17,19,34,0.06)" }}>
        <p style={{ fontSize: "14px", fontWeight: 600, color: "rgba(17,19,34,0.75)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</p>
        {watched
          ? <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#059669", flexShrink: 0, marginLeft: "12px" }}>
              <CheckCircle size={13} /> Watched
            </span>
          : <span style={{ fontSize: "12px", color: "rgba(17,19,34,0.35)", flexShrink: 0, marginLeft: "12px" }}>Watch fully</span>}
      </div>
    </div>
  );
}
