"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Award, BookOpen, Clock, GraduationCap } from "lucide-react";
import { api, type Certificate, type Student } from "@/lib/api";

export default function StudentDetailPage() {
  const params = useParams<{ id: string }>();
  const studentId = params?.id as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    Promise.all([
      api.students.get(studentId),
      api.certificates.list(),
    ])
      .then(([s, certs]) => {
        setStudent(s);
        setCertificates(certs.filter(c => c.student === s.name));
      })
      .catch(() => {
        setStudent(null);
        setCertificates([]);
      })
      .finally(() => setLoading(false));
  }, [studentId]);

  const statusLabel = useMemo(() => {
    if (!student) return "-";
    return student.enrolled_courses.length > 0 ? "active" : "not_started";
  }, [student]);

  if (loading) {
    return <div className="p-6 max-w-4xl mx-auto text-slate-600">Loading student...</div>;
  }

  if (!student) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <Link href="/admin/students" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft size={16} /> Back to Students
        </Link>
        <div className="glass-card p-6 text-slate-700">Student not found.</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/students" className="p-2 rounded-lg hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-slate-900 text-lg">{student.name}</h1>
          <p className="text-xs text-slate-600">{student.phone} - {student.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Courses", value: student.enrolled_courses.length, icon: GraduationCap, color: "text-purple-400" },
          { label: "Certificates", value: student.certificates.length, icon: Award, color: "text-amber-400" },
          { label: "Status", value: statusLabel, icon: BookOpen, color: "text-green-400" },
          { label: "Joined", value: student.joined, icon: Clock, color: "text-cyan-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card p-4 flex items-center gap-3">
            <Icon size={18} className={color} />
            <div>
              <p className="text-sm font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-600">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-5">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><Award size={16} className="text-amber-500" /> Certificates</h3>
        {certificates.length === 0 ? (
          <p className="text-sm text-slate-600">No certificates yet.</p>
        ) : (
          <div className="space-y-2">
            {certificates.map(cert => (
              <div key={cert.id} className="flex items-center gap-3 py-2 border-b border-slate-200 last:border-0">
                <div className="flex-1">
                  <p className="text-sm text-slate-900">{cert.course}</p>
                  <p className="text-xs text-slate-600">{cert.id} - Issued {cert.issued}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full badge-green">{cert.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
