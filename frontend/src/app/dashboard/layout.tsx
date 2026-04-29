"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Brain, LayoutDashboard, BookOpen, Award, User, LogOut, ChevronRight, Menu, Trophy } from "lucide-react";
import { api, clearToken, getToken } from "../../lib/api";

const NAV_LINKS = [
  { href: "/dashboard",                label: "Dashboard",    icon: LayoutDashboard },
  { href: "/dashboard/courses",        label: "My Courses",   icon: BookOpen },
  { href: "/dashboard/leaderboard",    label: "Leaderboard",  icon: Trophy },
  { href: "/dashboard/certificates",  label: "Certificates", icon: Award },
  { href: "/dashboard/profile",        label: "My Profile",   icon: User },
];

function SidebarContent({ pathname, onNavClick, onLogout, userName, userEmail }: { pathname: string; onNavClick: () => void; onLogout: () => void; userName: string; userEmail: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#0A0A12", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Brand */}
      <div style={{ padding: "20px", display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid rgba(17,19,34,0.06)", flexShrink: 0 }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg,#7C3AED,#9333EA)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 20px rgba(124,58,237,0.4)" }}>
          <Brain size={20} color="white" />
        </div>
        <div>
          <p style={{ fontWeight: 800, color: "#fff", fontSize: "14px", margin: 0 }}>EduPath</p>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: 0 }}>Student Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "2px" }}>
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} onClick={onNavClick} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "10px 12px", borderRadius: "10px", textDecoration: "none",
              fontSize: "14px", fontWeight: 600, transition: "all .15s",
              background: active ? "rgba(124,58,237,0.12)" : "transparent",
              color: active ? "#A78BFA" : "rgba(255,255,255,0.55)",
              border: `1px solid ${active ? "rgba(124,58,237,0.25)" : "transparent"}`,
            }}>
              <Icon size={17} />
              <span style={{ flex: 1 }}>{label}</span>
              {active && <ChevronRight size={13} color="#A78BFA" />}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={{ padding: "14px", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", marginBottom: "6px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "14px", flexShrink: 0 }}>{userName.charAt(0).toUpperCase()}</div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName}</p>
            <span style={{ fontSize: "11px", fontWeight: 600, background: "rgba(124,58,237,0.3)", color: "#C4B5FD", border: "1px solid rgba(124,58,237,0.4)", borderRadius: "20px", padding: "1px 8px", display: "inline-block", marginTop: "2px" }}>Student</span>
          </div>
        </div>
        <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "10px", textDecoration: "none", fontSize: "13px", color: "rgba(255,255,255,0.40)", fontWeight: 600, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer", width: "100%" }}>
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </div>
  );
}

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName]     = useState("");
  const [userEmail, setUserEmail]   = useState("");
  const [ready, setReady]           = useState(false);
  const pathname = usePathname();
  const router   = useRouter();

  useEffect(() => {
    if (!getToken()) { router.replace("/login"); return; }
    api.profile.get()
      .then(u => {
        if (u.role === "admin") { router.replace("/admin"); return; }
        setUserName(u.name);
        setUserEmail(u.email);
        setReady(true);
      })
      .catch(() => { clearToken(); router.replace("/login"); });
  }, [router]);

  const handleSignOut = () => { clearToken(); router.replace("/login"); };

  if (!ready) return (
    <div style={{ minHeight: "100vh", background: "#050508", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "32px", height: "32px", border: "3px solid rgba(124,58,237,0.3)", borderTopColor: "#7C3AED", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#050508" }}>

      {/* Desktop sidebar - hidden on course pages and on mobile */}
      <div
        className="desktop-sidebar-wrap"
        style={{ width: pathname.startsWith("/dashboard/courses/") ? "0" : "240px" }}
      >
        <SidebarContent pathname={pathname} onNavClick={() => {}} onLogout={handleSignOut} userName={userName} userEmail={userEmail} />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex" }}>
          <div style={{ width: "240px", flexShrink: 0, display: "flex", flexDirection: "column" }}>
            <SidebarContent pathname={pathname} onNavClick={() => setMobileOpen(false)} onLogout={handleSignOut} userName={userName} userEmail={userEmail} />
          </div>
          <div style={{ flex: 1, background: "rgba(17,19,34,0.65)" }} onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        {/* Mobile top bar */}
        <div className="mobile-bar">
          <button onClick={() => setMobileOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", padding: "8px", display: "flex" }}>
            <Menu size={20} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "26px", height: "26px", borderRadius: "8px", background: "linear-gradient(135deg,#7C3AED,#9333EA)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Brain size={13} color="white" />
            </div>
            <span style={{ fontWeight: 800, color: "#fff", fontSize: "14px" }}>EduPath</span>
          </div>
          <div style={{ width: "36px" }} />
        </div>

        <main style={{ flex: 1, overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
