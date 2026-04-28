"use client";
import { useState } from "react";
import { Trophy, ChevronLeft, ChevronRight, Zap, Gift, Crown, Medal } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  isCurrentUser?: boolean;
}

const MOCK_ENTRIES: LeaderboardEntry[] = [
  { rank: 1, name: "Arjun Sharma", points: 1240 },
  { rank: 2, name: "Priya Nair", points: 1080 },
  { rank: 3, name: "Rahul Mehta", points: 960 },
  { rank: 4, name: "Sneha Patel", points: 820 },
  { rank: 5, name: "Vikram Singh", points: 750 },
  { rank: 6, name: "Anita Roy", points: 630 },
  { rank: 7, name: "Karan Verma", points: 580 },
  { rank: 8, name: "Deepa Krishnan", points: 510 },
  { rank: 9, name: "Amit Gupta", points: 440 },
  { rank: 10, name: "You", points: 385, isCurrentUser: true },
];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

interface LeaderboardProps {
  showMyRank?: boolean;
}

export function Leaderboard({ showMyRank = false }: LeaderboardProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
  const daysLeft = isCurrentMonth ? new Date(year, month + 1, 0).getDate() - now.getDate() : 0;

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const top3 = MOCK_ENTRIES.slice(0, 3);
  const rest = MOCK_ENTRIES.slice(3);
  const currentUser = MOCK_ENTRIES.find(e => e.isCurrentUser);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Month header */}
      <div className="glass-card p-4 flex items-center justify-between">
        <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white">
          <ChevronLeft size={18} />
        </button>
        <div className="text-center">
          <p className="font-bold text-white">{MONTHS[month]} {year}</p>
          {isCurrentMonth && <p className="text-xs text-purple-400">{daysLeft} days left</p>}
        </div>
        <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Prize banner */}
      <div className="glass-card p-4 flex items-center gap-3 border border-amber-500/20 bg-amber-500/5">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
          <Gift size={20} className="text-amber-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-amber-400">Monthly Prize</p>
          <p className="text-xs text-white/60">Top 3 students win exclusive rewards!</p>
        </div>
      </div>

      {/* Top 3 podium */}
      <div className="glass-card p-6">
        <div className="flex items-end justify-center gap-4">
          {/* Rank 2 */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-bold text-xl">
              {top3[1]?.name[0]}
            </div>
            <p className="text-xs text-white/70 text-center max-w-[80px] truncate">{top3[1]?.name}</p>
            <div className="flex items-center gap-1 text-xs text-white/60">
              <Zap size={12} className="text-yellow-400" />
              {top3[1]?.points}
            </div>
            <div className="w-20 bg-gradient-to-t from-slate-600 to-slate-500 rounded-t-lg flex flex-col items-center justify-start pt-3 h-20">
              <Medal size={20} className="text-slate-300" />
              <span className="text-slate-300 font-bold text-lg">2</span>
            </div>
          </div>
          {/* Rank 1 */}
          <div className="flex flex-col items-center gap-2">
            <Crown size={20} className="text-yellow-400" />
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-2xl">
              {top3[0]?.name[0]}
            </div>
            <p className="text-xs text-white font-semibold text-center max-w-[80px] truncate">{top3[0]?.name}</p>
            <div className="flex items-center gap-1 text-xs text-yellow-400 font-bold">
              <Zap size={12} />
              {top3[0]?.points}
            </div>
            <div className="w-20 bg-gradient-to-t from-yellow-600 to-yellow-500 rounded-t-lg flex flex-col items-center justify-start pt-3 h-28">
              <Trophy size={20} className="text-yellow-200" />
              <span className="text-yellow-200 font-bold text-lg">1</span>
            </div>
          </div>
          {/* Rank 3 */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white font-bold text-xl">
              {top3[2]?.name[0]}
            </div>
            <p className="text-xs text-white/70 text-center max-w-[80px] truncate">{top3[2]?.name}</p>
            <div className="flex items-center gap-1 text-xs text-white/60">
              <Zap size={12} className="text-amber-400" />
              {top3[2]?.points}
            </div>
            <div className="w-20 bg-gradient-to-t from-amber-800 to-amber-700 rounded-t-lg flex flex-col items-center justify-start pt-3 h-14">
              <Medal size={20} className="text-amber-400" />
              <span className="text-amber-300 font-bold text-lg">3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the list */}
      <div className="glass-card overflow-hidden">
        {rest.map((entry) => (
          <div
            key={entry.rank}
            className={`flex items-center gap-4 px-5 py-3 border-b border-white/5 last:border-0 transition-colors ${
              entry.isCurrentUser ? "bg-purple-600/10" : "hover:bg-white/[0.02]"
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-sm font-bold text-white/60">
              {entry.rank}
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {entry.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${entry.isCurrentUser ? "text-purple-400" : "text-white"}`}>
                {entry.name} {entry.isCurrentUser && <span className="text-xs text-purple-400">(you)</span>}
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-white/70">
              <Zap size={14} className="text-yellow-400" />
              {entry.points}
            </div>
          </div>
        ))}
      </div>

      {/* My rank footer */}
      {showMyRank && currentUser && currentUser.rank > 3 && (
        <div className="glass-card p-4 flex items-center gap-4 border border-purple-600/30">
          <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center text-sm font-bold text-purple-400">
            {currentUser.rank}
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
            Y
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-purple-400">Your Rank</p>
          </div>
          <div className="flex items-center gap-1 text-sm font-bold text-purple-400">
            <Zap size={14} className="text-yellow-400" />
            {currentUser.points}
          </div>
        </div>
      )}
    </div>
  );
}
