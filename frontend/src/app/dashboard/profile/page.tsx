"use client";
import { useState, useEffect } from "react";
import { User, Phone, Mail, Lock, Eye, EyeOff, Edit, CheckCircle, Award, Trophy } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

const inp = (pl = 44, pr = 16): React.CSSProperties => ({
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: "12px",
  color: "#fff",
  padding: `12px ${pr}px 12px ${pl}px`,
  width: "100%",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color .2s, box-shadow .2s",
});

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "16px",
  padding: "20px",
};

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", joined: "" });
  const [loading, setLoading] = useState(true);
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });

  useEffect(() => {
    api.profile.get().then(s => {
      setForm({ name: s.name, phone: s.phone ?? "", email: s.email, joined: s.joined ?? "" });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const strength = pwForm.newPw.length === 0 ? 0 : pwForm.newPw.length < 6 ? 1 : pwForm.newPw.length < 10 ? 2 : 3;
  const strengthColor = ["", "#F87171", "#FBBF24", "#4ADE80"][strength];
  const strengthLabel = ["", "Weak", "Fair", "Strong"][strength];

  const handleSave = async () => {
    try {
      await api.profile.update({ name: form.name, phone: form.phone });
      toast.success("Profile updated!");
      setEditing(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  const handlePassword = async () => {
    if (!pwForm.current || !pwForm.newPw || !pwForm.confirm) { toast.error("Fill all password fields."); return; }
    if (pwForm.newPw !== pwForm.confirm) { toast.error("Passwords don't match."); return; }
    if (pwForm.newPw.length < 8) { toast.error("Password must be at least 8 characters."); return; }
    try {
      await api.profile.changePassword({ current_password: pwForm.current, new_password: pwForm.newPw });
      toast.success("Password changed!");
      setPwForm({ current: "", newPw: "", confirm: "" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to change password");
    }
  };

  const disabled = !pwForm.current || !pwForm.newPw || !pwForm.confirm || pwForm.newPw !== pwForm.confirm || pwForm.newPw.length < 8;

  if (loading) return <div style={{ padding: "48px", textAlign: "center", color: "rgba(255,255,255,0.4)" }}>Loading...</div>;

  return (
    <div style={{ padding: "28px 24px", maxWidth: "760px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* -- Hero card -- */}
      <div style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.20)", borderRadius: "20px", padding: "24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: "200px", height: "200px", background: "transparent", filter: "blur(48px)", opacity: 0.18, pointerEvents: "none" }} />

        {/* Profile row */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-start", gap: "18px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ width: "76px", height: "76px", borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontWeight: 900, fontSize: "28px", boxShadow: "0 8px 24px rgba(124,58,237,0.35)" }}>
              {form.name[0]}
            </div>
            <div style={{ position: "absolute", bottom: 3, right: 3, width: "14px", height: "14px", borderRadius: "50%", background: "#4ADE80", border: "2.5px solid #0A0A12" }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ color: "#fff", fontWeight: 800, fontSize: "22px", margin: "0 0 4px" }}>{form.name}</h1>
            <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "13px", margin: "0 0 10px" }}>Member since {form.joined}</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span className="badge-purple">Student</span>
              <span className="badge-green" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <CheckCircle size={10} /> Verified
              </span>
            </div>
          </div>

          <button
            onClick={() => setEditing(e => !e)}
            style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "12px", fontSize: "13px", fontWeight: 600, cursor: "pointer", border: "none", background: editing ? "rgba(17,19,34,0.07)" : "#2F45D8", color: "#111322", outline: "none" }}
          >
            <Edit size={14} /> {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Stats row */}
        <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginTop: "20px" }}>
          {[
            { label: "Enrolled Courses", value: "4",  color: "#A78BFA" },
            { label: "Certificates",     value: "1",  color: "#FBBF24" },
            { label: "Achievements",     value: "3",  color: "#4ADE80" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "14px 12px", textAlign: "center" }}>
              <p style={{ fontSize: "26px", fontWeight: 800, color, margin: "0 0 3px", lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.42)", margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* -- Personal Information -- */}
      <div style={card}>
        <h2 style={{ color: "#fff", fontWeight: 700, fontSize: "15px", margin: "0 0 16px" }}>Personal Information</h2>
        {editing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              { key: "name",  label: "Full Name", icon: <User size={15} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.38)", pointerEvents: "none" as const }} />, pl: 44 },
              { key: "email", label: "Email",     icon: <Mail size={15} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.38)", pointerEvents: "none" as const }} />, pl: 44 },
            ].map(({ key, label, icon, pl }) => (
              <div key={key}>
                <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", marginBottom: "6px", display: "block", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
                <div style={{ position: "relative" }}>
                  {icon}
                  <input
                    type={key === "email" ? "email" : "text"}
                    value={(form as Record<string, string>)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    style={inp(pl)}
                  />
                </div>
              </div>
            ))}
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", marginBottom: "6px", display: "block", textTransform: "uppercase", letterSpacing: "0.05em" }}>Phone</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.5)", fontSize: "13px", fontWeight: 500, pointerEvents: "none" }}>+91</span>
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))} style={inp(50)} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setEditing(false)} className="btn-secondary" style={{ padding: "10px 20px", fontSize: "13px" }}>Cancel</button>
              <button onClick={handleSave} className="btn-primary" style={{ padding: "10px 20px", fontSize: "13px" }}>Save Changes</button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { icon: User,  label: "Full Name", value: form.name },
              { icon: Phone, label: "Phone",     value: `+91 ${form.phone}` },
              { icon: Mail,  label: "Email",     value: form.email },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.03)" }}>
                <Icon size={15} style={{ color: "rgba(255,255,255,0.35)", marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.38)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 3px" }}>{label}</p>
                  <p style={{ color: "#fff", fontSize: "14px", margin: 0 }}>{value}</p>
                </div>
              </div>
            ))}
            <button onClick={() => setEditing(true)} style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#A78BFA", fontSize: "13px", background: "none", border: "none", cursor: "pointer", padding: "4px 0", fontWeight: 500 }}>
              <Edit size={13} /> Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* -- Change Password -- */}
      <div style={card}>
        <h2 style={{ color: "#fff", fontWeight: 700, fontSize: "15px", margin: "0 0 16px" }}>Change Password</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

          {[
            { show: showCur, setShow: setShowCur, val: pwForm.current, key: "current", placeholder: "Current Password" },
            { show: showNew, setShow: setShowNew, val: pwForm.newPw,  key: "newPw",   placeholder: "New Password" },
            { show: showConf,setShow: setShowConf,val: pwForm.confirm, key: "confirm", placeholder: "Confirm New Password" },
          ].map(({ show, setShow, val, key, placeholder }, idx) => (
            <div key={key}>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.38)", pointerEvents: "none" }} />
                <input
                  type={show ? "text" : "password"}
                  value={val}
                  onChange={e => setPwForm(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  style={inp(44, 44)}
                />
                <button onClick={() => setShow(v => !v)} type="button" style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.38)", padding: 0, display: "flex" }}>
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {/* Strength meter after new password field */}
              {idx === 1 && pwForm.newPw && (
                <div style={{ marginTop: "8px" }}>
                  <div style={{ display: "flex", gap: "5px", height: "5px" }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{ flex: 1, borderRadius: "9999px", background: i <= strength ? strengthColor : "rgba(255,255,255,0.07)", transition: "background .2s" }} />
                    ))}
                  </div>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "5px" }}>{strengthLabel}</p>
                </div>
              )}
              {/* Match indicator after confirm field */}
              {idx === 2 && pwForm.confirm && (
                <p style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "5px", color: pwForm.newPw === pwForm.confirm ? "#4ADE80" : "#F87171", marginTop: "6px" }}>
                  {pwForm.newPw === pwForm.confirm ? <CheckCircle size={12} /> : "x"}{" "}
                  {pwForm.newPw === pwForm.confirm ? "Passwords match" : "Passwords don't match"}
                </p>
              )}
            </div>
          ))}

          <button
            onClick={handlePassword}
            disabled={disabled}
            className="btn-primary"
            style={{ padding: "11px 24px", fontSize: "14px", alignSelf: "flex-start", opacity: disabled ? 0.4 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
          >
            Change Password
          </button>
        </div>
      </div>

      {/* -- Account Status -- */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 16px", borderRadius: "12px", background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)" }}>
        <CheckCircle size={16} style={{ color: "#4ADE80", flexShrink: 0 }} />
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", margin: 0 }}>Account verified and active.</p>
      </div>

    </div>
  );
}
