"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, BookOpen, CheckCircle, Clock, Users, PlayCircle, LayoutGrid, Video, HelpCircle, Plus } from "lucide-react";
import { api, type Course } from "@/lib/api";

type Tab = "all" | "in_progress" | "completed";

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("all");

  useEffect(() => {
    api.courses.list()
      .then(setCourses)
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter(c => {
    if (tab === "in_progress" && (!c.enrolled || c.completed)) return false;
    if (tab === "completed" && !c.completed) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: courses.length,
    in_progress: courses.filter(c => c.enrolled && !c.completed).length,
    completed: courses.filter(c => c.completed).length,
  };

  const handleEnroll = async (courseId: string) => {
    try {
      await api.courses.enroll(courseId);
      setCourses(prev => prev.map(c => c.id === courseId ? { ...c, enrolled: true, progress: 0, completed: false } : c));
      router.push(`/dashboard/courses/${courseId}`);
    } catch {
      // keep UI stable when enroll request fails
    }
  };

  const TAB_CONFIG: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "all",         label: "All Courses",  icon: <LayoutGrid size={13} /> },
    { key: "in_progress", label: "In Progress",   icon: <Clock size={13} /> },
    { key: "completed",   label: "Completed",     icon: <CheckCircle size={13} /> },
  ];

  return (
    <div style={{ padding: "28px 24px", maxWidth: "1180px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Page header */}
      <div>
        <h1 style={{ color: "#fff", fontWeight: 800, fontSize: "28px", margin: "0 0 6px", letterSpacing: "-0.4px" }}>Available Courses</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", margin: 0 }}>Enroll in courses and start learning</p>
      </div>

      {/* Search + Filters */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
          <Search size={15} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search courses by title or category..."
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", padding: "11px 16px 11px 42px", width: "100%", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            onFocus={e => { e.target.style.borderColor = "rgba(124,58,237,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.14)"; }}
            onBlur={e  => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
          />
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "5px" }}>
          {TAB_CONFIG.map(({ key, label, icon }) => {
            const active = tab === key;
            return (
              <button key={key} onClick={() => setTab(key)}
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer", border: "none", background: active ? "rgba(124,58,237,0.35)" : "transparent", color: active ? "#C4B5FD" : "rgba(255,255,255,0.4)", outline: "none", transition: "all .15s" }}>
                {icon} {label}
                <span style={{ fontSize: "11px", background: active ? "rgba(167,139,250,0.25)" : "rgba(255,255,255,0.08)", borderRadius: "20px", padding: "1px 7px", color: active ? "#C4B5FD" : "rgba(255,255,255,0.3)" }}>{counts[key]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading spinner */}
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "220px" }}>
          <div style={{ width: "36px", height: "36px", border: "3px solid rgba(124,58,237,0.2)", borderTopColor: "#7C3AED", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
      ) : filtered.length === 0 ? (
        /* Empty state */
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "48px 24px", textAlign: "center" }}>
          <BookOpen size={40} style={{ color: "rgba(255,255,255,0.12)", margin: "0 auto 12px", display: "block" }} />
          <p style={{ color: "rgba(255,255,255,0.4)", fontWeight: 600, margin: "0 0 16px" }}>No courses found.</p>
          <button onClick={() => { setSearch(""); setTab("all"); }}
            style={{ padding: "9px 20px", fontSize: "13px", background: "rgba(124,58,237,0.25)", color: "#C4B5FD", border: "1px solid rgba(124,58,237,0.4)", borderRadius: "10px", cursor: "pointer", fontWeight: 600 }}>
            Clear Filters
          </button>
        </div>
      ) : (
        /* Cards grid */
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {filtered.map(c => (
            <div key={c.id}
              style={{ background: "rgba(14,11,30,0.85)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", overflow: "hidden", display: "flex", flexDirection: "column", transition: "border-color .2s, transform .2s, box-shadow .2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(124,58,237,0.45)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(124,58,237,0.2)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; (e.currentTarget as HTMLDivElement).style.transform = "none"; }}>

              {/* Gradient thumbnail */}
              <div style={{ height: "130px", background: c.grad || "linear-gradient(135deg,#7C3AED 0%,#06B6D4 100%)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(10,7,20,0.75) 100%)" }} />
                <div style={{ position: "absolute", bottom: "14px", left: "16px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 600, padding: "4px 12px", borderRadius: "20px", background: "rgba(10,7,20,0.7)", color: "#fff", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}>
                    {c.category}
                  </span>
                  {c.completed && (
                    <span style={{ marginLeft: "6px", fontSize: "12px", fontWeight: 600, padding: "4px 12px", borderRadius: "20px", background: "rgba(16,185,129,0.25)", color: "#6EE7B7", border: "1px solid rgba(16,185,129,0.4)", backdropFilter: "blur(8px)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <CheckCircle size={10} /> Completed
                    </span>
                  )}
                </div>
              </div>

              <div style={{ padding: "18px 18px 20px", display: "flex", flexDirection: "column", flex: 1, gap: "14px" }}>

                {/* Title + description */}
                <div>
                  <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "17px", margin: "0 0 6px", lineHeight: "1.3" }}>{c.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.42)", fontSize: "13px", lineHeight: "1.55", margin: 0 }}>{c.desc}</p>
                </div>

                {/* Progress bar (enrolled only) */}
                {c.enrolled && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>Progress</span>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: c.completed ? "#6EE7B7" : "#A78BFA" }}>{c.progress}%</span>
                    </div>
                    <div style={{ height: "5px", borderRadius: "9999px", background: "rgba(255,255,255,0.08)" }}>
                      <div style={{ height: "100%", borderRadius: "9999px", width: `${c.progress}%`, background: c.completed ? "linear-gradient(90deg,#10B981,#34D399)" : "linear-gradient(90deg,#7C3AED,#06B6D4)", transition: "width .4s" }} />
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "6px" }}>
                  {[
                    { icon: <LayoutGrid size={13} />, val: c.modules, label: "Modules" },
                    { icon: <Video size={13} />, val: c.videos, label: "Videos" },
                    { icon: <HelpCircle size={13} />, val: c.quizzes, label: "Quizzes" },
                    { icon: <Users size={13} />, val: c.students, label: "Students" },
                  ].map(({ icon, val, label }) => (
                    <div key={label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "9px 4px", textAlign: "center" }}>
                      <div style={{ color: "rgba(255,255,255,0.28)", display: "flex", justifyContent: "center", marginBottom: "4px" }}>{icon}</div>
                      <p style={{ color: "#fff", fontSize: "13px", fontWeight: 700, margin: "0 0 2px" }}>{val}</p>
                      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", margin: 0 }}>{label}</p>
                    </div>
                  ))}
                </div>

                {/* Action button */}
                <div style={{ marginTop: "auto" }}>
                  {!c.enrolled ? (
                    <button
                      onClick={() => handleEnroll(c.id)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                        width: "100%", padding: "13px", borderRadius: "12px", fontSize: "14px",
                        fontWeight: 700, cursor: "pointer", boxSizing: "border-box",
                        background: "linear-gradient(135deg,#7C3AED 0%,#06B6D4 100%)",
                        color: "#fff", border: "none", boxShadow: "0 4px 20px rgba(124,58,237,0.35)",
                      }}
                    >
                      <Plus size={15} /> Enroll Now
                    </button>
                  ) : (
                    <Link
                      href={`/dashboard/courses/${c.id}`}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                        width: "100%", padding: "13px", borderRadius: "12px", fontSize: "14px",
                        fontWeight: 700, textDecoration: "none", cursor: "pointer", boxSizing: "border-box",
                        background: c.completed
                          ? "transparent"
                          : "linear-gradient(135deg,#3B82F6 0%,#6366F1 100%)",
                        color: c.completed ? "rgba(255,255,255,0.7)" : "#fff",
                        border: c.completed ? "1px solid rgba(255,255,255,0.18)" : "none",
                        boxShadow: c.completed ? "none" : "0 4px 20px rgba(124,58,237,0.35)",
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "0.87"}
                      onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "1"}
                    >
                      {!c.completed && <><PlayCircle size={15} /> Continue</>}
                      {c.completed && <><CheckCircle size={15} /> Review Course</>}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
