"use client";
import { useState } from "react";
import Link from "next/link";
import { Brain, Mail, Lock, Eye, EyeOff, Loader2, Sparkles, Award, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { api, saveToken } from "../../lib/api";

const DOTS: { top: string; left: string; size: number; color: string }[] = [
  { top: "7%",  left: "7%",  size: 4, color: "rgba(139,92,246,0.7)" },
  { top: "18%", left: "88%", size: 3, color: "rgba(255,255,255,0.25)" },
  { top: "5%",  left: "48%", size: 2, color: "rgba(34,211,238,0.45)" },
  { top: "32%", left: "14%", size: 3, color: "rgba(255,255,255,0.2)" },
  { top: "44%", left: "93%", size: 4, color: "rgba(139,92,246,0.5)" },
  { top: "62%", left: "6%",  size: 3, color: "rgba(34,211,238,0.35)" },
  { top: "76%", left: "80%", size: 5, color: "rgba(255,255,255,0.15)" },
  { top: "88%", left: "28%", size: 3, color: "rgba(139,92,246,0.6)" },
  { top: "92%", left: "65%", size: 2, color: "rgba(34,211,238,0.3)" },
  { top: "55%", left: "97%", size: 3, color: "rgba(255,255,255,0.2)" },
  { top: "14%", left: "58%", size: 2, color: "rgba(139,92,246,0.4)" },
  { top: "70%", left: "45%", size: 4, color: "rgba(255,255,255,0.12)" },
  { top: "38%", left: "72%", size: 3, color: "rgba(34,211,238,0.4)" },
  { top: "82%", left: "12%", size: 2, color: "rgba(139,92,246,0.5)" },
  { top: "25%", left: "3%",  size: 3, color: "rgba(255,255,255,0.18)" },
  { top: "50%", left: "55%", size: 2, color: "rgba(139,92,246,0.3)" },
  { top: "96%", left: "90%", size: 4, color: "rgba(34,211,238,0.35)" },
  { top: "10%", left: "73%", size: 3, color: "rgba(255,255,255,0.22)" },
];

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill in all fields."); return; }
    setLoading(true);
    try {
      const res = await api.auth.login(email, password);
      saveToken(res.access_token);
      toast.success(`Welcome back, ${res.name}!`);
      router.push(res.role === "admin" ? "/admin" : "/dashboard");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const darkInput: React.CSSProperties = {
    display: "block", width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "#fff", padding: "13px 16px 13px 44px", fontSize: "14px",
    outline: "none",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#07060e",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px 16px",
      position: "relative", overflow: "hidden",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      {/* Purple radial glow */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 50%, rgba(88,28,220,0.28) 0%, transparent 55%)", pointerEvents: "none" }} />
      {/* Teal radial glow */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 85% 15%, rgba(15,160,180,0.14) 0%, transparent 45%)", pointerEvents: "none" }} />
      {/* Dot grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)",
        backgroundSize: "38px 38px",
      }} />
      {/* Floating particles */}
      {DOTS.map((d, i) => (
        <div key={i} style={{
          position: "absolute", top: d.top, left: d.left,
          width: `${d.size}px`, height: `${d.size}px`,
          borderRadius: "50%", background: d.color,
          pointerEvents: "none",
        }} />
      ))}

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "22px",
            background: "linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 0 48px rgba(124,58,237,0.45)",
          }}>
            <Brain size={38} color="white" />
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.4px" }}>EduPath</h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", marginTop: "6px" }}>Sign in to continue learning</p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(14, 11, 30, 0.88)",
          border: "1px solid rgba(139,92,246,0.22)",
          borderRadius: "20px",
          padding: "32px",
          backdropFilter: "blur(24px)",
          boxShadow: "0 30px 90px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}>
          {/* Hint row */}
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "22px", color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
            <Sparkles size={13} color="rgba(139,92,246,0.9)" />
            <span>Login with your email and password</span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "8px" }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={15} color="rgba(255,255,255,0.28)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" autoComplete="email"
                  style={darkInput}
                  onFocus={e => { e.target.style.borderColor = "rgba(124,58,237,0.7)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.18)"; e.target.style.background = "rgba(255,255,255,0.07)"; }}
                  onBlur={e  => { e.target.style.borderColor = "rgba(255,255,255,0.1)";  e.target.style.boxShadow = "none"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "8px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={15} color="rgba(255,255,255,0.28)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password" autoComplete="current-password"
                  style={{ ...darkInput, paddingRight: "48px" }}
                  onFocus={e => { e.target.style.borderColor = "rgba(124,58,237,0.7)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.18)"; e.target.style.background = "rgba(255,255,255,0.07)"; }}
                  onBlur={e  => { e.target.style.borderColor = "rgba(255,255,255,0.1)";  e.target.style.boxShadow = "none"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.38)", padding: 0, display: "flex" }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{
                width: "100%", padding: "14px",
                background: loading ? "rgba(124,58,237,0.5)" : "linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)",
                color: "#fff", border: "none", borderRadius: "12px",
                fontSize: "15px", fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                marginTop: "4px",
                boxShadow: loading ? "none" : "0 6px 24px rgba(124,58,237,0.45)",
                transition: "box-shadow 0.2s",
              }}>
              {loading
                ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Signing in...</>
                : <><span style={{ marginRight: "2px" }}>→</span> Sign In</>
              }
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "14px", color: "rgba(255,255,255,0.35)", marginTop: "22px" }}>
            New to EduPath?{" "}
            <Link href="/register" style={{ color: "#A78BFA", fontWeight: 600, textDecoration: "none" }}>Register Now</Link>
          </p>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", marginTop: "24px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "rgba(255,255,255,0.22)" }}>
            <Sparkles size={11} /> AI-Powered
          </span>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.12)", margin: "0 6px" }}>·</span>
          <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "rgba(255,255,255,0.22)" }}>
            <Award size={11} /> Certified Courses
          </span>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.12)", margin: "0 6px" }}>·</span>
          <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "rgba(255,255,255,0.22)" }}>
            <BookOpen size={11} /> Learn &amp; Grow
          </span>
        </div>
      </div>
    </div>
  );
}
