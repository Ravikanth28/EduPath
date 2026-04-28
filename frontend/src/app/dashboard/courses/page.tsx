"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, BookOpen, CheckCircle, Clock, Users, PlayCircle, Filter } from "lucide-react";

const COURSES = [
  { id: "1", title: "Engineering Mathematics", desc: "Calculus, differential equations, linear algebra, and probability.", category: "Mathematics", modules: 6, videos: 18, quizzes: 30, students: 1240, progress: 65, enrolled: true, completed: false, grad: "#2F45D8", accent: "#2F45D8" },
  { id: "2", title: "Physics Mechanics", desc: "Newton's laws, kinematics, work-energy theorem, and fluid mechanics.", category: "Physics", modules: 5, videos: 15, quizzes: 25, students: 2100, progress: 100, enrolled: true, completed: true, grad: "#E1E8FF", accent: "#7E8498" },
  { id: "3", title: "Chemistry Fundamentals", desc: "Organic, inorganic and physical chemistry for first-year engineering.", category: "Chemistry", modules: 8, videos: 24, quizzes: 40, students: 850, progress: 0, enrolled: false, completed: false, grad: "#2F45D8", accent: "#6A7085" },
  { id: "4", title: "Computer Science Basics", desc: "Programming fundamentals, data structures, and algorithms in C.", category: "Computer Science", modules: 7, videos: 21, quizzes: 35, students: 620, progress: 0, enrolled: false, completed: false, grad: "#E1E8FF", accent: "#7E8498" },
  { id: "5", title: "Electronics & Circuits", desc: "Ohm's law, Kirchhoff's laws, diodes, transistors and circuit analysis.", category: "Electronics", modules: 4, videos: 12, quizzes: 20, students: 950, progress: 0, enrolled: false, completed: false, grad: "#2F45D8", accent: "#2F45D8" },
];

type Tab = "all" | "in_progress" | "completed";

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("all");

  const filtered = COURSES.filter(c => {
    if (tab === "in_progress" && (!c.enrolled || c.completed)) return false;
    if (tab === "completed" && !c.completed) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: COURSES.length,
    in_progress: COURSES.filter(c => c.enrolled && !c.completed).length,
    completed: COURSES.filter(c => c.completed).length,
  };

  const TAB_CONFIG: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "all",         label: "All",         icon: <BookOpen size={14} /> },
    { key: "in_progress", label: "In Progress",  icon: <Clock size={14} /> },
    { key: "completed",   label: "Completed",    icon: <CheckCircle size={14} /> },
  ];

  return (
    <div style={{ padding: "28px 24px", maxWidth: "1180px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* -- Page header -- */}
      <div>
        <h1 style={{ color: "#111322", fontWeight: 800, fontSize: "24px", margin: "0 0 4px" }}>Available Courses</h1>
        <p style={{ color: "rgba(17,19,34,0.45)", fontSize: "14px", margin: 0 }}>Enroll in courses and start learning.</p>
      </div>

      {/* -- Search + Filters -- */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search size={15} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(17,19,34,0.35)", pointerEvents: "none" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search courses..."
            style={{ background: "rgba(17,19,34,0.04)", border: "1px solid rgba(17,19,34,0.09)", borderRadius: "12px", color: "#111322", padding: "11px 16px 11px 42px", width: "100%", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {TAB_CONFIG.map(({ key, label, icon }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{ display: "flex", alignItems: "center", gap: "7px", padding: "10px 16px", borderRadius: "12px", fontSize: "13px", fontWeight: 600, cursor: "pointer", border: `1px solid ${active ? "rgba(47,69,216,0.4)" : "rgba(17,19,34,0.1)"}`, background: active ? "rgba(47,69,216,0.15)" : "transparent", color: active ? "#2F45D8" : "rgba(17,19,34,0.5)", transition: "all .15s", outline: "none" }}
              >
                {icon} {label}
                <span style={{ fontSize: "11px", opacity: 0.6 }}>({counts[key]})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* -- Empty state -- */}
      {filtered.length === 0 ? (
        <div style={{ background: "rgba(17,19,34,0.03)", border: "1px solid rgba(17,19,34,0.07)", borderRadius: "16px", padding: "48px 24px", textAlign: "center" }}>
          <BookOpen size={40} style={{ color: "rgba(17,19,34,0.15)", margin: "0 auto 12px", display: "block" }} />
          <p style={{ color: "rgba(17,19,34,0.5)", fontWeight: 600, margin: "0 0 16px" }}>No courses found.</p>
          <button onClick={() => { setSearch(""); setTab("all"); }} className="btn-secondary" style={{ padding: "9px 20px", fontSize: "13px" }}>
            Clear Filters
          </button>
        </div>
      ) : (
        /* -- Cards grid -- */
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {filtered.map(c => (
            <div key={c.id} style={{ background: "rgba(17,19,34,0.03)", border: "1px solid rgba(17,19,34,0.08)", borderRadius: "18px", overflow: "hidden", display: "flex", flexDirection: "column", transition: "border-color .2s, transform .2s, box-shadow .2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${c.accent}55`; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${c.accent}18`; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(17,19,34,0.08)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; (e.currentTarget as HTMLDivElement).style.transform = "none"; }}>

              {/* Color bar */}
              <div style={{ height: "4px", background: c.grad }} />

              <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1, gap: "14px" }}>

                {/* Category + status row */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: `${c.accent}22`, color: c.accent, border: `1px solid ${c.accent}44` }}>
                    {c.category}
                  </span>
                  {c.completed && (
                    <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(106,112,133,0.12)", color: "#111322", border: "1px solid rgba(106,112,133,0.3)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <CheckCircle size={10} /> Completed
                    </span>
                  )}
                  {c.enrolled && !c.completed && (
                    <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(47,69,216,0.12)", color: "#111322", border: "1px solid rgba(47,69,216,0.3)" }}>
                      {c.progress}%
                    </span>
                  )}
                </div>

                {/* Title + description */}
                <div>
                  <h3 style={{ color: "#111322", fontWeight: 700, fontSize: "16px", margin: "0 0 6px", lineHeight: "1.3" }}>{c.title}</h3>
                  <p style={{ color: "rgba(17,19,34,0.48)", fontSize: "13px", lineHeight: "1.55", margin: 0 }}>{c.desc}</p>
                </div>

                {/* Progress bar (enrolled only) */}
                {c.enrolled && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "11px", color: "rgba(17,19,34,0.4)" }}>Progress</span>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: c.accent }}>{c.progress}%</span>
                    </div>
                    <div style={{ height: "6px", borderRadius: "9999px", background: "rgba(17,19,34,0.07)" }}>
                      <div style={{ height: "100%", borderRadius: "9999px", width: `${c.progress}%`, background: c.grad, transition: "width .4s" }} />
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "6px" }}>
                  {[["Modules", c.modules], ["Videos", c.videos], ["Quizzes", c.quizzes], ["Students", c.students]].map(([label, val]) => (
                    <div key={label as string} style={{ background: "rgba(17,19,34,0.04)", borderRadius: "10px", padding: "8px 4px", textAlign: "center" }}>
                      <p style={{ color: "#111322", fontSize: "13px", fontWeight: 700, margin: "0 0 2px" }}>{val}</p>
                      <p style={{ color: "rgba(17,19,34,0.38)", fontSize: "10px", margin: 0 }}>{label}</p>
                    </div>
                  ))}
                </div>

                {/* Action button */}
                <div style={{ marginTop: "auto" }}>
                  <Link
                    href={`/dashboard/courses/${c.id}`}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "12px", borderRadius: "12px", fontSize: "14px", fontWeight: 700, textDecoration: "none", cursor: "pointer", background: c.enrolled ? c.grad : "rgba(17,19,34,0.06)", color: "#111322", border: c.enrolled ? "none" : "1px solid rgba(17,19,34,0.12)", boxSizing: "border-box", transition: "opacity .2s" }}
                    onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"}
                    onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "1"}
                  >
                    {!c.enrolled && <><Users size={15} /> Enroll Now</>}
                    {c.enrolled && !c.completed && <><PlayCircle size={15} /> Continue</>}
                    {c.completed && <><CheckCircle size={15} /> Review Course</>}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
