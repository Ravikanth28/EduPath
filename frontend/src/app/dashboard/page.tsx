"use client";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { PlayCircle, BookOpen, Award, CheckCircle, TrendingUp, Clock, Star } from "lucide-react";

const testScores = [
  { name: "M1", score: 85 }, { name: "M2", score: 92 }, { name: "M3", score: 78 },
  { name: "M4", score: 95 }, { name: "M5", score: 88 },
];

const RECENT_ACTIVITY = [
  { icon: PlayCircle,  color: "#A78BFA", bg: "rgba(167,139,250,0.12)", label: "Watched: Introduction to Calculus - Limits", time: "2 hours ago" },
  { icon: CheckCircle, color: "#4ADE80", bg: "rgba(74,222,128,0.12)",  label: "Passed: Module 3 Test - 92%",               time: "5 hours ago" },
  { icon: Award,       color: "#FBBF24", bg: "rgba(251,191,36,0.12)",  label: "Certificate Earned: Physics Mechanics",      time: "Yesterday"   },
  { icon: BookOpen,    color: "#22D3EE", bg: "rgba(34,211,238,0.12)",  label: "Enrolled: Engineering Mathematics",          time: "2 days ago"  },
];

const COURSES = [
  { id: "1", title: "Engineering Mathematics", category: "Mathematics", progress: 65,  modules: 6, status: "in_progress" },
  { id: "2", title: "Physics Mechanics",       category: "Physics",     progress: 100, modules: 5, status: "completed"   },
];

const CERTS = [
  { title: "Physics Mechanics", issued: "March 15, 2026", id: "CERT-DEMO-001" },
];

const STATS = [
  { icon: BookOpen,    label: "Enrolled Courses",    value: "4",  accent: "#A78BFA", bg: "rgba(167,139,250,0.12)" },
  { icon: CheckCircle, label: "Completed Modules",   value: "14", accent: "#4ADE80", bg: "rgba(74,222,128,0.12)"  },
  { icon: TrendingUp,  label: "Finished Courses",    value: "1",  accent: "#22D3EE", bg: "rgba(34,211,238,0.12)"  },
  { icon: Award,       label: "Certificates Earned", value: "1",  accent: "#FBBF24", bg: "rgba(251,191,36,0.12)"  },
];

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "16px",
};

const cardHover: React.CSSProperties = {
  ...card,
  transition: "border-color .2s",
};

export default function StudentDashboard() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ padding: "28px 28px 48px", maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* -- Welcome hero --------------------------------------- */}
      <div style={{ borderRadius: "20px", padding: "28px 32px", position: "relative", overflow: "hidden", background: "linear-gradient(135deg,#17268F 0%,#2F45D8 55%,#6375FF 100%)", border: "1px solid rgba(255,255,255,0.18)", boxShadow: "0 22px 55px rgba(25,40,150,0.26)" }}>
        <div style={{ position: "absolute", top: "-90px", right: "-70px", width: "340px", height: "340px", background: "radial-gradient(circle,rgba(255,255,255,0.28),transparent 62%)", borderRadius: "50%", filter: "blur(10px)" }} />
        <div style={{ position: "absolute", bottom: "-90px", left: "-60px",  width: "280px", height: "280px", background: "radial-gradient(circle,rgba(255,255,255,0.14),transparent 60%)",  borderRadius: "50%", filter: "blur(10px)" }} />

        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "13px", marginBottom: "6px" }}>{greeting},</p>
            <h1 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 800, color: "#FFFFFF", margin: "0 0 8px", letterSpacing: "-0.5px" }}>
              Welcome back, <span style={{ color: "#DDE4FF" }}>Student</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.76)", fontSize: "14px" }}>You have 2 courses in progress. Keep going!</p>
          </div>

          {/* Progress ring */}
          <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ position: "relative", width: "88px", height: "88px" }}>
              <svg viewBox="0 0 88 88" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="7" />
                <circle cx="44" cy="44" r="36" fill="none" strokeWidth="7" strokeLinecap="round"
                  stroke="#FFFFFF" strokeDasharray={`${62 * 2.262} ${(100-62)*2.262}`} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "17px", fontWeight: 800, color: "#FFFFFF" }}>62%</span>
              </div>
            </div>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.68)", marginTop: "6px", textAlign: "center" }}>Overall Progress</p>
          </div>
        </div>
      </div>

      {/* -- Continue learning ---------------------------------- */}
      <div style={{ borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px", position: "relative", overflow: "hidden", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.20)" }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(124,58,237,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <PlayCircle size={20} color="#A78BFA" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginBottom: "3px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Continue Learning</p>
          <p style={{ color: "#fff", fontWeight: 700, fontSize: "15px", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Engineering Mathematics</p>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>Module 4 of 6</p>
        </div>
        <Link href="/dashboard/courses/1" style={{ flexShrink: 0, padding: "10px 20px", background: "linear-gradient(135deg,#7C3AED,#5B21B6)", color: "#FFFFFF", borderRadius: "10px", fontSize: "13px", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: "7px" }}>
          <PlayCircle size={14} /> Resume
        </Link>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(135deg,#7C3AED,#A78BFA)", width: "65%" }} />
      </div>

      {/* -- Stats row ------------------------------------------ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px" }}>
        {STATS.map(({ icon: Icon, label, value, accent, bg }) => (
          <div key={label} style={{ ...card, padding: "20px", display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={20} color={accent} />
            </div>
            <div>
              <p style={{ fontSize: "24px", fontWeight: 800, color: "#fff", lineHeight: 1, marginBottom: "4px" }}>{value}</p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* -- Analytics ------------------------------------------ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Bar chart */}
        <div style={{ ...card, padding: "22px" }}>
          <p style={{ fontWeight: 700, color: "#fff", fontSize: "14px", marginBottom: "18px" }}>Test Scores by Module</p>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={testScores} margin={{ top: 0, right: 4, bottom: 0, left: -20 }}>
              <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} axisLine={false} tickLine={false} domain={[0,100]} />
              <Tooltip
                contentStyle={{ background: "#0A0A12", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "10px", color: "#fff", fontSize: "13px" }}
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
              />
              <Bar dataKey="score" fill="#7C3AED" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div style={{ ...card, padding: "22px" }}>
          <p style={{ fontWeight: 700, color: "#fff", fontSize: "14px", marginBottom: "20px" }}>Learning Insights</p>
          <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "22px" }}>
            <div style={{ position: "relative", width: "80px", height: "80px", flexShrink: 0 }}>
              <svg viewBox="0 0 80 80" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <circle cx="40" cy="40" r="30" fill="none" stroke="#7C3AED" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${88*1.885} ${(100-88)*1.885}`} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "16px", fontWeight: 800, color: "#fff" }}>88%</span>
              </div>
            </div>
            <div>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: "15px", marginBottom: "4px" }}>Avg Test Score</p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Across all modules</p>
            </div>
          </div>
          {[{ label: "Videos Watched", val: 78, color: "#A78BFA" }, { label: "Tests Passed", val: 92, color: "#4ADE80" }].map(({ label, val, color }) => (
            <div key={label} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "rgba(255,255,255,0.45)", marginBottom: "6px" }}>
                <span>{label}</span><span style={{ fontWeight: 700, color }}>{val}%</span>
              </div>
              <div style={{ height: "6px", borderRadius: "99px", background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: "99px", width: `${val}%`, background: color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* -- My Courses ----------------------------------------- */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h2 style={{ fontWeight: 800, color: "#fff", fontSize: "17px", margin: 0 }}>My Courses</h2>
          <Link href="/dashboard/courses" style={{ fontSize: "13px", color: "#A78BFA", textDecoration: "none", fontWeight: 600 }}>View All &gt;</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          {COURSES.map(c => (
            <div key={c.id} style={{ ...cardHover, overflow: "hidden" }}>
              <div style={{ height: "4px", background: "linear-gradient(135deg,#7C3AED,#06B6D4)" }} />
              <div style={{ padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#A78BFA", background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: "20px", padding: "2px 10px" }}>{c.category}</span>
                  {c.status === "completed"
                    ? <span style={{ fontSize: "11px", fontWeight: 700, color: "#4ADE80", background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: "20px", padding: "2px 10px" }}>Done</span>
                    : <span style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.55)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "2px 10px" }}>{c.progress}%</span>
                  }
                </div>
                <p style={{ fontWeight: 700, color: "#fff", fontSize: "15px", marginBottom: "12px" }}>{c.title}</p>
                <div style={{ height: "5px", borderRadius: "99px", background: "rgba(255,255,255,0.06)", marginBottom: "12px", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: "99px", width: `${c.progress}%`, background: "linear-gradient(135deg,#7C3AED,#A78BFA)" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{c.modules} modules</span>
                  <Link href={`/dashboard/courses/${c.id}`} style={{ fontSize: "12px", color: "#A78BFA", textDecoration: "none", fontWeight: 600 }}>
                    {c.status === "completed" ? "Review" : "Continue"} &gt;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* -- Certificates --------------------------------------- */}
      {CERTS.length > 0 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontWeight: 800, color: "#fff", fontSize: "17px", margin: 0 }}>Certificates</h2>
            <Link href="/dashboard/certificates" style={{ fontSize: "13px", color: "#A78BFA", textDecoration: "none", fontWeight: 600 }}>View All &gt;</Link>
          </div>
          <div style={{ display: "flex", gap: "14px", overflowX: "auto", paddingBottom: "4px" }}>
            {CERTS.map(c => (
              <div key={c.id} style={{ ...card, padding: "20px", minWidth: "240px", border: "1px solid rgba(124,58,237,0.25)", background: "rgba(124,58,237,0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                  <Star size={15} color="#FBBF24" />
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#FBBF24", background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: "20px", padding: "2px 10px" }}>Earned</span>
                </div>
                <p style={{ fontWeight: 700, color: "#fff", fontSize: "15px", marginBottom: "4px" }}>{c.title}</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>{c.issued}</p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>#{c.id.slice(-7)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -- Recent Activity ------------------------------------ */}
      <div>
        <h2 style={{ fontWeight: 800, color: "#fff", fontSize: "17px", margin: "0 0 16px" }}>Recent Activity</h2>
        <div style={{ ...card, padding: "8px 0" }}>
          {RECENT_ACTIVITY.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "14px 20px", borderBottom: i < RECENT_ACTIVITY.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={16} color={item.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.80)", marginBottom: "4px", lineHeight: 1.4 }}>{item.label}</p>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.30)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Clock size={11} /> {item.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
