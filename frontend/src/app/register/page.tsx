"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Award, BookOpen, Brain, Eye, EyeOff, Loader2, Lock, Mail, Phone, Sparkles, User } from "lucide-react";
import { api, saveToken } from "../../lib/api";

const DOTS: { top: string; left: string; size: number; color: string }[] = [
  { top: "6%", left: "9%", size: 4, color: "rgba(139,92,246,0.7)" },
  { top: "16%", left: "87%", size: 3, color: "rgba(255,255,255,0.2)" },
  { top: "4%", left: "50%", size: 2, color: "rgba(34,211,238,0.45)" },
  { top: "33%", left: "12%", size: 3, color: "rgba(255,255,255,0.18)" },
  { top: "46%", left: "94%", size: 4, color: "rgba(139,92,246,0.5)" },
  { top: "60%", left: "5%", size: 3, color: "rgba(34,211,238,0.35)" },
  { top: "74%", left: "82%", size: 5, color: "rgba(255,255,255,0.14)" },
  { top: "87%", left: "30%", size: 3, color: "rgba(139,92,246,0.6)" },
  { top: "94%", left: "67%", size: 2, color: "rgba(34,211,238,0.3)" },
  { top: "40%", left: "74%", size: 3, color: "rgba(34,211,238,0.4)" },
];

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.phone) {
      toast.error("All fields are required.");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (form.phone.length !== 10) {
      toast.error("Enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.auth.register(form);
      saveToken(res.access_token);
      toast.success("Account created! Welcome to EduPath.");
      router.push(res.role === "admin" ? "/admin" : "/dashboard");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "#fff",
    padding: "13px 16px 13px 44px",
    fontSize: "14px",
    outline: "none",
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "rgba(124,58,237,0.7)";
    e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.18)";
    e.target.style.background = "rgba(255,255,255,0.07)";
  };

  const blurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "rgba(255,255,255,0.1)";
    e.target.style.boxShadow = "none";
    e.target.style.background = "rgba(255,255,255,0.05)";
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#07060e",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 14px",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 50%, rgba(88,28,220,0.28) 0%, transparent 55%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 85% 15%, rgba(15,160,180,0.14) 0%, transparent 45%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)", backgroundSize: "38px 38px" }} />

      {DOTS.map((d, i) => (
        <div key={i} style={{ position: "absolute", top: d.top, left: d.left, width: d.size, height: d.size, borderRadius: "50%", background: d.color, pointerEvents: "none" }} />
      ))}

      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "22px" }}>
          <div style={{ width: "68px", height: "68px", borderRadius: "22px", background: "linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", boxShadow: "0 0 48px rgba(124,58,237,0.45)" }}>
            <Brain size={34} color="white" />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", margin: 0 }}>Create Account</h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", marginTop: "5px" }}>Join EduPath today</p>
        </div>

        <div style={{ background: "rgba(14, 11, 30, 0.88)", border: "1px solid rgba(139,92,246,0.22)", borderRadius: "20px", padding: "clamp(20px, 5vw, 28px)", backdropFilter: "blur(24px)", boxShadow: "0 30px 90px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "20px", color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
            <Sparkles size={13} color="rgba(139,92,246,0.9)" />
            <span>Fill in your details to get started</span>
          </div>

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "8px" }}>Full Name</label>
              <div style={{ position: "relative" }}>
                <User size={15} color="rgba(255,255,255,0.28)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "8px" }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={15} color="rgba(255,255,255,0.28)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "8px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={15} color="rgba(255,255,255,0.28)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input type={showPass ? "text" : "password"} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min 8 characters" style={{ ...inputStyle, paddingRight: "48px" }} onFocus={focusStyle} onBlur={blurStyle} />
                <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.38)", padding: 0, display: "flex" }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "8px" }}>Phone Number</label>
              <div style={{ position: "relative" }}>
                <Phone size={15} color="rgba(255,255,255,0.28)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <span style={{ position: "absolute", left: "36px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", color: "rgba(255,255,255,0.38)", pointerEvents: "none", fontFamily: "monospace" }}>+91</span>
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))} placeholder="10-digit number" style={{ ...inputStyle, paddingLeft: "72px" }} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", background: loading ? "rgba(124,58,237,0.5)" : "linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)", color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "4px", boxShadow: loading ? "none" : "0 6px 24px rgba(124,58,237,0.45)" }}>
              {loading ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Creating...</> : "Create Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "14px", color: "rgba(255,255,255,0.35)", marginTop: "20px" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#A78BFA", fontWeight: 600, textDecoration: "none" }}>Sign In</Link>
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", marginTop: "20px", flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "rgba(255,255,255,0.22)" }}><Sparkles size={11} /> AI-Powered</span>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.12)", margin: "0 6px" }}>.</span>
          <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "rgba(255,255,255,0.22)" }}><Award size={11} /> Certified Courses</span>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.12)", margin: "0 6px" }}>.</span>
          <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "rgba(255,255,255,0.22)" }}><BookOpen size={11} /> Learn &amp; Grow</span>
        </div>
      </div>
    </div>
  );
}
