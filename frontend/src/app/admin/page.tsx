"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { BookOpen, Users, Award, Layers, Plus, UserCheck, Clock, TrendingUp, LayoutDashboard } from "lucide-react";
import { api, type AdminStats, type ActivityEntry, type LeaderboardEntry, type Student } from "../../lib/api";

const enrollData = [
  { name: "Eng. Maths", students: 420 }, { name: "Physics", students: 380 },
  { name: "Chemistry", students: 290 }, { name: "CS", students: 340 }, { name: "Electronics", students: 190 },
];
const categoryData = [
  { name: "Mathematics", value: 30, color: "#7C3AED" },
  { name: "Physics", value: 25, color: "#06B6D4" },
  { name: "Chemistry", value: 20, color: "#22D3EE" },
  { name: "Computer Sci.", value: 15, color: "#A78BFA" },
  { name: "Other", value: 10, color: "#6D28D9" },
];

const RANK_STYLE: Record<number, string> = {
  1: "bg-yellow-500/20 text-yellow-400",
  2: "bg-slate-500/20 text-slate-300",
  3: "bg-amber-700/20 text-amber-600",
};

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "16px",
};

export default function AdminDashboard() {
  const [stats, setStats]       = useState<AdminStats | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [leaders, setLeaders]   = useState<LeaderboardEntry[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    api.admin.stats().then(setStats).catch(() => {});
    api.activity.list().then(a => setActivity(a.slice(0, 5))).catch(() => {});
    api.leaderboard.get().then(l => setLeaders(l.slice(0, 3))).catch(() => {});
    api.students.list().then(s =>
      setStudents([...s].sort((a, b) => new Date(b.joined).getTime() - new Date(a.joined).getTime()).slice(0, 4))
    ).catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const statCards = [
    { icon: BookOpen, label: "Total Courses",   value: stats?.total_courses      ?? "â€”", accent: "#A78BFA", bg: "rgba(124,58,237,0.1)"  },
    { icon: Layers,   label: "Active Students", value: stats?.active_students    ?? "â€”", accent: "#22D3EE", bg: "rgba(6,182,212,0.1)"   },
    { icon: Users,    label: "Total Students",  value: stats?.total_students     ?? "â€”", accent: "#60A5FA", bg: "rgba(59,130,246,0.1)"  },
    { icon: Award,    label: "Certificates",    value: stats?.total_certificates ?? "â€”", accent: "#FCD34D", bg: "rgba(252,211,77,0.1)"  },
  ];

  return (
    <div style={{ padding: "28px 28px 48px", maxWidth: "1280px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* â”€â”€ Hero â”€â”€ */}
      <div style={{ borderRadius: "20px", padding: "28px 32px", position: "relative", overflow: "hidden", background: "linear-gradient(135deg,#0D0D1A,#131325 60%,#0A0A12)", border: "1px solid rgba(124,58,237,0.2)" }}>
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "340px", height: "340px", background: "radial-gradient(circle,rgba(124,58,237,0.22),transparent 65%)", borderRadius: "50%", filter: "blur(20px)" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "-40px", width: "260px", height: "260px", background: "radial-gradient(circle,rgba(6,182,212,0.12),transparent 65%)", borderRadius: "50%", filter: "blur(20px)" }} />
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", marginBottom: "6px" }}>{greeting},</p>
            <h1 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.5px" }}>
              Welcome back, <span style={{ background: "linear-gradient(135deg,#A78BFA,#22D3EE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Admin</span> ðŸ‘‹
            </h1>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", marginBottom: "20px" }}>
              {stats
                ? `${stats.total_students} students Â· ${stats.total_courses} courses Â· ${stats.total_certificates} certificates`
                : "Loading platform dataâ€¦"}
            </p>
            <Link href="/admin/courses/new" style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "10px 20px", background: "linear-gradient(135deg,#7C3AED,#06B6D4)", color: "#fff", borderRadius: "10px", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}>
              <Plus size={14} /> New Course
            </Link>
          </div>
          <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ position: "relative", width: "88px", height: "88px" }}>
              <svg viewBox="0 0 88 88" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
                <circle cx="44" cy="44" r="36" fill="none" strokeWidth="7" strokeLinecap="round"
                  stroke="url(#adminPg)" strokeDasharray={`${78 * 2.262} ${(100 - 78) * 2.262}`} />
                <defs>
                  <linearGradient id="adminPg" x1="0%" y1="0%" x2="100%">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#22D3EE" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "17px", fontWeight: 800, color: "#fff" }}>78%</span>
              </div>
            </div>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "6px", textAlign: "center" }}>Platform Health</p>
          </div>
        </div>
      </div>

      {/* â”€â”€ Stat cards â”€â”€ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px" }}>
        {statCards.map(({ icon: Icon, label, value, accent, bg }) => (
          <div key={label} style={{ ...card, padding: "20px", display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={20} color={accent} />
            </div>
            <div>
              <p style={{ fontSize: "26px", fontWeight: 800, color: "#fff", lineHeight: 1, marginBottom: "4px" }}>{value}</p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* â”€â”€ Quick actions â”€â”€ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" }}>
        {[
          { href: "/admin/courses/new", icon: Plus,           label: "New Course",   sub: "Add to catalogue",   accent: "#A78BFA", bg: "rgba(124,58,237,0.1)", border: "rgba(124,58,237,0.2)", dot: "#A78BFA" },
          { href: "/admin/students",    icon: UserCheck,       label: "Students",     sub: "Manage enrolments",  accent: "#4ADE80", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.2)", dot: "#4ADE80" },
          { href: "/admin/activity",    icon: LayoutDashboard, label: "Activity Log", sub: "Live platform feed", accent: "#FCD34D", bg: "rgba(252,211,77,0.1)", border: "rgba(252,211,77,0.2)", dot: "#FCD34D" },
        ].map(({ href, icon: Icon, label, sub, accent, bg, border, dot }) => (
          <Link key={label} href={href} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${border}`, borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px", textDecoration: "none" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={18} color={accent} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "3px" }}>{label}</p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sub}</p>
            </div>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: dot, flexShrink: 0, opacity: 0.85 }} />
          </Link>
        ))}
      </div>

      {/* â”€â”€ Charts â”€â”€ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Bar chart */}
        <div style={{ ...card, padding: "22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
            <p style={{ fontWeight: 700, color: "#fff", fontSize: "14px", margin: 0 }}>Students Enrolled per Course</p>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#A78BFA", background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: "20px", padding: "3px 10px" }}>This semester</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={enrollData} margin={{ top: 4, right: 4, bottom: 0, left: -14 }}>
              <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "rgba(124,58,237,0.08)" }} contentStyle={{ background: "#131325", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "10px", color: "#fff", fontSize: "12px" }} />
              <defs>
                <linearGradient id="adminBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
              <Bar dataKey="students" fill="url(#adminBar)" radius={[5, 5, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart + legend */}
        <div style={{ ...card, padding: "22px" }}>
          <p style={{ fontWeight: 700, color: "#fff", fontSize: "14px", margin: "0 0 18px" }}>Category Breakdown</p>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ flexShrink: 0 }}>
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={46} outerRadius={72} paddingAngle={3} dataKey="value">
                    {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#131325", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "10px", color: "#fff", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
              {categoryData.map(({ name, value, color }) => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", flex: 1 }}>{name}</span>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>{value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* â”€â”€ Bottom row â”€â”€ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

        {/* Recent Activity */}
        <div style={{ ...card, padding: "22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <p style={{ fontWeight: 700, color: "#fff", fontSize: "14px", margin: 0 }}>Recent Activity</p>
            <Link href="/admin/activity" style={{ fontSize: "12px", color: "#A78BFA", textDecoration: "none", fontWeight: 600 }}>View all â†’</Link>
          </div>
          {activity.length === 0 ? (
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)", textAlign: "center", padding: "24px 0" }}>No activity yet</p>
          ) : (
            <div>
              {activity.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: i < activity.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "13px", flexShrink: 0 }}>
                    {a.student[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "2px" }}>{a.student}</p>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.detail}</p>
                  </div>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", gap: "4px", flexShrink: 0, whiteSpace: "nowrap" }}>
                    <Clock size={10} />{a.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Students + Recently Joined */}
        <div style={{ ...card, padding: "22px", display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Leaderboard */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <p style={{ fontWeight: 700, color: "#fff", fontSize: "14px", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                <TrendingUp size={14} color="#A78BFA" style={{ flexShrink: 0 }} /> Top Students
              </p>
              <Link href="/admin/leaderboard" style={{ fontSize: "12px", color: "#A78BFA", textDecoration: "none", fontWeight: 600 }}>Full â†’</Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {leaders.length === 0 ? (
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)", textAlign: "center", padding: "12px 0" }}>No data available</p>
              ) : leaders.map(({ rank, name, points }) => (
                <div key={rank} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ width: "24px", height: "24px", borderRadius: "8px", fontSize: "11px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: rank === 1 ? "rgba(252,211,77,0.15)" : rank === 2 ? "rgba(148,163,184,0.15)" : "rgba(180,119,50,0.15)", color: rank === 1 ? "#FCD34D" : rank === 2 ? "#CBD5E1" : "#C2853A" }}>{rank}</span>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "12px", flexShrink: 0 }}>{name[0]}</div>
                  <span style={{ flex: 1, fontSize: "13px", color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>{points} pts</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

          {/* Recently Joined */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Recently Joined</p>
              <Link href="/admin/students" style={{ fontSize: "12px", color: "#A78BFA", textDecoration: "none", fontWeight: 600 }}>All â†’</Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {students.length === 0 ? (
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)", textAlign: "center", padding: "12px 0" }}>No students yet</p>
              ) : students.map(s => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg,#4C1D95,#164E63)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "12px", flexShrink: 0 }}>{s.name[0]}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "13px", color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "2px" }}>{s.name}</p>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{s.joined}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
