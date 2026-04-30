"use client";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Trophy, CheckCircle, Clock, XCircle, Eye, Award, Download, X } from "lucide-react";
import { api, type Certificate } from "@/lib/api";

const STATUS_MAP = {
  verified: { label: "Verified", color: "#4ADE80", bg: "rgba(74,222,128,0.12)",  border: "rgba(74,222,128,0.30)",  icon: <CheckCircle size={11} /> },
  pending:  { label: "Pending",  color: "#FBBF24", bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.30)",  icon: <Clock size={11} /> },
  revoked:  { label: "Revoked",  color: "#F87171", bg: "rgba(248,113,113,0.12)",border: "rgba(248,113,113,0.30)", icon: <XCircle size={11} /> },
};

/** Award rosette badge SVG (scalloped gold ring + red disc + ribbon tails) */
function GoldMedal() {
  const cx = 60, cy = 58;
  const N = 22;
  const outerR = 50, innerR = 43;

  // Build scalloped path
  let scallop = "";
  for (let i = 0; i < N; i++) {
    const a0 = ((i - 0.5) / N) * 2 * Math.PI - Math.PI / 2;
    const a1 = (i / N) * 2 * Math.PI - Math.PI / 2;
    const a2 = ((i + 0.5) / N) * 2 * Math.PI - Math.PI / 2;
    const x0 = (cx + innerR * Math.cos(a0)).toFixed(1);
    const y0 = (cy + innerR * Math.sin(a0)).toFixed(1);
    const x1 = (cx + outerR * Math.cos(a1)).toFixed(1);
    const y1 = (cy + outerR * Math.sin(a1)).toFixed(1);
    const x2 = (cx + innerR * Math.cos(a2)).toFixed(1);
    const y2 = (cy + innerR * Math.sin(a2)).toFixed(1);
    scallop += i === 0 ? `M${x0},${y0}` : "";
    scallop += ` Q${x1},${y1} ${x2},${y2}`;
  }
  scallop += " Z";

  // 5-pointed star (outer r=16, inner r=7)
  const star5 = Array.from({ length: 10 }, (_, i) => {
    const a = (i * Math.PI / 5) - Math.PI / 2;
    const r = i % 2 === 0 ? 16 : 7;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 120 165" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", overflow: "visible" }}>
      <defs>
        <radialGradient id="aw_ring" cx="30%" cy="25%" r="75%">
          <stop offset="0%"   stopColor="#FFFDE0" />
          <stop offset="20%"  stopColor="#FFD700" />
          <stop offset="55%"  stopColor="#C8940A" />
          <stop offset="85%"  stopColor="#8B6200" />
          <stop offset="100%" stopColor="#5C3D00" />
        </radialGradient>
        <radialGradient id="aw_disc" cx="32%" cy="25%" r="72%">
          <stop offset="0%"   stopColor="#1e3a8a" />
          <stop offset="30%"  stopColor="#0a1855" />
          <stop offset="65%"  stopColor="#060f38" />
          <stop offset="100%" stopColor="#020818" />
        </radialGradient>
        <linearGradient id="aw_rib" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%"   stopColor="#FFE566" />
          <stop offset="45%"  stopColor="#C8940A" />
          <stop offset="100%" stopColor="#7B5000" />
        </linearGradient>
        <linearGradient id="aw_sheenL" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.35)" />
          <stop offset="45%"  stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.10)" />
        </linearGradient>
        <linearGradient id="aw_sheenR" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.35)" />
          <stop offset="45%"  stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.10)" />
        </linearGradient>
        <filter id="aw_shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#000" floodOpacity="0.55" />
        </filter>
        <filter id="aw_glow" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Ribbon tails (drawn first, behind disc) ── */}
      <path d="M55,95 L42,100 L10,156 L34,144 L43,159 L57,101 Z" fill="url(#aw_rib)" />
      <path d="M55,95 L42,100 L10,156 L34,144 L43,159 L57,101 Z" fill="url(#aw_sheenL)" />
      <path d="M65,95 L78,100 L110,156 L86,144 L77,159 L63,101 Z" fill="url(#aw_rib)" />
      <path d="M65,95 L78,100 L110,156 L86,144 L77,159 L63,101 Z" fill="url(#aw_sheenR)" />

      {/* ── Scalloped gold ring shadow ── */}
      <path d={scallop} fill="#000" opacity="0.25" filter="url(#aw_shadow)" transform="translate(2,4)" />

      {/* ── Scalloped gold ring ── */}
      <path d={scallop} fill="url(#aw_ring)" />
      <path d={scallop} fill="none" stroke="#FFFDE0" strokeWidth="0.5" opacity="0.40" />

      {/* ── Deep red disc ── */}
      <circle cx={cx} cy={cy} r="37" fill="url(#aw_disc)" filter="url(#aw_glow)" />
      <circle cx={cx} cy={cy} r="37" fill="none" stroke="#FFD700" strokeWidth="1.0" opacity="0.50" />
      <circle cx={cx} cy={cy} r="32" fill="none" stroke="#c8a000" strokeWidth="0.5" opacity="0.35" />

      {/* ── Gold 5-pointed star ── */}
      <polygon points={star5} fill="#FFD700" filter="url(#aw_glow)" opacity="0.95" />
      <polygon points={star5} fill="none" stroke="#FFFDE0" strokeWidth="0.7" opacity="0.65" />
    </svg>
  );
}

/** Decorative background swirls + subtle gradient bg */
function DecoSwirls() {
  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
      viewBox="0 0 297 210"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="bgGlow" cx="62%" cy="50%" r="58%">
          <stop offset="0%"   stopColor="#f8f9ff" />
          <stop offset="100%" stopColor="#e4e8f5" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="297" height="210" fill="url(#bgGlow)" />
      <ellipse cx="238" cy="168" rx="138" ry="74" transform="rotate(-25 238 168)" fill="#b0b0c8" opacity="0.15" />
      <ellipse cx="268" cy="44"  rx="108" ry="60" transform="rotate(20 268 44)"   fill="#b0b0c8" opacity="0.12" />
      <ellipse cx="192" cy="202" rx="128" ry="70" transform="rotate(-38 192 202)" fill="#b0b0c8" opacity="0.11" />
      <ellipse cx="283" cy="114" rx="90"  ry="50" transform="rotate(12 283 114)"  fill="#b0b0c8" opacity="0.09" />
      <ellipse cx="172" cy="78"  rx="92"  ry="52" transform="rotate(-15 172 78)"  fill="#b0b0c8" opacity="0.07" />
    </svg>
  );
}

/** Certificate visual — curved SVG strip, space-between layout */
function CertificateView({
  studentName, course, issued, id, status,
}: {
  studentName: string; course: string; issued: string; id: string; status: "verified" | "pending" | "revoked";
}) {
  return (
    <div style={{
      position: "relative",
      background: "#f3f5fb",
      width: "100%",
      aspectRatio: "297 / 210",
      overflow: "hidden",
      borderRadius: "6px",
      containerType: "inline-size",
      fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif",
      border: "2px solid #b8820a",
      boxShadow: "0 10px 48px rgba(0,0,0,0.22)",
    }}>
      <DecoSwirls />

      {/* Curved dark left strip — AI Robot theme */}
      <svg
        style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }}
        viewBox="0 0 297 210"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="stripGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#0d0721" />
            <stop offset="40%"  stopColor="#100a30" />
            <stop offset="80%"  stopColor="#06103a" />
            <stop offset="100%" stopColor="#0a1855" stopOpacity="0.92" />
          </linearGradient>
          {/* Purple glow band */}
          <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#7b2ff7" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#7b2ff7" stopOpacity="0.0" />
          </linearGradient>
          {/* Cyan glow */}
          <radialGradient id="cyanGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#00e5ff" stopOpacity="0.85" />
            <stop offset="55%"  stopColor="#00aacc" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#0044aa" stopOpacity="0.0" />
          </radialGradient>
          <linearGradient id="goldEdge" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#ffe066" />
            <stop offset="30%"  stopColor="#c8a000" />
            <stop offset="70%"  stopColor="#c8a000" />
            <stop offset="100%" stopColor="#ffe066" />
          </linearGradient>
          <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
          <clipPath id="stripClip">
            <path d="M0,0 L63,0 Q71,105 59,210 L0,210 Z" />
          </clipPath>
        </defs>

        {/* ── Main curved dark panel ── */}
        <path d="M0,0 L63,0 Q71,105 59,210 L0,210 Z" fill="url(#stripGrad)" />
        {/* Purple glow overlay */}
        <path d="M0,0 L63,0 Q71,105 59,210 L0,210 Z" fill="url(#purpleGlow)" />

        {/* ── All robot + decoration clipped to strip ── */}
        <g clipPath="url(#stripClip)">

          {/* ── Subtle circuit lines in top area ── */}
          <line x1="5"  y1="8"  x2="28" y2="8"  stroke="#00e5ff" strokeWidth="0.5" opacity="0.18" />
          <line x1="28" y1="8"  x2="28" y2="18" stroke="#00e5ff" strokeWidth="0.5" opacity="0.18" />
          <line x1="28" y1="18" x2="48" y2="18" stroke="#00e5ff" strokeWidth="0.5" opacity="0.18" />
          <line x1="10" y1="14" x2="10" y2="28" stroke="#00e5ff" strokeWidth="0.5" opacity="0.14" />
          <circle cx="28" cy="8"  r="1.2" fill="#00e5ff" opacity="0.40" />
          <circle cx="10" cy="14" r="1.0" fill="#7b2ff7" opacity="0.50" />
          <circle cx="48" cy="18" r="1.0" fill="#00e5ff" opacity="0.38" />
          <line x1="5"  y1="22" x2="20" y2="22" stroke="#7b2ff7" strokeWidth="0.4" opacity="0.22" />
          <line x1="40" y1="5"  x2="40" y2="14" stroke="#7b2ff7" strokeWidth="0.4" opacity="0.22" />
          <circle cx="40" cy="5"  r="0.9" fill="#7b2ff7" opacity="0.45" />

          {/* ── Small floating data dots ── */}
          <circle cx="7"  cy="50"  r="0.8" fill="#00e5ff" opacity="0.30" />
          <circle cx="55" cy="42"  r="0.7" fill="#7b2ff7" opacity="0.35" />
          <circle cx="12" cy="80"  r="0.7" fill="#00e5ff" opacity="0.28" />
          <circle cx="50" cy="75"  r="0.8" fill="#00e5ff" opacity="0.28" />
          <circle cx="8"  cy="100" r="0.6" fill="#7b2ff7" opacity="0.30" />
          <circle cx="53" cy="100" r="0.7" fill="#00e5ff" opacity="0.25" />
          <circle cx="14" cy="135" r="0.8" fill="#00e5ff" opacity="0.28" />
          <circle cx="48" cy="148" r="0.7" fill="#7b2ff7" opacity="0.30" />
          <circle cx="8"  cy="165" r="0.7" fill="#00e5ff" opacity="0.25" />
          <circle cx="52" cy="175" r="0.6" fill="#00e5ff" opacity="0.28" />
          <circle cx="20" cy="195" r="0.8" fill="#7b2ff7" opacity="0.30" />
          <circle cx="44" cy="200" r="0.7" fill="#00e5ff" opacity="0.25" />

        </g>

        {/* ── Gold curved accent edge (outside clip) ── */}
        <path d="M63,0 Q71,105 59,210" fill="none" stroke="url(#goldEdge)" strokeWidth="1.8" opacity="0.75" />
        <path d="M63,0 Q71,105 59,210" fill="none" stroke="#ffffff" strokeWidth="0.4" opacity="0.10" />
      </svg>

      {/* Gold medal — upper section of the dark strip */}
      <div style={{
        position: "absolute",
        left: "0.5cqw",
        top: "33%",
        transform: "translateY(-50%)",
        width: "17.5cqw",
        zIndex: 3,
      }}>
        <GoldMedal />
      </div>

      {/* Main content — 4 sections, space-between fills the height */}
      <div style={{
        position: "absolute",
        left: "20cqw", top: 0, right: 0, bottom: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "0.8cqw 2.5cqw 0.8cqw 0.5cqw",
      }}>

        {/* ① + ②+③ top group — header and certificate title stay close together */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0" }}>

        {/* ① College header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.15cqw", width: "100%" }}>
          {/* Name row: logo absolutely placed so it never shifts the text */}
          <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/SMVEC.png" alt="SMVEC" style={{
              position: "absolute", left: 0,
              width: "20cqw", height: "12cqw", objectFit: "contain",
              mixBlendMode: "multiply",
            }} />
            <span style={{
              fontSize: "3.4cqw", fontWeight: 800, color: "#06103a",
              letterSpacing: "0.06em", fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif",
              textTransform: "uppercase", lineHeight: 1.1, textAlign: "center", paddingLeft: "10cqw",
              textShadow: "0 1px 4px rgba(6,16,58,0.12)",
            }}>
              Sri Manakula Vinayagar Engineering College
            </span>
          </div>
          {/* Gold rule */}
          <div style={{ width: "90%", height: "1px", background: "linear-gradient(90deg,transparent,#b8820a 18%,#e8c040 50%,#b8820a 82%,transparent)", marginBottom: "0.1cqw" }} />
          <div style={{ width: "70%", height: "1px", background: "linear-gradient(90deg,transparent,#b8820a 25%,#e8c040 50%,#b8820a 75%,transparent)", marginTop: "2px" }} />
          {/* Department name — below the gold rule */}
          <span style={{
            fontSize: "1.8cqw", fontWeight: 600, color: "#1a3070",
            letterSpacing: "0.08em", fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif",
            textTransform: "uppercase", lineHeight: 1.2, paddingTop: "0.2cqw", paddingBottom: "0",
          }}>
            Department of Artificial Intelligence and Data Science
          </span>
          {/* Logos row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "2cqw", marginBottom: "0" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/iic_logo.png" alt="IIC" style={{ height: "9cqw", width: "auto", objectFit: "contain", mixBlendMode: "multiply" }} />
            {/* Divider */}
            <div style={{ width: "1px", height: "7cqw", background: "linear-gradient(180deg, transparent, #b8820a 30%, #b8820a 70%, transparent)" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/idsc.png" alt="IDSC" style={{ height: "12cqw", width: "auto", objectFit: "contain", mixBlendMode: "multiply" }} />
            {/* Divider */}
            <div style={{ width: "1px", height: "7cqw", background: "linear-gradient(180deg, transparent, #b8820a 30%, #b8820a 70%, transparent)" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/infinit-aid.png" alt="Infinit-Aid" style={{ height: "6cqw", width: "auto", objectFit: "contain", mixBlendMode: "multiply" }} />
          </div>
        </div>

        {/* ② + ③ Centre block — title and body merged */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6cqw" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "6.8cqw", fontWeight: 900, color: "#06103a", lineHeight: 0.88, letterSpacing: "0.04em",
              fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif",
              textShadow: "0 3px 12px rgba(6,16,58,0.18)",
            }}>
              CERTIFICATE
            </div>
            <div style={{
              fontSize: "2.2cqw", fontWeight: 600, color: "#b8820a",
              letterSpacing: "0.42em", fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif",
              fontStyle: "italic", textTransform: "uppercase", marginTop: "0.28cqw",
            }}>
              of Appreciation
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6cqw" }}>
            <div style={{ fontSize: "1.9cqw", fontStyle: "italic", color: "#7a5c2e", fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "0.04em" }}>This is to certify that</div>
            <div style={{ fontSize: "5.5cqw", fontWeight: 700, color: "#06103a", lineHeight: 0.98, textAlign: "center", fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif", textShadow: "0 1px 6px rgba(6,16,58,0.13)" }}>
              {studentName}
            </div>
            <div style={{ fontSize: "1.72cqw", fontStyle: "italic", color: "#7a5c2e", fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "0.03em" }}>has successfully completed the course</div>
            <div style={{ fontSize: "2.8cqw", fontWeight: 700, color: "#06103a", lineHeight: 1.04, textAlign: "center", fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif", letterSpacing: "0.05em", borderBottom: "1.5px solid #b8820a", paddingBottom: "0.2cqw" }}>
              {course}
            </div>
            <div style={{ fontSize: "1.42cqw", fontStyle: "italic", color: "#7a5c2e", textAlign: "center", paddingLeft: "4cqw", fontFamily: "Georgia, 'Times New Roman', serif", lineHeight: 1.5 }}>
             In recognition of outstanding performance, dedication, and successful completion of all course modules and assessments conducted by EduPath Platform
            </div>
            {/* Course Completed badge */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4cqw", marginTop: "0.1cqw" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "0.5cqw",
                background: "#0a1855",
                border: "1.5px solid #c8a000",
                borderRadius: "999px",
                padding: "0.45cqw 1.4cqw",
              }}>
                <span style={{ fontSize: "1.6cqw", lineHeight: 1 }}>🏆</span>
                <span style={{
                  fontSize: "1.5cqw", fontWeight: 700, color: "#e8b800",
                  letterSpacing: "0.06em", fontFamily: "Georgia,'Times New Roman',serif",
                  fontStyle: "italic",
                }}>
                  Course Completed
                </span>
              </div>
              {status === "verified" && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.28cqw", background: "rgba(236,253,243,0.97)", border: "1.2px solid #22a050", borderRadius: "999px", padding: "0.22cqw 0.9cqw", fontSize: "0.82cqw", fontWeight: 700, color: "#16803c", fontFamily: "Arial,sans-serif", letterSpacing: "0.07em" }}>
                  ✓&nbsp;VERIFIED CERTIFICATE
                </div>
              )}
            </div>
          </div>
        </div>
        </div>{/* end top group */}

        {/* ④ Footer */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.48cqw" }}>
          <div style={{ width: "100%", height: "1px", background: "linear-gradient(90deg,transparent,#b8820a 20%,#e8c040 50%,#b8820a 80%,transparent)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: "1.3cqw", fontWeight: 700, color: "#06103a", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif" }}>{issued}</div>
              <div style={{ fontSize: "0.83cqw", color: "#b8820a", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif", fontWeight: 700, marginTop: "0.18cqw" }}>Date Issued</div>
            </div>
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: "1.3cqw", fontWeight: 700, color: "#06103a", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif" }}>{id}</div>
              <div style={{ fontSize: "0.83cqw", color: "#b8820a", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif", fontWeight: 700, marginTop: "0.18cqw" }}>Certificate ID</div>
            </div>
            <div style={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2cqw" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/sign.png" alt="Signature" style={{ width: "9cqw", objectFit: "contain", mixBlendMode: "multiply", opacity: 0.88 }} />
              <div style={{ width: "7cqw", height: "1px", background: "rgba(0,0,0,0.25)" }} />
              <div style={{ fontSize: "0.83cqw", color: "#b8820a", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif", fontWeight: 700 }}>Authorised Signature</div>
            </div>
          </div>
        </div>

      </div>
      {/* Double gold border frame overlay */}
      <div style={{ position: "absolute", inset: 0, border: "2px solid #b8820a", borderRadius: "4px", pointerEvents: "none", zIndex: 10 }} />
      <div style={{ position: "absolute", inset: "5px", border: "1px solid rgba(184,130,10,0.40)", borderRadius: "2px", pointerEvents: "none", zIndex: 10 }} />
    </div>
  );
}

/** Capture the already-rendered certificate element as a PNG using html-to-image.
 *  This preserves container-query units (cqw) and CSS blend modes exactly as seen in browser. */
async function downloadCertAsImage(el: HTMLElement, certId: string) {
  const { toPng } = await import("html-to-image");
  const dataUrl = await toPng(el, {
    pixelRatio: 2,
    cacheBust: true,
    skipFonts: false,
  });
  const link = document.createElement("a");
  link.download = `Certificate-${certId}.png`;
  link.href = dataUrl;
  link.click();
}



export default function CertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState<Certificate | null>(null);
  const [downloading, setDownloading] = useState(false);
  const certContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      api.certificates.list(),
      api.profile.get(),
    ])
      .then(([certsData, profile]) => {
        setCerts(certsData);
        setStudentName(profile.name);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (cert: Certificate) => {
    if (cert.status !== "verified") return;
    // Open the modal (if not already showing this cert) so the certificate is in the DOM
    flushSync(() => {
      setDownloading(true);
      if (!viewModal || viewModal.id !== cert.id) setViewModal(cert);
    });
    // Wait for React to paint + images/fonts to load
    await new Promise(r => setTimeout(r, 1000));
    try {
      if (certContainerRef.current) {
        await downloadCertAsImage(certContainerRef.current, cert.id);
      }
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "clamp(16px, 3vw, 28px) clamp(12px, 3vw, 24px)", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "200px" }}>
        <div style={{ width: "32px", height: "32px", border: "3px solid rgba(167,139,250,0.25)", borderTopColor: "#A78BFA", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

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
          <p style={{ color: "rgba(255,255,255,0.42)", fontSize: "13px", margin: 0 }}>Hall of Achievement — {certs.length} certificate{certs.length !== 1 ? "s" : ""} earned</p>
        </div>
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", flexShrink: 0, paddingLeft: "20px", borderLeft: "1px solid rgba(255,255,255,0.10)" }}>
          <p style={{ fontSize: "44px", fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1 }}>{certs.length}</p>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)", margin: "4px 0 0", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total</p>
        </div>
      </div>

      {/* Empty state */}
      {certs.length === 0 ? (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "56px 24px", textAlign: "center" }}>
          <div style={{ width: "68px", height: "68px", borderRadius: "50%", border: "2px dashed rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Trophy size={26} style={{ color: "rgba(255,255,255,0.18)" }} />
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontWeight: 700, fontSize: "16px", margin: "0 0 8px" }}>No certificates yet</p>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", margin: 0 }}>Complete a course and pass all module tests to earn a certificate.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: "20px" }}>
          {certs.map(c => {
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
                        <Download size={14} /> {downloading ? "Generating..." : "Download PNG"}
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
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.90)", backdropFilter: "blur(10px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "clamp(12px, 3vw, 24px)", overflowY: "auto" }}
          onClick={() => setViewModal(null)}
        >
          <div style={{ position: "relative", width: "min(100%, 1020px)", margin: "auto 0" }} onClick={e => e.stopPropagation()}>

            {/* Close button */}
            <button
              onClick={() => setViewModal(null)}
              style={{ position: "absolute", top: "-14px", right: "-14px", zIndex: 20, width: "34px", height: "34px", borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}
            >
              <X size={15} />
            </button>

            {/* Certificate */}
            <div ref={certContainerRef} style={{ borderRadius: "10px", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.75)" }}>
              <CertificateView
                studentName={studentName}
                course={viewModal.course}
                issued={viewModal.issued}
                id={viewModal.id}
                status={viewModal.status}
              />
            </div>

            {/* Download button */}
            {viewModal.status === "verified" && (
              <button
                onClick={() => handleDownload(viewModal)}
                disabled={downloading}
                style={{ marginTop: "14px", width: "100%", padding: "13px", borderRadius: "12px", background: "linear-gradient(135deg,#7C3AED,#5B21B6)", border: "none", color: "#fff", fontSize: "15px", fontWeight: 700, cursor: downloading ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", opacity: downloading ? 0.7 : 1 }}
              >
                <Download size={16} /> {downloading ? "Generating image..." : "Download Certificate (PNG)"}
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
