"use client";
import Link from "next/link";
import { GraduationCap, PlayCircle, ChevronRight, BookOpen, Award, TrendingUp, Shield, Video, FileCheck, Zap } from "lucide-react";

const STATS = [
  { value: "50+", label: "Courses Available" },
  { value: "5,000+", label: "Students Enrolled" },
  { value: "98%", label: "Completion Rate" },
  { value: "200+", label: "Certificates Issued" },
];

const FEATURES = [
  { icon: Video,      label: "Video Lectures",       desc: "Expert-taught video lessons covering every engineering and science topic with structured, sequential modules.",            color: "#A78BFA", bg: "rgba(124,58,237,0.1)",  border: "rgba(124,58,237,0.2)"  },
  { icon: BookOpen,   label: "Structured Curriculum", desc: "Modules unlock sequentially. Complete each lecture, pass checkpoint questions, and earn your score.",                    color: "#22D3EE", bg: "rgba(6,182,212,0.1)",   border: "rgba(6,182,212,0.2)"   },
  { icon: Award,      label: "Verified Certificates", desc: "Earn a scannable, verifiable certificate for every course you complete and pass. Share it anywhere.",                   color: "#FCD34D", bg: "rgba(252,211,77,0.08)", border: "rgba(252,211,77,0.18)" },
  { icon: FileCheck,  label: "Practice Tests",        desc: "End-of-module quizzes with detailed explanations help you identify gaps and reinforce learning.",                       color: "#4ADE80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.18)" },
  { icon: Shield,     label: "Trusted Content",       desc: "Curriculum aligned with national standards — CBSE, JEE, and first-year engineering syllabi.",                           color: "#60A5FA", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.18)" },
  { icon: TrendingUp, label: "Track Your Progress",   desc: "Personal dashboards show exactly where you stand — scores, completion rates, and week-on-week improvement.",           color: "#F87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.18)" },
];

const JOURNEY = [
  { step: "01", icon: Video,      label: "Watch Lectures",   desc: "Follow structured video modules at your own pace.",               color: "#A78BFA" },
  { step: "02", icon: Zap,        label: "Take Module Tests", desc: "Pass the end-of-module quiz to unlock the next one.",             color: "#22D3EE" },
  { step: "03", icon: TrendingUp, label: "Track Progress",   desc: "See your scores and growth in your personal dashboard.",          color: "#4ADE80" },
  { step: "04", icon: Award,      label: "Get Certified",    desc: "Complete the course and receive your verified certificate.",       color: "#FCD34D" },
];

const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Computer Science", "Engineering Drawing", "Electronics", "Mechanics", "English"];

const cx = { maxWidth: "1120px", margin: "0 auto", paddingLeft: "32px", paddingRight: "32px" } as const;

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#050508" }}>

      {/* ── Background ─────────────────────────────────────────── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div className="grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />
        <div style={{ position: "absolute", top: "-160px", left: "22%", width: "680px", height: "680px", background: "radial-gradient(circle, rgba(124,58,237,0.18), transparent 65%)", borderRadius: "50%", filter: "blur(30px)" }} />
        <div style={{ position: "absolute", bottom: "5%", right: "8%", width: "560px", height: "560px", background: "radial-gradient(circle, rgba(6,182,212,0.12), transparent 65%)", borderRadius: "50%", filter: "blur(30px)" }} />
      </div>

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(5,5,8,0.88)", backdropFilter: "blur(20px)" }}>
        <div style={{ ...cx, display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "11px", background: "linear-gradient(135deg,#7C3AED,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <GraduationCap size={19} color="white" />
            </div>
            <span style={{ fontWeight: 800, color: "#fff", fontSize: "17px", letterSpacing: "-0.3px" }}>EduPath</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link href="/login" className="btn-secondary" style={{ padding: "9px 22px", fontSize: "14px" }}>Sign In</Link>
            <Link href="/register" className="btn-primary" style={{ padding: "9px 22px", fontSize: "14px" }}>Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 10, ...cx, paddingTop: "100px", paddingBottom: "80px", textAlign: "center" }}>

        {/* Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "6px 16px", borderRadius: "100px", marginBottom: "32px", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)" }}>
          <GraduationCap size={13} color="#A78BFA" />
          <span style={{ color: "#C4B5FD", fontSize: "13px", fontWeight: 600 }}>Built for Post-School Students</span>
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 900, color: "#fff", lineHeight: 1.08, letterSpacing: "-2px", marginBottom: "24px" }}>
          From School to Your<br />
          <span className="gradient-text">Dream Engineering</span><br />
          Career
        </h1>

        {/* Sub-headline */}
        <p style={{ fontSize: "clamp(15px, 1.5vw, 18px)", color: "rgba(255,255,255,0.55)", maxWidth: "560px", margin: "0 auto 44px", lineHeight: 1.75 }}>
          A structured learning platform with video lectures, practice tests, and verified certificates — built for students stepping into engineering.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", justifyContent: "center", marginBottom: "72px" }}>
          <Link href="/register" className="btn-primary" style={{ padding: "14px 32px", fontSize: "16px", display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <PlayCircle size={18} /> Start Learning Free
          </Link>
          <Link href="/login" className="btn-secondary" style={{ padding: "14px 32px", fontSize: "16px", display: "inline-flex", alignItems: "center", gap: "8px" }}>
            Sign In <ChevronRight size={18} />
          </Link>
        </div>

        {/* Stats bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: "rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }}>
          {STATS.map(({ value, label }) => (
            <div key={label} style={{ padding: "22px 12px", textAlign: "center", background: "rgba(255,255,255,0.02)" }}>
              <p className="gradient-text" style={{ fontSize: "clamp(22px, 2.5vw, 30px)", fontWeight: 800, marginBottom: "4px" }}>{value}</p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Subjects ribbon ────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 10, ...cx, paddingBottom: "72px" }}>
        <div className="neon-line" style={{ marginBottom: "36px" }} />
        <p style={{ textAlign: "center", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontWeight: 700, marginBottom: "18px" }}>Subjects Covered</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
          {SUBJECTS.map(s => (
            <span key={s} style={{ padding: "8px 18px", borderRadius: "100px", fontSize: "13px", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", fontWeight: 500 }}>{s}</span>
          ))}
        </div>
      </div>

      {/* ── Features ───────────────────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 10, ...cx, paddingBottom: "96px" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 800, color: "#fff", marginBottom: "14px", letterSpacing: "-0.5px" }}>Everything You Need to Learn</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", maxWidth: "460px", margin: "0 auto", fontSize: "16px", lineHeight: 1.6 }}>Purpose-built tools for effective, structured, and rewarding learning.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "20px" }}>
          {FEATURES.map(({ icon: Icon, label, desc, color, bg, border }) => (
            <div key={label} className="glass-card-hover" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: bg, border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={22} color={color} />
              </div>
              <h3 style={{ fontWeight: 700, color: "#fff", fontSize: "15px" }}>{label}</h3>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Journey ────────────────────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 10, ...cx, paddingBottom: "96px" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 800, color: "#fff", marginBottom: "14px", letterSpacing: "-0.5px" }}>Your Learning Journey</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px" }}>A clear, structured path from enrolment to certification.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: "20px" }}>
          {JOURNEY.map(({ step, icon: Icon, label, desc, color }) => (
            <div key={step} className="glass-card" style={{ padding: "28px", position: "relative", overflow: "hidden" }}>
              <span style={{ position: "absolute", top: "12px", right: "14px", fontSize: "54px", fontWeight: 900, color: "rgba(255,255,255,0.04)", lineHeight: 1, userSelect: "none" }}>{step}</span>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}>
                <Icon size={20} color={color} />
              </div>
              <p style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontWeight: 700, marginBottom: "6px" }}>Step {step}</p>
              <h3 style={{ fontWeight: 700, color: "#fff", fontSize: "15px", marginBottom: "8px" }}>{label}</h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 10, ...cx, paddingBottom: "112px" }}>
        <div style={{ borderRadius: "24px", padding: "72px 48px", textAlign: "center", position: "relative", overflow: "hidden", background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.07))", border: "1px solid rgba(124,58,237,0.3)" }}>
          <div className="grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.12, borderRadius: "24px" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, #7C3AED 40%, #22D3EE 60%, transparent)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "20px", background: "linear-gradient(135deg,rgba(124,58,237,0.35),rgba(6,182,212,0.2))", border: "1px solid rgba(124,58,237,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <GraduationCap size={30} color="#C4B5FD" />
            </div>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 800, color: "#fff", marginBottom: "16px", letterSpacing: "-0.5px" }}>Ready to Start Your Journey?</h2>
            <p style={{ color: "rgba(255,255,255,0.55)", maxWidth: "460px", margin: "0 auto 36px", fontSize: "16px", lineHeight: 1.65 }}>
              Join thousands of students building real engineering skills and earning verified certificates.
            </p>
            <Link href="/register" className="btn-primary" style={{ padding: "14px 36px", fontSize: "16px", display: "inline-flex", alignItems: "center", gap: "9px" }}>
              <GraduationCap size={18} /> Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer style={{ position: "relative", zIndex: 10, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ ...cx, paddingTop: "32px", paddingBottom: "32px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "linear-gradient(135deg,#7C3AED,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <GraduationCap size={15} color="white" />
            </div>
            <span style={{ fontWeight: 700, color: "#fff", fontSize: "15px" }}>EduPath</span>
          </div>
          <div style={{ display: "flex", gap: "24px" }}>
            <Link href="/login" style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", textDecoration: "none" }}>Sign In</Link>
            <Link href="/register" style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", textDecoration: "none" }}>Register</Link>
          </div>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "13px" }}>© 2026 EduPath. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
