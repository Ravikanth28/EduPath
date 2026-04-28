"use client";
import { useState, useMemo } from "react";
import React from "react";
import { Activity, Users, Clock, Award, LogIn, LogOut, BookOpen, Video, CheckCircle, Search, ChevronLeft, ChevronRight } from "lucide-react";

const EVENTS = [
  { id: 1, type: "test_passed", student: "Arjun Sharma", phone: "9876543210", detail: "Passed Module 3 Test - Engineering Mathematics", time: "Apr 27, 2026 - 09:15 AM" },
  { id: 2, type: "certificate", student: "Priya Nair", phone: "9876543211", detail: "Earned Certificate: Physics Mechanics", time: "Apr 27, 2026 - 08:50 AM" },
  { id: 3, type: "video", student: "Rahul Mehta", phone: "9876543212", detail: "Watched Video: Linear Motion - Physics Mechanics", time: "Apr 27, 2026 - 08:30 AM" },
  { id: 4, type: "enrolled", student: "Deepa Krishnan", phone: "9876543214", detail: "Enrolled in Chemistry Fundamentals", time: "Apr 26, 2026 - 06:00 PM" },
  { id: 5, type: "login", student: "Sneha Patel", phone: "9876543213", detail: "Logged in", time: "Apr 26, 2026 - 05:45 PM" },
  { id: 6, type: "logout", student: "Arjun Sharma", phone: "9876543210", detail: "Logged out", time: "Apr 26, 2026 - 05:30 PM" },
  { id: 7, type: "login", student: "Arjun Sharma", phone: "9876543210", detail: "Logged in", time: "Apr 26, 2026 - 10:00 AM" },
  { id: 8, type: "test_passed", student: "Karan Verma", phone: "9876543215", detail: "Passed Module 1 Test - Computer Science Basics", time: "Apr 25, 2026 - 04:20 PM" },
];

const ACTION_FILTERS = ["All", "Login", "Logout", "Enrolled", "Video", "Test Passed", "Certificate"];
const TYPE_MAP: Record<string, string> = {
  login: "Login", logout: "Logout", enrolled: "Enrolled", video: "Video", test_passed: "Test Passed", certificate: "Certificate",
};
const TYPE_ICON: Record<string, React.ReactNode> = {
  login: <LogIn size={14} className="text-green-400" />,
  logout: <LogOut size={14} className="text-white/40" />,
  enrolled: <BookOpen size={14} className="text-purple-400" />,
  video: <Video size={14} className="text-cyan-400" />,
  test_passed: <CheckCircle size={14} className="text-blue-400" />,
  certificate: <Award size={14} className="text-amber-400" />,
};
const TYPE_BG: Record<string, string> = {
  login: "bg-green-500/10", logout: "bg-white/5", enrolled: "bg-purple-500/10",
  video: "bg-cyan-500/10", test_passed: "bg-blue-500/10", certificate: "bg-amber-500/10",
};

const PAGE_SIZE = 5;

export default function ActivityLogPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => EVENTS.filter(e => {
    const matchSearch = !search || e.student.toLowerCase().includes(search.toLowerCase()) || e.phone.includes(search);
    const matchFilter = filter === "All" || TYPE_MAP[e.type] === filter;
    return matchSearch && matchFilter;
  }), [search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const uniqueStudentsToday = new Set(
    EVENTS.filter(e => e.time.startsWith("Apr 27")).map(e => e.student)
  ).size;
  const certsToday = EVENTS.filter(e => e.type === "certificate" && e.time.startsWith("Apr 27")).length;

  return (
    <div className="p-6 space-y-5 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Activity Log</h1>
        <p className="text-white/50 text-sm mt-0.5">All student events on the platform</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Events", value: EVENTS.length, icon: Activity, color: "text-purple-400" },
          { label: "Active Today", value: uniqueStudentsToday, icon: Users, color: "text-cyan-400" },
          { label: "Online Last 30m", value: 2, icon: Clock, color: "text-green-400" },
          { label: "Certs Today", value: certsToday, icon: Award, color: "text-amber-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card p-4 flex items-center gap-3">
            <Icon size={18} className={color} />
            <div><p className="text-lg font-bold text-white">{value}</p><p className="text-xs text-white/50">{label}</p></div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by student name or phone..." className="input-field pl-10" />
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {ACTION_FILTERS.map(f => (
          <button key={f} onClick={() => { setFilter(f); setPage(1); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${filter === f ? "bg-purple-600/20 text-purple-400 border-purple-600/30" : "border-white/[0.08] text-white/50 hover:text-white"}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Events */}
      <div className="glass-card divide-y divide-white/[0.04]">
        {paginated.length === 0 ? (
          <div className="px-5 py-10 text-center text-white/40 text-sm">No events found.</div>
        ) : paginated.map(e => (
          <div key={e.id} className="flex items-start gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
            <div className={`w-9 h-9 rounded-xl ${TYPE_BG[e.type]} flex items-center justify-center flex-shrink-0 mt-0.5`}>
              {TYPE_ICON[e.type]}
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
                {e.student[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-white leading-tight">{e.student}</p>
                <p className="text-xs text-white/40">{e.phone}</p>
              </div>
            </div>
            <div className="flex-1 min-w-0 ml-1">
              <p className="text-sm text-white/70 leading-snug">{e.detail}</p>
              <p className="text-xs text-white/30 mt-0.5 flex items-center gap-1"><Clock size={10} />{e.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1} className="p-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-colors disabled:opacity-30">
            <ChevronLeft size={15} />
          </button>
          <span className="text-sm text-white/60">Page {safePage} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className="p-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-colors disabled:opacity-30">
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
