"use client";
import { useState } from "react";
import Link from "next/link";
import { Brain, User, Mail, Lock, Phone, Eye, EyeOff, Loader2, CheckCircle, Sparkles, Award, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { api, saveToken } from "../../lib/api";

const DOTS: { top: string; left: string; size: number; color: string }[] = [
  { top: "6%",  left: "9%",  size: 4, color: "rgba(139,92,246,0.7)" },
  { top: "16%", left: "87%", size: 3, color: "rgba(255,255,255,0.2)" },
  { top: "4%",  left: "50%", size: 2, color: "rgba(34,211,238,0.45)" },
  { top: "33%", left: "12%", size: 3, color: "rgba(255,255,255,0.18)" },
  { top: "46%", left: "94%", size: 4, color: "rgba(139,92,246,0.5)" },
  { top: "60%", left: "5%",  size: 3, color: "rgba(34,211,238,0.35)" },
  { top: "74%", left: "82%", size: 5, color: "rgba(255,255,255,0.14)" },
  { top: "87%", left: "30%", size: 3, color: "rgba(139,92,246,0.6)" },
  { top: "94%", left: "67%", size: 2, color: "rgba(34,211,238,0.3)" },
  { top: "52%", left: "98%", size: 3, color: "rgba(255,255,255,0.18)" },
  { top: "13%", left: "60%", size: 2, color: "rgba(139,92,246,0.4)" },
  { top: "68%", left: "43%", size: 4, color: "rgba(255,255,255,0.1)" },
  { top: "40%", left: "74%", size: 3, color: "rgba(34,211,238,0.4)" },
  { top: "80%", left: "15%", size: 2, color: "rgba(139,92,246,0.5)" },
  { top: "23%", left: "2%",  size: 3, color: "rgba(255,255,255,0.16)" },
  { top: "97%", left: "88%", size: 4, color: "rgba(34,211,238,0.32)" },
];

export default function RegisterPage() {
  const [step, setStep]         = useState(1);
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm]         = useState({ name: "", email: "", password: "", phone: "" });
  const [otp, setOtp]           = useState("");
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.phone) { toast.error("All fields are required."); return; }
    if (form.password.length < 8) { toast.error("Password must be at least 8 characters."); return; }
    if (form.phone.length !== 10) { toast.error("Enter a valid 10-digit phone number."); return; }
    setLoading(true);
    try {
      await api.auth.register(form);
      toast.success("OTP sent! Check the server console for the code.");
      setStep(2);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) { toast.error("Enter the OTP."); return; }
    setLoading(true);
    try {
      const res = await api.auth.verifyOtp(form.email, otp);
      saveToken(res.access_token);
      toast.success("Account created! Welcome to EduPath.");
      router.push(res.role === "admin" ? "/admin" : "/dashboard");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "OTP verification failed");
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
  const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "rgba(124,58,237,0.7)";
    e.target.style.boxShadow   = "0 0 0 3px rgba(124,58,237,0.18)";
    e.target.style.background  = "rgba(255,255,255,0.07)";
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "rgba(255,255,255,0.1)";
    e.target.style.boxShadow   = "none";
    e.target.style.background  = "rgba(255,255,255,0.05)";
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#07060e",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "32px 16px",
      position: "relative", overflow: "hidden",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      {/* Gradient blobs */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 50%, rgba(88,28,220,0.28) 0%, transparent 55%)", pointerEvents: "none" }} />
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
          borderRadius: "50%", background: d.color, pointerEvents: "none",
        }} />
      ))}

      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{
            width: "68px", height: "68px", borderRadius: "22px",
            background: "linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 14px",
            boxShadow: "0 0 48px rgba(124,58,237,0.45)",
          }}>
            <Brain size={34} color="white" />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.3px" }}>Create Account</h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", marginTop: "5px" }}>Join EduPath today</p>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "18px" }}>
          {([1, 2] as const).map(s => (
            <div key={s} style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "6px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 600,
              border: `1px solid ${step === s ? "rgba(139,92,246,0.5)" : step > s ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.1)"}`,
              background: step === s ? "rgba(124,58,237,0.18)" : step > s ? "rgba(124,58,237,0.1)" : "transparent",
              color: step === s ? "#C4B5FD" : step > s ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)",
            }}>
              {step > s
                ? <CheckCircle size={11} color="#A78BFA" />
                : <span style={{ width: "16px", height: "16px", borderRadius: "50%", border: `1px solid ${step === s ? "#7C3AED" : "rgba(255,255,255,0.2)"}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>{s}</span>
              }
              {s === 1 ? "Your Details" : "Verify OTP"}
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(14, 11, 30, 0.88)",
          border: "1px solid rgba(139,92,246,0.22)",
          borderRadius: "20px",
          padding: "28px",
          backdropFilter: "blur(24px)",
          boxShadow: "0 30px 90px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}>
          {/* Hint row */}
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "20px", color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
            <Sparkles size={13} color="rgba(139,92,246,0.9)" />
            <span>{step === 1 ? "Fill in your details to get started" : "Enter the OTP sent to your phone"}</span>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Name */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "8px" }}>Full Name</label>
                <div style={{ position: "relative" }}>
                  <User size={15} color="rgba(255,255,255,0.28)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Your full name" style={darkInput} onFocus={focusStyle} onBlur={blurStyle} />
                </div>
              </div>
              {/* Email */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "8px" }}>Email Address</label>
                <div style={{ position: "relative" }}>
                  <Mail size={15} color="rgba(255,255,255,0.28)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com" style={darkInput} onFocus={focusStyle} onBlur={blurStyle} />
                </div>
              </div>
              {/* Password */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "8px" }}>Password</label>
                <div style={{ position: "relative" }}>
                  <Lock size={15} color="rgba(255,255,255,0.28)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <input type={showPass ? "text" : "password"} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Min 8 characters"
                    style={{ ...darkInput, paddingRight: "48px" }}
                    onFocus={focusStyle} onBlur={blurStyle} />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.38)", padding: 0, display: "flex" }}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              {/* Phone */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "8px" }}>Phone Number</label>
                <div style={{ position: "relative" }}>
                  <Phone size={15} color="rgba(255,255,255,0.28)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <span style={{ position: "absolute", left: "36px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", color: "rgba(255,255,255,0.38)", pointerEvents: "none", fontFamily: "monospace" }}>+91</span>
                  <input type="tel" value={form.phone}
                    onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 10); setForm(f => ({ ...f, phone: v })); }}
                    placeholder="10-digit number"
                    style={{ ...darkInput, paddingLeft: "72px" }}
                    onFocus={focusStyle} onBlur={blurStyle} />
                </div>
              </div>
              {/* Submit */}
              <button type="submit" disabled={loading}
                style={{
                  width: "100%", padding: "14px",
                  background: loading ? "rgba(124,58,237,0.5)" : "linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)",
                  color: "#fff", border: "none", borderRadius: "12px",
                  fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  marginTop: "4px", boxShadow: loading ? "none" : "0 6px 24px rgba(124,58,237,0.45)",
                }}>
                {loading ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Sending OTP...</> : <><span style={{ marginRight: "2px" }}>→</span> Send OTP</>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Info badge */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "10px", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(139,92,246,0.3)", color: "rgba(255,255,255,0.8)", fontSize: "13px" }}>
                <CheckCircle size={14} color="#A78BFA" /> OTP sent to +91 {form.phone}
              </div>
              {/* Dev hint */}
              <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
                Check the backend server console for your OTP.
              </div>
              {/* OTP input */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "8px" }}>Enter OTP</label>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="· · · · · ·"
                  style={{
                    display: "block", width: "100%", boxSizing: "border-box",
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px", color: "#fff", padding: "14px 16px",
                    fontSize: "22px", fontFamily: "monospace", textAlign: "center",
                    letterSpacing: "0.4em", outline: "none",
                  }}
                  onFocus={focusStyle as never} onBlur={blurStyle as never}
                />
              </div>
              <button type="submit" disabled={loading}
                style={{
                  width: "100%", padding: "14px",
                  background: loading ? "rgba(124,58,237,0.5)" : "linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)",
                  color: "#fff", border: "none", borderRadius: "12px",
                  fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  boxShadow: loading ? "none" : "0 6px 24px rgba(124,58,237,0.45)",
                }}>
                {loading ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Verifying...</> : <><span style={{ marginRight: "2px" }}>→</span> Verify &amp; Create Account</>}
              </button>
              <button type="button" onClick={() => setStep(1)}
                style={{
                  width: "100%", padding: "12px",
                  background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px",
                  fontSize: "14px", fontWeight: 600, cursor: "pointer",
                }}>
                ← Change Details
              </button>
            </form>
          )}

          <p style={{ textAlign: "center", fontSize: "14px", color: "rgba(255,255,255,0.35)", marginTop: "20px" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#A78BFA", fontWeight: 600, textDecoration: "none" }}>Sign In</Link>
          </p>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", marginTop: "20px" }}>
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

export default function RegisterPage() {
  const [step, setStep]         = useState(1);
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm]         = useState({ name: "", email: "", password: "", phone: "" });
  const [otp, setOtp]           = useState("");
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.phone) { toast.error("All fields are required."); return; }
    if (form.password.length < 8) { toast.error("Password must be at least 8 characters."); return; }
    if (form.phone.length !== 10) { toast.error("Enter a valid 10-digit phone number."); return; }
    setLoading(true);
    try {
      await api.auth.register(form);
      toast.success("OTP sent! Check the server console for the code.");
      setStep(2);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) { toast.error("Enter the OTP."); return; }
    setLoading(true);
    try {
      const res = await api.auth.verifyOtp(form.email, otp);
      saveToken(res.access_token);
      toast.success("Account created! Welcome to EduPath.");
      router.push(res.role === "admin" ? "/admin" : "/dashboard");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    display: "block", width: "100%", background: "rgba(17,19,34,0.04)",
    border: "1px solid rgba(17,19,34,0.08)", borderRadius: "12px",
    color: "#111322", padding: "13px 16px 13px 44px", fontSize: "14px",
    outline: "none", boxSizing: "border-box",
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "rgba(47,69,216,0.6)";
    e.target.style.boxShadow   = "0 0 0 3px rgba(47,69,216,0.12)";
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "rgba(17,19,34,0.08)";
    e.target.style.boxShadow   = "none";
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#14218C 0%,#243AD1 45%,#5368F0 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 16px", position: "relative", overflow: "hidden" }}>

      {/* Background */}
      <div className="grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.4, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "10%", left: "15%", width: "500px", height: "500px", background: "transparent", borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "15%", width: "400px", height: "400px", background: "transparent", borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "400px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ width: "70px", height: "70px", borderRadius: "22px", background: "linear-gradient(135deg,#2F45D8,#2336B8)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <GraduationCap size={34} color="white" />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#111322", margin: 0, letterSpacing: "-0.3px" }}>Create Account</h1>
          <p style={{ fontSize: "14px", color: "rgba(17,19,34,0.45)", marginTop: "5px" }}>Join EduPath today</p>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
          {([1, 2] as const).map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 600, border: `1px solid ${step === s ? "rgba(47,69,216,0.4)" : step > s ? "rgba(47,69,216,0.35)" : "rgba(17,19,34,0.1)"}`, background: step === s ? "rgba(47,69,216,0.1)" : step > s ? "rgba(47,69,216,0.08)" : "transparent", color: step === s ? "#5368F0" : step > s ? "#111322" : "rgba(17,19,34,0.3)" }}>
              {step > s
                ? <CheckCircle size={11} />
                : <span style={{ width: "16px", height: "16px", borderRadius: "50%", border: `1px solid ${step === s ? "#2F45D8" : "rgba(17,19,34,0.2)"}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>{s}</span>
              }
              {s === 1 ? "Your Details" : "Verify OTP"}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div style={{ background: "rgba(17,19,34,0.03)", border: "1px solid rgba(17,19,34,0.07)", borderRadius: "20px", padding: "28px", boxShadow: "0 0 60px rgba(47,69,216,0.08)", position: "relative" }}>

          {step === 1 ? (
            <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Name */}
              <div style={{ position: "relative" }}>
                <User size={15} color="rgba(17,19,34,0.35)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Full Name" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
              {/* Email */}
              <div style={{ position: "relative" }}>
                <Mail size={15} color="rgba(17,19,34,0.35)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="Email Address" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
              {/* Password */}
              <div style={{ position: "relative" }}>
                <Lock size={15} color="rgba(17,19,34,0.35)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input type={showPass ? "text" : "password"} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Password (min 8 chars)" style={{ ...inputStyle, paddingRight: "48px" }} onFocus={focusStyle} onBlur={blurStyle} />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(17,19,34,0.4)", padding: 0, display: "flex" }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {/* Phone */}
              <div style={{ position: "relative" }}>
                <Phone size={15} color="rgba(17,19,34,0.35)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <span style={{ position: "absolute", left: "36px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", color: "rgba(17,19,34,0.45)", pointerEvents: "none", fontFamily: "monospace" }}>+91</span>
                <input type="tel" value={form.phone} onChange={e => { const v = e.target.value.replace(/\D/g,"").slice(0,10); setForm(f => ({ ...f, phone: v })); }}
                  placeholder="Phone Number"
                  style={{ ...inputStyle, paddingLeft: "72px" }}
                  onFocus={focusStyle} onBlur={blurStyle} />
              </div>
              {/* Submit */}
              <button type="submit" disabled={loading}
                style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#2F45D8,#2336B8)", color: "#FFFFFF", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "4px" }}>
                {loading ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Sending...</> : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Success badge */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "10px", background: "rgba(47,69,216,0.05)", border: "1px solid rgba(47,69,216,0.2)", color: "#111322", fontSize: "13px" }}>
                <CheckCircle size={14} /> OTP sent to +91 {form.phone}
              </div>
              {/* Dev hint */}
              <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(17,19,34,0.02)", border: "1px solid rgba(17,19,34,0.06)", fontSize: "12px" }}>
                <span style={{ color: "rgba(17,19,34,0.25)" }}>Check the backend server console for your OTP.</span>
              </div>
              {/* OTP input */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "rgba(17,19,34,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Enter OTP</label>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,"").slice(0,6))}
                  placeholder="· · · · · ·"
                  style={{ display: "block", width: "100%", background: "rgba(17,19,34,0.04)", border: "1px solid rgba(17,19,34,0.08)", borderRadius: "12px", color: "#111322", padding: "14px 16px", fontSize: "22px", fontFamily: "monospace", textAlign: "center", letterSpacing: "0.4em", outline: "none", boxSizing: "border-box" }}
                  onFocus={focusStyle as never} onBlur={blurStyle as never}
                />
              </div>
              <button type="submit" disabled={loading}
                style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#2F45D8,#2336B8)", color: "#FFFFFF", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                {loading ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Verifying...</> : "Verify & Create Account"}
              </button>
              <button type="button" onClick={() => setStep(1)}
                style={{ width: "100%", padding: "12px", background: "rgba(17,19,34,0.05)", color: "#111322", border: "1px solid rgba(17,19,34,0.1)", borderRadius: "12px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                ? Change Details
              </button>
            </form>
          )}

          <p style={{ textAlign: "center", fontSize: "14px", color: "rgba(17,19,34,0.45)", marginTop: "20px" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#2F45D8", fontWeight: 600, textDecoration: "none" }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
