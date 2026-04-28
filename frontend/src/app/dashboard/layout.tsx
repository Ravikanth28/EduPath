"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GraduationCap, LayoutDashboard, BookOpen, Award, User, LogOut, ChevronRight, Menu, X } from "lucide-react";
import { api, clearToken, getToken } from "../../lib/api";

const NAV_LINKS = [
  { href: "/dashboard",              label: "Dashboard",    icon: LayoutDashboard },
  { href: "/dashboard/courses",      label: "My Courses",   icon: BookOpen },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/profile",      label: "My Profile",   icon: User },
];

function SidebarContent({ pathname, onNavClick, onLogout, userName, userEmail }: { pathname: string; onNavClick: () => void; onLogout: () => void; userName: string; userEmail: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "linear-gradient(180deg,rgba(238,243,255,0.98),rgba(225,232,255,0.94))", borderRight: "1px solid rgba(17,19,34,0.06)" }}>
      {/* Brand */}
      <div style={{ padding: "20px", display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid rgba(17,19,34,0.06)", flexShrink: 0 }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg,#2F45D8,#2336B8)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <GraduationCap size={20} color="white" />
        </div>
        <div>
          <p style={{ fontWeight: 800, color: "#111322", fontSize: "14px", margin: 0 }}>EduPath</p>
          <p style={{ fontSize: "11px", color: "rgba(17,19,34,0.4)", margin: 0 }}>Student Portal</p>
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
              background: active ? "rgba(47,69,216,0.12)" : "transparent",
              color: active ? "#2F45D8" : "rgba(17,19,34,0.55)",
              border: `1px solid ${active ? "rgba(47,69,216,0.25)" : "transparent"}`,
            }}>
              <Icon size={17} />
              <span style={{ flex: 1 }}>{label}</span>
              {active && <ChevronRight size={13} color="#2F45D8" />}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={{ padding: "14px", borderTop: "1px solid rgba(17,19,34,0.06)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", marginBottom: "6px" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#2F45D8,#2336B8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontWeight: 800, fontSize: "13px", flexShrink: 0 }}>{userName.charAt(0).toUpperCase()}</div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "#111322", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName}</p>
            <p style={{ fontSize: "10px", color: "#2F45D8", margin: 0, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userEmail}</p>
          </div>
        </div>
        <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "10px", textDecoration: "none", fontSize: "13px", color: "rgba(17,19,34,0.45)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", width: "100%" }}>
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
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#DDE7FF 0%,#EEF3FF 52%,#CAD8FF 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "32px", height: "32px", border: "3px solid rgba(47,69,216,0.3)", borderTopColor: "#2F45D8", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "linear-gradient(135deg,#DDE7FF 0%,#EEF3FF 52%,#CAD8FF 100%)" }}>

      {/* Desktop sidebar - always visible =768px */}
      <div style={{ width: "240px", flexShrink: 0, display: "flex", flexDirection: "column" }}>
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
        <div style={{ display: "none" }} className="mobile-bar">
          <button onClick={() => setMobileOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(17,19,34,0.7)", padding: "8px", display: "flex" }}>
            <Menu size={20} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "26px", height: "26px", borderRadius: "8px", background: "linear-gradient(135deg,#2F45D8,#2336B8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <GraduationCap size={13} color="white" />
            </div>
            <span style={{ fontWeight: 800, color: "#111322", fontSize: "14px" }}>EduPath</span>
          </div>
        </div>

        <main style={{ flex: 1, overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
