"use client";
import { useState, useMemo } from "react";
import {
  Shield, CheckCircle, Clock, XCircle, FileText, Search, Download,
  Copy, X, Filter, ChevronUp, ChevronDown, RefreshCw, ArrowUpDown,
} from "lucide-react";
import toast from "react-hot-toast";

const COURSES_LIST = [
  "Engineering Mathematics",
  "Physics Mechanics",
  "Chemistry Fundamentals",
  "Computer Science Basics",
  "Electronics & Circuits",
];

const STUDENTS_LIST = [
  "Arjun Sharma", "Priya Nair", "Meera Iyer",
];

const CERTS = [
  { id: "CERT-2026-001", student: "Arjun Sharma",  phone: "9876543210", course: "Engineering Mathematics", category: "Mathematics", issued: "Apr 20, 2026", status: "verified"  },
  { id: "CERT-2026-002", student: "Priya Nair",    phone: "9876543211", course: "Physics Mechanics",       category: "Physics",     issued: "Apr 15, 2026", status: "pending"   },
  { id: "CERT-2026-003", student: "Meera Iyer",    phone: "9876543218", course: "Physics Mechanics",       category: "Physics",     issued: "Mar 18, 2026", status: "verified"  },
  { id: "CERT-2026-004", student: "Arjun Sharma",  phone: "9876543210", course: "Computer Science Basics", category: "CS",          issued: "Mar 5, 2026",  status: "revoked", revokeReason: "Academic dishonesty" },
  { id: "CERT-2026-005", student: "Priya Nair",    phone: "9876543211", course: "Chemistry Fundamentals",  category: "Chemistry",   issued: "Feb 28, 2026", status: "pending"   },
];

type Cert = typeof CERTS[0] & { revokeReason?: string };
type SortField = "issued" | "student" | "course";

const STATUS_META: Record<string, { label: string; bg: string; color: string; border: string }> = {
  verified: { label: "Verified",        bg: "rgba(106,112,133,0.10)",  color: "#111322", border: "rgba(106,112,133,0.25)"  },
  pending:  { label: "Pending Review",  bg: "rgba(106,112,133,0.10)",  color: "#111322", border: "rgba(106,112,133,0.25)"  },
  revoked:  { label: "Revoked",         bg: "rgba(47,69,216,0.10)",   color: "#2F45D8", border: "rgba(47,69,216,0.25)"   },
};

export default function AdminCertificatesPage() {
  const [certs, setCerts]             = useState<Cert[]>(CERTS);
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

  // -- Status helpers ---------------------------------------------------------
  const getStatus = (id: string) => certs.find(c => c.id === id)?.status ?? "pending";
  const getReason = (id: string) => certs.find(c => c.id === id)?.revokeReason;

  // -- Filtering + sorting ----------------------------------------------------
  const filtered = useMemo(() => {
    return certs
      .filter(c => {
        if (search && !c.student.toLowerCase().includes(search.toLowerCase()) &&
            !c.phone.includes(search) && !c.id.toLowerCase().includes(search.toLowerCase()) &&
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
        if (sortField === "student") val = a.student.localeCompare(b.student);
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
    students: new Set(certs.map(c => c.student)).size,
    verifiedPct: certs.length ? Math.round(certs.filter(c => c.status === "verified").length / certs.length * 100) : 0,
  }), [certs]);

  // -- Selection helpers ------------------------------------------------------
  const toggleSelect  = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll     = () => setSelected(selected.length === filtered.length ? [] : filtered.map(c => c.id));

  // -- Actions ----------------------------------------------------------------
  const updateCerts = (ids: string[], status: string, reason?: string) => {
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
      ...certs.map(c => [c.id, c.student, c.phone, c.course, c.category, c.issued, c.status, c.revokeReason ?? ""]),
    ];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href = url; a.download = "certificates.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
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
      label: "TOTAL ISSUED",   value: counts.total,    icon: FileText,      iconBg: "#2F45D8",
      sub: <span style={{ fontSize: "11px", color: "rgba(17,19,34,0.35)", display: "flex", alignItems: "center", gap: "4px" }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        {counts.students} unique students
      </span>,
    },
    {
      label: "VERIFIED",       value: counts.verified, icon: CheckCircle,   iconBg: "#E1E8FF",
      sub: <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <div style={{ flex: 1, height: "4px", borderRadius: "9999px", background: "rgba(17,19,34,0.08)", maxWidth: "80px" }}>
          <div style={{ height: "100%", borderRadius: "9999px", width: `${counts.verifiedPct}%`, background: "#6A7085" }} />
        </div>
        <span style={{ fontSize: "11px", color: "#111322" }}>{counts.verifiedPct}%</span>
      </div>,
    },
    {
      label: "PENDING REVIEW", value: counts.pending,  icon: Clock,         iconBg: "#E1E8FF",
      sub: <span style={{ fontSize: "11px", color: "rgba(17,19,34,0.35)" }}>All reviewed</span>,
    },
    {
      label: "REVOKED",        value: counts.revoked,  icon: XCircle,       iconBg: "#2F45D8",
      sub: <span style={{ fontSize: "11px", color: "rgba(17,19,34,0.35)" }}>Invalidated certificates</span>,
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
    <div style={{ padding: "28px 24px", maxWidth: "1280px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* -- Breadcrumb -- */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "rgba(17,19,34,0.35)" }}>
        <span>Dashboard</span>
        <span>/</span>
        <span style={{ color: "rgba(17,19,34,0.7)" }}>Certificates</span>
      </div>

      {/* -- Header -- */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg,#2F45D8,#2336B8)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
            <Shield size={20} color="#111322" />
          </div>
          <div>
            <h1 style={{ color: "#FFFFFF", fontWeight: 800, fontSize: "26px", margin: "0 0 3px", background: "linear-gradient(135deg,#2F45D8,#2336B8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Certificate Management</h1>
            <p style={{ color: "rgba(17,19,34,0.4)", fontSize: "14px", margin: 0 }}>Review, verify &amp; manage student certificates</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
          <button
            onClick={handleExportCSV}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "0 18px", height: "40px", background: "transparent", border: "1px solid rgba(17,19,34,0.15)", borderRadius: "10px", color: "rgba(17,19,34,0.7)", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all .15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(17,19,34,0.3)"; (e.currentTarget as HTMLButtonElement).style.color = "#111322"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(17,19,34,0.15)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(17,19,34,0.7)"; }}
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={() => toast.success("Data refreshed!")}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "0 18px", height: "40px", background: "transparent", border: "1px solid rgba(17,19,34,0.15)", borderRadius: "10px", color: "rgba(17,19,34,0.7)", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all .15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(17,19,34,0.3)"; (e.currentTarget as HTMLButtonElement).style.color = "#111322"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(17,19,34,0.15)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(17,19,34,0.7)"; }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* -- Stat cards -- */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px" }}>
        {STAT_CARDS.map(({ label, value, icon: Icon, iconBg, sub }) => (
          <div key={label} style={{ background: "rgba(17,19,34,0.025)", border: "1px solid rgba(17,19,34,0.07)", borderRadius: "16px", padding: "20px 20px 16px", display: "flex", flexDirection: "column", gap: "10px", position: "relative", overflow: "hidden" }}>
            {/* faint big icon watermark */}
            <div style={{ position: "absolute", right: "-8px", top: "-8px", opacity: 0.06 }}>
              <Icon size={80} color="#111322" />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={16} color="#111322" />
              </div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "rgba(17,19,34,0.4)", letterSpacing: "0.07em", textTransform: "uppercase" as const }}>{label}</span>
            </div>
            <p style={{ fontSize: "36px", fontWeight: 900, color: "#111322", margin: "2px 0 0", lineHeight: 1 }}>{value}</p>
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
            style={{ background: "rgba(17,19,34,0.04)", border: "1px solid rgba(17,19,34,0.09)", borderRadius: "12px", color: "#111322", padding: "0 16px 0 42px", height: "44px", width: "100%", fontSize: "14px", outline: "none", boxSizing: "border-box" as const }}
          />
        </div>
        <button
          onClick={() => setShowFilters(v => !v)}
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "0 18px", height: "44px", background: showFilters ? "rgba(47,69,216,0.18)" : "rgba(17,19,34,0.05)", border: `1px solid ${showFilters ? "rgba(47,69,216,0.5)" : "rgba(17,19,34,0.12)"}`, borderRadius: "12px", color: showFilters ? "#2F45D8" : "#111322", fontSize: "14px", fontWeight: 600, cursor: "pointer", flexShrink: 0, transition: "all .15s" }}
        >
          <Filter size={14} /> Filters {showFilters ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
        <button
          onClick={() => { cycleSortField(); }}
          onContextMenu={e => { e.preventDefault(); toggleSortDir(); }}
          title="Left-click: cycle sort field  |  Right-click: toggle asc/desc"
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "0 18px", height: "44px", background: "rgba(17,19,34,0.05)", border: "1px solid rgba(17,19,34,0.12)", borderRadius: "12px", color: "rgba(17,19,34,0.7)", fontSize: "13px", fontWeight: 600, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" as const, transition: "all .15s" }}
        >
          {sortLabel} <ArrowUpDown size={13} />
        </button>
      </div>

      {/* -- Filter panel -- */}
      {showFilters && (
        <div style={{ background: "rgba(17,19,34,0.02)", border: "1px solid rgba(17,19,34,0.08)", borderRadius: "14px", padding: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            {([
              { label: "STUDENT", value: fStudent, setter: setFStudent, options: ["All Students", ...STUDENTS_LIST] },
              { label: "COURSE",  value: fCourse,  setter: setFCourse,  options: ["All Courses",  ...COURSES_LIST]  },
              { label: "STATUS",  value: fStatus,  setter: setFStatus,  options: ["All Statuses", "Verified", "Pending Review", "Revoked"] },
            ] as const).map(({ label, value, setter, options }) => (
              <div key={label}>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "rgba(17,19,34,0.35)", letterSpacing: "0.08em", margin: "0 0 8px" }}>{label}</p>
                <select
                  value={value}
                  onChange={e => (setter as (v: string) => void)(e.target.value)}
                  style={{ width: "100%", background: "rgba(17,19,34,0.06)", border: "1px solid rgba(17,19,34,0.1)", borderRadius: "10px", color: "#111322", padding: "0 14px", height: "40px", fontSize: "13px", outline: "none", cursor: "pointer" }}
                >
                  {options.map(o => <option key={o} value={o} style={{ background: "linear-gradient(135deg,#EEF3FF,#DDE7FF)" }}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -- Bulk action bar -- */}
      {selected.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 18px", background: "rgba(47,69,216,0.08)", border: "1px solid rgba(47,69,216,0.2)", borderRadius: "12px" }}>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#2F45D8" }}>{selected.length} selected</span>
          <button onClick={() => setSelected([])} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(17,19,34,0.4)", fontSize: "12px", padding: 0 }}>Clear</button>
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
      <div style={{ background: "rgba(17,19,34,0.02)", border: "1px solid rgba(17,19,34,0.07)", borderRadius: "16px", overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "80px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "rgba(17,19,34,0.04)", border: "1px solid rgba(17,19,34,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={28} color="rgba(17,19,34,0.2)" />
            </div>
            <p style={{ color: "rgba(17,19,34,0.6)", fontWeight: 600, fontSize: "15px", margin: 0 }}>No certificates found</p>
            <p style={{ color: "rgba(17,19,34,0.3)", fontSize: "13px", margin: 0 }}>Certificates will appear here once students complete courses</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(17,19,34,0.07)" }}>
                  <th style={{ padding: "12px 16px", width: "40px" }}>
                    <input
                      type="checkbox"
                      checked={selected.length === filtered.length && filtered.length > 0}
                      onChange={toggleAll}
                      style={{ cursor: "pointer", accentColor: "#2F45D8", width: "15px", height: "15px" }}
                    />
                  </th>
                  {(["Student", "Course", "Cert #", "Issued", "Status", "Actions"] as const).map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "rgba(17,19,34,0.35)", textTransform: "uppercase" as const, letterSpacing: "0.07em", whiteSpace: "nowrap" as const }}>
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
                      style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(17,19,34,0.05)" : "none", transition: "background .12s", background: selected.includes(c.id) ? "rgba(47,69,216,0.05)" : "transparent" }}
                      onMouseEnter={e => { if (!selected.includes(c.id)) (e.currentTarget as HTMLTableRowElement).style.background = "rgba(17,19,34,0.02)"; }}
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
                            {c.student[0]}
                          </div>
                          <div>
                            <p style={{ color: "#111322", fontWeight: 600, fontSize: "14px", margin: "0 0 2px" }}>{c.student}</p>
                            <p style={{ color: "rgba(17,19,34,0.35)", fontSize: "12px", margin: 0 }}>{c.phone}</p>
                          </div>
                        </div>
                      </td>

                      {/* Course */}
                      <td style={{ padding: "14px 16px" }}>
                        <p style={{ color: "rgba(17,19,34,0.8)", fontSize: "13px", fontWeight: 500, margin: "0 0 2px" }}>{c.course}</p>
                        <p style={{ color: "rgba(17,19,34,0.35)", fontSize: "11px", margin: 0 }}>{c.category}</p>
                      </td>

                      {/* Cert # */}
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <code style={{ fontSize: "12px", color: "#2F45D8", fontFamily: "monospace", background: "rgba(47,69,216,0.1)", padding: "2px 8px", borderRadius: "6px", border: "1px solid rgba(47,69,216,0.2)" }}>{c.id}</code>
                          <button
                            onClick={() => { navigator.clipboard.writeText(`/verify/${c.id}`); toast.success("Verification link copied!"); }}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(17,19,34,0.3)", display: "flex", padding: "2px", transition: "color .12s" }}
                            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#2F45D8"}
                            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "rgba(17,19,34,0.3)"}
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                      </td>

                      {/* Issued */}
                      <td style={{ padding: "14px 16px", fontSize: "13px", color: "rgba(17,19,34,0.5)", whiteSpace: "nowrap" as const }}>
                        {c.issued}
                      </td>

                      {/* Status */}
                      <td style={{ padding: "14px 16px" }}>
                        <div>
                          <StatusBadge status={currentStatus} />
                          {currentStatus === "revoked" && c.revokeReason && (
                            <p style={{ fontSize: "11px", color: "rgba(47,69,216,0.65)", margin: "4px 0 0", maxWidth: "180px" }}>{c.revokeReason}</p>
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
          <div style={{ background: "linear-gradient(135deg,#EEF3FF,#DDE7FF)", border: "1px solid rgba(17,19,34,0.1)", borderRadius: "20px", padding: "28px", maxWidth: "400px", width: "100%", display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ color: "#111322", fontWeight: 700, fontSize: "17px", margin: "0 0 4px" }}>Revoke Certificate</h3>
                <p style={{ color: "rgba(17,19,34,0.4)", fontSize: "13px", margin: 0 }}>
                  <code style={{ color: "#2F45D8", fontSize: "12px" }}>{revokeModal}</code>
                </p>
              </div>
              <button onClick={() => { setRevokeModal(null); setRevokeReason(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(17,19,34,0.4)", display: "flex", padding: "2px" }}>
                <X size={18} />
              </button>
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "rgba(17,19,34,0.5)", marginBottom: "8px", display: "block" }}>Reason for revocation <span style={{ color: "#2F45D8" }}>*</span></label>
              <textarea
                value={revokeReason}
                onChange={e => setRevokeReason(e.target.value)}
                rows={3}
                placeholder="e.g. Academic dishonesty, data error..."
                style={{ background: "rgba(17,19,34,0.05)", border: "1px solid rgba(17,19,34,0.1)", borderRadius: "10px", color: "#111322", padding: "12px 14px", width: "100%", fontSize: "13px", outline: "none", resize: "vertical", boxSizing: "border-box" as const }}
              />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => { setRevokeModal(null); setRevokeReason(""); }} style={{ flex: 1, height: "42px", borderRadius: "12px", background: "rgba(17,19,34,0.05)", border: "1px solid rgba(17,19,34,0.12)", color: "#111322", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleRevoke} style={{ flex: 1, height: "42px", borderRadius: "12px", background: "rgba(47,69,216,0.15)", border: "1px solid rgba(47,69,216,0.35)", color: "#2F45D8", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>Revoke</button>
            </div>
          </div>
        </div>
      )}

      {/* -- Bulk approve modal -- */}
      {bulkApproveModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(17,19,34,0.65)", backdropFilter: "blur(6px)", padding: "16px" }}>
          <div style={{ background: "linear-gradient(135deg,#EEF3FF,#DDE7FF)", border: "1px solid rgba(17,19,34,0.1)", borderRadius: "20px", padding: "28px", maxWidth: "400px", width: "100%", display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ color: "#111322", fontWeight: 700, fontSize: "17px", margin: "0 0 4px" }}>Verify {selected.length} Certificates</h3>
                <p style={{ color: "rgba(17,19,34,0.4)", fontSize: "13px", margin: 0 }}>This will mark all selected certificates as verified.</p>
              </div>
              <button onClick={() => setBulkApproveModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(17,19,34,0.4)", display: "flex", padding: "2px" }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setBulkApproveModal(false)} style={{ flex: 1, height: "42px", borderRadius: "12px", background: "rgba(17,19,34,0.05)", border: "1px solid rgba(17,19,34,0.12)", color: "#111322", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleBulkVerify} style={{ flex: 1, height: "42px", borderRadius: "12px", background: "rgba(106,112,133,0.15)", border: "1px solid rgba(106,112,133,0.35)", color: "#111322", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>Verify All</button>
            </div>
          </div>
        </div>
      )}

      {/* -- Bulk revoke modal -- */}
      {bulkRevokeModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(17,19,34,0.65)", backdropFilter: "blur(6px)", padding: "16px" }}>
          <div style={{ background: "linear-gradient(135deg,#EEF3FF,#DDE7FF)", border: "1px solid rgba(17,19,34,0.1)", borderRadius: "20px", padding: "28px", maxWidth: "400px", width: "100%", display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ color: "#111322", fontWeight: 700, fontSize: "17px", margin: "0 0 4px" }}>Bulk Revoke {selected.length} Certificates</h3>
                <p style={{ color: "rgba(17,19,34,0.4)", fontSize: "13px", margin: 0 }}>Provide a reason that applies to all selected.</p>
              </div>
              <button onClick={() => { setBulkRevokeModal(false); setRevokeReason(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(17,19,34,0.4)", display: "flex", padding: "2px" }}>
                <X size={18} />
              </button>
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "rgba(17,19,34,0.5)", marginBottom: "8px", display: "block" }}>Reason for revocation <span style={{ color: "#2F45D8" }}>*</span></label>
              <textarea
                value={revokeReason}
                onChange={e => setRevokeReason(e.target.value)}
                rows={3}
                placeholder="e.g. Batch audit, policy update..."
                style={{ background: "rgba(17,19,34,0.05)", border: "1px solid rgba(17,19,34,0.1)", borderRadius: "10px", color: "#111322", padding: "12px 14px", width: "100%", fontSize: "13px", outline: "none", resize: "vertical", boxSizing: "border-box" as const }}
              />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => { setBulkRevokeModal(false); setRevokeReason(""); }} style={{ flex: 1, height: "42px", borderRadius: "12px", background: "rgba(17,19,34,0.05)", border: "1px solid rgba(17,19,34,0.12)", color: "#111322", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleBulkRevoke} style={{ flex: 1, height: "42px", borderRadius: "12px", background: "rgba(47,69,216,0.15)", border: "1px solid rgba(47,69,216,0.35)", color: "#2F45D8", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>Revoke All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
