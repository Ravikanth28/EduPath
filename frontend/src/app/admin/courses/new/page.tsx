"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Minus, Upload, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const CATEGORIES = ["Mathematics", "Physics", "Chemistry", "Computer Science", "Electronics", "Mechanics", "Engineering Drawing", "English"];

export default function NewCoursePage() {
  const [form, setForm] = useState({ title: "", desc: "", category: "", thumbnail: "" });
  const [moduleCount, setModuleCount] = useState(3);
  const [moduleNames, setModuleNames] = useState<string[]>(Array(3).fill(""));
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleModuleCount = (delta: number) => {
    const next = Math.min(20, Math.max(1, moduleCount + delta));
    setModuleCount(next);
    setModuleNames(prev => {
      const arr = [...prev];
      while (arr.length < next) arr.push("");
      return arr.slice(0, next);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.category) { toast.error("Title and category are required."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    toast.success("Course created!");
    router.push("/admin/courses");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/courses" className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">New Course</h1>
          <p className="text-white/40 text-sm">Create a new course shell with modules</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="glass-card p-6 space-y-5 red-border">
          {/* Title */}
          <div>
            <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Course Title *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Machine Learning Fundamentals" className="input-field" />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Description</label>
            <textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="Brief course description..." rows={3} className="input-field resize-none" />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Category *</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-field">
              <option value="">Select category...</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Thumbnail</label>
            {form.thumbnail ? (
              <div className="flex items-center gap-3">
                <div className="w-20 h-14 rounded-xl bg-white/[0.06] overflow-hidden flex items-center justify-center">
                  <img src={form.thumbnail} alt="thumb" className="w-full h-full object-cover" />
                </div>
                <button type="button" onClick={() => setForm(f => ({ ...f, thumbnail: "" }))} className="text-sm text-red-400 hover:text-red-300">Remove thumbnail</button>
              </div>
            ) : (
              <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-white/20 hover:border-white/40 cursor-pointer transition-colors">
                <Upload size={16} className="text-white/40" />
                <span className="text-sm text-white/40">Choose File</span>
                <input type="file" accept="image/*" className="hidden" onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) setForm(f => ({ ...f, thumbnail: URL.createObjectURL(file) }));
                }} />
              </label>
            )}
          </div>

          {/* Module count */}
          <div>
            <label className="text-xs text-white/50 uppercase tracking-wider mb-3 block">Number of Modules</label>
            <div className="flex items-center gap-5">
              <button type="button" onClick={() => handleModuleCount(-1)} disabled={moduleCount <= 1} className="w-10 h-10 rounded-xl border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-purple-600/40 transition-all disabled:opacity-30">
                <Minus size={16} />
              </button>
              <span className="text-4xl font-black text-red-400 w-12 text-center">{moduleCount}</span>
              <button type="button" onClick={() => handleModuleCount(1)} disabled={moduleCount >= 20} className="w-10 h-10 rounded-xl border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-purple-600/40 transition-all disabled:opacity-30">
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Module names */}
          <div className="space-y-2">
            <label className="text-xs text-white/50 uppercase tracking-wider block">Module Names</label>
            {moduleNames.map((name, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-purple-600/20 text-purple-400 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                <input
                  value={name}
                  onChange={e => { const n = [...moduleNames]; n[i] = e.target.value; setModuleNames(n); }}
                  placeholder={`Module ${i + 1} title`}
                  className="input-field flex-1"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        {form.title && (
          <div className="glass-card p-4">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Preview</p>
            <h3 className="font-bold text-white mb-2">{form.title}</h3>
            <div className="flex flex-wrap gap-2">
              {form.category && <span className="badge-purple">{form.category}</span>}
              {moduleNames.filter(Boolean).map((n, i) => (
                <span key={i} className="text-xs px-2 py-1 rounded-full border border-white/[0.08] text-white/50">M{i + 1}: {n.slice(0, 20)}</span>
              ))}
            </div>
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
          {loading ? <><Loader2 size={15} className="animate-spin-slow" /> Creating...</> : <><Plus size={16} /> Create Course</>}
        </button>
      </form>
    </div>
  );
}
