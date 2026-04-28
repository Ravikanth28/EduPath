import { Trophy, Zap } from "lucide-react";
import { Leaderboard } from "@/components/Leaderboard";

const EARN_POINTS = [
  { label: "Login", pts: "+5" },
  { label: "Enroll in Course", pts: "+10" },
  { label: "Pass a Test", pts: "+25" },
  { label: "Earn Certificate", pts: "+100" },
];

export default function LeaderboardPage() {
  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Trophy size={28} className="text-amber-400" />
          <h1 className="text-3xl font-bold text-red-400">Leaderboard</h1>
        </div>
        <p className="text-white/50 text-sm">Earn points, climb the ranks, and win monthly prizes.</p>
      </div>

      {/* Earn points card */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
          <Zap size={15} className="text-yellow-400" /> How to Earn Points
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {EARN_POINTS.map(({ label, pts }) => (
            <div key={label} className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-lg font-black text-yellow-400">{pts}</p>
              <p className="text-xs text-white/50 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <Leaderboard showMyRank={true} />
    </div>
  );
}
