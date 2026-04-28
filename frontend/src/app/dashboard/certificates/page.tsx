"use client";
import { useState } from "react";
import Link from "next/link";
import { Trophy, CheckCircle, Clock, XCircle, Eye, EyeOff, Award, Download } from "lucide-react";
import { CertificateCard } from "@/components/student/CertificateCard";

const CERTS = [
  {
    id: "CERT-DEMO-001",
    course: "Physics Mechanics",
    category: "Physics",
    issued: "March 15, 2026",
    status: "verified" as "verified" | "pending" | "revoked",
    grad: "#E1E8FF",
    accent: "#7E8498",
    accentDim: "rgba(126,132,152,0.12)",
    accentBorder: "rgba(126,132,152,0.3)",
  },
  {
    id: "CERT-DEMO-004",
    course: "Engineering Mathematics",
    category: "Mathematics",
    issued: "April 20, 2026",
    status: "pending" as "verified" | "pending" | "revoked",
    grad: "#2F45D8",
    accent: "#2F45D8",
    accentDim: "rgba(47,69,216,0.12)",
    accentBorder: "rgba(47,69,216,0.3)",
  },
];

const STATUS_MAP = {
  verified: { label: "Verified",  color: "#111322", bg: "rgba(106,112,133,0.12)", border: "rgba(106,112,133,0.3)", icon: <CheckCircle size={11} /> },
  pending:  { label: "Pending",   color: "#111322", bg: "rgba(106,112,133,0.12)", border: "rgba(106,112,133,0.3)",  icon: <Clock size={11} /> },
  revoked:  { label: "Revoked",   color: "#2F45D8", bg: "rgba(47,69,216,0.12)",  border: "rgba(47,69,216,0.3)",   icon: <XCircle size={11} /> },
};

export default function CertificatesPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div style={{ padding: "28px 24px", maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* -- Trophy header -- */}
      <div style={{ background: "linear-gradient(180deg,rgba(238,243,255,0.98),rgba(225,232,255,0.94))", border: "1px solid rgba(106,112,133,0.25)", borderRadius: "20px", padding: "24px 28px", display: "flex", alignItems: "center", gap: "20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "transparent", opacity: 0.07, pointerEvents: "none" }} />
        <div style={{ width: "60px", height: "60px", borderRadius: "18px", background: "rgba(106,112,133,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative", zIndex: 1, boxShadow: "0 0 0 1px rgba(106,112,133,0.25)" }}>
          <Trophy size={30} style={{ color: "#111322" }} />
        </div>
        <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
          <h1 style={{ color: "#111322", fontWeight: 800, fontSize: "22px", margin: "0 0 5px" }}>My Certificates</h1>
          <p style={{ color: "rgba(17,19,34,0.42)", fontSize: "13px", margin: 0 }}>Hall of Achievement - {CERTS.length} certificate{CERTS.length !== 1 ? "s" : ""} earned</p>
        </div>
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", flexShrink: 0, paddingLeft: "20px", borderLeft: "1px solid rgba(106,112,133,0.2)" }}>
          <p style={{ fontSize: "44px", fontWeight: 900, color: "#111322", margin: 0, lineHeight: 1 }}>{CERTS.length}</p>
          <p style={{ fontSize: "11px", color: "rgba(17,19,34,0.38)", margin: "4px 0 0", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total</p>
        </div>
      </div>

      {/* -- Empty state -- */}
      {CERTS.length === 0 ? (
        <div style={{ background: "rgba(17,19,34,0.03)", border: "1px solid rgba(17,19,34,0.07)", borderRadius: "16px", padding: "56px 24px", textAlign: "center" }}>
          <div style={{ width: "68px", height: "68px", borderRadius: "50%", border: "2px dashed rgba(17,19,34,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Trophy size={26} style={{ color: "rgba(17,19,34,0.18)" }} />
          </div>
          <p style={{ color: "rgba(17,19,34,0.5)", fontWeight: 700, fontSize: "16px", margin: "0 0 8px" }}>No certificates yet</p>
          <p style={{ fontSize: "13px", color: "rgba(17,19,34,0.3)", margin: "0 0 24px" }}>Complete a course and pass all module tests to earn a certificate.</p>
          <Link href="/dashboard/courses" className="btn-primary" style={{ display: "inline-block", padding: "11px 28px", fontSize: "14px", textDecoration: "none" }}>Explore Courses</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
          {CERTS.map(c => {
            const st = STATUS_MAP[c.status];
            const isOpen = expanded === c.id;
            return (
              <div key={c.id} style={{ background: "rgba(17,19,34,0.03)", border: `1px solid ${isOpen ? c.accentBorder : "rgba(17,19,34,0.08)"}`, borderRadius: "18px", overflow: "hidden", transition: "border-color .2s, box-shadow .2s", boxShadow: isOpen ? `0 8px 32px ${c.accent}20` : "none" }}>

                {/* Gradient top bar */}
                <div style={{ height: "5px", background: c.grad }} />

                {/* Certificate body */}
                <div style={{ padding: "20px 22px" }}>

                  {/* Top row: award icon + status badges */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: c.accentDim, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Award size={18} style={{ color: c.accent }} />
                    </div>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(106,112,133,0.12)", color: "#111322", border: "1px solid rgba(106,112,133,0.25)" }}>
                        Certificate
                      </span>
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: st.bg, color: st.color, border: `1px solid ${st.border}`, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        {st.icon} {st.label}
                      </span>
                    </div>
                  </div>

                  {/* Course name */}
                  <h3 style={{ color: "#111322", fontWeight: 800, fontSize: "18px", margin: "0 0 10px", lineHeight: 1.2 }}>{c.course}</h3>

                  {/* Category badge */}
                  <span style={{ display: "inline-block", fontSize: "11px", fontWeight: 700, padding: "3px 12px", borderRadius: "20px", background: c.accentDim, color: c.accent, border: `1px solid ${c.accentBorder}`, marginBottom: "14px" }}>
                    {c.category}
                  </span>

                  {/* Issued date + cert ID */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px", padding: "12px 14px", borderRadius: "10px", background: "rgba(17,19,34,0.02)", border: "1px solid rgba(17,19,34,0.05)", marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "11px", color: "rgba(17,19,34,0.38)", width: "56px", flexShrink: 0 }}>Issued</span>
                      <span style={{ fontSize: "13px", color: "rgba(17,19,34,0.8)", fontWeight: 500 }}>{c.issued}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "11px", color: "rgba(17,19,34,0.38)", width: "56px", flexShrink: 0 }}>Cert ID</span>
                      <span style={{ fontSize: "12px", color: "rgba(17,19,34,0.6)", fontFamily: "monospace" }}>#{c.id.slice(-8)}</span>
                    </div>
                  </div>

                  {/* View / Hide button */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : c.id)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "12px", borderRadius: "12px", fontSize: "14px", fontWeight: 700, cursor: "pointer", border: "none", background: isOpen ? "rgba(17,19,34,0.07)" : c.grad, color: c.grad === "#E1E8FF" || isOpen ? "#111322" : "#FFFFFF", transition: "opacity .2s", outline: "none" }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = "1"}
                  >
                    {isOpen ? <EyeOff size={15} /> : <Eye size={15} />}
                    {isOpen ? "Hide Certificate" : "View & Download"}
                  </button>
                </div>

                {/* Expanded CertificateCard */}
                {isOpen && (
                  <div style={{ padding: "0 22px 22px" }}>
                    <CertificateCard
                      studentName="Arjun Sharma"
                      courseName={c.course}
                      issuedDate={c.issued}
                      certId={c.id}
                      status={c.status}
                      verifyUrl={`https://academy.example.com/verify/${c.id}`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
