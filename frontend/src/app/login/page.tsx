"use client";
import { useState } from "react";
import Link from "next/link";
import { GraduationCap, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { api, saveToken } from "../../lib/api";

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

  const inputStyle: React.CSSProperties = {
    display: "block", width: "100%", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px",
    color: "#fff", padding: "13px 44px 13px 44px", fontSize: "14px",
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050508", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", position: "relative", overflow: "hidden" }}>

      {/* Background */}
      <div className="grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.4, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "15%", left: "20%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(124,58,237,0.2), transparent 65%)", borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "15%", right: "15%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(6,182,212,0.14), transparent 65%)", borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none" }} />

      {/* Card */}
      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "400px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "24px", background: "linear-gradient(135deg,#7C3AED,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <GraduationCap size={40} color="white" />
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.4px" }}>EduPath</h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", marginTop: "6px" }}>Sign in to continue learning</p>
        </div>

        {/* Form card */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "32px", boxShadow: "0 0 60px rgba(124,58,237,0.1)" }}>
          {/* Top accent line */}
          <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(90deg, transparent, #7C3AED, #22D3EE, transparent)", borderRadius: "1px" }} />

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Email</label>
              <div style={{ position: "relative" }}>
                <Mail size={15} color="rgba(255,255,255,0.35)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" autoComplete="email"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = "rgba(124,58,237,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.12)"; }}
                  onBlur={e  => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={15} color="rgba(255,255,255,0.35)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" autoComplete="current-password"
                  style={{ ...inputStyle, paddingRight: "48px" }}
                  onFocus={e => { e.target.style.borderColor = "rgba(124,58,237,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.12)"; }}
                  onBlur={e  => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 0, display: "flex" }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#7C3AED,#06B6D4)", color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              {loading ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Signing in...</> : "Sign In"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "14px", color: "rgba(255,255,255,0.45)", marginTop: "20px" }}>
            New here?{" "}
            <Link href="/register" style={{ color: "#A78BFA", fontWeight: 600, textDecoration: "none" }}>Create an account</Link>
          </p>
        </div>

        {/* Footer hints */}
        <div style={{ display: "flex", justifyContent: "center", gap: "28px", marginTop: "24px" }}>
          {["Structured Courses", "Earn Certificates", "Track Progress"].map(label => (
            <span key={label} style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
