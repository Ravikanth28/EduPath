"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Edit2, Save, X, BookOpen, Award, GraduationCap, CheckCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";

const STUDENT = {
  id: "1", name: "Arjun Sharma", phone: "9876543210", email: "arjun@example.com",
  certs: 1, courses: 2, joined: "Mar 10, 2026", status: "active",
  certificates: [
    { id: "CERT-001", course: "Engineering Mathematics", issued: "Apr 20, 2026", status: "verified" },
  ],
  enrollments: [
    {
      courseId: "1", courseName: "Engineering Mathematics", progress: 72, enrolled: "Mar 12, 2026",
      modules: [
        { num: 1, title: "Limits & Derivatives", videosDone: 3, videosTotal: 3, testScore: 85, testDone: true },
        { num: 2, title: "Integration Techniques", videosDone: 3, videosTotal: 3, testScore: 70, testDone: true },
        { num: 3, title: "Differential Equations", videosDone: 1, videosTotal: 2, testScore: null, testDone: false },
      ],
    },
    {
      courseId: "2", courseName: "Physics Mechanics", progress: 40, enrolled: "Apr 1, 2026",
      modules: [
        { num: 1, title: "Newton's Laws of Motion", videosDone: 3, videosTotal: 3, testScore: 80, testDone: true },
        { num: 2, title: "Work, Energy & Power", videosDone: 0, videosTotal: 3, testScore: null, testDone: false },
      ],
    },
  ],
};

export default function StudentDetailPage() {
  const params = useParams();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: STUDENT.name, phone: STUDENT.phone, email: STUDENT.email, password: "" });
  const [expanded, setExpanded] = useState<string | null>("1");

  const handleSave = () => { toast.success("Student updated!"); setEditing(false); };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/students" className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-white text-lg">{STUDENT.name}</h1>
          <p className="text-xs text-white/40">{STUDENT.phone} - {STUDENT.email}</p>
        </div>
        <button onClick={() => editing ? handleSave() : setEditing(true)} className={editing ? "btn-primary flex items-center gap-2 px-4 py-2 text-sm" : "btn-secondary flex items-center gap-2 px-4 py-2 text-sm"}>
          {editing ? <><Save size={14} /> Save</> : <><Edit2 size={14} /> Edit</>}
        </button>
        {editing && (
          <button onClick={() => setEditing(false)} className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Courses", value: STUDENT.courses, icon: GraduationCap, color: "text-purple-400" },
          { label: "Certificates", value: STUDENT.certs, icon: Award, color: "text-amber-400" },
          { label: "Status", value: STUDENT.status, icon: BookOpen, color: "text-green-400" },
          { label: "Joined", value: STUDENT.joined, icon: Clock, color: "text-cyan-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card p-4 flex items-center gap-3">
            <Icon size={18} className={color} />
            <div><p className="text-sm font-bold text-white">{value}</p><p className="text-xs text-white/50">{label}</p></div>
          </div>
        ))}
      </div>

      {/* Edit form */}
      {editing && (
        <div className="glass-card p-5 space-y-4 red-border">
          <h3 className="font-semibold text-white text-sm">Edit Student Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[["Full Name", "name", "text"], ["Phone Number", "phone", "tel"], ["Email", "email", "email"], ["New Password", "password", "password"]].map(([label, key, type]) => (
              <div key={key as string}>
                <label className="text-xs text-white/40 mb-1 block">{label as string}</label>
                <input type={type as string} value={(form as Record<string, string>)[key as string]} onChange={e => setForm(f => ({ ...f, [key as string]: e.target.value }))} className="input-field" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificates */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Award size={16} className="text-amber-400" /> Certificates</h3>
        {STUDENT.certificates.length === 0 ? (
          <p className="text-sm text-white/40">No certificates yet.</p>
        ) : (
          <div className="space-y-2">
            {STUDENT.certificates.map(cert => (
              <div key={cert.id} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
                <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-white">{cert.course}</p>
                  <p className="text-xs text-white/40">{cert.id} - Issued {cert.issued}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${cert.status === "verified" ? "badge-green" : "badge-amber"}`}>{cert.status}</span>
                <Link href={`/admin/certificates`} className="text-xs text-purple-400 hover:text-purple-300">Manage</Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enrollment details */}
      <div className="space-y-3">
        <h3 className="font-semibold text-white flex items-center gap-2"><BookOpen size={16} className="text-purple-400" /> Course Enrollments</h3>
        {STUDENT.enrollments.map(en => (
          <div key={en.courseId} className="glass-card overflow-hidden">
            <button
              onClick={() => setExpanded(e => e === en.courseId ? null : en.courseId)}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors text-left"
            >
              <div className="flex-1">
                <p className="font-medium text-white">{en.courseName}</p>
                <p className="text-xs text-white/40 mt-0.5">Enrolled {en.enrolled}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-red-500" style={{ width: `${en.progress}%` }} />
                  </div>
                  <span className="text-xs text-white/60">{en.progress}%</span>
                </div>
              </div>
            </button>
            {expanded === en.courseId && (
              <div className="border-t border-white/[0.06] px-5 py-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        <th className="text-left py-2 text-xs text-white/40 font-semibold">Module</th>
                        <th className="text-center py-2 text-xs text-white/40 font-semibold">Videos</th>
                        <th className="text-center py-2 text-xs text-white/40 font-semibold">Test</th>
                        <th className="text-center py-2 text-xs text-white/40 font-semibold">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {en.modules.map(mod => (
                        <tr key={mod.num} className="border-b border-white/[0.04] last:border-0">
                          <td className="py-3 text-white/80 pr-4">M{mod.num}: {mod.title}</td>
                          <td className="py-3 text-center">
                            <span className="text-xs text-white/60">{mod.videosDone}/{mod.videosTotal}</span>
                          </td>
                          <td className="py-3 text-center">
                            {mod.testDone ? <CheckCircle size={14} className="text-green-400 mx-auto" /> : <span className="text-xs text-white/30">-</span>}
                          </td>
                          <td className="py-3 text-center">
                            {mod.testScore !== null ? (
                              <span className={`text-xs font-bold ${mod.testScore >= 70 ? "text-green-400" : "text-red-400"}`}>{mod.testScore}%</span>
                            ) : (
                              <span className="text-xs text-white/30">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
