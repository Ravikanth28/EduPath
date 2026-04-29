"use client";
import { useState } from "react";
import { Trophy, CheckCircle, Clock, XCircle, Eye, Award, Download, X } from "lucide-react";

const CERTS = [
  {
    id: "CERT-DEMO-001",
    course: "Physics Mechanics",
    category: "Physics",
    issued: "March 15, 2026",
    status: "verified" as "verified" | "pending" | "revoked",
    studentName: "Arjun Sharma",
  },
  {
    id: "CERT-DEMO-004",
    course: "Engineering Mathematics",
    category: "Mathematics",
    issued: "April 20, 2026",
    status: "pending" as "verified" | "pending" | "revoked",
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
  // cert-bg.jpeg: 1042×727, ratio 1.4333
  const W = 297;
  const H = Math.round(W / (1042 / 727)); // ≈ 207mm
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [W, H] });

  // Load blank SMVEC template
  const img = new Image();
  img.src = "/cert-bg.jpeg";
  await new Promise<void>(resolve => { img.onload = () => resolve(); });
  doc.addImage(img, "JPEG", 0, 0, W, H);

  // White area horizontal center (medal takes left ~17%): center at 57% of W
  const CX = W * 0.57;

  // "This is to certify that" — italic, gray
  doc.setFont("times", "italic");
  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.text("This is to certify that", CX, H * 0.455, { align: "center" });

  // Student name — large bold navy
  doc.setFont("times", "bold");
  doc.setFontSize(40);
  doc.setTextColor(8, 18, 65);
  doc.text(studentName, CX, H * 0.555, { align: "center" });

  // "has successfully completed the course" — italic navy
  doc.setFont("times", "italic");
  doc.setFontSize(15);
  doc.setTextColor(8, 18, 65);
  doc.text("has successfully completed the course", CX, H * 0.645, { align: "center" });

  // Course name — bold navy
  doc.setFont("times", "bold");
  doc.setFontSize(24);
  doc.setTextColor(8, 18, 65);
  doc.text(courseName, CX, H * 0.725, { align: "center" });

  // Description — italic gray
  doc.setFont("times", "italic");
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.text("with distinction, showcasing excellence throughout.", CX, H * 0.80, { align: "center" });

  // Footer labels
  const xDate = W * 0.38, xCert = W * 0.57, xSign = W * 0.80;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(110, 100, 80);
  doc.text("DATE ISSUED",          xDate, H * 0.867, { align: "center" });
  doc.text("CERTIFICATE ID",       xCert, H * 0.867, { align: "center" });
  doc.text("AUTHORISED SIGNATURE", xSign, H * 0.867, { align: "center" });

  // Footer values
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.setTextColor(8, 18, 65);
  doc.text(issuedDate, xDate, H * 0.91, { align: "center" });
  doc.text(certId,     xCert, H * 0.91, { align: "center" });

  // Verified badge
  const bw = 58, bh = 11;
  doc.setFillColor(236, 253, 243);
  doc.setDrawColor(34, 160, 80);
  doc.setLineWidth(0.8);
  doc.roundedRect(xCert - bw / 2, H * 0.935, bw, bh, 5.5, 5.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(22, 130, 58);
  doc.text("\u2713  VERIFIED CERTIFICATE", xCert, H * 0.935 + 7.5, { align: "center" });

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
    <div style={{ padding: "28px 24px", display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.20)", borderRadius: "20px", padding: "24px 28px", display: "flex", alignItems: "center", gap: "20px", position: "relative", overflow: "hidden" }}>
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
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
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.88)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
          onClick={() => setViewModal(null)}
        >
          <div style={{ position: "relative", width: "100%", maxWidth: "960px" }} onClick={e => e.stopPropagation()}>

            {/* Close button */}
            <button
              onClick={() => setViewModal(null)}
              style={{ position: "absolute", top: "-14px", right: "-14px", zIndex: 20, width: "34px", height: "34px", borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}
            >
              <X size={15} />
            </button>

            {/* Certificate: blank template + text overlays matching template.png exactly */}
            {/* cert-bg.jpeg has "THIS CERTIFICATE IS PRESENTED TO" baked at y≈33-43% — masked with white */}
            <div style={{ position: "relative", borderRadius: "10px", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.75)" }}>
              <img src="/cert-bg.jpeg" alt="certificate" style={{ width: "100%", display: "block" }} />

              {/* WHITE MASK — covers the pre-printed "THIS CERTIFICATE IS PRESENTED TO" text */}
              <div style={{ position: "absolute", top: "31%", left: "20%", right: "1%", height: "12%", background: "white", pointerEvents: "none" }} />

              {/* WHITE MASK — covers the baked-in gold decorative line behind the name area */}
              <div style={{ position: "absolute", top: "49%", left: "20%", right: "1%", height: "3%", background: "white", pointerEvents: "none" }} />

              {/* "This is to certify that" — italic serif, gray — y≈37% */}
              <div style={{ position: "absolute", top: "37%", left: "57%", transform: "translateX(-50%)", width: "72%", textAlign: "center", pointerEvents: "none" }}>
                <span style={{ fontFamily: "Georgia,'Times New Roman',serif", fontStyle: "italic", fontSize: "1.95vw", color: "#444" }}>This is to certify that</span>
              </div>

              {/* Student name — bold serif, large, dark navy — y≈44% */}
              <div style={{ position: "absolute", top: "44%", left: "57%", transform: "translateX(-50%)", width: "72%", textAlign: "center", pointerEvents: "none" }}>
                <span style={{ fontFamily: "Georgia,'Times New Roman',serif", fontWeight: "bold", fontSize: "4.4vw", color: "#08124a", display: "block", lineHeight: 1.1 }}>{viewModal.studentName}</span>
              </div>

              {/* "has successfully completed the course" — italic serif, dark navy — y≈57% */}
              <div style={{ position: "absolute", top: "57%", left: "57%", transform: "translateX(-50%)", width: "72%", textAlign: "center", pointerEvents: "none" }}>
                <span style={{ fontFamily: "Georgia,'Times New Roman',serif", fontStyle: "italic", fontSize: "1.6vw", color: "#08124a", display: "block" }}>has successfully completed the course</span>
              </div>

              {/* Course name — bold serif, dark navy — y≈64.5% */}
              <div style={{ position: "absolute", top: "64.5%", left: "57%", transform: "translateX(-50%)", width: "72%", textAlign: "center", pointerEvents: "none" }}>
                <span style={{ fontFamily: "Georgia,'Times New Roman',serif", fontWeight: "bold", fontSize: "2.5vw", color: "#08124a", display: "block" }}>{viewModal.course}</span>
              </div>

              {/* "with distinction..." — italic serif, gray — y≈73% */}
              <div style={{ position: "absolute", top: "73%", left: "57%", transform: "translateX(-50%)", width: "68%", textAlign: "center", pointerEvents: "none" }}>
                <span style={{ fontFamily: "Georgia,'Times New Roman',serif", fontStyle: "italic", fontSize: "1.15vw", color: "#555", display: "block" }}>with distinction, showcasing excellence throughout.</span>
              </div>

              {/* Footer labels — DATE ISSUED @ 38%, CERT ID @ 57%, AUTHORISED SIGNATURE @ 80% — y≈80.5% */}
              <div style={{ position: "absolute", top: "80.5%", left: "38%", transform: "translateX(-50%)", textAlign: "center", pointerEvents: "none" }}>
                <span style={{ display: "block", fontFamily: "Arial,sans-serif", fontWeight: 700, fontSize: "0.62vw", color: "#888", letterSpacing: "0.12em", textTransform: "uppercase" }}>Date Issued</span>
                <span style={{ display: "block", fontFamily: "Georgia,'Times New Roman',serif", fontWeight: "bold", fontSize: "1.25vw", color: "#08124a", marginTop: "0.3vw" }}>{viewModal.issued}</span>
              </div>
              <div style={{ position: "absolute", top: "80.5%", left: "57%", transform: "translateX(-50%)", textAlign: "center", pointerEvents: "none" }}>
                <span style={{ display: "block", fontFamily: "Arial,sans-serif", fontWeight: 700, fontSize: "0.62vw", color: "#888", letterSpacing: "0.12em", textTransform: "uppercase" }}>Certificate ID</span>
                <span style={{ display: "block", fontFamily: "Georgia,'Times New Roman',serif", fontWeight: "bold", fontSize: "1.25vw", color: "#08124a", marginTop: "0.3vw" }}>{viewModal.id}</span>
              </div>
              <div style={{ position: "absolute", top: "80.5%", left: "80%", transform: "translateX(-50%)", textAlign: "center", pointerEvents: "none" }}>
                <span style={{ display: "block", fontFamily: "Arial,sans-serif", fontWeight: 700, fontSize: "0.62vw", color: "#888", letterSpacing: "0.12em", textTransform: "uppercase" }}>Authorised</span>
                <span style={{ display: "block", fontFamily: "Arial,sans-serif", fontWeight: 700, fontSize: "0.62vw", color: "#888", letterSpacing: "0.12em", textTransform: "uppercase" }}>Signature</span>
              </div>

              {/* Verified badge — centered at 57%, y≈89% */}
              {viewModal.status === "verified" && (
                <div style={{ position: "absolute", top: "89%", left: "57%", transform: "translateX(-50%)", background: "rgba(236,253,243,0.97)", border: "1.5px solid #22a050", borderRadius: "20px", padding: "0.3vw 1vw", display: "inline-flex", alignItems: "center", gap: "0.4vw", pointerEvents: "none", whiteSpace: "nowrap" }}>
                  <CheckCircle size={11} color="#22a050" />
                  <span style={{ fontFamily: "Arial,sans-serif", fontWeight: 700, fontSize: "0.8vw", color: "#16803c", letterSpacing: "0.08em" }}>VERIFIED CERTIFICATE</span>
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
