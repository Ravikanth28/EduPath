"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GraduationCap, LayoutDashboard, BookOpen, Users, Award, Activity, LogOut, ChevronRight, Menu } from "lucide-react";
import { api, clearToken, getToken } from "../../lib/api";

const NAV_LINKS = [
  { href: "/admin",              label: "Dashboard",   icon: LayoutDashboard },
  { href: "/admin/courses",      label: "Courses",     icon: BookOpen },
  { href: "/admin/students",     label: "Students",    icon: Users },
  { href: "/admin/certificates", label: "Certificates",icon: Award },
  { href: "/admin/activity",     label: "Activity Log",icon: Activity },
];

function SidebarContent({ pathname, onNavClick, onLogout, adminName }: { pathname: string; onNavClick: () => void; onLogout: () => void; adminName: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "linear-gradient(180deg,rgba(238,243,255,0.98),rgba(225,232,255,0.94))", borderRight: "1px solid rgba(17,19,34,0.06)" }}>
      <div style={{ padding: "20px", display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid rgba(17,19,34,0.06)", flexShrink: 0 }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg,#2F45D8,#2336B8)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <GraduationCap size={20} color="white" />
        </div>
        <div>
          <p style={{ fontWeight: 800, color: "#111322", fontSize: "14px", margin: 0 }}>EduPath</p>
          <p style={{ fontSize: "11px", color: "rgba(17,19,34,0.4)", margin: 0 }}>Admin Panel</p>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "2px" }}>
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
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

      <div style={{ padding: "14px", borderTop: "1px solid rgba(17,19,34,0.06)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", marginBottom: "6px" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#2F45D8,#2336B8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontWeight: 800, fontSize: "13px", flexShrink: 0 }}>A</div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "#111322", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{adminName}</p>
            <p style={{ fontSize: "10px", color: "#2F45D8", margin: 0, fontWeight: 600 }}>Administrator</p>
          </div>
        </div>
        <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "10px", fontSize: "13px", color: "rgba(17,19,34,0.45)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", width: "100%" }}>
          <LogOut size={15} /> Logout
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminName, setAdminName]     = useState("");
  const [ready, setReady]             = useState(false);
  const pathname = usePathname();
  const router   = useRouter();

  useEffect(() => {
    if (!getToken()) { router.replace("/login"); return; }
    api.profile.get()
      .then(u => {
        if (u.role !== "admin") { router.replace("/dashboard"); return; }
        setAdminName(u.name);
        setReady(true);
      })
      .catch(() => { clearToken(); router.replace("/login"); });
  }, [router]);

  const handleLogout = () => { clearToken(); router.replace("/login"); };

  if (!ready) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#DDE7FF 0%,#EEF3FF 52%,#CAD8FF 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "32px", height: "32px", border: "3px solid rgba(47,69,216,0.3)", borderTopColor: "#2F45D8", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "linear-gradient(135deg,#DDE7FF 0%,#EEF3FF 52%,#CAD8FF 100%)" }}>

      {/* Desktop sidebar - toggled by Menu button */}
      <div style={{
        width: sidebarOpen ? "240px" : "0px",
        flexShrink: 0,
        overflow: "hidden",
        transition: "width 0.25s ease",
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{ width: "240px", height: "100%" }}>
          <SidebarContent pathname={pathname} onNavClick={() => {}} onLogout={handleLogout} adminName={adminName} />
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(17,19,34,0.06)", background: "linear-gradient(180deg,rgba(238,243,255,0.98),rgba(225,232,255,0.94))", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <button onClick={() => setSidebarOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(17,19,34,0.6)", padding: "6px", display: "flex", borderRadius: "8px" }}>
            <Menu size={18} />
          </button>
          <div style={{ width: "1px", height: "18px", background: "rgba(17,19,34,0.1)" }} />
          <span style={{ fontSize: "13px", color: "rgba(17,19,34,0.5)", fontWeight: 600 }}>Admin Panel</span>
        </div>
        <main style={{ flex: 1, overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
