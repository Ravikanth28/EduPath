"use client";
import { useState } from "react";
import { Download, ExternalLink, CheckCircle, Clock, XCircle } from "lucide-react";

interface CertificateCardProps {
  studentName: string;
  courseName: string;
  issuedDate: string;
  certId: string;
  status: "verified" | "pending" | "revoked";
  revokeReason?: string;
  verifyUrl?: string;
}

export function CertificateCard({
  studentName,
  courseName,
  issuedDate,
  certId,
  status,
  revokeReason,
  verifyUrl,
}: CertificateCardProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setDownloading(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Certificate canvas */}
      <div
        className="relative overflow-hidden rounded-2xl select-none"
        style={{
          background: "linear-gradient(135deg, #050520 0%, #0A0A30 50%, #050520 100%)",
          border: "2px solid rgba(212,175,55,0.3)",
        }}
      >
        {/* Corner ornaments */}
        <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-amber-400/50 rounded-tl-lg" />
        <div className="absolute top-3 right-3 w-12 h-12 border-t-2 border-r-2 border-amber-400/50 rounded-tr-lg" />
        <div className="absolute bottom-3 left-3 w-12 h-12 border-b-2 border-l-2 border-amber-400/50 rounded-bl-lg" />
        <div className="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-amber-400/50 rounded-br-lg" />

        <div className="p-10 text-center space-y-4">
          {/* Academy title */}
          <p className="text-xs tracking-[0.3em] uppercase text-amber-400/70 font-semibold">AI-DS Academy</p>

          {/* Main title */}
          <h1 className="text-3xl font-bold text-amber-300" style={{ fontFamily: "Georgia, serif", letterSpacing: "0.05em" }}>
            Certificate of Recognition
          </h1>

          <div className="neon-line my-2" />

          <p className="text-sm text-white/50 tracking-widest uppercase">This is to certify that</p>

          {/* Student name */}
          <h2 className="text-4xl font-bold text-white" style={{ fontFamily: "Georgia, serif" }}>
            {studentName}
          </h2>

          <p className="text-sm text-white/60">has successfully completed the course</p>

          {/* Course name */}
          <div className="inline-block px-6 py-2 rounded-full border border-amber-400/40" style={{ background: "rgba(212,175,55,0.08)" }}>
            <span className="text-amber-300 font-semibold text-lg">{courseName}</span>
          </div>

          <p className="text-xs text-white/40 max-w-sm mx-auto">
            demonstrating commitment to excellence in AI and Data Science education.
          </p>

          <div className="neon-line my-2" />

          {/* Meta */}
          <div className="flex items-center justify-center gap-8 text-xs text-white/50">
            <div>
              <p className="text-white/30 mb-1 uppercase tracking-wider">Date Issued</p>
              <p className="text-white/70">{issuedDate}</p>
            </div>
            <div>
              <p className="text-white/30 mb-1 uppercase tracking-wider">Certificate ID</p>
              <p className="text-white/70 font-mono">{certId}</p>
            </div>
          </div>

          {/* Verification URL */}
          {verifyUrl && (
            <p className="text-xs text-white/30">Verify at: {verifyUrl}</p>
          )}
        </div>

        {/* Status footer */}
        {status === "verified" && (
          <div className="px-6 py-3 flex items-center gap-2 justify-center" style={{ background: "rgba(34,197,94,0.08)", borderTop: "1px solid rgba(34,197,94,0.2)" }}>
            <CheckCircle size={14} className="text-green-400" />
            <span className="text-xs text-green-400 font-semibold">Verified Certificate</span>
            {verifyUrl && (
              <a href={verifyUrl} target="_blank" rel="noopener noreferrer" className="ml-2">
                <ExternalLink size={12} className="text-green-400/60" />
              </a>
            )}
          </div>
        )}
        {status === "pending" && (
          <div className="px-6 py-3 flex items-center gap-2 justify-center" style={{ background: "rgba(245,158,11,0.08)", borderTop: "1px solid rgba(245,158,11,0.2)" }}>
            <Clock size={14} className="text-amber-400" />
            <span className="text-xs text-amber-400 font-semibold">Pending Admin Verification</span>
          </div>
        )}
        {status === "revoked" && (
          <div className="px-6 py-3 flex items-center gap-2 justify-center" style={{ background: "rgba(239,68,68,0.08)", borderTop: "1px solid rgba(239,68,68,0.2)" }}>
            <XCircle size={14} className="text-red-400" />
            <span className="text-xs text-red-400 font-semibold">Revoked{revokeReason ? `: ${revokeReason}` : ""}</span>
          </div>
        )}
      </div>

      {/* Download button */}
      {status === "verified" ? (
        <button onClick={handleDownload} disabled={downloading} className="btn-primary w-full mt-4 flex items-center justify-center gap-2 py-3">
          <Download size={16} />
          {downloading ? "Generating PDF..." : "Download Certificate (PDF)"}
        </button>
      ) : (
        <div className="mt-4 text-center text-sm text-white/40">
          {status === "pending" ? "Download available after admin verification." : "Certificate has been revoked and cannot be downloaded."}
        </div>
      )}
    </div>
  );
}
