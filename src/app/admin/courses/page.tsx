"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, Plus, Trash2, BookOpen, Video, HelpCircle, Users, ToggleLeft, Settings, CheckSquare } from "lucide-react";
import toast from "react-hot-toast";

const COURSES = [
  { id: "1", title: "Engineering Mathematics", category: "Mathematics", desc: "Calculus, Linear Algebra, Differential Equations.", modules: 6, videos: 18, questions: 90, students: 420, published: true, color: "from-purple-600 to-blue-600" },
  { id: "2", title: "Physics Mechanics", category: "Physics", desc: "Newton's laws, kinematics, and energy systems.", modules: 5, videos: 15, questions: 75, students: 380, published: true, color: "from-cyan-600 to-teal-600" },
  { id: "3", title: "Chemistry Fundamentals", category: "Chemistry", desc: "Organic, inorganic and physical chemistry.", modules: 8, videos: 24, questions: 120, students: 290, published: false, color: "from-orange-600 to-red-600" },
];

export default function AdminCoursesPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showBulkDelete, setShowBulkDelete] = useState(false);

  const filtered = COURSES.filter(c => !search || c.title.toLowerCase().includes(search.toLowerCase()));
  const allSelected = filtered.length > 0 && filtered.every(c => selected.includes(c.id));

  const toggleSelect = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(allSelected ? [] : filtered.map(c => c.id));

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Courses</h1>
          <p className="text-white/50 text-sm mt-0.5">{COURSES.length} total courses</p>
        </div>
        <Link href="/admin/courses/new" className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm">
          <Plus size={16} /> New Course
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Courses", value: COURSES.length, icon: BookOpen, color: "text-purple-400" },
          { label: "Published", value: COURSES.filter(c => c.published).length, icon: CheckSquare, color: "text-green-400" },
          { label: "Total Videos", value: COURSES.reduce((a, c) => a + c.videos, 0), icon: Video, color: "text-cyan-400" },
          { label: "Enrollments", value: COURSES.reduce((a, c) => a + c.students, 0), icon: Users, color: "text-amber-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card p-4 flex items-center gap-3">
            <Icon size={18} className={color} />
            <div><p className="text-lg font-bold text-white">{value}</p><p className="text-xs text-white/50">{label}</p></div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses..." className="input-field pl-10" />
        </div>
        <button onClick={toggleAll} className="btn-secondary flex items-center gap-2 px-4 py-2.5 text-sm">
          <CheckSquare size={15} /> {allSelected ? "Deselect All" : "Select All"}
        </button>
      </div>

      {/* Bulk action bar */}
      {selected.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <span className="text-sm text-white">{selected.length} selected</span>
          <button onClick={() => setSelected([])} className="text-xs text-white/50 hover:text-white ml-2">Clear</button>
          <button onClick={() => setShowBulkDelete(true)} className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/20 text-red-400 border border-red-600/30 text-sm hover:bg-red-600/30 transition-colors">
            <Trash2 size={14} /> Delete Selected
          </button>
        </div>
      )}

      {/* Course grid */}
      {filtered.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <BookOpen size={32} className="text-white/20 mx-auto mb-3" />
          <p className="text-white/50">No courses found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(c => (
            <div key={c.id} className={`glass-card overflow-hidden flex flex-col relative ${selected.includes(c.id) ? "border border-purple-500/40" : ""}`}>
              {/* Checkbox */}
              <button
                onClick={() => toggleSelect(c.id)}
                className="absolute top-3 left-3 z-10 w-5 h-5 rounded-md border transition-all flex items-center justify-center"
                style={{ background: selected.includes(c.id) ? "#7C3AED" : "rgba(5,5,8,0.7)", borderColor: selected.includes(c.id) ? "#7C3AED" : "rgba(255,255,255,0.2)" }}
              >
                {selected.includes(c.id) && <CheckSquare size={12} className="text-white" />}
              </button>
              <div className={`h-2 bg-gradient-to-r ${c.color}`} />
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-2 pl-5">
                  <span className="badge-purple text-xs">{c.category}</span>
                  {c.published ? <span className="badge-green text-xs">Published</span> : <span className="badge-amber text-xs">Draft</span>}
                </div>
                <h3 className="font-bold text-white mb-1">{c.title}</h3>
                <p className="text-xs text-white/50 mb-3 flex-1">{c.desc}</p>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[["Modules", c.modules], ["Videos", c.videos], ["Questions", c.questions], ["Students", c.students]].map(([l, v]) => (
                    <div key={l as string} className="text-center py-1.5 rounded-lg bg-white/[0.03]">
                      <p className="text-xs font-bold text-white">{v}</p>
                      <p className="text-[10px] text-white/40">{l}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toast.success(c.published ? "Course unpublished" : "Course published")} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all border border-white/10 hover:border-white/20 text-white/60 hover:text-white">
                    <ToggleLeft size={13} /> {c.published ? "Unpublish" : "Publish"}
                  </button>
                  <Link href={`/admin/courses/${c.id}`} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs btn-primary">
                    <Settings size={13} /> Manage
                  </Link>
                  <button onClick={() => setShowDeleteModal(c.id)} className="p-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-card p-6 max-w-sm w-full space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto">
              <Trash2 size={24} className="text-red-400" />
            </div>
            <h3 className="text-white font-bold text-center">Delete Course?</h3>
            <p className="text-sm text-white/50 text-center">This action cannot be undone. All modules, videos, and student progress will be lost.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(null)} className="btn-secondary flex-1 py-2.5 text-sm">Cancel</button>
              <button onClick={() => { toast.success("Course deleted"); setShowDeleteModal(null); }} className="flex-1 py-2.5 text-sm rounded-xl bg-red-600/20 border border-red-600/30 text-red-400 hover:bg-red-600/30 transition-colors font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk delete modal */}
      {showBulkDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-card p-6 max-w-sm w-full space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto">
              <Trash2 size={24} className="text-red-400" />
            </div>
            <h3 className="text-white font-bold text-center">Delete {selected.length} Courses?</h3>
            <p className="text-sm text-white/50 text-center">This will permanently delete all selected courses and their data.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowBulkDelete(false)} className="btn-secondary flex-1 py-2.5 text-sm">Cancel</button>
              <button onClick={() => { toast.success(`${selected.length} courses deleted`); setSelected([]); setShowBulkDelete(false); }} className="flex-1 py-2.5 text-sm rounded-xl bg-red-600/20 border border-red-600/30 text-red-400 hover:bg-red-600/30 transition-colors font-semibold">Delete All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
