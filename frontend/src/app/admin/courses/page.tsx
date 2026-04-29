"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, Trash2, BookOpen, Video, Users, Settings, CheckSquare, CheckCircle, EyeOff, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { api, type Course } from "@/lib/api";

export default function AdminCoursesPage() {
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showBulkDelete, setShowBulkDelete] = useState(false);

  useEffect(() => {
    api.courses.adminList()
      .then(setCourseList)
      .catch(() => toast.error("Failed to load courses"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = courseList.filter(c => !search || c.title.toLowerCase().includes(search.toLowerCase()));
  const allSelected = filtered.length > 0 && filtered.every(c => selected.includes(c.id));

  const toggleSelect = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(allSelected ? [] : filtered.map(c => c.id));

  const togglePublish = async (id: string) => {
    const course = courseList.find(c => c.id === id);
    const wasPublished = course?.is_published ?? false;
    // Optimistic update
    setCourseList(list => list.map(c => c.id === id ? { ...c, is_published: !c.is_published } : c));
    try {
      await api.courses.togglePublish(id);
      toast.success(wasPublished ? "Course unpublished" : "Course published");
    } catch {
      // Revert on failure
      setCourseList(list => list.map(c => c.id === id ? { ...c, is_published: wasPublished } : c));
      toast.error("Failed to update publish status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.courses.delete(id);
      setCourseList(list => list.filter(c => c.id !== id));
      setSelected(s => s.filter(x => x !== id));
      setShowDeleteModal(null);
      toast.success("Course deleted");
    } catch {
      toast.error("Failed to delete course");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selected.map(id => api.courses.delete(id)));
      setCourseList(list => list.filter(c => !selected.includes(c.id)));
      toast.success(`${selected.length} courses deleted`);
      setSelected([]);
      setShowBulkDelete(false);
    } catch {
      toast.error("Failed to delete courses");
    }
  };

  return (
    <div style={{ padding: "28px 24px", maxWidth: "1180px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
        <div>
          <h1 style={{ color: "#111322", fontWeight: 800, fontSize: "24px", margin: "0 0 4px" }}>Courses</h1>
          <p style={{ color: "rgba(17,19,34,0.45)", fontSize: "14px", margin: 0 }}>{courseList.length} total courses</p>
        </div>
        <Link href="/admin/courses/new" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "0 20px", height: "44px", background: "linear-gradient(135deg,#2F45D8,#2336B8)", color: "#FFFFFF", borderRadius: "12px", fontSize: "14px", fontWeight: 700, textDecoration: "none", flexShrink: 0 }}>
          <Plus size={16} /> New Course
        </Link>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
        {[
          { label: "Total Courses",  value: courseList.length,                                         icon: BookOpen,    accent: "#2F45D8", bg: "rgba(47,69,216,0.1)"  },
          { label: "Published",      value: courseList.filter(c => c.is_published).length,             icon: CheckSquare, accent: "#111322", bg: "rgba(47,69,216,0.1)"  },
          { label: "Total Videos",   value: courseList.reduce((a, c) => a + (c.videos ?? 0), 0),       icon: Video,       accent: "#111322", bg: "rgba(47,69,216,0.1)" },
          { label: "Enrollments",    value: courseList.reduce((a, c) => a + (c.students ?? 0), 0),     icon: Users,       accent: "#111322", bg: "rgba(47,69,216,0.1)"  },
        ].map(({ label, value, icon: Icon, accent, bg }) => (
          <div key={label} style={{ background: "rgba(17,19,34,0.03)", border: "1px solid rgba(17,19,34,0.07)", borderRadius: "14px", padding: "16px 18px", display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={18} color={accent} />
            </div>
            <div>
              <p style={{ fontSize: "22px", fontWeight: 800, color: "#111322", margin: "0 0 2px", lineHeight: 1 }}>{loading ? "—" : value}</p>
              <p style={{ fontSize: "12px", color: "rgba(17,19,34,0.4)", margin: 0 }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Select All */}
      <div style={{ display: "flex", gap: "12px" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={15} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(17,19,34,0.35)", pointerEvents: "none" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search courses..."
            style={{ background: "rgba(17,19,34,0.04)", border: "1px solid rgba(17,19,34,0.09)", borderRadius: "12px", color: "#111322", padding: "0 16px 0 42px", height: "44px", width: "100%", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <button
          onClick={toggleAll}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 18px", height: "44px", background: "rgba(17,19,34,0.05)", border: "1px solid rgba(17,19,34,0.12)", borderRadius: "12px", color: "#111322", fontSize: "13px", fontWeight: 600, cursor: "pointer", flexShrink: 0 }}
        >
          <CheckSquare size={15} /> {allSelected ? "Deselect All" : "Select All"}
        </button>
      </div>

      {/* Bulk action bar */}
      {selected.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "12px", background: "rgba(47,69,216,0.08)", border: "1px solid rgba(47,69,216,0.2)" }}>
          <span style={{ fontSize: "13px", color: "#111322" }}>{selected.length} selected</span>
          <button onClick={() => setSelected([])} style={{ fontSize: "12px", color: "rgba(17,19,34,0.45)", background: "none", border: "none", cursor: "pointer", marginLeft: "4px" }}>Clear</button>
          <button onClick={() => setShowBulkDelete(true)} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "10px", background: "rgba(47,69,216,0.15)", border: "1px solid rgba(47,69,216,0.3)", color: "#2F45D8", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
            <Trash2 size={14} /> Delete Selected
          </button>
        </div>
      )}

      {/* Course grid */}
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "180px" }}>
          <div style={{ width: "32px", height: "32px", border: "3px solid rgba(47,69,216,0.2)", borderTopColor: "#2F45D8", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: "rgba(17,19,34,0.03)", border: "1px solid rgba(17,19,34,0.07)", borderRadius: "16px", padding: "48px 24px", textAlign: "center" }}>
          <BookOpen size={36} style={{ color: "rgba(17,19,34,0.15)", margin: "0 auto 12px", display: "block" }} />
          <p style={{ color: "rgba(17,19,34,0.45)", fontSize: "14px", margin: 0 }}>No courses found.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {filtered.map(c => {
            const isPublished = c.is_published ?? false;
            const isSelected = selected.includes(c.id);
            return (
              <div
                key={c.id}
                style={{ background: "rgba(17,19,34,0.03)", border: `1px solid ${isSelected ? `${c.accent}60` : "rgba(17,19,34,0.08)"}`, borderRadius: "18px", overflow: "hidden", display: "flex", flexDirection: "column", transition: "border-color .2s, box-shadow .2s", boxShadow: isSelected ? `0 0 0 2px ${c.accent}30` : "none" }}
              >
                {/* Accent bar */}
                <div style={{ height: "4px", background: c.grad }} />

                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1, gap: "14px" }}>

                  {/* Badge row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: `${c.accent}22`, color: c.accent, border: `1px solid ${c.accent}44` }}>
                        {c.category}
                      </span>
                      {isPublished
                        ? <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(106,112,133,0.12)", color: "#111322", border: "1px solid rgba(106,112,133,0.3)", display: "inline-flex", alignItems: "center", gap: "4px" }}><CheckCircle size={10} /> Published</span>
                        : <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(106,112,133,0.12)", color: "#111322", border: "1px solid rgba(106,112,133,0.3)" }}>Draft</span>
                      }
                    </div>
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleSelect(c.id)}
                      style={{ width: "22px", height: "22px", borderRadius: "6px", border: `1.5px solid ${isSelected ? c.accent : "rgba(17,19,34,0.2)"}`, background: isSelected ? c.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all .15s" }}
                    >
                      {isSelected && <CheckSquare size={12} color="#111322" />}
                    </button>
                  </div>

                  {/* Title + desc */}
                  <div>
                    <h3 style={{ color: "#111322", fontWeight: 700, fontSize: "16px", margin: "0 0 6px", lineHeight: "1.3" }}>{c.title}</h3>
                    <p style={{ color: "rgba(17,19,34,0.48)", fontSize: "13px", lineHeight: "1.55", margin: 0 }}>{c.desc}</p>
                  </div>

                  {/* Stats */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "6px" }}>
                    {([["Modules", c.modules], ["Videos", c.videos], ["Questions", c.quizzes], ["Students", c.students]] as const).map(([label, val]) => (
                      <div key={label} style={{ background: "rgba(17,19,34,0.04)", borderRadius: "10px", padding: "8px 4px", textAlign: "center" }}>
                        <p style={{ color: "#111322", fontSize: "13px", fontWeight: 700, margin: "0 0 2px" }}>{val}</p>
                        <p style={{ color: "rgba(17,19,34,0.38)", fontSize: "10px", margin: 0 }}>{label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div style={{ marginTop: "auto", display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => togglePublish(c.id)}
                      style={{ display: "flex", alignItems: "center", gap: "6px", padding: "0 14px", height: "42px", borderRadius: "12px", fontSize: "13px", fontWeight: 600, cursor: "pointer", background: "rgba(17,19,34,0.04)", border: "1px solid rgba(17,19,34,0.1)", color: "rgba(17,19,34,0.6)", flexShrink: 0, transition: "all .15s" }}
                    >
                      {isPublished ? <><EyeOff size={14} /> Unpublish</> : <><Eye size={14} /> Publish</>}
                    </button>
                    <Link
                      href={`/admin/courses/${c.id}`}
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", height: "42px", borderRadius: "12px", fontSize: "13px", fontWeight: 700, textDecoration: "none", color: "#111322", background: c.grad, transition: "opacity .2s" }}
                    >
                      <Settings size={14} /> Manage
                    </Link>
                    <button
                      onClick={() => setShowDeleteModal(c.id)}
                      style={{ width: "42px", height: "42px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", border: "1px solid rgba(47,69,216,0.2)", background: "transparent", color: "#2F45D8", cursor: "pointer", flexShrink: 0, transition: "background .15s" }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete modal */}
      {showDeleteModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(17,19,34,0.65)", backdropFilter: "blur(6px)", padding: "16px" }}>
          <div style={{ background: "linear-gradient(135deg,#EEF3FF,#DDE7FF)", border: "1px solid rgba(17,19,34,0.1)", borderRadius: "20px", padding: "28px", maxWidth: "380px", width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(47,69,216,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
              <Trash2 size={22} color="#2F45D8" />
            </div>
            <div style={{ textAlign: "center" }}>
              <h3 style={{ color: "#111322", fontWeight: 700, fontSize: "16px", margin: "0 0 6px" }}>Delete Course?</h3>
              <p style={{ color: "rgba(17,19,34,0.45)", fontSize: "13px", lineHeight: "1.55", margin: 0 }}>This action cannot be undone. All modules, videos, and student progress will be lost.</p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setShowDeleteModal(null)} style={{ flex: 1, height: "42px", borderRadius: "12px", background: "rgba(17,19,34,0.05)", border: "1px solid rgba(17,19,34,0.12)", color: "#111322", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={() => handleDelete(showDeleteModal)} style={{ flex: 1, height: "42px", borderRadius: "12px", background: "rgba(47,69,216,0.15)", border: "1px solid rgba(47,69,216,0.3)", color: "#2F45D8", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk delete modal */}
      {showBulkDelete && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(17,19,34,0.65)", backdropFilter: "blur(6px)", padding: "16px" }}>
          <div style={{ background: "linear-gradient(135deg,#EEF3FF,#DDE7FF)", border: "1px solid rgba(17,19,34,0.1)", borderRadius: "20px", padding: "28px", maxWidth: "380px", width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(47,69,216,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
              <Trash2 size={22} color="#2F45D8" />
            </div>
            <div style={{ textAlign: "center" }}>
              <h3 style={{ color: "#111322", fontWeight: 700, fontSize: "16px", margin: "0 0 6px" }}>Delete {selected.length} Courses?</h3>
              <p style={{ color: "rgba(17,19,34,0.45)", fontSize: "13px", lineHeight: "1.55", margin: 0 }}>This will permanently delete all selected courses and their data.</p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setShowBulkDelete(false)} style={{ flex: 1, height: "42px", borderRadius: "12px", background: "rgba(17,19,34,0.05)", border: "1px solid rgba(17,19,34,0.12)", color: "#111322", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleBulkDelete} style={{ flex: 1, height: "42px", borderRadius: "12px", background: "rgba(47,69,216,0.15)", border: "1px solid rgba(47,69,216,0.3)", color: "#2F45D8", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Delete All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
