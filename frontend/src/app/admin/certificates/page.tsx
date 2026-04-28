"use client";
import { useState } from "react";
import React from "react";
import { Award, CheckCircle, Clock, XCircle, Search, Download, Copy, X } from "lucide-react";
import toast from "react-hot-toast";

const CERTS = [
  { id: "CERT-DEMO-001", student: "Arjun Sharma", phone: "9876543210", course: "Engineering Mathematics", category: "Mathematics", issued: "Apr 20, 2026", status: "verified" },
  { id: "CERT-DEMO-002", student: "Priya Nair", phone: "9876543211", course: "Physics Mechanics", category: "Physics", issued: "Apr 15, 2026", status: "pending" },
  { id: "CERT-DEMO-003", student: "Rahul Mehta", phone: "9876543212", course: "Chemistry Fundamentals", category: "Chemistry", issued: "Mar 30, 2026", status: "revoked", revokeReason: "Academic dishonesty" },
];

const STATUS_COLORS: Record<string, string> = {
  verified: "badge-green", pending: "badge-amber", revoked: "badge-red",
};
const STATUS_ICONS: Record<string, React.ReactNode> = {
  verified: <CheckCircle size={14} className="text-green-400" />,
  pending: <Clock size={14} className="text-amber-400" />,
  revoked: <XCircle size={14} className="text-red-400" />,
};

export default function AdminCertificatesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [revokeModal, setRevokeModal] = useState<string | null>(null);
  const [revokeReason, setRevokeReason] = useState("");
  const [bulkRevokeModal, setBulkRevokeModal] = useState(false);
  const [statusMap, setStatusMap] = useState<Record<string, string>>(
    Object.fromEntries(CERTS.map(c => [c.id, c.status]))
  );
  const [revokeReasons, setRevokeReasons] = useState<Record<string, string>>(
    Object.fromEntries(CERTS.filter(c => c.revokeReason).map(c => [c.id, c.revokeReason!]))
  );

  const filtered = CERTS.filter(c => {
    const matchSearch = !search || c.student.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search) || c.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || statusMap[c.id] === statusFilter;
    return matchSearch && matchStatus;
  });

  const toggleSelect = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(c => c.id));

  const handleVerify = (id: string) => {
    setStatusMap(m => ({ ...m, [id]: "verified" }));
    setRevokeReasons(r => { const next = { ...r }; delete next[id]; return next; });
    toast.success("Certificate verified!");
  };

  const handleRevoke = (id: string) => {
    if (!revokeReason.trim()) { toast.error("Please provide a revocation reason"); return; }
    setStatusMap(m => ({ ...m, [id]: "revoked" }));
    setRevokeReasons(r => ({ ...r, [id]: revokeReason }));
    setRevokeModal(null);
    setRevokeReason("");
    toast.success("Certificate revoked");
  };

  const handleRestore = (id: string) => {
    setStatusMap(m => ({ ...m, [id]: "pending" }));
    setRevokeReasons(r => { const next = { ...r }; delete next[id]; return next; });
    toast.success("Certificate restored!");
  };

  const handleBulkVerify = () => {
    const updates = Object.fromEntries(selected.map(id => [id, "verified"]));
    setStatusMap(m => ({ ...m, ...updates }));
    setRevokeReasons(r => {
      const next = { ...r };
      selected.forEach(id => delete next[id]);
      return next;
    });
    toast.success(`${selected.length} certificates verified`);
    setSelected([]);
  };

  const handleBulkRevoke = () => {
    if (!revokeReason.trim()) { toast.error("Please provide a revocation reason"); return; }
    const updates = Object.fromEntries(selected.map(id => [id, "revoked"]));
    const reasons = Object.fromEntries(selected.map(id => [id, revokeReason]));
    setStatusMap(m => ({ ...m, ...updates }));
    setRevokeReasons(r => ({ ...r, ...reasons }));
    toast.success(`${selected.length} certificates revoked`);
    setSelected([]);
    setBulkRevokeModal(false);
    setRevokeReason("");
  };

  const counts = {
    total: CERTS.length,
    verified: Object.values(statusMap).filter(s => s === "verified").length,
    pending: Object.values(statusMap).filter(s => s === "pending").length,
    revoked: Object.values(statusMap).filter(s => s === "revoked").length,
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Certificates</h1><p className="text-white/50 text-sm mt-0.5">{CERTS.length} certificates issued</p></div>
        <button onClick={() => toast.success("CSV exported!")} className="btn-secondary flex items-center gap-2 px-4 py-2.5 text-sm"><Download size={15} /> Export CSV</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total", value: counts.total, color: "text-purple-400" },
          { label: "Verified", value: counts.verified, color: "text-green-400" },
          { label: "Pending", value: counts.pending, color: "text-amber-400" },
          { label: "Revoked", value: counts.revoked, color: "text-red-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card p-4"><p className={`text-2xl font-black ${color}`}>{value}</p><p className="text-xs text-white/50">{label}</p></div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by student, phone, or cert #..." className="input-field pl-10" />
        </div>
        <div className="flex gap-2">
          {["all", "verified", "pending", "revoked"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border capitalize ${statusFilter === s ? "bg-purple-600/20 text-purple-400 border-purple-600/30" : "border-white/[0.08] text-white/50 hover:text-white"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk bar */}
      {selected.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <span className="text-sm text-white">{selected.length} selected</span>
          <button onClick={() => setSelected([])} className="text-xs text-white/50 hover:text-white">Clear</button>
          <div className="ml-auto flex gap-2">
            <button onClick={handleBulkVerify} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600/20 text-green-400 border border-green-600/30 text-sm hover:bg-green-600/30 transition-colors">
              <CheckCircle size={14} /> Verify All
            </button>
            <button onClick={() => setBulkRevokeModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/20 text-red-400 border border-red-600/30 text-sm hover:bg-red-600/30 transition-colors">
              <XCircle size={14} /> Revoke All
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-4 py-3 text-left w-10">
                  <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded" />
                </th>
                {["Student", "Course", "Cert #", "Issued", "Status", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-white/40 font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-white/40 text-sm">No certificates found.</td>
                </tr>
              ) : filtered.map(c => {
                const currentStatus = statusMap[c.id] ?? c.status;
                const reason = revokeReasons[c.id];
                return (
                  <tr key={c.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggleSelect(c.id)} className="rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {c.student[0]}
                        </div>
                        <div>
                          <p className="font-medium text-white">{c.student}</p>
                          <p className="text-xs text-white/40">{c.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white/80">{c.course}</p>
                      <p className="text-xs text-white/40">{c.category}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-purple-400 font-mono">{c.id}</code>
                        <button onClick={() => { navigator.clipboard.writeText(`/verify/${c.id}`); toast.success("Link copied"); }} className="text-white/30 hover:text-white transition-colors">
                          <Copy size={11} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-white/50 whitespace-nowrap">{c.issued}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {STATUS_ICONS[currentStatus]}
                        <span className={`${STATUS_COLORS[currentStatus]} text-xs`}>{currentStatus}</span>
                      </div>
                      {reason && <p className="text-[10px] text-red-400/70 mt-0.5">{reason}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 flex-wrap">
                        {currentStatus !== "verified" && (
                          <button onClick={() => handleVerify(c.id)} className="text-xs px-2 py-1 rounded-lg bg-green-600/20 text-green-400 border border-green-600/30 hover:bg-green-600/30 transition-colors">Verify</button>
                        )}
                        {currentStatus !== "revoked" && (
                          <button onClick={() => setRevokeModal(c.id)} className="text-xs px-2 py-1 rounded-lg bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/30 transition-colors">Revoke</button>
                        )}
                        {currentStatus === "revoked" && (
                          <button onClick={() => handleRestore(c.id)} className="text-xs px-2 py-1 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-600/30 hover:bg-amber-600/30 transition-colors">Restore</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revoke modal */}
      {revokeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-card p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white">Revoke Certificate</h3>
              <button onClick={() => { setRevokeModal(null); setRevokeReason(""); }} className="text-white/40 hover:text-white"><X size={18} /></button>
            </div>
            <p className="text-sm text-white/50">Provide a reason for revoking this certificate.</p>
            <textarea value={revokeReason} onChange={e => setRevokeReason(e.target.value)} rows={3} placeholder="Reason for revocation..." className="input-field resize-none text-sm" />
            <div className="flex gap-3">
              <button onClick={() => { setRevokeModal(null); setRevokeReason(""); }} className="btn-secondary flex-1 py-2.5 text-sm">Cancel</button>
              <button onClick={() => handleRevoke(revokeModal)} className="flex-1 py-2.5 text-sm rounded-xl bg-red-600/20 border border-red-600/30 text-red-400 hover:bg-red-600/30 transition-colors font-semibold">Revoke</button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk revoke modal */}
      {bulkRevokeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-card p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white">Bulk Revoke {selected.length} Certificates</h3>
              <button onClick={() => { setBulkRevokeModal(false); setRevokeReason(""); }} className="text-white/40 hover:text-white"><X size={18} /></button>
            </div>
            <textarea value={revokeReason} onChange={e => setRevokeReason(e.target.value)} rows={3} placeholder="Reason for revocation..." className="input-field resize-none text-sm" />
            <div className="flex gap-3">
              <button onClick={() => { setBulkRevokeModal(false); setRevokeReason(""); }} className="btn-secondary flex-1 py-2.5 text-sm">Cancel</button>
              <button onClick={handleBulkRevoke} className="flex-1 py-2.5 text-sm rounded-xl bg-red-600/20 border border-red-600/30 text-red-400 hover:bg-red-600/30 transition-colors font-semibold">Revoke All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
