"use client";
import { useState, useRef, useEffect } from "react";
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

interface CheckpointQuestion {
  timestamp: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface VideoPlayerProps {
  videoId: string;
  title: string;
  onComplete?: () => void;
  checkpoints?: CheckpointQuestion[];
}

export function VideoPlayer({ videoId, title, onComplete, checkpoints = [] }: VideoPlayerProps) {
  const [watched, setWatched] = useState(false);
  const [checkpoint, setCheckpoint] = useState<CheckpointQuestion | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);

  const handleSubmit = () => {
    if (selected === null) return;
    const isCorrect = selected === checkpoint!.correct;
    setSubmitted(true);
    setCorrect(isCorrect);
  };

  const handleRetry = () => {
    setCheckpoint(null);
    setSelected(null);
    setSubmitted(false);
    setCorrect(false);
  };

  const handleContinue = () => {
    setCheckpoint(null);
    setSelected(null);
    setSubmitted(false);
    setCorrect(false);
    setWatched(true);
    onComplete?.();
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* 16:9 video container */}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <div className="absolute inset-0 bg-black flex items-center justify-center text-white/20 text-sm">
          {/* YouTube embed placeholder - in production use actual YouTube iframe */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3 mx-auto">
              <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8 ml-1">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
            <p className="text-xs text-white/40">YouTube Video: {videoId}</p>
          </div>
        </div>

        {/* Checkpoint overlay */}
        {checkpoint && (
          <div className="absolute inset-0 flex items-center justify-center z-10" style={{ background: "rgba(5,5,8,0.92)", backdropFilter: "blur(6px)" }}>
            <div className="glass-card p-6 max-w-md w-full mx-4 space-y-4">
              <div className="flex items-center gap-2">
                <span className="badge-purple text-xs">Checkpoint Question</span>
              </div>
              <p className="text-white font-semibold text-sm">{checkpoint.question}</p>
              <div className="space-y-2">
                {checkpoint.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => !submitted && setSelected(i)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border ${
                      submitted
                        ? i === checkpoint.correct
                          ? "border-green-500/60 bg-green-500/10 text-green-300"
                          : i === selected && !correct
                          ? "border-red-500/60 bg-red-500/10 text-red-300"
                          : "border-white/10 text-white/40"
                        : selected === i
                        ? "border-purple-500/60 bg-purple-500/10 text-purple-300"
                        : "border-white/10 hover:border-white/20 text-white/70"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {submitted && <p className="text-xs text-white/50 bg-white/[0.04] p-3 rounded-xl">{checkpoint.explanation}</p>}
              {!submitted ? (
                <button onClick={handleSubmit} disabled={selected === null} className="btn-primary w-full py-2.5 text-sm">
                  Submit Answer
                </button>
              ) : correct ? (
                <button onClick={handleContinue} className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2">
                  <CheckCircle size={16} /> Continue Watching
                </button>
              ) : (
                <button onClick={handleRetry} className="w-full py-2.5 text-sm flex items-center justify-center gap-2 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors">
                  <RefreshCw size={16} /> Restart Video
                </button>
              )}
            </div>
          </div>
        )}

        {/* Bottom overlay to block progress bar seeking */}
        <div className="absolute bottom-0 left-0 right-0 h-10 z-[5]" />
      </div>

      {/* Info row */}
      <div className="px-4 py-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-white/80 truncate">{title}</p>
        {watched ? (
          <span className="flex items-center gap-1 text-xs text-green-400 flex-shrink-0 ml-2">
            <CheckCircle size={14} /> Watched
          </span>
        ) : (
          <span className="text-xs text-white/40 flex-shrink-0 ml-2">Watch fully</span>
        )}
      </div>
    </div>
  );
}
