"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import React from "react";
import { Activity, Users, Award, LogIn, LogOut, BookOpen, Video, CheckCircle, Search, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";

type EventType = "login" | "logout" | "enrolled" | "video" | "test_passed" | "certificate" | "other";

interface ActivityEvent {
  id: number;
  type: EventType;
  student: string;
  detail: string;
  points: number;
  time: string;
}

/** Infer event type and points from the backend `detail` string */
function parseEvent(detail: string): { type: EventType; points: number } {
  const d = detail.toLowerCase();
  if (d.includes("earned certificate"))        return { type: "certificate",  points: 100 };
  if (d.includes("passed") && d.includes("test")) return { type: "test_passed", points:  25 };
  if (d.includes("enrolled in"))               return { type: "enrolled",     points:  10 };
  if (d.includes("watched") || d.includes("video")) return { type: "video",    points:   0 };
  if (d.includes("signed out") || d.includes("logged out")) return { type: "logout", points: 0 };
  if (d.includes("logged in") || d.includes("verified account")) return { type: "login", points: 5 };
  return { type: "other", points: 0 };
}

const ACTION_FILTERS = ["All", "Login", "Logout", "Enrolled", "Video", "Test Passed", "Certificate"];

const TYPE_LABEL: Record<EventType, string> = {
  login: "Login", logout: "Logout", enrolled: "Enrolled",
  video: "Video", test_passed: "Test Passed", certificate: "Certificate", other: "Other",
};

const TYPE_ICON: Record<EventType, React.ReactNode> = {
  login:       <LogIn       size={15} style={{ color: "#111322" }} />,
  logout:      <LogOut      size={15} style={{ color: "rgba(17,19,34,0.35)" }} />,
  enrolled:    <BookOpen    size={15} style={{ color: "#2F45D8" }} />,
  video:       <Video       size={15} style={{ color: "#111322" }} />,
  test_passed: <CheckCircle size={15} style={{ color: "#4D5368" }} />,
  certificate: <Award       size={15} style={{ color: "#111322" }} />,
  other:       <Activity    size={15} style={{ color: "rgba(17,19,34,0.35)" }} />,
};

const TYPE_BG: Record<EventType, string> = {
  login:       "rgba(47,69,216,0.10)",
  logout:      "rgba(17,19,34,0.05)",
  enrolled:    "rgba(47,69,216,0.10)",
  video:       "rgba(47,69,216,0.10)",
  test_passed: "rgba(77,83,104,0.10)",
  certificate: "rgba(47,69,216,0.10)",
  other:       "rgba(17,19,34,0.04)",
};

const PAGE_SIZE = 10;

export default function ActivityLogPage() {
  const [events, setEvents]         = useState<ActivityEvent[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [filter, setFilter]         = useState("All");
  const [page, setPage]             = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      const data = await api.activity.list();
      setEvents(
        data.map((entry, i) => {
          const { type, points } = parseEvent(entry.detail);
          return { id: i, type, student: entry.student, detail: entry.detail, points, time: entry.time };
        })
      );
    } catch {
      // keep existing data on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    fetchEvents().finally(() => setTimeout(() => setRefreshing(false), 600));
  };

  const filtered = useMemo(() => events.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !search
      || e.student.toLowerCase().includes(q)
      || e.detail.toLowerCase().includes(q);
    const matchFilter = filter === "All" || TYPE_LABEL[e.type] === filter;
    return matchSearch && matchFilter;
  }), [events, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const start      = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const end        = Math.min(safePage * PAGE_SIZE, filtered.length);

  const recentEvents = events.filter(e => e.time === "just now" || e.time.endsWith("m ago") || e.time.endsWith("h ago"));
  const activeRecent = new Set(recentEvents.map(e => e.student)).size;
  const onlineNow    = events.filter(e => e.type === "login" && (e.time === "just now" || e.time.endsWith("m ago"))).length;
  const certsTotal   = events.filter(e => e.type === "certificate").length;



  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#111322", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
            <Activity size={24} style={{ color: "#111322" }} />
            Activity Log
          </h1>
          <p style={{ fontSize: "13px", color: "rgba(17,19,34,0.45)", marginTop: "4px" }}>
            Real-time login &amp; learning activity of all students
          </p>
        </div>
        <button
          onClick={handleRefresh}
          style={{ padding: "8px", borderRadius: "10px", background: "rgba(17,19,34,0.05)", border: "1px solid rgba(17,19,34,0.08)", color: refreshing ? "#2F45D8" : "rgba(17,19,34,0.5)", cursor: refreshing ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "color .2s" }}
        >
          <RefreshCw size={15} style={{ animation: refreshing ? "spin 0.8s linear infinite" : "none" }} />
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
        {([
          { label: "Total Events",  value: events.length, icon: Activity, iconBg: "rgba(47,69,216,0.15)", iconColor: "#2F45D8" },
          { label: "Active Today",  value: activeRecent,  icon: LogIn,    iconBg: "rgba(47,69,216,0.15)",  iconColor: "#111322" },
          { label: "Online (30m)",  value: onlineNow,     icon: Users,    iconBg: "rgba(47,69,216,0.15)",  iconColor: "#111322" },
          { label: "Certs Issued",  value: certsTotal,    icon: Award,    iconBg: "rgba(47,69,216,0.15)",  iconColor: "#111322" },
        ] as { label: string; value: number; icon: React.ElementType; iconBg: string; iconColor: string }[]).map(({ label, value, icon: Icon, iconBg, iconColor }) => (
          <div key={label} style={{ background: "rgba(17,19,34,0.03)", border: "1px solid rgba(17,19,34,0.07)", borderRadius: "14px", padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={18} style={{ color: iconColor }} />
            </div>
            <div>
              <p style={{ fontSize: "20px", fontWeight: 800, color: "#111322", margin: 0, lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: "11px", color: "rgba(17,19,34,0.45)", margin: "3px 0 0" }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(17,19,34,0.35)", pointerEvents: "none" }} />
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
                background: filter === f ? "rgba(47,69,216,0.20)" : "rgba(17,19,34,0.04)",
                color:      filter === f ? "#2F45D8"                : "rgba(17,19,34,0.50)",
                border:     filter === f ? "1px solid rgba(47,69,216,0.35)" : "1px solid rgba(17,19,34,0.07)",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Event list */}
      <div style={{ background: "rgba(17,19,34,0.02)", border: "1px solid rgba(17,19,34,0.07)", borderRadius: "16px", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "rgba(17,19,34,0.35)", fontSize: "14px" }}>Loading activity...</div>
        ) : paginated.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "rgba(17,19,34,0.35)", fontSize: "14px" }}>{events.length === 0 ? "No activity recorded yet." : "No events match your search."}</div>
        ) : paginated.map((e, idx) => (
          <div
            key={e.id}
            style={{
              display: "flex", alignItems: "center", gap: "14px",
              padding: "14px 20px",
              borderBottom: idx < paginated.length - 1 ? "1px solid rgba(17,19,34,0.04)" : "none",
            }}
          >
            {/* Event type icon */}
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: TYPE_BG[e.type], display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {TYPE_ICON[e.type]}
            </div>

            {/* Student avatar */}
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#2F45D8,#2336B8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontWeight: 800, fontSize: "13px", flexShrink: 0 }}>
              {e.student[0].toUpperCase()}
            </div>

            {/* Student info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#111322" }}>{e.student}</span>
              <p style={{ fontSize: "12px", color: "rgba(17,19,34,0.50)", margin: "2px 0 0" }}>{e.detail}</p>
            </div>

            {/* Points badge */}
            {e.points > 0 && (
              <div style={{ padding: "3px 10px", borderRadius: "20px", background: "rgba(47,69,216,0.15)", border: "1px solid rgba(47,69,216,0.25)", color: "#111322", fontSize: "11px", fontWeight: 700, flexShrink: 0 }}>
                +{e.points} pts
              </div>
            )}

            {/* Time */}
            <div style={{ textAlign: "right", flexShrink: 0, minWidth: "56px" }}>
              <p style={{ fontSize: "12px", color: "rgba(17,19,34,0.45)", margin: 0, fontWeight: 500, whiteSpace: "nowrap" }}>{e.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "13px", color: "rgba(17,19,34,0.40)" }}>
          {filtered.length === 0 ? "No results" : `Showing ${start}-${end} of ${filtered.length}`}
        </span>
        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              style={{ padding: "6px 8px", borderRadius: "8px", border: "1px solid rgba(17,19,34,0.10)", background: "none", color: "rgba(17,19,34,0.50)", cursor: safePage === 1 ? "default" : "pointer", opacity: safePage === 1 ? 0.3 : 1, display: "flex" }}
            >
              <ChevronLeft size={15} />
            </button>
            <span style={{ fontSize: "13px", color: "rgba(17,19,34,0.60)" }}>Page {safePage} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              style={{ padding: "6px 8px", borderRadius: "8px", border: "1px solid rgba(17,19,34,0.10)", background: "none", color: "rgba(17,19,34,0.50)", cursor: safePage === totalPages ? "default" : "pointer", opacity: safePage === totalPages ? 0.3 : 1, display: "flex" }}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
