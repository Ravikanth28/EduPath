"use client";
import { useState } from "react";
import Link from "next/link";
import { GraduationCap, User, Mail, Lock, Phone, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    toast.success("OTP sent to your phone!");
    setStep(2);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) { toast.error("Enter the OTP."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    toast.success("Account created! Welcome to EduPath.");
    router.push("/dashboard");
  };

  const inputStyle: React.CSSProperties = {
    display: "block", width: "100%", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px",
    color: "#fff", padding: "13px 16px 13px 44px", fontSize: "14px",
    outline: "none", boxSizing: "border-box",
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "rgba(124,58,237,0.6)";
    e.target.style.boxShadow   = "0 0 0 3px rgba(124,58,237,0.12)";
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "rgba(255,255,255,0.08)";
    e.target.style.boxShadow   = "none";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050508", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 16px", position: "relative", overflow: "hidden" }}>

      {/* Background */}
      <div className="grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.4, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "10%", left: "15%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(124,58,237,0.18), transparent 65%)", borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "15%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(6,182,212,0.12), transparent 65%)", borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "400px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ width: "70px", height: "70px", borderRadius: "22px", background: "linear-gradient(135deg,#7C3AED,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <GraduationCap size={34} color="white" />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.3px" }}>Create Account</h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", marginTop: "5px" }}>Join EduPath today</p>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
          {([1, 2] as const).map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 600, border: `1px solid ${step === s ? "rgba(124,58,237,0.4)" : step > s ? "rgba(74,222,128,0.35)" : "rgba(255,255,255,0.1)"}`, background: step === s ? "rgba(124,58,237,0.1)" : step > s ? "rgba(74,222,128,0.08)" : "transparent", color: step === s ? "#C4B5FD" : step > s ? "#4ADE80" : "rgba(255,255,255,0.3)" }}>
              {step > s
                ? <CheckCircle size={11} />
                : <span style={{ width: "16px", height: "16px", borderRadius: "50%", border: `1px solid ${step === s ? "#7C3AED" : "rgba(255,255,255,0.2)"}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>{s}</span>
              }
              {s === 1 ? "Your Details" : "Verify OTP"}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "28px", boxShadow: "0 0 60px rgba(124,58,237,0.08)", position: "relative" }}>

          {step === 1 ? (
            <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Name */}
              <div style={{ position: "relative" }}>
                <User size={15} color="rgba(255,255,255,0.35)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Full Name" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
              {/* Email */}
              <div style={{ position: "relative" }}>
                <Mail size={15} color="rgba(255,255,255,0.35)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="Email Address" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
              {/* Password */}
              <div style={{ position: "relative" }}>
                <Lock size={15} color="rgba(255,255,255,0.35)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input type={showPass ? "text" : "password"} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Password (min 8 chars)" style={{ ...inputStyle, paddingRight: "48px" }} onFocus={focusStyle} onBlur={blurStyle} />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 0, display: "flex" }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {/* Phone */}
              <div style={{ position: "relative" }}>
                <Phone size={15} color="rgba(255,255,255,0.35)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <span style={{ position: "absolute", left: "36px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", color: "rgba(255,255,255,0.45)", pointerEvents: "none", fontFamily: "monospace" }}>+91</span>
                <input type="tel" value={form.phone} onChange={e => { const v = e.target.value.replace(/\D/g,"").slice(0,10); setForm(f => ({ ...f, phone: v })); }}
                  placeholder="Phone Number"
                  style={{ ...inputStyle, paddingLeft: "72px" }}
                  onFocus={focusStyle} onBlur={blurStyle} />
              </div>
              {/* Submit */}
              <button type="submit" disabled={loading}
                style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#7C3AED,#06B6D4)", color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "4px" }}>
                {loading ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Sending...</> : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Success badge */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "10px", background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ADE80", fontSize: "13px" }}>
                <CheckCircle size={14} /> OTP sent to +91 {form.phone}
              </div>
              {/* Demo hint */}
              <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", fontSize: "12px" }}>
                <span style={{ color: "rgba(255,255,255,0.25)" }}>Demo OTP: </span>
                <span style={{ fontFamily: "monospace", color: "#22D3EE", fontWeight: 700, letterSpacing: "0.1em" }}>123456</span>
              </div>
              {/* OTP input */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Enter OTP</label>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,"").slice(0,6))}
                  placeholder="· · · · · ·"
                  style={{ display: "block", width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", color: "#fff", padding: "14px 16px", fontSize: "22px", fontFamily: "monospace", textAlign: "center", letterSpacing: "0.4em", outline: "none", boxSizing: "border-box" }}
                  onFocus={focusStyle as never} onBlur={blurStyle as never}
                />
              </div>
              <button type="submit" disabled={loading}
                style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#7C3AED,#06B6D4)", color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                {loading ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Verifying...</> : "Verify & Create Account"}
              </button>
              <button type="button" onClick={() => setStep(1)}
                style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                ← Change Details
              </button>
            </form>
          )}

          <p style={{ textAlign: "center", fontSize: "14px", color: "rgba(255,255,255,0.45)", marginTop: "20px" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#A78BFA", fontWeight: 600, textDecoration: "none" }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
