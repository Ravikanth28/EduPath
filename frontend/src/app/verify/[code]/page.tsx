"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, CheckCircle, XCircle, Clock, AlertCircle, User, BookOpen, Calendar, Hash, Loader2, ExternalLink } from "lucide-react";

type Status = "loading" | "verified" | "pending" | "revoked" | "not_found";

const MOCK: Record<string, { status: Status; name: string; course: string; issued: string; id: string; reason?: string }> = {
  "CERT-DEMO-001": { status: "verified", name: "Arjun Sharma", course: "Physics Mechanics", issued: "March 15, 2026", id: "CERT-DEMO-001" },
  "CERT-DEMO-002": { status: "pending", name: "Priya Nair", course: "Engineering Mathematics", issued: "April 1, 2026", id: "CERT-DEMO-002" },
  "CERT-DEMO-003": { status: "revoked", name: "John Doe", course: "Chemistry Fundamentals", issued: "January 20, 2026", id: "CERT-DEMO-003", reason: "Academic misconduct" },
};

export default function VerifyPage({ params }: { params: { code: string } }) {
  const [status, setStatus] = useState<Status>("loading");
  const [data, setData] = useState<typeof MOCK[string] | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const found = MOCK[params.code];
      if (found) { setData(found); setStatus(found.status); }
      else setStatus("not_found");
    }, 1500);
    return () => clearTimeout(timer);
  }, [params.code]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative" style={{ background: "linear-gradient(135deg,#14218C 0%,#243AD1 45%,#5368F0 100%)" }}>
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-1/3 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "transparent" }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#2F45D8,#2336B8)" }}>
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="font-bold text-white">EduPath</span>
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 border border-purple-600/30 bg-purple-600/10 text-purple-400">
            Certificate Verification
          </div>
          <h1 className="text-2xl font-bold text-white">Verify Certificate</h1>
          <p className="text-sm text-white/50 mt-1">Check the authenticity of an AI-DS Academy certificate.</p>
        </div>

        {/* Result card */}
        {status === "loading" && (
          <div className="glass-card p-8 text-center">
            <Loader2 size={32} className="text-purple-400 animate-spin-slow mx-auto mb-4" />
            <p className="text-white/60">Verifying certificate...</p>
            <p className="text-xs text-white/30 mt-1 font-mono">{params.code}</p>
          </div>
        )}

        {status === "not_found" && (
          <div className="glass-card p-8 text-center border border-red-500/20">
            <XCircle size={40} className="text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Certificate Not Found</h2>
            <p className="text-sm text-white/50">No certificate matching <span className="font-mono text-white/70">{params.code}</span> was found in our records.</p>
            <Link href="/" className="btn-secondary mt-6 inline-block px-6 py-2 text-sm">Go Home</Link>
          </div>
        )}

        {(status === "verified" || status === "pending" || status === "revoked") && data && (
          <div className={`glass-card overflow-hidden border ${status === "verified" ? "border-green-500/20" : status === "pending" ? "border-amber-500/20" : "border-red-500/20"}`}>
            {/* Status banner */}
            <div className={`px-5 py-3 flex items-center gap-3 ${status === "verified" ? "bg-green-500/10" : status === "pending" ? "bg-amber-500/10" : "bg-red-500/10"}`}>
              {status === "verified" && <><CheckCircle size={18} className="text-green-400" /><span className="text-green-400 font-semibold">Certificate Verified</span></>}
              {status === "pending" && <><Clock size={18} className="text-amber-400" /><span className="text-amber-400 font-semibold">Pending Verification</span></>}
              {status === "revoked" && <><XCircle size={18} className="text-red-400" /><span className="text-red-400 font-semibold">Certificate Revoked</span></>}
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <User size={16} className="text-white/40 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider">Student Name</p>
                  <p className="text-white font-semibold">{data.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BookOpen size={16} className="text-white/40 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider">Course Completed</p>
                  <p className="text-white">{data.course}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar size={16} className="text-white/40 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider">Issued Date</p>
                  <p className="text-white">{data.issued}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Hash size={16} className="text-white/40 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider">Certificate ID</p>
                  <p className="text-white font-mono text-sm">{data.id}</p>
                </div>
              </div>
              {status === "revoked" && data.reason && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-red-400/70 uppercase tracking-wider">Revocation Reason</p>
                    <p className="text-red-400 text-sm">{data.reason}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
