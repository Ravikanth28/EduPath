"use client";
import Link from "next/link";
import { GraduationCap, PlayCircle, ChevronRight, BookOpen, Award, TrendingUp, Shield, Video, FileCheck, Zap } from "lucide-react";

/* ── colour tokens ───────────────────────────────────────────── */
const P = "#7C3AED";          // primary violet
const PL = "#A78BFA";         // light violet
const PD = "#6D28D9";         // dark violet
const CARD = "rgba(13,13,26,0.85)";
const BORDER = "rgba(124,58,237,0.15)";

const STATS = [
  { value: "50+", label: "Courses Available" },
  { value: "5,000+", label: "Students Enrolled" },
  { value: "98%", label: "Completion Rate" },
  { value: "200+", label: "Certificates Issued" },
];

const FEATURES = [
  { icon: Video,      label: "Video Lectures",       desc: "Expert-taught video lessons covering every engineering and science topic with structured, sequential modules." },
  { icon: BookOpen,   label: "Structured Curriculum", desc: "Modules unlock sequentially. Complete each lecture, pass checkpoint questions, and earn your score." },
  { icon: Award,      label: "Verified Certificates", desc: "Earn a scannable, verifiable certificate for every course you complete and pass. Share it anywhere." },
  { icon: FileCheck,  label: "Practice Tests",        desc: "End-of-module quizzes with detailed explanations help you identify gaps and reinforce learning." },
  { icon: Shield,     label: "Trusted Content",       desc: "Curriculum aligned with national standards - CBSE, JEE, and first-year engineering syllabi." },
  { icon: TrendingUp, label: "Track Your Progress",   desc: "Personal dashboards show exactly where you stand - scores, completion rates, and week-on-week improvement." },
];

const JOURNEY = [
  { step: "01", icon: Video,      label: "Watch Lectures",    desc: "Follow structured video modules at your own pace." },
  { step: "02", icon: Zap,        label: "Take Module Tests", desc: "Pass the end-of-module quiz to unlock the next one." },
  { step: "03", icon: TrendingUp, label: "Track Progress",    desc: "See your scores and growth in your personal dashboard." },
  { step: "04", icon: Award,      label: "Get Certified",     desc: "Complete the course and receive your verified certificate." },
];

const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Computer Science", "Engineering Drawing", "Electronics", "Mechanics", "English"];

const cx = { maxWidth: "1120px", margin: "0 auto", paddingLeft: "32px", paddingRight: "32px" } as const;

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#050508", color: "#FFFFFF", fontFamily: "Inter, sans-serif" }}>

      {/* ── Background glows ───────────────────────────────────── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-15%", left: "-8%", width: "700px", height: "700px", background: `radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 65%)`, borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "5%", right: "-8%", width: "600px", height: "600px", background: `radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 65%)`, borderRadius: "50%" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
      </div>

      {/* ── Navbar ────────────────────────────────────────────── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(5,5,8,0.82)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ ...cx, display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "11px", background: `linear-gradient(135deg,${P},${PD})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <GraduationCap size={19} color="white" />
            </div>
            <span style={{ fontWeight: 800, color: "#FFFFFF", fontSize: "17px", letterSpacing: "-0.3px" }}>EduPath</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link href="/login" style={{ padding: "9px 22px", fontSize: "14px", fontWeight: 600, color: "#FFFFFF", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.16)", borderRadius: "12px", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>Sign In</Link>
            <Link href="/register" style={{ padding: "9px 22px", fontSize: "14px", fontWeight: 700, color: "#FFFFFF", background: `linear-gradient(135deg,${P},${PD})`, border: "none", borderRadius: "12px", textDecoration: "none", display: "inline-flex", alignItems: "center", boxShadow: `0 0 18px rgba(124,58,237,0.35)` }}>Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 10, ...cx, paddingTop: "100px", paddingBottom: "80px", textAlign: "center" }}>

        {/* Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "6px 16px", borderRadius: "100px", marginBottom: "32px", background: `rgba(124,58,237,0.12)`, border: `1px solid rgba(124,58,237,0.40)`, boxShadow: `0 0 20px rgba(124,58,237,0.18)` }}>
          <GraduationCap size={13} color={PL} />
          <span style={{ color: PL, fontSize: "13px", fontWeight: 600 }}>Built for Post-School Students</span>
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: "clamp(38px, 6vw, 74px)", fontWeight: 900, color: "#FFFFFF", lineHeight: 1.08, letterSpacing: "-2px", marginBottom: "24px" }}>
          From School to Your<br />
          <span style={{ background: `linear-gradient(90deg, ${PL}, #60A5FA)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Dream Engineering</span><br />
          Career
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: "clamp(15px, 1.5vw, 18px)", color: "rgba(255,255,255,0.62)", maxWidth: "560px", margin: "0 auto 44px", lineHeight: 1.78 }}>
          A structured learning platform with video lectures, practice tests, and verified certificates - built for students stepping into engineering.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", justifyContent: "center", marginBottom: "72px" }}>
          <Link href="/register" style={{ padding: "14px 32px", fontSize: "16px", fontWeight: 700, color: "#FFFFFF", background: `linear-gradient(135deg,${P},${PD})`, border: "none", borderRadius: "12px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px", boxShadow: `0 0 28px rgba(124,58,237,0.40)` }}>
            <PlayCircle size={18} /> Start Learning Free
          </Link>
          <Link href="/login" style={{ padding: "14px 32px", fontSize: "16px", fontWeight: 600, color: "#FFFFFF", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.20)", borderRadius: "12px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}>
            Sign In <ChevronRight size={18} />
          </Link>
        </div>

        {/* Stats bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: "rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
          {STATS.map(({ value, label }) => (
            <div key={label} style={{ padding: "22px 12px", textAlign: "center", background: "#0D0D1A" }}>
              <p style={{ fontSize: "clamp(22px, 2.5vw, 30px)", fontWeight: 800, marginBottom: "4px", color: PL }}>{value}</p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Subjects ribbon ───────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 10, ...cx, paddingBottom: "72px" }}>
        <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${P}, ${PL}, transparent)`, marginBottom: "36px" }} />
        <p style={{ textAlign: "center", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.30)", fontWeight: 700, marginBottom: "18px" }}>Subjects Covered</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
          {SUBJECTS.map(s => (
            <span key={s} style={{ padding: "8px 18px", borderRadius: "100px", fontSize: "13px", color: "rgba(255,255,255,0.60)", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", fontWeight: 500 }}>{s}</span>
          ))}
        </div>
      </div>

      {/* ── Features ──────────────────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 10, ...cx, paddingBottom: "96px" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 800, color: "#FFFFFF", marginBottom: "14px", letterSpacing: "-0.5px" }}>Everything You Need to Learn</h2>
          <p style={{ color: "rgba(255,255,255,0.48)", maxWidth: "460px", margin: "0 auto", fontSize: "16px", lineHeight: 1.6 }}>Purpose-built tools for effective, structured, and rewarding learning.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div key={label} style={{ padding: "28px", background: CARD, border: BORDER, borderWidth: "1px", borderStyle: "solid", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "14px", backdropFilter: "blur(8px)" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: `rgba(124,58,237,0.14)`, border: `1px solid rgba(124,58,237,0.28)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={22} color={PL} />
              </div>
              <h3 style={{ fontWeight: 700, color: "#FFFFFF", fontSize: "15px" }}>{label}</h3>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.42)", lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Journey ───────────────────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 10, ...cx, paddingBottom: "96px" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 800, color: "#FFFFFF", marginBottom: "14px", letterSpacing: "-0.5px" }}>Your Learning Journey</h2>
          <p style={{ color: "rgba(255,255,255,0.48)", fontSize: "16px" }}>A clear, structured path from enrolment to certification.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
          {JOURNEY.map(({ step, icon: Icon, label, desc }) => (
            <div key={step} style={{ padding: "28px", background: CARD, border: BORDER, borderWidth: "1px", borderStyle: "solid", borderRadius: "16px", position: "relative", overflow: "hidden", backdropFilter: "blur(8px)" }}>
              <span style={{ position: "absolute", top: "12px", right: "14px", fontSize: "54px", fontWeight: 900, color: `rgba(167,139,250,0.07)`, lineHeight: 1, userSelect: "none" }}>{step}</span>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: `rgba(124,58,237,0.14)`, border: `1px solid rgba(124,58,237,0.28)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}>
                <Icon size={20} color={PL} />
              </div>
              <p style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: `rgba(167,139,250,0.45)`, fontWeight: 700, marginBottom: "6px" }}>Step {step}</p>
              <h3 style={{ fontWeight: 700, color: "#FFFFFF", fontSize: "15px", marginBottom: "8px" }}>{label}</h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.42)", lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 10, ...cx, paddingBottom: "112px" }}>
        <div style={{ borderRadius: "24px", padding: "72px 48px", textAlign: "center", position: "relative", overflow: "hidden", background: `linear-gradient(135deg, rgba(124,58,237,0.18), rgba(109,40,217,0.10))`, border: `1px solid rgba(124,58,237,0.28)`, boxShadow: `0 0 60px rgba(124,58,237,0.12)` }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "30px 30px", borderRadius: "24px" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg, transparent, ${P}, ${PL}, transparent)` }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "20px", background: `rgba(124,58,237,0.18)`, border: `1px solid rgba(124,58,237,0.38)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <GraduationCap size={30} color={PL} />
            </div>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 800, color: "#FFFFFF", marginBottom: "16px", letterSpacing: "-0.5px" }}>Ready to Start Your Journey?</h2>
            <p style={{ color: "rgba(255,255,255,0.52)", maxWidth: "460px", margin: "0 auto 36px", fontSize: "16px", lineHeight: 1.65 }}>
              Join thousands of students building real engineering skills and earning verified certificates.
            </p>
            <Link href="/register" style={{ padding: "14px 36px", fontSize: "16px", fontWeight: 700, color: "#FFFFFF", background: `linear-gradient(135deg,${P},${PD})`, borderRadius: "12px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "9px", boxShadow: `0 0 28px rgba(124,58,237,0.40)` }}>
              <GraduationCap size={18} /> Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer style={{ position: "relative", zIndex: 10, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ ...cx, paddingTop: "32px", paddingBottom: "32px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: `linear-gradient(135deg,${P},${PD})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <GraduationCap size={15} color="white" />
            </div>
            <span style={{ fontWeight: 700, color: "#FFFFFF", fontSize: "15px" }}>EduPath</span>
          </div>
          <div style={{ display: "flex", gap: "24px" }}>
            <Link href="/login" style={{ color: "rgba(255,255,255,0.28)", fontSize: "14px", textDecoration: "none" }}>Sign In</Link>
            <Link href="/register" style={{ color: "rgba(255,255,255,0.28)", fontSize: "14px", textDecoration: "none" }}>Register</Link>
          </div>
          <p style={{ color: "rgba(255,255,255,0.18)", fontSize: "13px" }}>(c) 2026 EduPath. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
