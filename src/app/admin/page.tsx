"use client";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { BookOpen, Users, Award, Layers, Plus, Video, UserCheck, Activity, Clock } from "lucide-react";

const enrollData = [
  { name: "Eng. Maths", students: 420 }, { name: "Physics", students: 380 },
  { name: "Chemistry", students: 290 }, { name: "Computer Sci.", students: 340 }, { name: "Electronics", students: 190 },
];
const categoryData = [
  { name: "Mathematics", value: 30, color: "#7C3AED" },
  { name: "Physics", value: 25, color: "#06B6D4" },
  { name: "Chemistry", value: 20, color: "#22D3EE" },
  { name: "Computer Science", value: 15, color: "#A78BFA" },
  { name: "Other", value: 10, color: "#6D28D9" },
];

const RECENT_ACTIVITY = [
  { name: "Arjun Sharma", detail: "Passed Module 3 Test — Engineering Mathematics", time: "2m ago" },
  { name: "Priya Nair", detail: "Earned Certificate: Physics Mechanics", time: "15m ago" },
  { name: "Rahul Mehta", detail: "Enrolled in Chemistry Fundamentals", time: "1h ago" },
  { name: "Sneha Patel", detail: "Logged in", time: "2h ago" },
];

const LEADERBOARD = [
  { rank: 1, name: "Arjun Sharma", courses: 3 },
  { rank: 2, name: "Priya Nair", courses: 2 },
  { rank: 3, name: "Rahul Mehta", courses: 2 },
];

const RECENT_STUDENTS = [
  { name: "Deepa Krishnan", phone: "9876500001", joined: "Apr 25, 2026" },
  { name: "Karan Verma", phone: "9876500002", joined: "Apr 24, 2026" },
  { name: "Anita Roy", phone: "9876500003", joined: "Apr 23, 2026" },
];

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0D0D1A, #131325)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="absolute top-0 right-0 w-64 h-64 blur-3xl opacity-15" style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 blur-3xl opacity-10" style={{ background: "radial-gradient(circle, #06B6D4, transparent)" }} />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="badge-purple mb-2 inline-block">Admin Dashboard</span>
            <h1 className="text-2xl font-bold text-white">Welcome, Admin 👋</h1>
            <p className="text-white/50 text-sm mt-1">Here&apos;s a full overview of the platform.</p>
          </div>
          <div className="hidden md:grid grid-cols-3 gap-3">
            {[["5", "Courses"], ["1,355", "Students"], ["47", "Certificates"]].map(([v, l]) => (
              <div key={l} className="glass-card px-5 py-3 text-center">
                <p className="text-2xl font-black gradient-text">{v}</p>
                <p className="text-xs text-white/40">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: "Total Courses", value: "5", color: "text-purple-400", bg: "bg-purple-600/10" },
          { icon: Layers, label: "Total Modules", value: "30", color: "text-cyan-400", bg: "bg-cyan-600/10" },
          { icon: Users, label: "Students", value: "1,355", color: "text-blue-400", bg: "bg-blue-600/10" },
          { icon: Award, label: "Certificates", value: "47", color: "text-amber-400", bg: "bg-amber-600/10" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="glass-card p-4 flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={22} className={color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-white/50">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { href: "/admin/courses/new", icon: Plus, label: "Create Course", color: "text-purple-400", bg: "bg-purple-600/10 border-purple-600/20" },
          { href: "/admin/students", icon: UserCheck, label: "View Students", color: "text-green-400", bg: "bg-green-600/10 border-green-600/20" },
          { href: "/admin/activity", icon: Activity, label: "Activity Log", color: "text-amber-400", bg: "bg-amber-600/10 border-amber-600/20" },
        ].map(({ href, icon: Icon, label, color, bg }) => (
          <Link key={label} href={href} className={`glass-card-hover p-4 flex flex-col items-center gap-2 text-center border ${bg}`}>
            <Icon size={22} className={color} />
            <span className="text-sm font-medium text-white">{label}</span>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card p-5">
          <h3 className="font-semibold text-white text-sm mb-4">Students Enrolled per Course</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={enrollData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1A1A30", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "8px", color: "#fff", fontSize: "12px" }} />
              <Bar dataKey="students" fill="url(#adminBar)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="adminBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card p-5">
          <h3 className="font-semibold text-white text-sm mb-4">Courses by Category</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#1A1A30", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "8px", color: "#fff", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5">
              {categoryData.map(({ name, value, color }) => (
                <div key={name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span className="text-xs text-white/60">{name}</span>
                  <span className="text-xs text-white/30 ml-auto">{value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Live activity */}
        <div className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white text-sm">Live Activity</h3>
            <Link href="/admin/activity" className="text-xs text-purple-400 hover:text-purple-300">View All</Link>
          </div>
          <div className="space-y-3">
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                  {a.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{a.name}</p>
                  <p className="text-xs text-white/50 truncate">{a.detail}</p>
                </div>
                <span className="text-xs text-white/30 flex items-center gap-1 flex-shrink-0"><Clock size={10} />{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent students */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white text-sm">Top Students</h3>
            <Link href="/admin/students" className="text-xs text-purple-400 hover:text-purple-300">All</Link>
          </div>
          <div className="space-y-3">
            {LEADERBOARD.map(({ rank, name, courses }) => (
              <div key={rank} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${rank === 1 ? "bg-yellow-500/20 text-yellow-400" : rank === 2 ? "bg-slate-500/20 text-slate-300" : "bg-amber-700/20 text-amber-500"}`}>
                  {rank}
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                  {name[0]}
                </div>
                <Link href="/admin/students/1" className="flex-1 text-sm text-white/80 hover:text-white truncate">{name}</Link>
                <span className="text-xs text-white/40">{courses} courses</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-white/[0.06] pt-4">
            <h4 className="text-xs text-white/40 mb-3">Recently Joined</h4>
            {RECENT_STUDENTS.map(s => (
              <div key={s.name} className="flex items-center gap-2 py-1.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-800 to-cyan-800 flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0">
                  {s.name[0]}
                </div>
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
  );
}
