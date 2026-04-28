"use client";
import { useState, useMemo } from "react";
import React from "react";
import { Activity, Users, Clock, Award, LogIn, LogOut, BookOpen, Video, CheckCircle, Search, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

type EventType = "login" | "logout" | "enrolled" | "video" | "test_passed" | "certificate";

interface ActivityEvent {
  id: number;
  type: EventType;
  student: string;
  phone: string;
  detail: string;
  points: number;
  date: string;  // e.g. "21 Apr"
  time: string;  // e.g. "07:32 pm"
}

const EVENTS: ActivityEvent[] = [
  { id:  1, type: "login",        student: "Rithika",       phone: "8807427673", detail: "Login",                                              points:   5, date: "21 Apr", time: "07:32 pm" },
  { id:  2, type: "login",        student: "Rithika",       phone: "8807427673", detail: "Login",                                              points:   5, date: "19 Apr", time: "04:49 pm" },
  { id:  3, type: "logout",       student: "Hemanth L",     phone: "9443581068", detail: "Signed out",                                         points:   0, date: "18 Apr", time: "09:43 pm" },
  { id:  4, type: "login",        student: "Hemanth L",     phone: "9443581068", detail: "Login",                                              points:   5, date: "18 Apr", time: "09:11 pm" },
  { id:  5, type: "login",        student: "Pranishk A S",  phone: "9789264243", detail: "Login",                                              points:   5, date: "17 Apr", time: "11:07 am" },
  { id:  6, type: "login",        student: "Dhinakaran C",  phone: "6381295050", detail: "Login",                                              points:   5, date: "16 Apr", time: "09:34 am" },
  { id:  7, type: "login",        student: "Sadhana sri U", phone: "8148073634", detail: "Login",                                              points:   5, date: "15 Apr", time: "06:54 pm" },
  { id:  8, type: "enrolled",     student: "NITHIYARASU R", phone: "7449047954", detail: "Enrolled in Data Structures & Algorithms",           points:  10, date: "14 Apr", time: "09:56 am" },
  { id:  9, type: "test_passed",  student: "Arjun Sharma",  phone: "9876543210", detail: "Passed Module 3 Test - Engineering Mathematics",     points:  25, date: "27 Apr", time: "09:15 am" },
  { id: 10, type: "certificate",  student: "Priya Nair",    phone: "9876543211", detail: "Earned Certificate: Physics Mechanics",              points: 100, date: "27 Apr", time: "08:50 am" },
  { id: 11, type: "video",        student: "Rahul Mehta",   phone: "9876543212", detail: "Watched: Linear Motion - Physics Mechanics",         points:   0, date: "27 Apr", time: "08:30 am" },
  { id: 12, type: "enrolled",     student: "Deepa Krishnan",phone: "9876543214", detail: "Enrolled in Chemistry Fundamentals",                 points:  10, date: "26 Apr", time: "06:00 pm" },
  { id: 13, type: "login",        student: "Sneha Patel",   phone: "9876543213", detail: "Login",                                              points:   5, date: "26 Apr", time: "05:45 pm" },
  { id: 14, type: "logout",       student: "Arjun Sharma",  phone: "9876543210", detail: "Signed out",                                         points:   0, date: "26 Apr", time: "05:30 pm" },
  { id: 15, type: "login",        student: "Arjun Sharma",  phone: "9876543210", detail: "Login",                                              points:   5, date: "26 Apr", time: "10:00 am" },
  { id: 16, type: "test_passed",  student: "Karan Verma",   phone: "9876543215", detail: "Passed Module 1 Test - Computer Science Basics",     points:  25, date: "25 Apr", time: "04:20 pm" },
  { id: 17, type: "video",        student: "Meera Iyer",    phone: "9876543218", detail: "Watched: Newton's Laws - Physics Mechanics",         points:   0, date: "25 Apr", time: "02:10 pm" },
  { id: 18, type: "login",        student: "Karan Verma",   phone: "9876543215", detail: "Login",                                              points:   5, date: "24 Apr", time: "11:30 am" },
  { id: 19, type: "certificate",  student: "Meera Iyer",    phone: "9876543218", detail: "Earned Certificate: Engineering Mathematics",        points: 100, date: "23 Apr", time: "03:45 pm" },
  { id: 20, type: "enrolled",     student: "Rithika",       phone: "8807427673", detail: "Enrolled in Engineering Mathematics",                points:  10, date: "22 Apr", time: "10:20 am" },
];

const ACTION_FILTERS = ["All", "Login", "Logout", "Enrolled", "Video", "Test Passed", "Certificate"];

const TYPE_MAP: Record<EventType, string> = {
  login: "Login", logout: "Logout", enrolled: "Enrolled",
  video: "Video", test_passed: "Test Passed", certificate: "Certificate",
};

const TYPE_ICON: Record<EventType, React.ReactNode> = {
  login:       <LogIn      size={15} style={{ color: "#4ADE80" }} />,
  logout:      <LogOut     size={15} style={{ color: "rgba(255,255,255,0.35)" }} />,
  enrolled:    <BookOpen   size={15} style={{ color: "#A78BFA" }} />,
  video:       <Video      size={15} style={{ color: "#22D3EE" }} />,
  test_passed: <CheckCircle size={15} style={{ color: "#60A5FA" }} />,
  certificate: <Award      size={15} style={{ color: "#FBBF24" }} />,
};

const TYPE_BG: Record<EventType, string> = {
  login:       "rgba(74,222,128,0.10)",
  logout:      "rgba(255,255,255,0.05)",
  enrolled:    "rgba(167,139,250,0.10)",
  video:       "rgba(34,211,238,0.10)",
  test_passed: "rgba(96,165,250,0.10)",
  certificate: "rgba(251,191,36,0.10)",
};

const PAGE_SIZE = 10;

export default function ActivityLogPage() {
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("All");
  const [page, setPage]           = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => EVENTS.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !search
      || e.student.toLowerCase().includes(q)
      || e.phone.includes(q)
      || e.detail.toLowerCase().includes(q);
    const matchFilter = filter === "All" || TYPE_MAP[e.type] === filter;
    return matchSearch && matchFilter;
  }), [search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const start      = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const end        = Math.min(safePage * PAGE_SIZE, filtered.length);

  const todayStr   = "27 Apr";
  const activeToday = new Set(EVENTS.filter(e => e.date === todayStr).map(e => e.student)).size;
  const onlineNow   = EVENTS.filter(e => e.type === "login" && e.date === todayStr).length;
  const certsTotal  = EVENTS.filter(e => e.type === "certificate").length;

  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
            <Activity size={24} style={{ color: "#4ADE80" }} />
            Activity Log
          </h1>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", marginTop: "4px" }}>
            Real-time login &amp; learning activity of all students
          </p>
        </div>
        <button
          onClick={handleRefresh}
          style={{ padding: "8px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: refreshing ? "#A78BFA" : "rgba(255,255,255,0.5)", cursor: refreshing ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "color .2s" }}
        >
          <RefreshCw size={15} style={{ animation: refreshing ? "spin 0.8s linear infinite" : "none" }} />
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
        {([
          { label: "Total Events",  value: EVENTS.length, icon: Activity, iconBg: "rgba(167,139,250,0.15)", iconColor: "#A78BFA" },
          { label: "Active Today",  value: activeToday,   icon: LogIn,    iconBg: "rgba(74,222,128,0.15)",  iconColor: "#4ADE80" },
          { label: "Online (30m)",  value: onlineNow,     icon: Users,    iconBg: "rgba(34,211,238,0.15)",  iconColor: "#22D3EE" },
          { label: "Certs Issued",  value: certsTotal,    icon: Award,    iconBg: "rgba(251,191,36,0.15)",  iconColor: "#FBBF24" },
        ] as { label: string; value: number; icon: React.ElementType; iconBg: string; iconColor: string }[]).map(({ label, value, icon: Icon, iconBg, iconColor }) => (
          <div key={label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={18} style={{ color: iconColor }} />
            </div>
            <div>
              <p style={{ fontSize: "20px", fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", margin: "3px 0 0" }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.35)", pointerEvents: "none" }} />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, phone or detail..."
            className="input-field"
            style={{ paddingLeft: "40px", width: "100%", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {ACTION_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              style={{
                padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 600,
                cursor: "pointer", transition: "all .15s",
                background: filter === f ? "rgba(124,58,237,0.20)" : "rgba(255,255,255,0.04)",
                color:      filter === f ? "#A78BFA"                : "rgba(255,255,255,0.50)",
                border:     filter === f ? "1px solid rgba(124,58,237,0.35)" : "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Event list */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden" }}>
        {paginated.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: "14px" }}>No events found.</div>
        ) : paginated.map((e, idx) => (
          <div
            key={e.id}
            style={{
              display: "flex", alignItems: "center", gap: "14px",
              padding: "14px 20px",
              borderBottom: idx < paginated.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
            }}
          >
            {/* Event type icon */}
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: TYPE_BG[e.type], display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {TYPE_ICON[e.type]}
            </div>

            {/* Student avatar */}
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "13px", flexShrink: 0 }}>
              {e.student[0].toUpperCase()}
            </div>

            {/* Student info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>{e.student}</span>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.40)" }}>{e.phone}</span>
              </div>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.50)", margin: "2px 0 0" }}>{e.detail}</p>
            </div>

            {/* Points badge */}
            {e.points > 0 && (
              <div style={{ padding: "3px 10px", borderRadius: "20px", background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.25)", color: "#FBBF24", fontSize: "11px", fontWeight: 700, flexShrink: 0 }}>
                +{e.points} pts
              </div>
            )}

            {/* Date / time */}
            <div style={{ textAlign: "right", flexShrink: 0, minWidth: "56px" }}>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", margin: 0, fontWeight: 600 }}>{e.date}</p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.30)", margin: "2px 0 0" }}>{e.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.40)" }}>
          {filtered.length === 0 ? "No results" : `Showing ${start}–${end} of ${filtered.length}`}
        </span>
        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              style={{ padding: "6px 8px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.10)", background: "none", color: "rgba(255,255,255,0.50)", cursor: safePage === 1 ? "default" : "pointer", opacity: safePage === 1 ? 0.3 : 1, display: "flex" }}
            >
              <ChevronLeft size={15} />
            </button>
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.60)" }}>Page {safePage} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              style={{ padding: "6px 8px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.10)", background: "none", color: "rgba(255,255,255,0.50)", cursor: safePage === totalPages ? "default" : "pointer", opacity: safePage === totalPages ? 0.3 : 1, display: "flex" }}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
