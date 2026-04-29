"use client";
import { useState } from "react";
import { Trophy, CheckCircle, Clock, XCircle, Eye, Award, Download, X } from "lucide-react";

const CERTS = [
  {
    id: "CERT-DEMO-001",
    course: "Engineering Mathematics",
    category: "Mathematics",
    issued: "March 15, 2026",
    status: "verified" as "verified" | "pending" | "revoked",
    studentName: "Arjun Sharma",
  },
  {
    id: "CERT-DEMO-002",
    course: "Physics Mechanics",
    category: "Physics",
    issued: "March 20, 2026",
    status: "verified" as "verified" | "pending" | "revoked",
    studentName: "Arjun Sharma",
  },
  {
    id: "CERT-DEMO-003",
    course: "Chemistry Fundamentals",
    category: "Chemistry",
    issued: "April 05, 2026",
    status: "verified" as "verified" | "pending" | "revoked",
    studentName: "Arjun Sharma",
  },
  {
    id: "CERT-DEMO-004",
    course: "Computer Science Basics",
    category: "Computer Science",
    issued: "April 15, 2026",
    status: "verified" as "verified" | "pending" | "revoked",
    studentName: "Arjun Sharma",
  },
  {
    id: "CERT-DEMO-005",
    course: "Electronics & Circuits",
    category: "Electronics",
    issued: "April 25, 2026",
    status: "verified" as "verified" | "pending" | "revoked",
    studentName: "Arjun Sharma",
  },
];


const STATUS_MAP = {
  verified: { label: "Verified", color: "#4ADE80", bg: "rgba(74,222,128,0.12)",  border: "rgba(74,222,128,0.30)",  icon: <CheckCircle size={11} /> },
  pending:  { label: "Pending",  color: "#FBBF24", bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.30)",  icon: <Clock size={11} /> },
  revoked:  { label: "Revoked",  color: "#F87171", bg: "rgba(248,113,113,0.12)",border: "rgba(248,113,113,0.30)", icon: <XCircle size={11} /> },
};

async function downloadCertAsPDF(studentName: string, courseName: string, issuedDate: string, certId: string) {
  const { jsPDF } = await import("jspdf");
  // template.png: A4 landscape ratio
  const W = 297;
  const H = 210;
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [W, H] });

  // Load SMVEC template
  const img = new Image();
  img.src = "/template.png";
  await new Promise<void>(resolve => { img.onload = () => resolve(); });
  doc.addImage(img, "PNG", 0, 0, W, H);

  // Cover existing text in template to make it dynamic
  doc.setFillColor(255, 255, 255);
  // Cover Name area
  doc.rect(W * 0.25, H * 0.43, W * 0.65, H * 0.12, "F");
  // Cover Course area
  doc.rect(W * 0.25, H * 0.63, W * 0.65, H * 0.10, "F");
  // Cover Date area
  doc.rect(W * 0.25, H * 0.89, W * 0.20, H * 0.05, "F");
  // Cover ID area
  doc.rect(W * 0.48, H * 0.89, W * 0.20, H * 0.05, "F");

  const logo = new Image();
  logo.src = "/SMVEC.png";
  await new Promise<void>(resolve => { logo.onload = () => resolve(); });
  
  // Place logo properly in top-left white area
  doc.rect(W * 0.18, H * 0.02, W * 0.08, H * 0.11, "F"); // Cover old logo area
  doc.addImage(logo, "PNG", W * 0.195, H * 0.03, W * 0.06, H * 0.08);

  const CX = W * 0.57;

  // Student name
  doc.setFont("times", "bold");
  doc.setFontSize(40);
  doc.setTextColor(8, 18, 74);
  doc.text(studentName, CX, H * 0.52, { align: "center" });

  // Course name
  doc.setFont("times", "bold");
  doc.setFontSize(26);
  doc.setTextColor(8, 18, 74);
  doc.text(courseName, CX, H * 0.71, { align: "center" });

  // Footer values
  const xDate = W * 0.36, xCert = W * 0.57;
  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.setTextColor(8, 18, 65);
  doc.text(issuedDate, xDate, H * 0.92, { align: "center" });
  doc.text(certId, xCert, H * 0.92, { align: "center" });

  // Verified badge
  const bw = 64, bh = 11;
  doc.setFillColor(236, 253, 243);
  doc.setDrawColor(34, 160, 80);
  doc.setLineWidth(0.8);
  doc.roundedRect(xCert - bw / 2, H * 0.94, bw, bh, 5.5, 5.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(22, 130, 58);
  doc.text("\u2713  VERIFIED CERTIFICATE", xCert, H * 0.94 + 7.5, { align: "center" });

  doc.save(`Certificate-${certId}.pdf`);
}


export default function CertificatesPage() {
  const [viewModal, setViewModal] = useState<typeof CERTS[0] | null>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (cert: typeof CERTS[0]) => {
    if (cert.status !== "verified") return;
    setDownloading(true);
    try {
      await downloadCertAsPDF(cert.studentName, cert.course, cert.issued, cert.id);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{ padding: "clamp(16px, 3vw, 28px) clamp(12px, 3vw, 24px)", display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.20)", borderRadius: "20px", padding: "clamp(18px, 3vw, 24px) clamp(16px, 3vw, 28px)", display: "flex", alignItems: "center", gap: "16px", position: "relative", overflow: "hidden", flexWrap: "wrap" }}>
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "220px", height: "220px", background: "radial-gradient(circle,rgba(124,58,237,0.18),transparent 60%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ width: "60px", height: "60px", borderRadius: "18px", background: "rgba(167,139,250,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 0 1px rgba(167,139,250,0.25)", position: "relative", zIndex: 1 }}>
          <Trophy size={30} style={{ color: "#A78BFA" }} />
        </div>
        <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
          <h1 style={{ color: "#fff", fontWeight: 800, fontSize: "22px", margin: "0 0 5px" }}>My Certificates</h1>
          <p style={{ color: "rgba(255,255,255,0.42)", fontSize: "13px", margin: 0 }}>Hall of Achievement — {CERTS.length} certificate{CERTS.length !== 1 ? "s" : ""} earned</p>
        </div>
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", flexShrink: 0, paddingLeft: "20px", borderLeft: "1px solid rgba(255,255,255,0.10)" }}>
          <p style={{ fontSize: "44px", fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1 }}>{CERTS.length}</p>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)", margin: "4px 0 0", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total</p>
        </div>
      </div>

      {/* Empty state */}
      {CERTS.length === 0 ? (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "56px 24px", textAlign: "center" }}>
          <div style={{ width: "68px", height: "68px", borderRadius: "50%", border: "2px dashed rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Trophy size={26} style={{ color: "rgba(255,255,255,0.18)" }} />
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontWeight: 700, fontSize: "16px", margin: "0 0 8px" }}>No certificates yet</p>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", margin: 0 }}>Complete a course and pass all module tests to earn a certificate.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: "20px" }}>
          {CERTS.map(c => {
            const st = STATUS_MAP[c.status];
            return (
              <div key={c.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "18px", overflow: "hidden", transition: "border-color .2s, box-shadow .2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(167,139,250,0.30)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(124,58,237,0.15)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
              >
                <div style={{ height: "4px", background: "linear-gradient(90deg,#7C3AED,#06B6D4)" }} />
                <div style={{ padding: "20px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "rgba(167,139,250,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Award size={18} style={{ color: "#A78BFA" }} />
                    </div>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.10)" }}>Certificate</span>
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: st.bg, color: st.color, border: `1px solid ${st.border}`, display: "inline-flex", alignItems: "center", gap: "4px" }}>{st.icon} {st.label}</span>
                    </div>
                  </div>
                  <h3 style={{ color: "#fff", fontWeight: 800, fontSize: "18px", margin: "0 0 10px", lineHeight: 1.2 }}>{c.course}</h3>
                  <span style={{ display: "inline-block", fontSize: "11px", fontWeight: 700, padding: "3px 12px", borderRadius: "20px", background: "rgba(124,58,237,0.12)", color: "#A78BFA", border: "1px solid rgba(124,58,237,0.25)", marginBottom: "14px" }}>{c.category}</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px", padding: "12px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", width: "56px", flexShrink: 0 }}>Issued</span>
                      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{c.issued}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", width: "56px", flexShrink: 0 }}>Cert ID</span>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", fontFamily: "monospace" }}>#{c.id.slice(-8)}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => setViewModal(c)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", padding: "11px", borderRadius: "10px", fontSize: "13px", fontWeight: 700, cursor: "pointer", border: "none", background: "linear-gradient(135deg,#7C3AED,#5B21B6)", color: "#fff", transition: "opacity .2s" }} onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"} onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = "1"}>
                      <Eye size={14} /> View
                    </button>
                    {c.status === "verified" && (
                      <button onClick={() => handleDownload(c)} disabled={downloading} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", padding: "11px", borderRadius: "10px", fontSize: "13px", fontWeight: 700, cursor: downloading ? "wait" : "pointer", border: "1px solid rgba(167,139,250,0.30)", background: "rgba(167,139,250,0.08)", color: "#A78BFA", transition: "opacity .2s", opacity: downloading ? 0.6 : 1 }} onMouseEnter={e => { if (!downloading) (e.currentTarget as HTMLButtonElement).style.background = "rgba(167,139,250,0.16)"; }} onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(167,139,250,0.08)"}>
                        <Download size={14} /> {downloading ? "Opening..." : "Download"}
                      </button>
                    )}
                    {c.status !== "verified" && (
                      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "11px", borderRadius: "10px", fontSize: "12px", color: "rgba(255,255,255,0.30)", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", textAlign: "center" }}>
                        {c.status === "pending" ? "Awaiting verification" : "Revoked"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View modal — matches template.png exactly */}
      {viewModal && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.88)", backdropFilter: "blur(10px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "clamp(12px, 3vw, 24px)", overflowY: "auto" }}
          onClick={() => setViewModal(null)}
        >
          <div style={{ position: "relative", width: "min(100%, 1040px)", margin: "auto 0" }} onClick={e => e.stopPropagation()}>

            {/* Close button */}
            <button
              onClick={() => setViewModal(null)}
              style={{ position: "absolute", top: "-14px", right: "-14px", zIndex: 20, width: "34px", height: "34px", borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}
            >
              <X size={15} />
            </button>

            {/* Certificate: blank template + text overlays matching template.png exactly */}
            {/* cert-bg.jpeg has "THIS CERTIFICATE IS PRESENTED TO" baked at y≈33-43% — masked with white */}
            <div style={{ position: "relative", borderRadius: "10px", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.75)", containerType: "inline-size" }}>
              <img src="/template.png" alt="certificate" style={{ width: "100%", display: "block" }} />
              
              {/* Overlay covers to hide template defaults */}
              <div style={{ position: "absolute", top: "2%", left: "18%", width: "9%", height: "12%", background: "white" }} />
              <div style={{ position: "absolute", top: "43%", left: "25%", width: "65%", height: "13%", background: "white" }} />
              <div style={{ position: "absolute", top: "63%", left: "25%", width: "65%", height: "11%", background: "white" }} />
              <div style={{ position: "absolute", top: "89%", left: "25%", width: "22%", height: "6%", background: "white" }} />
              <div style={{ position: "absolute", top: "89%", left: "47%", width: "22%", height: "6%", background: "white" }} />

              {/* Dynamic Logo */}
              <img src="/SMVEC.png" alt="" style={{ position: "absolute", top: "3%", left: "19.5%", width: "6%", height: "auto" }} />

              {/* Dynamic Name */}
              <div style={{ position: "absolute", top: "44.5%", left: "57%", transform: "translateX(-50%)", width: "72%", textAlign: "center" }}>
                <span style={{ fontFamily: "Georgia,'Times New Roman',serif", fontWeight: "bold", fontSize: "clamp(28px, 6.5cqw, 66px)", color: "#08124a", display: "block", lineHeight: 1.02 }}>{viewModal.studentName}</span>
              </div>

              {/* Dynamic Course */}
              <div style={{ position: "absolute", top: "65%", left: "57%", transform: "translateX(-50%)", width: "72%", textAlign: "center" }}>
                <span style={{ fontFamily: "Georgia,'Times New Roman',serif", fontWeight: "bold", fontSize: "clamp(18px, 3.9cqw, 40px)", color: "#08124a", display: "block", lineHeight: 1.05 }}>{viewModal.course}</span>
              </div>

              {/* Footer Values */}
              <div style={{ position: "absolute", top: "81%", left: "36%", transform: "translateX(-50%)", width: "20%", textAlign: "center" }}>
                <span style={{ display: "block", fontFamily: "Arial,sans-serif", fontWeight: 700, fontSize: "clamp(6px, 1cqw, 10px)", color: "#888", letterSpacing: "0.12em", textTransform: "uppercase" }}>Date Issued</span>
                <span style={{ display: "block", fontFamily: "Georgia,'Times New Roman',serif", fontWeight: "bold", fontSize: "clamp(10px, 1.9cqw, 20px)", color: "#08124a", marginTop: "0.3cqw", whiteSpace: "nowrap" }}>{viewModal.issued}</span>
              </div>
              <div style={{ position: "absolute", top: "81%", left: "57%", transform: "translateX(-50%)", width: "22%", textAlign: "center" }}>
                <span style={{ display: "block", fontFamily: "Arial,sans-serif", fontWeight: 700, fontSize: "clamp(6px, 1cqw, 10px)", color: "#888", letterSpacing: "0.12em", textTransform: "uppercase" }}>Certificate ID</span>
                <span style={{ display: "block", fontFamily: "Georgia,'Times New Roman',serif", fontWeight: "bold", fontSize: "clamp(10px, 1.9cqw, 20px)", color: "#08124a", marginTop: "0.3cqw", whiteSpace: "nowrap" }}>{viewModal.id}</span>
              </div>

              {/* Verified badge */}
              {viewModal.status === "verified" && (
                <div style={{ position: "absolute", top: "90%", left: "57%", transform: "translateX(-50%)", background: "rgba(236,253,243,0.97)", border: "1.5px solid #22a050", borderRadius: "999px", padding: "0.45cqw 1.35cqw", display: "inline-flex", alignItems: "center", gap: "0.55cqw", whiteSpace: "nowrap" }}>
                  <CheckCircle size={11} color="#22a050" />
                  <span style={{ fontFamily: "Arial,sans-serif", fontWeight: 700, fontSize: "clamp(7px, 1.35cqw, 14px)", color: "#16803c", letterSpacing: "0.08em" }}>VERIFIED CERTIFICATE</span>
                </div>
              )}
            </div>

            {/* Download button */}
            {viewModal.status === "verified" && (
              <button
                onClick={() => handleDownload(viewModal)}
                style={{ marginTop: "14px", width: "100%", padding: "13px", borderRadius: "12px", background: "linear-gradient(135deg,#7C3AED,#5B21B6)", border: "none", color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = "1"}
              >
                <Download size={16} /> Download Certificate (PDF)
              </button>
            )}
            {viewModal.status !== "verified" && (
              <p style={{ textAlign: "center", color: "rgba(255,255,255,0.40)", fontSize: "13px", marginTop: "12px" }}>
                {viewModal.status === "pending" ? "Download available after admin verification." : "This certificate has been revoked."}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
