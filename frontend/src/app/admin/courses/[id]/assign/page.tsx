"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Search, UserPlus, Loader2, CheckCircle2, Users } from "lucide-react";
import toast from "react-hot-toast";
import { api, type Course, type Student, type CourseEnrollmentItem } from "@/lib/api";

const BG = "transparent";
const CARD = "linear-gradient(180deg, rgba(238,243,255,0.98), rgba(225,232,255,0.94))";
const BORDER = "rgba(17,19,34,0.08)";

export default function CourseAssignPage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollmentItem[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const loadData = async () => {
    const [c, allStudents, enrolled] = await Promise.all([
      api.courses.get(id as string),
      api.students.list(),
      api.admin.courseEnrollments(id as string),
    ]);
    setCourse(c);
    setStudents(allStudents);
    setEnrollments(enrolled.items);
  };

  useEffect(() => {
    loadData().catch(() => toast.error("Failed to load assign screen")).finally(() => setLoading(false));
  }, [id]);

  const enrolledStudentIds = useMemo(() => new Set(enrollments.map(item => item.student_id)), [enrollments]);

  const visibleStudents = useMemo(() => {
    const q = studentSearch.trim().toLowerCase();
    if (!q) return students;
    return students.filter(s => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
  }, [studentSearch, students]);

  const toggleStudent = (studentId: string) => {
    if (enrolledStudentIds.has(studentId)) return;
    setSelectedStudentIds(current =>
      current.includes(studentId)
        ? current.filter(idItem => idItem !== studentId)
        : [...current, studentId]
    );
  };

  const handleAssign = async () => {
    if (!selectedStudentIds.length) {
      toast.error("Select at least one student");
      return;
    }
    setAssigning(true);
    try {
      const result = await api.admin.assignStudentsToCourse(id as string, selectedStudentIds);
      await loadData();
      setSelectedStudentIds([]);
      toast.success(`Assigned ${result.assigned_count} student(s)`);
    } catch {
      toast.error("Failed to assign students");
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "36px", height: "36px", border: "3px solid rgba(124,58,237,0.2)", borderTopColor: "#7C3AED", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={{ background: BG, padding: "28px 24px" }}>
      <div style={{ maxWidth: "980px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/admin/courses" style={{ width: "36px", height: "36px", borderRadius: "10px", border: "1px solid rgba(17,19,34,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(17,19,34,0.55)", textDecoration: "none", flexShrink: 0 }}>
            <ArrowLeft size={16} />
          </Link>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ color: "#111322", fontWeight: 800, fontSize: "30px", margin: 0, lineHeight: 1.15 }}>{course?.title ?? "Course"}</h1>
            <p style={{ color: "rgba(17,19,34,0.45)", margin: "5px 0 0", fontSize: "13px" }}>Assign students to this course directly from this screen.</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
          <span style={{ border: "1px solid rgba(124,58,237,0.45)", background: "rgba(124,58,237,0.18)", color: "#C4B5FD", borderRadius: "10px", padding: "9px 14px", fontWeight: 700, fontSize: "13px" }}>Assign</span>
          <Link href={`/admin/courses/${id}/status`} style={{ border: "1px solid rgba(17,19,34,0.14)", background: "rgba(17,19,34,0.03)", color: "rgba(17,19,34,0.72)", borderRadius: "10px", padding: "9px 14px", fontWeight: 700, fontSize: "13px", textDecoration: "none" }}>Status</Link>
        </div>

        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "16px" }}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
            <div style={{ position: "relative", flex: 1 }}>
                <Search size={14} style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", color: "rgba(17,19,34,0.35)" }} />
              <input
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
                placeholder="Search registered students by name or email"
                style={{ width: "100%", height: "42px", borderRadius: "10px", border: "1px solid rgba(17,19,34,0.12)", background: "rgba(17,19,34,0.03)", color: "#111322", padding: "0 14px 0 34px", outline: "none", boxSizing: "border-box", fontSize: "13px" }}
              />
            </div>
            <button
              onClick={handleAssign}
              disabled={assigning || selectedStudentIds.length === 0}
              style={{
                height: "42px",
                display: "flex",
                alignItems: "center",
                gap: "7px",
                borderRadius: "10px",
                border: "none",
                padding: "0 16px",
                background: "linear-gradient(135deg,#7C3AED,#6D28D9)",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 700,
                cursor: assigning || selectedStudentIds.length === 0 ? "not-allowed" : "pointer",
                opacity: assigning || selectedStudentIds.length === 0 ? 0.55 : 1,
              }}
            >
              {assigning ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <UserPlus size={14} />} Assign Selected
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <p style={{ margin: 0, color: "rgba(17,19,34,0.42)", fontSize: "12px" }}>Registered students</p>
            <p style={{ margin: 0, color: "rgba(17,19,34,0.42)", fontSize: "12px" }}>{enrollments.length} currently enrolled</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: "10px" }}>
            {visibleStudents.map(student => {
              const alreadyEnrolled = enrolledStudentIds.has(student.id);
              const selected = selectedStudentIds.includes(student.id);
              return (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => toggleStudent(student.id)}
                  style={{
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    borderRadius: "11px",
                    border: `1px solid ${selected ? "rgba(124,58,237,0.5)" : "rgba(17,19,34,0.12)"}`,
                    background: selected ? "rgba(124,58,237,0.17)" : "rgba(17,19,34,0.02)",
                    padding: "10px 12px",
                    cursor: alreadyEnrolled ? "default" : "pointer",
                    opacity: alreadyEnrolled ? 0.72 : 1,
                  }}
                >
                  <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "rgba(124,58,237,0.2)", color: "#DDD6FE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 800, flexShrink: 0 }}>
                    {student.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: "#111322", fontSize: "13px", fontWeight: 700, margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{student.name}</p>
                    <p style={{ color: "rgba(17,19,34,0.45)", fontSize: "11px", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{student.email}</p>
                  </div>
                  {alreadyEnrolled ? (
                    <span style={{ fontSize: "10px", fontWeight: 700, borderRadius: "999px", padding: "3px 8px", background: "rgba(16,185,129,0.16)", color: "#6EE7B7", border: "1px solid rgba(16,185,129,0.32)", flexShrink: 0, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <CheckCircle2 size={11} /> Enrolled
                    </span>
                  ) : (
                    <span style={{ width: "18px", height: "18px", borderRadius: "5px", border: `1px solid ${selected ? "rgba(124,58,237,0.65)" : "rgba(17,19,34,0.22)"}`, background: selected ? "rgba(124,58,237,0.45)" : "transparent", flexShrink: 0 }} />
                  )}
                </button>
              );
            })}
          </div>

          {visibleStudents.length === 0 && (
            <div style={{ textAlign: "center", color: "rgba(17,19,34,0.35)", padding: "30px 12px", fontSize: "13px" }}>
              <Users size={16} style={{ marginBottom: "6px" }} />
              No registered students found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
