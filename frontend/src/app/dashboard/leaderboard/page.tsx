"use client";
import { useEffect, useState } from "react";
import { Trophy, Zap, Crown, Medal, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { api, type LeaderboardEntry } from "@/lib/api";

interface DisplayEntry {
  rank: number;
  name: string;
  points: number;
  badge?: string;
  isCurrentUser?: boolean;
}

function getBadge(rank: number): string | undefined {
  if (rank === 1) return "Champion";
  if (rank <= 3) return "Elite";
  return undefined;
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const AVATAR_COLORS = ["#7C3AED","#2563EB","#059669","#DC2626","#D97706","#0891B2","#BE185D","#6366F1"];

export default function LeaderboardPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [entries, setEntries] = useState<DisplayEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.leaderboard.get()
      .then((data: LeaderboardEntry[]) => {
        setEntries(data.map(e => ({
          rank: e.rank,
          name: e.name,
          points: e.points,
          badge: getBadge(e.rank),
          isCurrentUser: e.is_current_user,
        })));
      })
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
  const daysLeft = isCurrentMonth ? new Date(year, month + 1, 0).getDate() - now.getDate() : 0;

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const currentUser = entries.find(e => e.isCurrentUser);
  const maxPoints = entries[0]?.points ?? 1;

  const navBtn: React.CSSProperties = {
    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px", width: "40px", height: "40px", display: "flex",
    alignItems: "center", justifyContent: "center", cursor: "pointer",
    color: "rgba(255,255,255,0.6)", flexShrink: 0,
  };

  const podiumPerson = (entry: LeaderboardEntry, avatarSize: number, platformH: number, platformBg: string, medalColor: string, isFirst: boolean) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      {isFirst && <Crown size={28} color="#FBBF24" style={{ filter: "drop-shadow(0 0 8px #FBBF24)" }} />}
      <div style={{
        width: `${avatarSize}px`, height: `${avatarSize}px`, borderRadius: "50%",
        background: isFirst ? "linear-gradient(135deg,#7C3AED,#A78BFA)" : AVATAR_COLORS[(entry.rank - 1) % AVATAR_COLORS.length],
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontWeight: 800, fontSize: `${Math.round(avatarSize * 0.38)}px`,
        boxShadow: isFirst ? "0 0 28px rgba(124,58,237,0.6), 0 4px 20px rgba(0,0,0,0.4)" : "0 4px 16px rgba(0,0,0,0.35)",
        border: isFirst ? "3px solid rgba(167,139,250,0.5)" : "2px solid rgba(255,255,255,0.08)",
        flexShrink: 0,
      }}>{entry.name[0]}</div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "14px", fontWeight: 700, color: isFirst ? "#fff" : "rgba(255,255,255,0.8)", margin: "0 0 3px", maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.name}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
          <Zap size={13} color="#FBBF24" />
          <span style={{ fontSize: "14px", fontWeight: 800, color: isFirst ? "#FBBF24" : "rgba(255,255,255,0.65)" }}>{entry.points.toLocaleString()}</span>
        </div>
        {entry.badge && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", marginTop: "5px", padding: "2px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 700, background: isFirst ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.07)", color: isFirst ? "#FBBF24" : "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>
            <Star size={9} />{entry.badge}
          </span>
        )}
      </div>
      <div style={{
        width: "88px", background: platformBg, borderRadius: "10px 10px 0 0",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        height: `${platformH}px`,
        boxShadow: isFirst ? "0 -4px 20px rgba(124,58,237,0.25)" : undefined,
      }}>
        {isFirst ? <Trophy size={22} color="#FBBF24" /> : <Medal size={20} color={medalColor} />}
        <span style={{ color: isFirst ? "#FBBF24" : medalColor, fontWeight: 900, fontSize: "20px", marginTop: "2px" }}>{entry.rank}</span>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "36px 40px", maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "linear-gradient(135deg,#92400E,#D97706)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 24px rgba(217,119,6,0.35)" }}>
              <Trophy size={24} color="#FEF3C7" />
            </div>
            <div>
              <h1 style={{ fontSize: "30px", fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "-0.6px" }}>Leaderboard</h1>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0 }}>Monthly rankings · {loading ? "…" : `${entries.length} students competing`}</p>
            </div>
          </div>
        </div>

        {/* Month navigator */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "10px 16px" }}>
          <button onClick={prevMonth} style={navBtn}><ChevronLeft size={18} /></button>
          <div style={{ textAlign: "center", minWidth: "130px" }}>
            <p style={{ fontWeight: 700, color: "#fff", margin: 0, fontSize: "16px" }}>{MONTHS[month]} {year}</p>
            {isCurrentMonth && (
              <p style={{ fontSize: "12px", color: "#A78BFA", margin: "2px 0 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "#A78BFA" }} />
                {daysLeft} days remaining
              </p>
            )}
          </div>
          <button onClick={nextMonth} style={navBtn}><ChevronRight size={18} /></button>
        </div>
      </div>

      {/* Podium */}
      <div style={{
        background: "linear-gradient(160deg, rgba(124,58,237,0.12) 0%, rgba(255,255,255,0.02) 60%)",
        border: "1px solid rgba(124,58,237,0.2)",
        borderRadius: "20px", padding: "40px 32px 0", position: "relative", overflow: "hidden",
      }}>
        {/* Subtle glow behind #1 */}
        <div style={{ position: "absolute", top: "30px", left: "50%", transform: "translateX(-50%)", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "32px", position: "relative" }}>
          {/* Rank 2 */}
          {top3[1] && podiumPerson(top3[1], 72, 90, "#1F2937", "#9CA3AF", false)}
          {/* Rank 1 */}
          {top3[0] && podiumPerson(top3[0], 88, 130, "linear-gradient(180deg,#6D28D9,#4C1D95)", "#FBBF24", true)}
          {/* Rank 3 */}
          {top3[2] && podiumPerson(top3[2], 68, 70, "#374151", "#D97706", false)}
        </div>
      </div>

      {/* Ranked list */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", overflow: "hidden" }}>
        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "56px 1fr 180px 100px", gap: "0", padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>#</span>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Student</span>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Progress</span>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "right" }}>Points</span>
        </div>

        {rest.map((entry, i) => {
          const pct = Math.round((entry.points / maxPoints) * 100);
          const isMe = entry.isCurrentUser;
          return (
            <div key={entry.rank} style={{
              display: "grid", gridTemplateColumns: "56px 1fr 180px 100px", gap: "0",
              alignItems: "center", padding: "16px 24px",
              borderBottom: i < rest.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              background: isMe ? "rgba(124,58,237,0.08)" : "transparent",
              transition: "background 0.15s",
            }}>
              {/* Rank */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: isMe ? "rgba(124,58,237,0.25)" : "rgba(255,255,255,0.05)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "14px", fontWeight: 800,
                  color: isMe ? "#A78BFA" : "rgba(255,255,255,0.45)",
                }}>{entry.rank}</div>
              </div>
              {/* Name + avatar */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "42px", height: "42px", borderRadius: "50%",
                  background: isMe ? "linear-gradient(135deg,#7C3AED,#A78BFA)" : AVATAR_COLORS[(entry.rank - 1) % AVATAR_COLORS.length],
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 700, fontSize: "16px", flexShrink: 0,
                  boxShadow: isMe ? "0 0 12px rgba(124,58,237,0.4)" : "none",
                }}>{entry.name[0]}</div>
                <div>
                  <p style={{ fontSize: "15px", fontWeight: 600, color: isMe ? "#C4B5FD" : "#fff", margin: "0 0 2px" }}>
                    {entry.name}{isMe && <span style={{ marginLeft: "8px", fontSize: "11px", fontWeight: 700, background: "rgba(124,58,237,0.3)", color: "#A78BFA", padding: "1px 7px", borderRadius: "20px" }}>YOU</span>}
                  </p>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", margin: 0 }}>Rank #{entry.rank}</p>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ paddingRight: "24px" }}>
                <div style={{ height: "6px", borderRadius: "99px", background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: "99px", width: `${pct}%`,
                    background: isMe ? "linear-gradient(90deg,#7C3AED,#A78BFA)" : "linear-gradient(90deg,#374151,#6B7280)",
                    transition: "width 0.6s ease",
                  }} />
                </div>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", margin: "4px 0 0" }}>{pct}% of top</p>
              </div>
              {/* Points */}
              <div style={{ textAlign: "right", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "5px" }}>
                <Zap size={14} color="#FBBF24" />
                <span style={{ fontSize: "16px", fontWeight: 800, color: isMe ? "#A78BFA" : "rgba(255,255,255,0.75)" }}>{entry.points.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* My rank sticky footer */}
      {currentUser && currentUser.rank > 3 && (
        <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 24px", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "14px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(124,58,237,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 800, color: "#A78BFA" }}>{currentUser.rank}</div>
          <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#A78BFA)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "16px", boxShadow: "0 0 12px rgba(124,58,237,0.4)" }}>Y</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "15px", fontWeight: 700, color: "#C4B5FD", margin: "0 0 2px" }}>Your Current Rank</p>
            <p style={{ fontSize: "12px", color: "rgba(167,139,250,0.6)", margin: 0 }}>{maxPoints - currentUser.points} points to reach #1</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Zap size={16} color="#FBBF24" />
            <span style={{ fontSize: "20px", fontWeight: 900, color: "#A78BFA" }}>{currentUser.points.toLocaleString()}</span>
          </div>
        </div>
      )}

    </div>
  );
}
