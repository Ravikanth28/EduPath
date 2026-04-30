"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search, Users, BookOpen, Award, GraduationCap, UserPlus,
  ChevronUp, ChevronDown, X, ExternalLink, Calendar, Filter, Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { api, type Student as ApiStudent, type Course, type CourseEnrollmentsResponse } from "@/lib/api";

type Student = {
  id: string;
  name: string;
  phone: string;
  email: string;
  courseName: string | null;
  courseStatus: string | null;
  progress: number;
  certs: number;
  joined: string;
  status: "active" | "not_started" | "inactive";
  enrolled: boolean;
};
type SortKey = "name" | "progress" | "joined";

const AVATAR_COLORS = [
  "#2F45D8",
  "#6F82FF",
  "#2F45D8",
  "#8EA0FF",
  "#2F45D8",
  "#2F45D8",
];
const avatarColor = (id: string) => {
  const hash = id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};

export default function AdminStudentsPage() {
  const [students, setStudents]       = useState<Student[]>([]);
  const [courses, setCourses]         = useState<Course[]>([]);
  const [search, setSearch]           = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy]           = useState<SortKey>("joined");
  const [sortDir, setSortDir]         = useState<"asc" | "desc">("desc");

  // Filters
  const [fCourse, setFCourse] = useState("All Courses");
  const [fCert,   setFCert]   = useState("All");
  const [fEnroll, setFEnroll] = useState("All");
  const [fStatus, setFStatus] = useState("All Statuses");

  // Register modal
  const [showRegister, setShowRegister] = useState(false);
  const [regForm, setRegForm]           = useState({ name: "", email: "", phone: "", password: "" });
  const [regErrors, setRegErrors]       = useState<Record<string, string>>({});
  const [deletingId, setDeletingId]     = useState<string | null>(null);
  const [selectedIds, setSelectedIds]   = useState<string[]>([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const loadData = async () => {
    const [studentRows, courseRows] = await Promise.all([
      api.students.list(),
      api.courses.adminList().catch(() => [] as Course[]),
    ]);
    const enrollmentRows = await Promise.all(
      courseRows.map(c => api.admin.courseEnrollments(c.id).catch(() => ({
        course_id: c.id,
        course_title: c.title,
        enrolled_count: 0,
        items: [],
      } as CourseEnrollmentsResponse)))
    );

    const progressByStudent = new Map<string, { progress: number; courseTitle: string; completedModules: number; totalModules: number }>();
    for (const courseEnrollments of enrollmentRows) {
      for (const item of courseEnrollments.items) {
        const existing = progressByStudent.get(item.student_id);
        if (!existing || item.progress > existing.progress) {
          progressByStudent.set(item.student_id, {
            progress: item.progress,
            courseTitle: courseEnrollments.course_title,
            completedModules: item.completed_modules,
            totalModules: item.total_modules,
          });
        }
      }
    }

    const mapped = studentRows.map((s: ApiStudent) => {
      const enrolledCount = s.enrolled_courses.length;
      const live = progressByStudent.get(s.id);
      const progress = live?.progress ?? 0;
      return {
        id: s.id,
        name: s.name,
        phone: s.phone,
        email: s.email,
        courseName: enrolledCount > 0 ? (live?.courseTitle ?? "Assigned Course") : null,
        courseStatus: enrolledCount > 0
          ? (progress >= 100
            ? "Completed"
            : `In progress - ${live ? `${live.completedModules}/${live.totalModules} modules` : `${progress}%`}`)
          : null,
        progress,
        certs: s.certificates.length,
        joined: s.joined,
        status: enrolledCount > 0 ? "active" : "not_started",
        enrolled: enrolledCount > 0,
      } as Student;
    });
    setCourses(courseRows);
    setStudents(mapped);
  };

  useEffect(() => {
    loadData().catch(() => {
      toast.error("Failed to load students");
    });
  }, []);

  // -- Sorting + filtering ----------------------------------------------------
  const handleSort = (key: SortKey) => {
    if (sortBy === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(key); setSortDir("asc"); }
  };

  const SortIcon = ({ field }: { field: SortKey }) =>
    sortBy === field
      ? sortDir === "asc" ? <ChevronUp size={11} /> : <ChevronDown size={11} />
      : <span style={{ width: 11, display: "inline-block" }} />;

  const filtered = useMemo(() => students
    .filter(s => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) &&
          !s.phone.includes(search) && !s.email.toLowerCase().includes(search.toLowerCase())) return false;
      if (fCourse !== "All Courses" && s.courseName !== fCourse) return false;
      if (fCert === "Has Certificate" && s.certs === 0) return false;
      if (fCert === "No Certificate" && s.certs > 0) return false;
      if (fEnroll === "Enrolled" && !s.enrolled) return false;
      if (fEnroll === "Not Enrolled" && s.enrolled) return false;
      if (fStatus !== "All Statuses") {
        const map: Record<string, string> = { "Active": "active", "Inactive": "inactive", "Not Started": "not_started" };
        if (s.status !== map[fStatus]) return false;
      }
      return true;
    })
    .sort((a, b) => {
      let val = 0;
      if (sortBy === "name") val = a.name.localeCompare(b.name);
      else if (sortBy === "progress") val = a.progress - b.progress;
      else val = new Date(a.joined).getTime() - new Date(b.joined).getTime();
      return sortDir === "asc" ? val : -val;
    }), [students, search, fCourse, fCert, fEnroll, fStatus, sortBy, sortDir]);

  const visibleIds = filtered.map(s => s.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every(id => selectedIds.includes(id));

  // -- In-view stats ----------------------------------------------------------
  const statEnrolled = filtered.filter(s => s.enrolled).length;
  const statCerts    = filtered.filter(s => s.certs > 0).length;
  const statNotStart = filtered.filter(s => s.status === "not_started").length;

  // -- Register ---------------------------------------------------------------
  const validateReg = () => {
    const e: Record<string, string> = {};
    if (!regForm.name.trim())    e.name     = "Name is required";
    if (!regForm.email.trim())   e.email    = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regForm.email)) e.email = "Invalid email";
    if (!regForm.phone.trim())   e.phone    = "Phone is required";
    else if (!/^\d{10}$/.test(regForm.phone.replace(/\s/g, ""))) e.phone = "Must be 10 digits";
    if (!regForm.password)       e.password = "Password is required";
    else if (regForm.password.length < 6) e.password = "Min 6 characters";
    return e;
  };

  const handleRegister = async () => {
    const errs = validateReg();
    if (Object.keys(errs).length) { setRegErrors(errs); return; }
    try {
      await api.auth.register({
        name: regForm.name.trim(),
        email: regForm.email.trim(),
        phone: regForm.phone.trim(),
        password: regForm.password,
      });
      await loadData();
      toast.success("Student registered!");
      setShowRegister(false);
      setRegForm({ name: "", email: "", phone: "", password: "" });
      setRegErrors({});
    } catch {
      toast.error("Failed to register student");
    }
  };

  const closeReg = () => {
    setShowRegister(false);
    setRegForm({ name: "", email: "", phone: "", password: "" });
    setRegErrors({});
  };

  const handleDeleteStudent = async (student: Student) => {
    const ok = window.confirm(`Delete ${student.name}? This will permanently remove the student and related records.`);
    if (!ok) return;
    setDeletingId(student.id);
    try {
      await api.students.delete(student.id);
      setStudents(prev => prev.filter(s => s.id !== student.id));
      toast.success("Student deleted");
    } catch {
      toast.error("Failed to delete student");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedIds(prev => prev.filter(id => !visibleIds.includes(id)));
      return;
    }
    setSelectedIds(prev => Array.from(new Set([...prev, ...visibleIds])));
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const ok = window.confirm(`Delete ${selectedIds.length} selected student(s)? This will permanently remove their records from the database.`);
    if (!ok) return;

    setBulkDeleting(true);
    try {
      const res = await api.students.bulkDelete(selectedIds);
      setStudents(prev => prev.filter(s => !selectedIds.includes(s.id)));
      setSelectedIds([]);
      toast.success(`Deleted ${res.deleted_count} student(s)`);
    } catch {
      toast.error("Failed to bulk delete students");
    } finally {
      setBulkDeleting(false);
    }
  };

  // -- Stat cards -------------------------------------------------------------
  const STAT_CARDS = [
    { value: filtered.length, label: "Showing",        sub: `of ${students.length} students`, icon: Users,        iconBg: "#2F45D8" },
    { value: statEnrolled,    label: "Enrolled",        sub: "in view",                        icon: BookOpen,     iconBg: "#E1E8FF" },
    { value: statCerts,       label: "Has Certificate", sub: "in view",                        icon: Award,        iconBg: "#E1E8FF" },
    { value: statNotStart,    label: "Not Started",     sub: "in view",                        icon: GraduationCap, iconBg: "#2F45D8" },
  ];

  // -- Table header helper ----------------------------------------------------
  const TH = ({ label, field }: { label: string; field?: SortKey }) => (
    <th
      onClick={field ? () => handleSort(field) : undefined}
      style={{ textAlign: "left", padding: "11px 16px", fontSize: "11px", fontWeight: 700, color: "rgba(17,19,34,0.35)", textTransform: "uppercase" as const, letterSpacing: "0.07em", cursor: field ? "pointer" : "default", userSelect: "none" as const, whiteSpace: "nowrap" as const }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
        {label}{field && <SortIcon field={field} />}
      </span>
    </th>
  );

  // -------------------------------------------------------------------------
  return (
    <div style={{ padding: "28px 24px", maxWidth: "1280px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
        <div>
          <h1 style={{ color: "#111322", fontWeight: 800, fontSize: "28px", margin: "0 0 4px" }}>Students</h1>
          <p style={{ color: "rgba(17,19,34,0.45)", fontSize: "14px", margin: 0 }}>{students.length} registered users</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "0 16px", height: "44px", background: bulkDeleting ? "rgba(185,28,28,0.5)" : "#B91C1C", color: "#FFFFFF", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: 700, cursor: bulkDeleting ? "not-allowed" : "pointer", flexShrink: 0 }}
            >
              Delete Selected ({selectedIds.length})
            </button>
          )}
          <button
            onClick={() => setShowRegister(true)}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "0 20px", height: "44px", background: "linear-gradient(135deg,#2F45D8,#2336B8)", color: "#FFFFFF", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: 700, cursor: "pointer", flexShrink: 0 }}
          >
            <UserPlus size={16} /> Register User
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px" }}>
        {STAT_CARDS.map(({ value, label, sub, icon: Icon, iconBg }) => (
          <div key={label} style={{ background: "rgba(17,19,34,0.03)", border: "1px solid rgba(17,19,34,0.07)", borderRadius: "16px", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={22} color="#111322" />
            </div>
            <div>
              <p style={{ fontSize: "28px", fontWeight: 800, color: "#111322", margin: "0 0 1px", lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#111322", margin: "0 0 1px" }}>{label}</p>
              <p style={{ fontSize: "11px", color: "rgba(17,19,34,0.35)", margin: 0 }}>{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filters toggle */}
      <div style={{ display: "flex", gap: "12px" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={15} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(17,19,34,0.35)", pointerEvents: "none" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, phone, email..."
            style={{ background: "rgba(17,19,34,0.04)", border: "1px solid rgba(17,19,34,0.09)", borderRadius: "12px", color: "#111322", padding: "0 16px 0 42px", height: "44px", width: "100%", fontSize: "14px", outline: "none", boxSizing: "border-box" as const }}
          />
        </div>
        <button
          onClick={() => setShowFilters(v => !v)}
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "0 20px", height: "44px", background: showFilters ? "rgba(47,69,216,0.15)" : "rgba(17,19,34,0.05)", border: `1px solid ${showFilters ? "rgba(47,69,216,0.4)" : "rgba(17,19,34,0.12)"}`, borderRadius: "12px", color: showFilters ? "#2F45D8" : "#111322", fontSize: "14px", fontWeight: 600, cursor: "pointer", flexShrink: 0, transition: "all .15s" }}
        >
          <Filter size={15} /> Filters {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div style={{ background: "rgba(17,19,34,0.02)", border: "1px solid rgba(17,19,34,0.08)", borderRadius: "14px", padding: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
            {([
              { label: "COURSE",      value: fCourse, setter: setFCourse, options: ["All Courses", ...Array.from(new Set(courses.map(c => c.title)))] },
              { label: "CERTIFICATE", value: fCert,   setter: setFCert,   options: ["All", "Has Certificate", "No Certificate"] },
              { label: "ENROLLMENT",  value: fEnroll, setter: setFEnroll, options: ["All", "Enrolled", "Not Enrolled"] },
              { label: "STATUS",      value: fStatus, setter: setFStatus, options: ["All Statuses", "Active", "Inactive", "Not Started"] },
            ] as const).map(({ label, value, setter, options }) => (
              <div key={label}>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "rgba(17,19,34,0.35)", letterSpacing: "0.08em", margin: "0 0 8px" }}>{label}</p>
                <select
                  value={value}
                  onChange={e => (setter as (v: string) => void)(e.target.value)}
                  style={{ width: "100%", background: "rgba(17,19,34,0.06)", border: "1px solid rgba(17,19,34,0.1)", borderRadius: "10px", color: "#111322", padding: "0 12px", height: "40px", fontSize: "13px", outline: "none", cursor: "pointer" }}
                >
                  {options.map(o => <option key={o} value={o} style={{ background: "linear-gradient(135deg,#EEF3FF,#DDE7FF)" }}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ background: "rgba(17,19,34,0.02)", border: "1px solid rgba(17,19,34,0.07)", borderRadius: "16px", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(17,19,34,0.07)" }}>
                <th style={{ width: "42px", textAlign: "center", padding: "11px 8px" }}>
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleSelectAllVisible}
                    aria-label="Select all visible students"
                  />
                </th>
                <TH label="Student"  field="name" />
                <TH label="Contact" />
                <TH label="Courses" />
                <TH label="Progress" field="progress" />
                <TH label="Certs" />
                <TH label="Joined"   field="joined" />
                <th style={{ width: "92px" }} />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "48px 16px", textAlign: "center", color: "rgba(17,19,34,0.3)", fontSize: "14px" }}>
                    No students match your search.
                  </td>
                </tr>
              ) : filtered.map((s, i) => (
                <tr
                  key={s.id}
                  style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(17,19,34,0.05)" : "none", transition: "background .12s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "rgba(17,19,34,0.025)"}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}
                >
                  <td style={{ padding: "14px 8px", textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(s.id)}
                      onChange={() => toggleSelect(s.id)}
                      aria-label={`Select ${s.name}`}
                    />
                  </td>

                  {/* Student */}
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: avatarColor(s.id), display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontWeight: 800, fontSize: "14px", flexShrink: 0 }}>
                        {s.name[0]}
                      </div>
                      <div>
                        <p style={{ color: "#111322", fontWeight: 600, fontSize: "14px", margin: "0 0 3px" }}>{s.name}</p>
                        <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "20px", background: s.status === "active" ? "rgba(106,112,133,0.12)" : s.status === "inactive" ? "rgba(106,112,133,0.12)" : "rgba(47,69,216,0.12)", color: s.status === "active" ? "#111322" : s.status === "inactive" ? "#111322" : "#2F45D8" }}>
                          {s.status === "not_started" ? "Not Started" : s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td style={{ padding: "14px 16px" }}>
                    <p style={{ color: "rgba(17,19,34,0.75)", fontSize: "13px", margin: "0 0 3px", fontWeight: 500 }}>{s.phone}</p>
                    <p style={{ color: "rgba(17,19,34,0.35)", fontSize: "12px", margin: 0, maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.email}</p>
                  </td>

                  {/* Courses */}
                  <td style={{ padding: "14px 16px" }}>
                    {s.courseName ? (
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                          <BookOpen size={12} color="rgba(47,69,216,0.8)" />
                          <p style={{ color: "rgba(17,19,34,0.8)", fontSize: "13px", fontWeight: 500, margin: 0 }}>{s.courseName}</p>
                        </div>
                        <p style={{ color: "rgba(17,19,34,0.35)", fontSize: "11px", margin: 0, paddingLeft: "18px" }}>{s.courseStatus}</p>
                      </div>
                    ) : (
                      <span style={{ color: "rgba(17,19,34,0.25)", fontSize: "13px" }}>None</span>
                    )}
                  </td>

                  {/* Progress */}
                  <td style={{ padding: "14px 16px" }}>
                    {s.enrolled ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ flex: 1, height: "6px", borderRadius: "9999px", background: "rgba(17,19,34,0.08)", minWidth: "80px" }}>
                          <div style={{ height: "100%", borderRadius: "9999px", width: `${s.progress}%`, background: s.progress >= 100 ? "#6F82FF" : "#2F45D8" }} />
                        </div>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: s.progress >= 100 ? "#111322" : "#2F45D8", whiteSpace: "nowrap" }}>{s.progress}%</span>
                      </div>
                    ) : (
                      <span style={{ color: "rgba(17,19,34,0.2)", fontSize: "13px" }}>-</span>
                    )}
                  </td>

                  {/* Certs */}
                  <td style={{ padding: "14px 16px", textAlign: "center" }}>
                    {s.certs > 0 ? (
                      <span style={{ fontSize: "12px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(106,112,133,0.12)", color: "#111322", border: "1px solid rgba(106,112,133,0.3)" }}>{s.certs}</span>
                    ) : (
                      <span style={{ color: "rgba(17,19,34,0.2)", fontSize: "13px" }}>-</span>
                    )}
                  </td>

                  {/* Joined */}
                  <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(17,19,34,0.45)", fontSize: "12px" }}>
                      <Calendar size={12} />
                      {s.joined}
                    </div>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "14px 12px", textAlign: "center" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <Link
                        href={`/admin/students/${s.id}`}
                        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "30px", height: "30px", borderRadius: "8px", color: "rgba(17,19,34,0.3)", border: "1px solid rgba(17,19,34,0.08)", textDecoration: "none", transition: "all .15s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#2F45D8"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(47,69,216,0.4)"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(47,69,216,0.1)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(17,19,34,0.3)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(17,19,34,0.08)"; (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
                      >
                        <ExternalLink size={13} />
                      </Link>
                      <button
                        onClick={() => handleDeleteStudent(s)}
                        disabled={deletingId === s.id}
                        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "30px", height: "30px", borderRadius: "8px", color: deletingId === s.id ? "rgba(185,28,28,0.35)" : "rgba(185,28,28,0.75)", border: "1px solid rgba(185,28,28,0.25)", background: deletingId === s.id ? "rgba(185,28,28,0.05)" : "transparent", cursor: deletingId === s.id ? "not-allowed" : "pointer", transition: "all .15s" }}
                        title="Delete student"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Modal */}
      {showRegister && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(17,19,34,0.65)", backdropFilter: "blur(6px)", padding: "16px" }}>
          <div style={{ background: "linear-gradient(135deg,#EEF3FF,#DDE7FF)", border: "1px solid rgba(17,19,34,0.1)", borderRadius: "20px", padding: "28px", maxWidth: "420px", width: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ color: "#111322", fontWeight: 700, fontSize: "17px", margin: "0 0 3px" }}>Register New Student</h3>
                <p style={{ color: "rgba(17,19,34,0.4)", fontSize: "13px", margin: 0 }}>Create a new student account</p>
              </div>
              <button onClick={closeReg} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(17,19,34,0.4)", display: "flex", padding: "4px" }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {([["Full Name", "name", "text"], ["Email Address", "email", "email"], ["Phone Number (10 digits)", "phone", "tel"], ["Temporary Password", "password", "password"]] as const).map(([label, key, type]) => (
                <div key={key}>
                  <label style={{ fontSize: "12px", color: "rgba(17,19,34,0.5)", marginBottom: "6px", display: "block" }}>{label}</label>
                  <input
                    type={type}
                    value={regForm[key]}
                    onChange={e => { setRegForm(f => ({ ...f, [key]: e.target.value })); setRegErrors(r => { const n = { ...r }; delete n[key]; return n; }); }}
                    style={{ background: "rgba(17,19,34,0.05)", border: `1px solid ${regErrors[key] ? "rgba(47,69,216,0.5)" : "rgba(17,19,34,0.1)"}`, borderRadius: "10px", color: "#111322", padding: "0 14px", height: "42px", width: "100%", fontSize: "14px", outline: "none", boxSizing: "border-box" as const }}
                  />
                  {regErrors[key] && <p style={{ fontSize: "12px", color: "#2F45D8", margin: "4px 0 0" }}>{regErrors[key]}</p>}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={closeReg} style={{ flex: 1, height: "42px", borderRadius: "12px", background: "rgba(17,19,34,0.05)", border: "1px solid rgba(17,19,34,0.12)", color: "#111322", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleRegister} style={{ flex: 1, height: "42px", borderRadius: "12px", background: "linear-gradient(135deg,#2F45D8,#2336B8)", border: "none", color: "#FFFFFF", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>Register</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
