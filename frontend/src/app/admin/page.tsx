"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { BookOpen, Users, Award, Layers, Plus, UserCheck, Activity, Clock, TrendingUp } from "lucide-react";
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

export default function AdminDashboard() {
  const [stats, setStats]       = useState<AdminStats | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [leaders, setLeaders]   = useState<LeaderboardEntry[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    api.admin.stats().then(setStats).catch(() => {});
    api.activity.list().then(a => setActivity(a.slice(0, 5))).catch(() => {});
    api.leaderboard.get().then(l => setLeaders(l.slice(0, 3))).catch(() => {});
    api.students.list().then(s => setStudents([...s].sort((a, b) => new Date(b.joined).getTime() - new Date(a.joined).getTime()).slice(0, 4))).catch(() => {});
  }, []);

  const statCards = [
    { icon: BookOpen, label: "Total Courses",   value: stats?.total_courses      ?? "—", color: "text-purple-400", bg: "bg-purple-600/10", border: "border-purple-600/20" },
    { icon: Layers,   label: "Active Students", value: stats?.active_students    ?? "—", color: "text-cyan-400",   bg: "bg-cyan-600/10",   border: "border-cyan-600/20" },
    { icon: Users,    label: "Total Students",  value: stats?.total_students     ?? "—", color: "text-blue-400",   bg: "bg-blue-600/10",   border: "border-blue-600/20" },
    { icon: Award,    label: "Certificates",    value: stats?.total_certificates ?? "—", color: "text-amber-400",  bg: "bg-amber-600/10",  border: "border-amber-600/20" },
  ];

  return (
    <div className="p-6 space-y-5" style={{ maxWidth: "1280px", margin: "0 auto" }}>

      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Overview</h1>
          <p className="text-sm text-white/40 mt-0.5">Platform-wide statistics and activity</p>
        </div>
        <Link href="/admin/courses/new" className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
          <Plus size={15} /> New Course
        </Link>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map(({ icon: Icon, label, value, color, bg, border }) => (
          <div key={label} className={`glass-card p-5 flex items-center gap-4 border ${border}`}>
            <div className={`w-11 h-11 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={22} className={color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white leading-none tracking-tight">{value}</p>
              <p className="text-xs text-white/45 mt-1.5 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick actions ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { href: "/admin/courses/new", icon: Plus,      label: "New Course",   sub: "Add to catalogue",    color: "text-purple-400", iconBg: "bg-purple-600/10", dot: "bg-purple-500" },
          { href: "/admin/students",    icon: UserCheck,  label: "Students",     sub: "Manage enrolments",   color: "text-green-400",  iconBg: "bg-green-600/10",  dot: "bg-green-500" },
          { href: "/admin/activity",    icon: Activity,   label: "Activity Log", sub: "Live platform feed",  color: "text-amber-400",  iconBg: "bg-amber-600/10",  dot: "bg-amber-500" },
        ].map(({ href, icon: Icon, label, sub, color, iconBg, dot }) => (
          <Link key={label} href={href} className="glass-card-hover p-4 flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={19} className={color} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white leading-none">{label}</p>
              <p className="text-xs text-white/40 mt-1 truncate">{sub}</p>
            </div>
            <div className={`w-1.5 h-1.5 rounded-full ${dot} flex-shrink-0`} />
          </Link>
        ))}
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Bar chart — wider */}
        <div className="glass-card p-5 lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Students Enrolled per Course</h3>
            <span className="badge-purple text-xs">This semester</span>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={enrollData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: "rgba(124,58,237,0.08)" }}
                contentStyle={{ background: "#131325", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "10px", color: "#fff", fontSize: "12px" }}
              />
              <defs>
                <linearGradient id="adminBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
              <Bar dataKey="students" fill="url(#adminBar)" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart — narrower */}
        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-white mb-4">Category Breakdown</h3>
          <div className="flex flex-col items-center gap-4">
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={42} outerRadius={65} paddingAngle={3} dataKey="value">
                  {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#131325", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "10px", color: "#fff", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-1.5">
              {categoryData.map(({ name, value, color }) => (
                <div key={name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span className="text-xs text-white/60 flex-1">{name}</span>
                  <span className="text-xs font-medium text-white/50">{value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent activity */}
        <div className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
            <Link href="/admin/activity" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">View all →</Link>
          </div>
          {activity.length === 0 ? (
            <p className="text-xs text-white/30 py-4 text-center">No activity yet</p>
          ) : (
            <div className="space-y-3">
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 py-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {a.student[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white leading-none truncate">{a.student}</p>
                    <p className="text-xs text-white/45 mt-0.5 truncate">{a.detail}</p>
                  </div>
                  <span className="text-[11px] text-white/25 flex items-center gap-1 flex-shrink-0 pt-0.5">
                    <Clock size={10} />{a.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top students + recently joined */}
        <div className="glass-card p-5 flex flex-col gap-4">
          {/* Leaderboard */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5"><TrendingUp size={14} className="text-purple-400" /> Top Students</h3>
              <Link href="/admin/leaderboard" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Full →</Link>
            </div>
            <div className="space-y-2">
              {leaders.map(({ rank, name, points }) => (
                <div key={rank} className="flex items-center gap-2.5">
                  <span className={`w-6 h-6 rounded-lg text-[11px] font-bold flex items-center justify-center flex-shrink-0 ${RANK_STYLE[rank] ?? "bg-white/10 text-white/40"}`}>{rank}</span>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">{name[0]}</div>
                  <span className="flex-1 text-sm text-white truncate">{name}</span>
                  <span className="text-xs text-white/35">{points} pts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recently joined */}
          <div className="border-t border-white/[0.06] pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider">Recently Joined</h3>
              <Link href="/admin/students" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">All →</Link>
            </div>
            <div className="space-y-2">
              {students.map(s => (
                <div key={s.id} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-800 to-cyan-800 flex items-center justify-center text-white font-bold text-[11px] flex-shrink-0">{s.name[0]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate">{s.name}</p>
                    <p className="text-[10px] text-white/30">{s.joined}</p>
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
