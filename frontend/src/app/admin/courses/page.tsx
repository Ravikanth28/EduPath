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
  const [publishedMap, setPublishedMap] = useState<Record<string, boolean>>(
    Object.fromEntries(COURSES.map(c => [c.id, c.published]))
  );
  const [courseList, setCourseList] = useState(COURSES);

  const filtered = courseList.filter(c => !search || c.title.toLowerCase().includes(search.toLowerCase()));
  const allSelected = filtered.length > 0 && filtered.every(c => selected.includes(c.id));

  const toggleSelect = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(allSelected ? [] : filtered.map(c => c.id));

  const togglePublish = (id: string) => {
    const isPublished = publishedMap[id];
    setPublishedMap(m => ({ ...m, [id]: !isPublished }));
    toast.success(isPublished ? "Course unpublished" : "Course published");
  };

  const handleDelete = (id: string) => {
    setCourseList(list => list.filter(c => c.id !== id));
    setSelected(s => s.filter(x => x !== id));
    setShowDeleteModal(null);
    toast.success("Course deleted");
  };

  const handleBulkDelete = () => {
    setCourseList(list => list.filter(c => !selected.includes(c.id)));
    toast.success(`${selected.length} courses deleted`);
    setSelected([]);
    setShowBulkDelete(false);
  };

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
          { label: "Total Courses", value: courseList.length, icon: BookOpen, color: "text-purple-400", bg: "bg-purple-600/10", border: "border-purple-600/20" },
          { label: "Published", value: courseList.filter(c => publishedMap[c.id]).length, icon: CheckSquare, color: "text-green-400", bg: "bg-green-600/10", border: "border-green-600/20" },
          { label: "Total Videos", value: courseList.reduce((a, c) => a + c.videos, 0), icon: Video, color: "text-cyan-400", bg: "bg-cyan-600/10", border: "border-cyan-600/20" },
          { label: "Enrollments", value: courseList.reduce((a, c) => a + c.students, 0), icon: Users, color: "text-amber-400", bg: "bg-amber-600/10", border: "border-amber-600/20" },
        ].map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className={`glass-card p-4 flex items-center gap-3.5 border ${border}`}>
            <div className={`w-10 h-10 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={19} className={color} />
            </div>
            <div>
              <p className="text-xl font-bold text-white leading-none">{value}</p>
              <p className="text-xs text-white/45 mt-1.5">{label}</p>
            </div>
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
          {filtered.map(c => {
            const isPublished = publishedMap[c.id] ?? c.published;
            return (
            <div
              key={c.id}
              className="glass-card overflow-hidden flex flex-col"
              style={{ border: selected.includes(c.id) ? "1px solid rgba(124,58,237,0.45)" : "1px solid rgba(255,255,255,0.06)" }}
            >
              {/* Colored accent strip */}
              <div className={`h-1.5 bg-gradient-to-r ${c.color}`} />

              <div className="p-5 flex flex-col flex-1 gap-3.5">
                {/* Badge row: category left | status + checkbox right */}
                <div className="flex items-center justify-between gap-2">
                  <span className="badge-purple text-xs">{c.category}</span>
                  <div className="flex items-center gap-2">
                    {isPublished
                      ? <span className="badge-green text-xs">Published</span>
                      : <span className="badge-amber text-xs">Draft</span>
                    }
                    <button
                      onClick={() => toggleSelect(c.id)}
                      className="w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all"
                      style={{
                        background: selected.includes(c.id) ? "#7C3AED" : "rgba(255,255,255,0.04)",
                        borderColor: selected.includes(c.id) ? "#7C3AED" : "rgba(255,255,255,0.18)",
                      }}
                    >
                      {selected.includes(c.id) && <CheckSquare size={11} className="text-white" />}
                    </button>
                  </div>
                </div>

                {/* Title + desc */}
                <div>
                  <h3 className="font-bold text-white text-base mb-1.5 leading-snug">{c.title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed">{c.desc}</p>
                </div>

                {/* Inner stats */}
                <div className="grid grid-cols-4 gap-2">
                  {(["Modules", "Videos", "Questions", "Students"] as const).map((l, idx) => (
                    <div key={l} className="text-center py-2 rounded-xl bg-white/[0.04] border border-white/[0.05]">
                      <p className="text-sm font-bold text-white">{[c.modules, c.videos, c.questions, c.students][idx]}</p>
                      <p className="text-[10px] text-white/40 mt-0.5">{l}</p>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => togglePublish(c.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all border border-white/10 hover:border-white/20 text-white/60 hover:text-white"
                  >
                    <ToggleLeft size={13} /> {isPublished ? "Unpublish" : "Publish"}
                  </button>
                  <Link
                    href={`/admin/courses/${c.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold btn-primary"
                  >
                    <Settings size={13} /> Manage
                  </Link>
                  <button
                    onClick={() => setShowDeleteModal(c.id)}
                    className="w-9 flex items-center justify-center rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
            );
          })}
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
              <button onClick={() => handleDelete(showDeleteModal)} className="flex-1 py-2.5 text-sm rounded-xl bg-red-600/20 border border-red-600/30 text-red-400 hover:bg-red-600/30 transition-colors font-semibold">Delete</button>
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
              <button onClick={handleBulkDelete} className="flex-1 py-2.5 text-sm rounded-xl bg-red-600/20 border border-red-600/30 text-red-400 hover:bg-red-600/30 transition-colors font-semibold">Delete All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
