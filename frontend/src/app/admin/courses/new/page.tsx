"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Minus, Upload, PlayCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const CATEGORIES = ["Mathematics", "Physics", "Chemistry", "Computer Science", "Electronics", "Mechanics", "Engineering Drawing", "English", "AI & Data Science", "Other"];

const BG = "transparent";
const CARD = "linear-gradient(180deg, rgba(238,243,255,0.98), rgba(225,232,255,0.94))";
const BORDER = "rgba(17,19,34,0.1)";
const INPUT_BG = "rgba(17,19,34,0.04)";
const INPUT_BORDER = "rgba(17,19,34,0.12)";
const LABEL: React.CSSProperties = { color: "rgba(17,19,34,0.7)", fontSize: "14px", fontWeight: 600, marginBottom: "8px", display: "block" };
const INPUT: React.CSSProperties = { width: "100%", background: INPUT_BG, border: `1px solid ${INPUT_BORDER}`, borderRadius: "10px", color: "#111322", padding: "12px 16px", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };

export default function NewCoursePage() {
  const [form, setForm] = useState({ title: "", desc: "", category: "", videos: 0, quizzes: 0 });
  const [moduleCount, setModuleCount] = useState(3);
  const [moduleNames, setModuleNames] = useState<string[]>(["Module 1", "Module 2", "Module 3"]);
  const [thumbTab, setThumbTab] = useState<"youtube" | "upload">("youtube");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleModuleCount = (delta: number) => {
    const next = Math.min(20, Math.max(1, moduleCount + delta));
    setModuleCount(next);
    setModuleNames(prev => {
      const arr = [...prev];
      while (arr.length < next) arr.push(`Module ${arr.length + 1}`);
      return arr.slice(0, next);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Course title is required."); return; }
    if (!form.category) { toast.error("Please select a category."); return; }
    setLoading(true);
    try {
      await api.courses.create({
        title: form.title.trim(),
        desc: form.desc.trim(),
        category: form.category,
        modules: moduleCount,
        module_names: moduleNames.slice(0, moduleCount),
        videos: form.videos,
        quizzes: form.quizzes,
      } as never);
      toast.success("Course created!");
      router.push("/admin/courses");
    } catch {
      toast.error("Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "rgba(124,58,237,0.6)";
    e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.12)";
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = INPUT_BORDER;
    e.target.style.boxShadow = "none";
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, padding: "32px 24px" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <Link href="/admin/courses" style={{ width: "38px", height: "38px", borderRadius: "10px", border: "1px solid rgba(17,19,34,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(17,19,34,0.55)", textDecoration: "none", flexShrink: 0, transition: "all .15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(124,58,237,0.5)"; (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(17,19,34,0.12)"; (e.currentTarget as HTMLAnchorElement).style.color = "rgba(17,19,34,0.55)"; }}>
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 800, lineHeight: 1.2 }}>
              <span style={{ color: "#111322" }}>Create </span>
              <span style={{ background: "linear-gradient(90deg,#A78BFA,#60A5FA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>New Course</span>
            </h1>
            <p style={{ margin: "4px 0 0", color: "rgba(17,19,34,0.45)", fontSize: "13px" }}>Modules will be generated automatically</p>
          </div>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit}>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "18px", padding: "32px", display: "flex", flexDirection: "column", gap: "24px", boxShadow: "0 0 60px rgba(124,58,237,0.08)" }}>

            {/* Course Title */}
            <div>
              <label style={LABEL}>Course Title *</label>
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Artificial Intelligence Fundamentals"
                style={INPUT}
                onFocus={focusStyle} onBlur={blurStyle}
              />
            </div>

            {/* Description */}
            <div>
              <label style={LABEL}>Description *</label>
              <textarea
                value={form.desc}
                onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                placeholder="Describe what students will learn in this course..."
                rows={4}
                style={{ ...INPUT, resize: "none", lineHeight: "1.6" }}
                onFocus={focusStyle} onBlur={blurStyle}
              />
            </div>

            {/* Category */}
            <div>
              <label style={LABEL}>Category</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                style={{ ...INPUT, appearance: "none", cursor: "pointer" }}
                onFocus={focusStyle} onBlur={blurStyle}
              >
                <option value="" style={{ background: "#fff" }}>Select category...</option>
                {CATEGORIES.map(c => <option key={c} value={c} style={{ background: "#fff" }}>{c}</option>)}
              </select>
            </div>

            {/* Videos + Quizzes row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={LABEL}>Videos per module</label>
                <input
                  type="number" min={0} max={50}
                  value={form.videos || ""}
                  onChange={e => setForm(f => ({ ...f, videos: parseInt(e.target.value) || 0 }))}
                  placeholder="e.g. 3"
                  style={INPUT}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
              </div>
              <div>
                <label style={LABEL}>Quizzes per module</label>
                <input
                  type="number" min={0} max={50}
                  value={form.quizzes || ""}
                  onChange={e => setForm(f => ({ ...f, quizzes: parseInt(e.target.value) || 0 }))}
                  placeholder="e.g. 5"
                  style={INPUT}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
              </div>
            </div>

            {/* Thumbnail */}
            <div>
              <label style={LABEL}>Thumbnail (optional)</label>
              {/* Tab switcher */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                {([["youtube", PlayCircle, "YouTube URL"], ["upload", Upload, "Upload Image"]] as const).map(([key, Icon, label]) => (
                  <button key={key} type="button" onClick={() => setThumbTab(key as "youtube" | "upload")}
                    style={{ display: "flex", alignItems: "center", gap: "7px", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", border: "1px solid rgba(17,19,34,0.1)", background: thumbTab === key ? "rgba(47,69,216,0.18)" : "rgba(17,19,34,0.05)", color: thumbTab === key ? "#2F45D8" : "rgba(17,19,34,0.55)", transition: "all .15s" }}>
                    <Icon size={14} /> {label}
                  </button>
                ))}
              </div>
              {thumbTab === "youtube" ? (
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(17,19,34,0.3)", pointerEvents: "none" }}>
                    <PlayCircle size={16} />
                  </div>
                  <input
                    value={youtubeUrl}
                    onChange={e => setYoutubeUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    style={{ ...INPUT, paddingLeft: "44px" }}
                    onFocus={focusStyle} onBlur={blurStyle}
                  />
                </div>
              ) : (
                <label style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", background: INPUT_BG, border: `1.5px dashed rgba(17,19,34,0.2)`, borderRadius: "10px", cursor: "pointer", transition: "border-color .15s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLLabelElement).style.borderColor = "rgba(124,58,237,0.5)"}
                  onMouseLeave={e => (e.currentTarget as HTMLLabelElement).style.borderColor = "rgba(17,19,34,0.2)"}>
                  <Upload size={18} style={{ color: "rgba(17,19,34,0.35)" }} />
                  <span style={{ color: "rgba(17,19,34,0.45)", fontSize: "14px" }}>Click to choose an image file</span>
                  <input type="file" accept="image/*" style={{ display: "none" }} />
                </label>
              )}
              {thumbTab === "youtube" && <p style={{ color: "rgba(17,19,34,0.35)", fontSize: "12px", marginTop: "6px" }}>Paste any YouTube video URL; its thumbnail image will be used as the course cover.</p>}
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "rgba(17,19,34,0.1)" }} />

            {/* Module count */}
            <div>
              <label style={LABEL}>How many modules? *</label>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <button type="button" onClick={() => handleModuleCount(-1)} disabled={moduleCount <= 1}
                  style={{ width: "40px", height: "40px", borderRadius: "50%", border: "1px solid rgba(17,19,34,0.15)", background: "rgba(17,19,34,0.05)", color: "rgba(17,19,34,0.6)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: moduleCount <= 1 ? 0.3 : 1, flexShrink: 0 }}>
                  <Minus size={16} />
                </button>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <span style={{ fontSize: "42px", fontWeight: 900, color: "#A78BFA", lineHeight: 1 }}>{moduleCount}</span>
                  <span style={{ color: "rgba(17,19,34,0.45)", fontSize: "14px" }}>modules</span>
                </div>
                <button type="button" onClick={() => handleModuleCount(1)} disabled={moduleCount >= 20}
                  style={{ width: "40px", height: "40px", borderRadius: "50%", border: "1px solid rgba(17,19,34,0.15)", background: "rgba(17,19,34,0.05)", color: "rgba(17,19,34,0.6)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: moduleCount >= 20 ? 0.3 : 1, flexShrink: 0 }}>
                  <Plus size={16} />
                </button>
              </div>
              <p style={{ color: "rgba(17,19,34,0.35)", fontSize: "12px", marginTop: "8px" }}>{moduleCount} module{moduleCount !== 1 ? "s" : ""} will be created. You can add videos and questions to each module after.</p>
            </div>

            {/* Module Names */}
            <div>
              <label style={LABEL}>Module Names</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {moduleNames.map((name, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.35)", color: "#A78BFA", fontSize: "12px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
                    <input
                      value={name}
                      onChange={e => { const n = [...moduleNames]; n[i] = e.target.value; setModuleNames(n); }}
                      placeholder={`Module ${i + 1}`}
                      style={{ ...INPUT, flex: 1 }}
                      onFocus={focusStyle} onBlur={blurStyle}
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            style={{ marginTop: "20px", width: "100%", padding: "16px", borderRadius: "12px", background: "linear-gradient(135deg,#7C3AED,#6D28D9)", color: "#fff", fontSize: "15px", fontWeight: 700, border: "none", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", boxShadow: "0 4px 24px rgba(124,58,237,0.4)", opacity: loading ? 0.7 : 1, transition: "opacity .15s" }}>
            {loading ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Creating...</> : <><Plus size={16} /> Create Course</>}
          </button>
        </form>
      </div>
    </div>
  );
}
