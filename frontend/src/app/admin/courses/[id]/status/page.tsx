"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";
import toast from "react-hot-toast";
import { api, type Course, type CourseEnrollmentItem } from "@/lib/api";

const BG = "transparent";
const CARD = "linear-gradient(180deg, rgba(238,243,255,0.98), rgba(225,232,255,0.94))";
const BORDER = "rgba(17,19,34,0.08)";

type Status = CourseEnrollmentItem["status"];

function formatDateTime(value: string | null): string {
  if (!value) return "-";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "-";
  return dt.toLocaleString();
}

function statusMeta(status: Status) {
  if (status === "completed") {
    return {
      label: "Completed",
      bg: "rgba(16,185,129,0.18)",
      color: "#6EE7B7",
      border: "rgba(16,185,129,0.38)",
    };
  }
  if (status === "in_progress") {
    return {
      label: "In Progress",
      bg: "rgba(59,130,246,0.18)",
      color: "#93C5FD",
      border: "rgba(59,130,246,0.38)",
    };
  }
  return {
    label: "Assigned",
    bg: "rgba(245,158,11,0.18)",
    color: "#FCD34D",
    border: "rgba(245,158,11,0.38)",
  };
}

export default function CourseStatusPage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<CourseEnrollmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.courses.get(id as string),
      api.admin.courseEnrollments(id as string),
    ])
      .then(([c, data]) => {
        setCourse(c);
        setEnrollments(data.items);
      })
      .catch(() => toast.error("Failed to load status screen"))
      .finally(() => setLoading(false));
  }, [id]);

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
          <Link href="/admin/courses" style={{ width: "36px", height: "36px", borderRadius: "10px", border: "1px solid rgba(17,19,34,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(17,19,34,0.6)", textDecoration: "none", flexShrink: 0 }}>
            <ArrowLeft size={16} />
          </Link>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ color: "#111322", fontWeight: 800, fontSize: "30px", margin: 0, lineHeight: 1.15 }}>{course?.title ?? "Course"}</h1>
            <p style={{ color: "rgba(17,19,34,0.45)", margin: "5px 0 0", fontSize: "13px" }}>Live progress and status for enrolled students.</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
          <Link href={`/admin/courses/${id}/assign`} style={{ border: "1px solid rgba(17,19,34,0.14)", background: "rgba(17,19,34,0.03)", color: "rgba(17,19,34,0.72)", borderRadius: "10px", padding: "9px 14px", fontWeight: 700, fontSize: "13px", textDecoration: "none" }}>Assign</Link>
          <span style={{ border: "1px solid rgba(124,58,237,0.45)", background: "rgba(124,58,237,0.18)", color: "#C4B5FD", borderRadius: "10px", padding: "9px 14px", fontWeight: 700, fontSize: "13px" }}>Status</span>
        </div>

        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <p style={{ margin: 0, color: "#111322", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}><Users size={15} /> Enrolled Students</p>
            <span style={{ color: "rgba(17,19,34,0.45)", fontSize: "12px" }}>{enrollments.length} total</span>
          </div>

          {enrollments.length === 0 ? (
              <div style={{ textAlign: "center", color: "rgba(17,19,34,0.35)", padding: "24px 12px", fontSize: "13px" }}>
              No students enrolled in this course yet.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {enrollments.map(item => {
                const m = statusMeta(item.status);
                return (
                  <div key={item.student_id} style={{ border: "1px solid rgba(17,19,34,0.1)", background: "rgba(17,19,34,0.02)", borderRadius: "11px", padding: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", marginBottom: "8px" }}>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ color: "#111322", fontSize: "13px", fontWeight: 700, margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.student_name}</p>
                        <p style={{ color: "rgba(17,19,34,0.45)", fontSize: "11px", margin: 0 }}>{item.email}</p>
                      </div>
                      <span style={{ fontSize: "10px", fontWeight: 700, borderRadius: "999px", padding: "3px 8px", background: m.bg, color: m.color, border: `1px solid ${m.border}`, flexShrink: 0 }}>
                        {m.label}
                      </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: "8px", marginBottom: "8px" }}>
                      <div style={{ background: "rgba(17,19,34,0.03)", borderRadius: "8px", padding: "7px 8px" }}>
                        <p style={{ margin: "0 0 2px", color: "rgba(17,19,34,0.45)", fontSize: "10px" }}>Progress</p>
                        <p style={{ margin: 0, color: "#111322", fontSize: "12px", fontWeight: 700 }}>{item.progress}%</p>
                      </div>
                      <div style={{ background: "rgba(17,19,34,0.03)", borderRadius: "8px", padding: "7px 8px" }}>
                        <p style={{ margin: "0 0 2px", color: "rgba(17,19,34,0.45)", fontSize: "10px" }}>Modules</p>
                        <p style={{ margin: 0, color: "#111322", fontSize: "12px", fontWeight: 700 }}>{item.completed_modules}/{item.total_modules}</p>
                      </div>
                      <div style={{ background: "rgba(17,19,34,0.03)", borderRadius: "8px", padding: "7px 8px" }}>
                        <p style={{ margin: "0 0 2px", color: "rgba(17,19,34,0.45)", fontSize: "10px" }}>Enrolled At</p>
                        <p style={{ margin: 0, color: "#111322", fontSize: "11px", fontWeight: 600 }}>{formatDateTime(item.enrolled_at)}</p>
                      </div>
                      <div style={{ background: "rgba(17,19,34,0.03)", borderRadius: "8px", padding: "7px 8px" }}>
                        <p style={{ margin: "0 0 2px", color: "rgba(17,19,34,0.45)", fontSize: "10px" }}>Last Activity</p>
                        <p style={{ margin: 0, color: "#111322", fontSize: "11px", fontWeight: 600 }}>{formatDateTime(item.last_activity_at)}</p>
                      </div>
                    </div>

                    <div style={{ height: "6px", borderRadius: "999px", overflow: "hidden", background: "rgba(17,19,34,0.12)" }}>
                      <div style={{ width: `${item.progress}%`, height: "100%", background: item.progress >= 100 ? "linear-gradient(90deg,#10B981,#34D399)" : "linear-gradient(90deg,#7C3AED,#A78BFA)" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
