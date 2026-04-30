"use client";
import { useEffect, useState, useMemo } from "react";
import {
  Shield, CheckCircle, Clock, XCircle, FileText, Search, Download,
  Copy, X, Filter, ChevronUp, ChevronDown, RefreshCw, ArrowUpDown, Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

type Cert = {
  id: string;
  student?: string;
  phone?: string;
  course: string;
  category: string;
  issued: string;
  status: "verified" | "pending" | "revoked";
  revokeReason?: string;
};
type SortField = "issued" | "student" | "course";

const STATUS_META: Record<string, { label: string; bg: string; color: string; border: string }> = {
  verified: { label: "Verified",       bg: "rgba(74,222,128,0.12)",   color: "#4ADE80",  border: "rgba(74,222,128,0.30)"  },
  pending:  { label: "Pending Review", bg: "rgba(251,191,36,0.12)",  color: "#FBBF24",  border: "rgba(251,191,36,0.30)"  },
  revoked:  { label: "Revoked",        bg: "rgba(248,113,113,0.12)", color: "#F87171",  border: "rgba(248,113,113,0.30)" },
};

export default function AdminCertificatesPage() {
  const [certs, setCerts]             = useState<Cert[]>([]);
  const [search, setSearch]           = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [sortField, setSortField]     = useState<SortField>("issued");
  const [sortDir, setSortDir]         = useState<"asc" | "desc">("desc");
  const [fStudent, setFStudent]       = useState("All Students");
  const [fCourse, setFCourse]         = useState("All Courses");
  const [fStatus, setFStatus]         = useState("All Statuses");
  const [selected, setSelected]       = useState<string[]>([]);

  // Modals
  const [revokeModal, setRevokeModal]     = useState<string | null>(null);   // single cert id
  const [bulkRevokeModal, setBulkRevokeModal] = useState(false);
  const [bulkApproveModal, setBulkApproveModal] = useState(false);
  const [revokeReason, setRevokeReason]   = useState("");
  const [issuing, setIssuing]             = useState(false);

  const loadCertificates = async () => {
    const data = await api.certificates.list();
    const mapped: Cert[] = data.map(c => ({
      id: c.id,
      student: c.student ?? "Unknown Student",
      phone: c.phone ?? "-",
      course: c.course,
      category: c.category,
      issued: c.issued,
      status: c.status,
      revokeReason: undefined,
    }));
    setCerts(mapped);
  };

  useEffect(() => {
    loadCertificates().catch(() => {
      toast.error("Failed to load certificates");
    });
  }, []);

  // -- Status helpers ---------------------------------------------------------
  const getStatus = (id: string) => certs.find(c => c.id === id)?.status ?? "pending";
  const getReason = (id: string) => certs.find(c => c.id === id)?.revokeReason;

  // -- Filtering + sorting ----------------------------------------------------
  const filtered = useMemo(() => {
    return certs
      .filter(c => {
        if (search && !(c.student ?? "").toLowerCase().includes(search.toLowerCase()) &&
            !(c.phone ?? "").includes(search) && !c.id.toLowerCase().includes(search.toLowerCase()) &&
            !c.course.toLowerCase().includes(search.toLowerCase())) return false;
        if (fStudent !== "All Students" && c.student !== fStudent) return false;
        if (fCourse !== "All Courses"   && c.course   !== fCourse)  return false;
        if (fStatus !== "All Statuses"  && c.status   !== fStatus.toLowerCase().replace(" ", "_")) {
          const map: Record<string, string> = { "Verified": "verified", "Pending Review": "pending", "Revoked": "revoked" };
          if (c.status !== map[fStatus]) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let val = 0;
        if (sortField === "student") val = (a.student ?? "").localeCompare(b.student ?? "");
        else if (sortField === "course") val = a.course.localeCompare(b.course);
        else val = new Date(a.issued).getTime() - new Date(b.issued).getTime();
        return sortDir === "asc" ? val : -val;
      });
  }, [certs, search, fStudent, fCourse, fStatus, sortField, sortDir]);

  // -- Counts for stat cards --------------------------------------------------
  const counts = useMemo(() => ({
    total:    certs.length,
    verified: certs.filter(c => c.status === "verified").length,
    pending:  certs.filter(c => c.status === "pending").length,
    revoked:  certs.filter(c => c.status === "revoked").length,
    students: new Set(certs.map(c => c.student ?? "Unknown Student")).size,
    verifiedPct: certs.length ? Math.round(certs.filter(c => c.status === "verified").length / certs.length * 100) : 0,
  }), [certs]);

  // -- Selection helpers ------------------------------------------------------
  const toggleSelect  = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll     = () => setSelected(selected.length === filtered.length ? [] : filtered.map(c => c.id));

  // -- Actions ----------------------------------------------------------------
  const updateCerts = (ids: string[], status: Cert["status"], reason?: string) => {
    setCerts(prev => prev.map(c => ids.includes(c.id)
      ? { ...c, status, revokeReason: status === "revoked" ? reason : undefined }
      : c
    ));
  };

  const handleVerify = (id: string) => {
    updateCerts([id], "verified");
    toast.success("Certificate verified!");
  };

  const handleRevoke = () => {
    if (!revokeReason.trim()) { toast.error("Please provide a revocation reason"); return; }
    if (revokeModal) {
      updateCerts([revokeModal], "revoked", revokeReason);
      toast.success("Certificate revoked");
    }
    setRevokeModal(null);
    setRevokeReason("");
  };

  const handleRestore = (id: string) => {
    updateCerts([id], "pending");
    toast.success("Certificate restored to pending!");
  };

  const handleBulkVerify = () => {
    updateCerts(selected, "verified");
    toast.success(`${selected.length} certificates verified`);
    setSelected([]);
    setBulkApproveModal(false);
  };

  const handleBulkRevoke = () => {
    if (!revokeReason.trim()) { toast.error("Please provide a revocation reason"); return; }
    updateCerts(selected, "revoked", revokeReason);
    toast.success(`${selected.length} certificates revoked`);
    setSelected([]);
    setBulkRevokeModal(false);
    setRevokeReason("");
  };

  const handleExportCSV = () => {
    const rows = [
      ["Cert #", "Student", "Phone", "Course", "Category", "Issued", "Status", "Revoke Reason"],
      ...certs.map(c => [c.id, c.student ?? "Unknown Student", c.phone ?? "-", c.course, c.category, c.issued, c.status, c.revokeReason ?? ""]),
    ];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href = url; a.download = "certificates.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  const handleIssueMissingCertificates = async () => {
    setIssuing(true);
    try {
      const res = await api.admin.issueMissingCertificates();
      await loadCertificates();
      if (res.issued_count > 0) {
        toast.success(`Issued ${res.issued_count} missing certificate(s).`);
      } else {
        toast.success("No missing certificates found for completed courses.");
      }
    } catch {
      toast.error("Failed to issue missing certificates");
    } finally {
      setIssuing(false);
    }
  };

  const cycleSortField = () => {
    const fields: SortField[] = ["issued", "student", "course"];
    const next = fields[(fields.indexOf(sortField) + 1) % fields.length];
    setSortField(next);
  };
  const toggleSortDir = () => setSortDir(d => d === "asc" ? "desc" : "asc");
  const sortLabel = `${sortField === "issued" ? "Newest" : sortField.charAt(0).toUpperCase() + sortField.slice(1)} ${sortDir === "desc" ? "First" : "Last"}`;

  // -- STAT CARDS config ------------------------------------------------------
  const STAT_CARDS = [
    {
      label: "TOTAL ISSUED",   value: counts.total,    icon: FileText,      iconBg: "rgba(167,139,250,0.18)",
      sub: <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", gap: "4px" }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        {counts.students} unique students
      </span>,
    },
    {
      label: "VERIFIED",       value: counts.verified, icon: CheckCircle,   iconBg: "rgba(74,222,128,0.18)",
      sub: <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <div style={{ flex: 1, height: "4px", borderRadius: "9999px", background: "rgba(255,255,255,0.08)", maxWidth: "80px" }}>
          <div style={{ height: "100%", borderRadius: "9999px", width: `${counts.verifiedPct}%`, background: "#4ADE80" }} />
        </div>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)" }}>{counts.verifiedPct}%</span>
      </div>,
    },
    {
      label: "PENDING REVIEW", value: counts.pending,  icon: Clock,         iconBg: "rgba(251,191,36,0.18)",
      sub: <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>All reviewed</span>,
    },
    {
      label: "REVOKED",        value: counts.revoked,  icon: XCircle,       iconBg: "rgba(248,113,113,0.18)",
      sub: <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>Invalidated certificates</span>,
    },
  ];

  // -- Status badge renderer --------------------------------------------------
  const StatusBadge = ({ status }: { status: string }) => {
    const m = STATUS_META[status] ?? STATUS_META.pending;
    const Icon = status === "verified" ? CheckCircle : status === "revoked" ? XCircle : Clock;
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 10px", borderRadius: "20px", background: m.bg, color: m.color, border: `1px solid ${m.border}`, fontSize: "12px", fontWeight: 600, whiteSpace: "nowrap" as const }}>
        <Icon size={11} /> {m.label}
      </span>
    );
  };

  // -------------------------------------------------------------------------
  return (
    <div style={{ padding: "28px 24px", display: "flex", flexDirection: "column", gap: "24px", background: "linear-gradient(180deg,#0B1020,#0F172A)", borderRadius: "18px", border: "1px solid rgba(255,255,255,0.08)" }}>

      {/* -- Breadcrumb -- */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "rgba(255,255,255,0.30)" }}>
        <span>Dashboard</span>
        <span>/</span>
        <span style={{ color: "rgba(255,255,255,0.65)" }}>Certificates</span>
      </div>

      {/* -- Header -- */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg,#7C3AED,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
            <Shield size={20} color="white" />
          </div>
          <div>
            <h1 style={{ color: "#fff", fontWeight: 800, fontSize: "26px", margin: "0 0 3px" }}>Certificate Management</h1>
            <p style={{ color: "rgba(255,255,255,0.40)", fontSize: "14px", margin: 0 }}>Review, verify &amp; manage student certificates</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
          <button
            onClick={handleIssueMissingCertificates}
            disabled={issuing}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "0 18px", height: "40px", background: "rgba(16,185,129,0.18)", border: "1px solid rgba(16,185,129,0.38)", borderRadius: "10px", color: "#6EE7B7", fontSize: "13px", fontWeight: 700, cursor: issuing ? "not-allowed" : "pointer", opacity: issuing ? 0.75 : 1, transition: "all .15s" }}
          >
            {issuing ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <CheckCircle size={14} />} Issue Certificates
          </button>
          <button
            onClick={handleExportCSV}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "0 18px", height: "40px", background: "transparent", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", color: "rgba(255,255,255,0.65)", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all .15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.30)"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.65)"; }}
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={() => {
              loadCertificates()
                .then(() => toast.success("Data refreshed!"))
                .catch(() => toast.error("Failed to refresh certificates"));
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "0 18px", height: "40px", background: "transparent", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", color: "rgba(255,255,255,0.65)", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all .15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.30)"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.65)"; }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* -- Stat cards -- */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px" }}>
        {STAT_CARDS.map(({ label, value, icon: Icon, iconBg, sub }) => (
          <div key={label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "20px 20px 16px", display: "flex", flexDirection: "column", gap: "10px", position: "relative", overflow: "hidden" }}>
            {/* faint big icon watermark */}
            <div style={{ position: "absolute", right: "-8px", top: "-8px", opacity: 0.06 }}>
              <Icon size={80} color="#fff" />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={16} color="#fff" />
              </div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.40)", letterSpacing: "0.07em", textTransform: "uppercase" as const }}>{label}</span>
            </div>
            <p style={{ fontSize: "36px", fontWeight: 900, color: "#fff", margin: "2px 0 0", lineHeight: 1 }}>{value}</p>
            {sub}
          </div>
        ))}
      </div>

      {/* -- Search + Filters + Sort -- */}
      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={15} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(17,19,34,0.35)", pointerEvents: "none" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by student name, course, or certificate number..."
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "12px", color: "#fff", padding: "0 16px 0 42px", height: "44px", width: "100%", fontSize: "14px", outline: "none", boxSizing: "border-box" as const }}
          />
        </div>
        <button
          onClick={() => setShowFilters(v => !v)}
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "0 18px", height: "44px", background: showFilters ? "rgba(124,58,237,0.18)" : "rgba(255,255,255,0.05)", border: `1px solid ${showFilters ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.12)"}`, borderRadius: "12px", color: showFilters ? "#A78BFA" : "rgba(255,255,255,0.65)", fontSize: "14px", fontWeight: 600, cursor: "pointer", flexShrink: 0, transition: "all .15s" }}
        >
          <Filter size={14} /> Filters {showFilters ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
        <button
          onClick={() => { cycleSortField(); }}
          onContextMenu={e => { e.preventDefault(); toggleSortDir(); }}
          title="Left-click: cycle sort field  |  Right-click: toggle asc/desc"
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "0 18px", height: "44px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "12px", color: "rgba(255,255,255,0.65)", fontSize: "13px", fontWeight: 600, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" as const, transition: "all .15s" }}
        >
          {sortLabel} <ArrowUpDown size={13} />
        </button>
      </div>

      {/* -- Filter panel -- */}
      {showFilters && (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            {([
              {
                label: "STUDENT",
                value: fStudent,
                setter: setFStudent,
                options: ["All Students", ...Array.from(new Set(certs.map(c => c.student ?? "Unknown Student")))],
              },
              {
                label: "COURSE",
                value: fCourse,
                setter: setFCourse,
                options: ["All Courses", ...Array.from(new Set(certs.map(c => c.course)))],
              },
              { label: "STATUS",  value: fStatus,  setter: setFStatus,  options: ["All Statuses", "Verified", "Pending Review", "Revoked"] },
            ] as const).map(({ label, value, setter, options }) => (
              <div key={label}>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", margin: "0 0 8px" }}>{label}</p>
                <select
                  value={value}
                  onChange={e => (setter as (v: string) => void)(e.target.value)}
                  style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "10px", color: "#fff", padding: "0 14px", height: "40px", fontSize: "13px", outline: "none", cursor: "pointer" }}
                >
                  {options.map(o => <option key={o} value={o} style={{ background: "#0A0A12" }}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -- Bulk action bar -- */}
      {selected.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 18px", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.20)", borderRadius: "12px" }}>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#A78BFA" }}>{selected.length} selected</span>
          <button onClick={() => setSelected([])} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.40)", fontSize: "12px", padding: 0 }}>Clear</button>
          <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
            <button
              onClick={() => setBulkApproveModal(true)}
              style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "0 16px", height: "36px", background: "rgba(106,112,133,0.12)", border: "1px solid rgba(106,112,133,0.3)", borderRadius: "10px", color: "#111322", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
            >
              <CheckCircle size={13} /> Verify All
            </button>
            <button
              onClick={() => setBulkRevokeModal(true)}
              style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "0 16px", height: "36px", background: "rgba(47,69,216,0.12)", border: "1px solid rgba(47,69,216,0.3)", borderRadius: "10px", color: "#2F45D8", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
            >
              <XCircle size={13} /> Revoke All
            </button>
          </div>
        </div>
      )}

      {/* -- Table / Empty state -- */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "80px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={28} color="rgba(255,255,255,0.2)" />
            </div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: "15px", margin: 0 }}>No certificates found</p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", margin: 0 }}>Certificates will appear here once students complete courses</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <th style={{ padding: "12px 16px", width: "40px" }}>
                    <input
                      type="checkbox"
                      checked={selected.length === filtered.length && filtered.length > 0}
                      onChange={toggleAll}
                      style={{ cursor: "pointer", accentColor: "#2F45D8", width: "15px", height: "15px" }}
                    />
                  </th>
                  {(["", "Student", "Course", "Cert #", "Issued", "Status", "Actions"] as const).map((h, hi) => (
                    <th key={hi} style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" as const, letterSpacing: "0.07em", whiteSpace: "nowrap" as const }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => {
                  const currentStatus = c.status;
                  return (
                    <tr
                      key={c.id}
                      style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", transition: "background .12s", background: selected.includes(c.id) ? "rgba(124,58,237,0.08)" : "transparent" }}
                      onMouseEnter={e => { if (!selected.includes(c.id)) (e.currentTarget as HTMLTableRowElement).style.background = "rgba(255,255,255,0.02)"; }}
                      onMouseLeave={e => { if (!selected.includes(c.id)) (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}
                    >
                      {/* Checkbox */}
                      <td style={{ padding: "14px 16px" }}>
                        <input
                          type="checkbox"
                          checked={selected.includes(c.id)}
                          onChange={() => toggleSelect(c.id)}
                          style={{ cursor: "pointer", accentColor: "#2F45D8", width: "15px", height: "15px" }}
                        />
                      </td>

                      {/* Student */}
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: ["#2F45D8", "#6F82FF", "#2F45D8"][parseInt(c.id.slice(-1)) % 3], display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontWeight: 800, fontSize: "13px", flexShrink: 0 }}>
                            {(c.student ?? "U")[0]}
                          </div>
                          <div>
                            <p style={{ color: "#fff", fontWeight: 600, fontSize: "14px", margin: "0 0 2px" }}>{c.student ?? "Unknown Student"}</p>
                            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", margin: 0 }}>{c.phone ?? "-"}</p>
                          </div>
                        </div>
                      </td>

                      {/* Course */}
                      <td style={{ padding: "14px 16px" }}>
                        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px", fontWeight: 500, margin: "0 0 2px" }}>{c.course}</p>
                        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", margin: 0 }}>{c.category}</p>
                      </td>

                      {/* Cert # */}
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <code style={{ fontSize: "12px", color: "#A78BFA", fontFamily: "monospace", background: "rgba(167,139,250,0.10)", padding: "2px 8px", borderRadius: "6px", border: "1px solid rgba(167,139,250,0.20)" }}>{c.id}</code>
                          <button
                            onClick={() => { navigator.clipboard.writeText(`/verify/${c.id}`); toast.success("Verification link copied!"); }}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.30)", display: "flex", padding: "2px", transition: "color .12s" }}
                            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#A78BFA"}
                            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.30)"}
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                      </td>

                      {/* Issued */}
                        <td style={{ padding: "14px 16px", fontSize: "13px", color: "rgba(255,255,255,0.50)", whiteSpace: "nowrap" as const }}>
                        {c.issued}
                      </td>

                      {/* Status */}
                      <td style={{ padding: "14px 16px" }}>
                        <div>
                          <StatusBadge status={currentStatus} />
                          {currentStatus === "revoked" && c.revokeReason && (
                            <p style={{ fontSize: "11px", color: "rgba(248,113,113,0.65)", margin: "4px 0 0", maxWidth: "180px" }}>{c.revokeReason}</p>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" as const }}>
                          {currentStatus !== "verified" && (
                            <button
                              onClick={() => handleVerify(c.id)}
                              style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "0 12px", height: "30px", background: "rgba(106,112,133,0.1)", border: "1px solid rgba(106,112,133,0.25)", borderRadius: "8px", color: "#111322", fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all .12s", whiteSpace: "nowrap" as const }}
                              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(106,112,133,0.18)"}
                              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(106,112,133,0.1)"}
                            >
                              <CheckCircle size={11} /> Verify
                            </button>
                          )}
                          {currentStatus !== "revoked" && (
                            <button
                              onClick={() => setRevokeModal(c.id)}
                              style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "0 12px", height: "30px", background: "rgba(47,69,216,0.1)", border: "1px solid rgba(47,69,216,0.25)", borderRadius: "8px", color: "#2F45D8", fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all .12s", whiteSpace: "nowrap" as const }}
                              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(47,69,216,0.18)"}
                              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(47,69,216,0.1)"}
                            >
                              <XCircle size={11} /> Revoke
                            </button>
                          )}
                          {currentStatus === "revoked" && (
                            <button
                              onClick={() => handleRestore(c.id)}
                              style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "0 12px", height: "30px", background: "rgba(106,112,133,0.1)", border: "1px solid rgba(106,112,133,0.25)", borderRadius: "8px", color: "#111322", fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all .12s", whiteSpace: "nowrap" as const }}
                              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(106,112,133,0.18)"}
                              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(106,112,133,0.1)"}
                            >
                              <Clock size={11} /> Restore
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* -- Revoke single modal -- */}
      {revokeModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(17,19,34,0.65)", backdropFilter: "blur(6px)", padding: "16px" }}>
          <div style={{ background: "#0F0F1A", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "20px", padding: "28px", maxWidth: "400px", width: "100%", display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "17px", margin: "0 0 4px" }}>Revoke Certificate</h3>
                <p style={{ color: "rgba(255,255,255,0.40)", fontSize: "13px", margin: 0 }}>
                  <code style={{ color: "#A78BFA", fontSize: "12px" }}>{revokeModal}</code>
                </p>
              </div>
              <button onClick={() => { setRevokeModal(null); setRevokeReason(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.40)", display: "flex", padding: "2px" }}>
                <X size={18} />
              </button>
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.50)", marginBottom: "8px", display: "block" }}>Reason for revocation <span style={{ color: "#F87171" }}>*</span></label>
              <textarea
                value={revokeReason}
                onChange={e => setRevokeReason(e.target.value)}
                rows={3}
                placeholder="e.g. Academic dishonesty, data error..."
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "10px", color: "#fff", padding: "12px 14px", width: "100%", fontSize: "13px", outline: "none", resize: "vertical", boxSizing: "border-box" as const }}
              />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => { setRevokeModal(null); setRevokeReason(""); }} style={{ flex: 1, height: "42px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.70)", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleRevoke} style={{ flex: 1, height: "42px", borderRadius: "12px", background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.35)", color: "#F87171", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>Revoke</button>
            </div>
          </div>
        </div>
      )}

      {/* -- Bulk approve modal -- */}
      {bulkApproveModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(17,19,34,0.65)", backdropFilter: "blur(6px)", padding: "16px" }}>
          <div style={{ background: "#0F0F1A", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "20px", padding: "28px", maxWidth: "400px", width: "100%", display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "17px", margin: "0 0 4px" }}>Verify {selected.length} Certificates</h3>
                <p style={{ color: "rgba(255,255,255,0.40)", fontSize: "13px", margin: 0 }}>This will mark all selected certificates as verified.</p>
              </div>
              <button onClick={() => setBulkApproveModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.40)", display: "flex", padding: "2px" }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setBulkApproveModal(false)} style={{ flex: 1, height: "42px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.70)", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleBulkVerify} style={{ flex: 1, height: "42px", borderRadius: "12px", background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.35)", color: "#4ADE80", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>Verify All</button>
            </div>
          </div>
        </div>
      )}

      {/* -- Bulk revoke modal -- */}
      {bulkRevokeModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(17,19,34,0.65)", backdropFilter: "blur(6px)", padding: "16px" }}>
          <div style={{ background: "#0F0F1A", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "20px", padding: "28px", maxWidth: "400px", width: "100%", display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "17px", margin: "0 0 4px" }}>Bulk Revoke {selected.length} Certificates</h3>
                <p style={{ color: "rgba(255,255,255,0.40)", fontSize: "13px", margin: 0 }}>Provide a reason that applies to all selected.</p>
              </div>
              <button onClick={() => { setBulkRevokeModal(false); setRevokeReason(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.40)", display: "flex", padding: "2px" }}>
                <X size={18} />
              </button>
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.50)", marginBottom: "8px", display: "block" }}>Reason for revocation <span style={{ color: "#F87171" }}>*</span></label>
              <textarea
                value={revokeReason}
                onChange={e => setRevokeReason(e.target.value)}
                rows={3}
                placeholder="e.g. Batch audit, policy update..."
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "10px", color: "#fff", padding: "12px 14px", width: "100%", fontSize: "13px", outline: "none", resize: "vertical", boxSizing: "border-box" as const }}
              />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => { setBulkRevokeModal(false); setRevokeReason(""); }} style={{ flex: 1, height: "42px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.70)", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleBulkRevoke} style={{ flex: 1, height: "42px", borderRadius: "12px", background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.35)", color: "#F87171", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>Revoke All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
