"use client";
import { LogIn, BookOpen, Video, CheckCircle, Award } from "lucide-react";
import { Leaderboard } from "@/components/Leaderboard";

const POINTS_GUIDE = [
  { icon: LogIn, label: "Login", desc: "Each time you log in", points: "+5", color: "text-green-400", bg: "bg-green-500/10" },
  { icon: BookOpen, label: "Enroll", desc: "Enrol in any course", points: "+10", color: "text-purple-400", bg: "bg-purple-500/10" },
  { icon: Video, label: "Watch Video", desc: "Complete a lecture video", points: "+0", color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { icon: CheckCircle, label: "Pass Test", desc: "Score >= passing mark", points: "+25", color: "text-blue-400", bg: "bg-blue-500/10" },
  { icon: Award, label: "Certificate", desc: "Earn a certificate", points: "+100", color: "text-amber-400", bg: "bg-amber-500/10" },
];

export default function AdminLeaderboardPage() {
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Leaderboard</h1>
        <p className="text-slate-600 text-sm mt-0.5">Platform-wide student rankings</p>
      </div>

      {/* Points system */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-slate-900 mb-4">Points System</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {POINTS_GUIDE.map(({ icon: Icon, label, desc, points, color, bg }) => (
            <div key={label} className="text-center p-3 rounded-xl" style={{ background: "rgba(17,19,34,0.02)" }}>
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mx-auto mb-2`}>
                <Icon size={18} className={color} />
              </div>
              <p className={`text-xl font-black ${color}`}>{points}</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">{label}</p>
              <p className="text-xs text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Leaderboard showMyRank={false} />
    </div>
  );
}
