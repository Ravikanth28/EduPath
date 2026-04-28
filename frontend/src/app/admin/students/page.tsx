"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, Users, Award, TrendingUp, Filter, ChevronUp, ChevronDown, UserPlus, BookOpen, X, Eye } from "lucide-react";
import toast from "react-hot-toast";

const INITIAL_STUDENTS = [
  { id: "1", name: "Arjun Sharma", phone: "9876543210", email: "arjun@example.com", courses: 3, progress: 72, certs: 1, joined: "Mar 10, 2026", status: "active", enrolled: true },
  { id: "2", name: "Priya Nair", phone: "9876543211", email: "priya@example.com", courses: 2, progress: 91, certs: 2, joined: "Feb 28, 2026", status: "active", enrolled: true },
  { id: "3", name: "Rahul Mehta", phone: "9876543212", email: "rahul@example.com", courses: 1, progress: 35, certs: 0, joined: "Apr 5, 2026", status: "inactive", enrolled: true },
  { id: "4", name: "Sneha Patel", phone: "9876543213", email: "sneha@example.com", courses: 0, progress: 0, certs: 0, joined: "Apr 20, 2026", status: "not_started", enrolled: false },
  { id: "5", name: "Deepa Krishnan", phone: "9876543214", email: "deepa@example.com", courses: 2, progress: 58, certs: 0, joined: "Mar 22, 2026", status: "active", enrolled: true },
];

export default function AdminStudentsPage() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "progress" | "joined">("joined");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [showRegister, setShowRegister] = useState(false);
  const [regForm, setRegForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});

  const sort = (key: typeof sortBy) => {
    if (sortBy === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(key); setSortDir("asc"); }
  };

  const filtered = students.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.phone.includes(search) || s.email.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    let val = 0;
    if (sortBy === "name") val = a.name.localeCompare(b.name);
    else if (sortBy === "progress") val = a.progress - b.progress;
    else val = new Date(a.joined).getTime() - new Date(b.joined).getTime();
    return sortDir === "asc" ? val : -val;
  });

  const SortIcon = ({ field }: { field: typeof sortBy }) =>
    sortBy === field ? (sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null;

  const validateRegForm = () => {
    const errors: Record<string, string> = {};
    if (!regForm.name.trim()) errors.name = "Name is required";
    if (!regForm.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regForm.email)) errors.email = "Invalid email format";
    if (!regForm.phone.trim()) errors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(regForm.phone.replace(/\s/g, ""))) errors.phone = "Phone must be 10 digits";
    if (!regForm.password) errors.password = "Password is required";
    else if (regForm.password.length < 6) errors.password = "Password must be at least 6 characters";
    return errors;
  };

  const handleRegister = () => {
    const errors = validateRegForm();
    if (Object.keys(errors).length > 0) { setRegErrors(errors); return; }
    const newStudent = {
      id: String(students.length + 1),
      name: regForm.name.trim(),
      phone: regForm.phone.trim(),
      email: regForm.email.trim(),
      courses: 0, progress: 0, certs: 0,
      joined: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "not_started", enrolled: false,
    };
    setStudents(s => [newStudent, ...s]);
    toast.success("Student registered successfully!");
    setShowRegister(false);
    setRegForm({ name: "", email: "", phone: "", password: "" });
    setRegErrors({});
  };

  const closeRegister = () => {
    setShowRegister(false);
    setRegForm({ name: "", email: "", phone: "", password: "" });
    setRegErrors({});
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Students</h1><p className="text-white/50 text-sm mt-0.5">{students.length} registered users</p></div>
        <button onClick={() => setShowRegister(true)} className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm"><UserPlus size={16} /> Register User</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Students", value: students.length, icon: Users, color: "text-purple-400" },
          { label: "Enrolled", value: students.filter(s => s.enrolled).length, icon: BookOpen, color: "text-cyan-400" },
          { label: "Certificates", value: students.reduce((a, s) => a + s.certs, 0), icon: Award, color: "text-amber-400" },
          { label: "Not Started", value: students.filter(s => s.status === "not_started").length, icon: TrendingUp, color: "text-red-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card p-4 flex items-center gap-3">
            <Icon size={18} className={color} />
            <div><p className="text-lg font-bold text-white">{value}</p><p className="text-xs text-white/50">{label}</p></div>
          </div>
        ))}
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Scope", value: students.length, sub: "Registered" },
          { label: "Enrolled", value: students.filter(s => s.enrolled).length, sub: "In a course" },
          { label: "Completed", value: students.filter(s => s.progress >= 100).length, sub: "All modules" },
          { label: "In Progress", value: students.filter(s => s.progress > 0 && s.progress < 100).length, sub: "Active learners" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="glass-card p-4 text-center">
            <p className="text-2xl font-black gradient-text">{value}</p>
            <p className="text-sm font-semibold text-white mt-0.5">{label}</p>
            <p className="text-xs text-white/40">{sub}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, phone, or email..." className="input-field pl-10" />
        </div>
        <button className="btn-secondary flex items-center gap-2 px-4 py-2.5 text-sm">
          <Filter size={15} /> Filters
        </button>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {[["Name", "name"], ["Contact", null], ["Courses", null], ["Progress", "progress"], ["Certs", null], ["Joined", "joined"], ["", null]].map(([label, key]) => (
                  <th key={label as string} className={`text-left px-4 py-3 text-xs text-white/40 font-semibold uppercase tracking-wider ${key ? "cursor-pointer hover:text-white/70 select-none" : ""}`}
                    onClick={key ? () => sort(key as typeof sortBy) : undefined}>
                    <span className="flex items-center gap-1">{label as string}{key && <SortIcon field={key as typeof sortBy} />}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-white/40 text-sm">No students found.</td>
                </tr>
              ) : filtered.map(s => (
                <tr key={s.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {s.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-white">{s.name}</p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${s.status === "active" ? "bg-green-500/10 text-green-400" : s.status === "inactive" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}>
                          {s.status === "not_started" ? "Not Started" : s.status}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/60 text-xs">
                    <p>{s.phone}</p>
                    <p className="text-white/40 truncate max-w-[140px]">{s.email}</p>
                  </td>
                  <td className="px-4 py-3 text-white/80">{s.courses}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 transition-all" style={{ width: `${s.progress}%` }} />
                      </div>
                      <span className="text-xs text-white/60">{s.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {s.certs > 0 ? <span className="badge-green text-xs">{s.certs}</span> : <span className="text-white/30 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 text-white/50 text-xs whitespace-nowrap">{s.joined}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/students/${s.id}`} className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors inline-flex">
                      <Eye size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-card p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white">Register New Student</h3>
              <button onClick={closeRegister} className="text-white/40 hover:text-white"><X size={18} /></button>
            </div>
            {[["Full Name", "name", "text"], ["Email", "email", "email"], ["Phone (10 digits)", "phone", "tel"], ["Temporary Password", "password", "password"]].map(([label, key, type]) => (
              <div key={key as string}>
                <label className="text-xs text-white/40 mb-1 block">{label as string}</label>
                <input
                  type={type as string}
                  value={(regForm as Record<string, string>)[key as string]}
                  onChange={e => { setRegForm(f => ({ ...f, [key as string]: e.target.value })); setRegErrors(r => { const n = { ...r }; delete n[key as string]; return n; }); }}
                  className={`input-field ${regErrors[key as string] ? "border-red-500/50" : ""}`}
                />
                {regErrors[key as string] && <p className="text-xs text-red-400 mt-1">{regErrors[key as string]}</p>}
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button onClick={closeRegister} className="btn-secondary flex-1 py-2.5 text-sm">Cancel</button>
              <button onClick={handleRegister} className="btn-primary flex-1 py-2.5 text-sm">Register</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
