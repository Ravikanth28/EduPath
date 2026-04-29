"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ChevronDown, ChevronUp, Video, HelpCircle, Plus, Trash2, Save, Link2, CheckCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { api, type AdminModule, type AdminVideo, type AdminQuestion, type Course } from "@/lib/api";

// ── Style constants ──────────────────────────────────────────────────────────
const BG      = "#06060F";
const CARD    = "rgba(16,14,36,0.95)";
const BORDER  = "rgba(255,255,255,0.07)";
const PBORDER = "rgba(124,58,237,0.3)";
const INPUT_S: React.CSSProperties = {
  width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px", color: "#fff", padding: "11px 14px", fontSize: "13px",
  outline: "none", boxSizing: "border-box", fontFamily: "inherit",
};
const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = "rgba(124,58,237,0.5)";
  e.target.style.boxShadow   = "0 0 0 3px rgba(124,58,237,0.1)";
};
const blur  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = "rgba(255,255,255,0.1)";
  e.target.style.boxShadow   = "none";
};

function extractYoutubeId(url: string): string {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : url.trim();
}
function ytThumb(id: string) { return `https://img.youtube.com/vi/${id}/mqdefault.jpg`; }
function emptyVideo(): { title: string; url: string } { return { title: "", url: "" }; }

type ModuleTab = "videos" | "questions";
type QTab = "manual" | "csv" | "settings";

function VideosPanel({ courseId, module }: { courseId: string; module: AdminModule }) {
  const [saved, setSaved] = useState<AdminVideo[]>(module.videos);
  const [drafts, setDrafts] = useState<{ title: string; url: string }[]>([emptyVideo()]);
  const [saving, setSaving] = useState(false);

  const setDraft = (i: number, field: "title" | "url", val: string) =>
    setDrafts(d => d.map((x, idx) => idx === i ? { ...x, [field]: val } : x));

  const handleSave = async () => {
    const newOnes = drafts.filter(d => d.title.trim() || d.url.trim()).map(d => ({
      title: d.title.trim() || "Untitled",
      youtube_id: extractYoutubeId(d.url),
    }));
    const all = [
      ...saved.map(v => ({ title: v.title, youtube_id: v.youtube_id })),
      ...newOnes,
    ];
    if (!all.length) { toast.error("No videos to save"); return; }
    setSaving(true);
    try {
      await api.modules.saveVideos(courseId, module.num, all);
      toast.success("Videos saved!");
      setSaved([...saved, ...newOnes.map((v, i) => ({ idx: saved.length + i + 1, ...v }))]);
      setDrafts([emptyVideo()]);
    } catch { toast.error("Failed to save videos"); }
    finally { setSaving(false); }
  };

  const deleteVideo = async (idx: number) => {
    const next = saved.filter(v => v.idx !== idx).map(v => ({ title: v.title, youtube_id: v.youtube_id }));
    try {
      await api.modules.saveVideos(courseId, module.num, next);
      setSaved(saved.filter(v => v.idx !== idx).map((v, i) => ({ ...v, idx: i + 1 })));
      toast.success("Video removed");
    } catch { toast.error("Failed to remove video"); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {saved.length > 0 && (
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.08em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: "10px" }}>Saved Videos</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {saved.map(v => (
              <div key={v.idx} style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "10px 12px" }}>
                <img src={ytThumb(v.youtube_id)} alt="" style={{ width: "52px", height: "36px", borderRadius: "6px", objectFit: "cover", flexShrink: 0, background: "#111" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: "#fff", fontSize: "13px", fontWeight: 600, margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.title}</p>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", margin: 0 }}>https://youtu.be/{v.youtube_id}</p>
                </div>
                <span style={{ fontSize: "11px", padding: "2px 10px", borderRadius: "20px", background: "rgba(124,58,237,0.2)", color: "#A78BFA", fontWeight: 700, flexShrink: 0 }}>#{v.idx}</span>
                <button onClick={() => deleteVideo(v.idx)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(239,68,68,0.6)", padding: "4px", display: "flex", flexShrink: 0 }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <p style={{ fontSize: "11px", letterSpacing: "0.08em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: "10px" }}>
          {saved.length > 0 ? "Add More Videos" : "Add Videos"}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {drafts.map((d, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px" }}>Video {saved.length + i + 1}</span>
                {drafts.length > 1 && (
                  <button onClick={() => setDrafts(dr => dr.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(239,68,68,0.5)", display: "flex" }}>
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <input value={d.title} onChange={e => setDraft(i, "title", e.target.value)} placeholder="Video title" style={INPUT_S} onFocus={focus} onBlur={blur} />
                <div style={{ position: "relative" }}>
                  <Link2 size={13} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
                  <input value={d.url} onChange={e => setDraft(i, "url", e.target.value)} placeholder="https://www.youtube.com/watch?v=..." style={{ ...INPUT_S, paddingLeft: "34px" }} onFocus={focus} onBlur={blur} />
                  {d.url.includes("youtube") && <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "11px", color: "#6EE7B7" }}>✓</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => setDrafts(d => [...d, emptyVideo()])} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
          <Plus size={14} /> Add Another Video
        </button>
        <button onClick={handleSave} disabled={saving} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 20px", background: "linear-gradient(135deg,#7C3AED,#6D28D9)", borderRadius: "10px", color: "#fff", fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 2px 16px rgba(124,58,237,0.35)", opacity: saving ? 0.7 : 1 }}>
          {saving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={14} />} Save Videos
        </button>
      </div>
    </div>
  );
}

type QDraft = { q: string; opts: string[]; correct: number; exp: string };
function emptyQ(): QDraft { return { q: "", opts: ["", "", "", ""], correct: 0, exp: "" }; }

function QuestionsPanel({ courseId, module }: { courseId: string; module: AdminModule }) {
  const [qTab, setQTab] = useState<QTab>("manual");
  const [saved, setSaved] = useState<AdminQuestion[]>(module.questions);
  const [drafts, setDrafts] = useState<QDraft[]>([emptyQ()]);
  const [csvText, setCsvText] = useState("");
  const [saving, setSaving] = useState(false);

  const setDraftField = (i: number, field: keyof QDraft, val: string | number | string[]) =>
    setDrafts(d => d.map((x, idx) => idx === i ? { ...x, [field]: val } : x));

  const saveManual = async () => {
    const valid = drafts.filter(d => d.q.trim() && d.opts.every(o => o.trim()));
    if (!valid.length) { toast.error("Fill in at least one complete question"); return; }
    const all = [
      ...saved.map(q => ({ q: q.q, opts: q.opts, correct: q.correct, exp: q.exp || "" })),
      ...valid,
    ];
    setSaving(true);
    try {
      await api.modules.saveQuestions(courseId, module.num, all);
      toast.success(`${valid.length} question(s) saved!`);
      setSaved([...saved, ...valid.map((q, i) => ({ idx: saved.length + i + 1, ...q }))]);
      setDrafts([emptyQ()]);
    } catch { toast.error("Failed to save questions"); }
    finally { setSaving(false); }
  };

  const saveCSV = async () => {
    const lines = csvText.trim().split("\n").filter(Boolean);
    const parsed: QDraft[] = [];
    for (const line of lines) {
      const cols = line.split(",").map(c => c.trim().replace(/^"|"$/g, ""));
      if (cols.length < 6) continue;
      parsed.push({ q: cols[0], opts: [cols[1], cols[2], cols[3], cols[4]], correct: ["A","B","C","D"].indexOf(cols[5].toUpperCase()), exp: cols[6] || "" });
    }
    if (!parsed.length) { toast.error("No valid rows found"); return; }
    const all = [
      ...saved.map(q => ({ q: q.q, opts: q.opts, correct: q.correct, exp: q.exp || "" })),
      ...parsed,
    ];
    setSaving(true);
    try {
      await api.modules.saveQuestions(courseId, module.num, all);
      toast.success(`${parsed.length} questions imported!`);
      setSaved([...saved, ...parsed.map((q, i) => ({ idx: saved.length + i + 1, ...q }))]);
      setCsvText("");
    } catch { toast.error("Failed to import questions"); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        {([["manual", "Add Manually"], ["csv", "Bulk CSV"], ["settings", "Settings"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setQTab(key)}
            style={{ padding: "7px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer", border: `1px solid ${qTab === key ? "rgba(124,58,237,0.4)" : "rgba(255,255,255,0.08)"}`, background: qTab === key ? "rgba(124,58,237,0.2)" : "transparent", color: qTab === key ? "#C4B5FD" : "rgba(255,255,255,0.4)" }}>
            {label}
          </button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>{saved.length} saved</span>
      </div>

      {qTab === "manual" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {drafts.map((d, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", padding: "2px 10px", borderRadius: "20px", background: "rgba(124,58,237,0.2)", color: "#A78BFA", fontWeight: 700 }}>Q{saved.length + i + 1}</span>
                {drafts.length > 1 && <button onClick={() => setDrafts(dr => dr.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(239,68,68,0.5)", display: "flex" }}><Trash2 size={13} /></button>}
              </div>
              <textarea value={d.q} onChange={e => setDraftField(i, "q", e.target.value)} placeholder="Question text..." rows={2} style={{ ...INPUT_S, resize: "none" }} onFocus={focus} onBlur={blur} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {["A","B","C","D"].map((lbl, oi) => (
                  <div key={lbl} style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.35)" }}>{lbl}.</span>
                    <input value={d.opts[oi]} onChange={e => { const o = [...d.opts]; o[oi] = e.target.value; setDraftField(i, "opts", o); }} placeholder={`Option ${lbl}`} style={{ ...INPUT_S, paddingLeft: "28px" }} onFocus={focus} onBlur={blur} />
                  </div>
                ))}
              </div>
              <div>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginBottom: "6px" }}>Correct answer</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  {["A","B","C","D"].map((lbl, oi) => (
                    <button key={lbl} onClick={() => setDraftField(i, "correct", oi)} type="button"
                      style={{ width: "36px", height: "36px", borderRadius: "8px", border: `1px solid ${d.correct === oi ? "rgba(16,185,129,0.6)" : "rgba(255,255,255,0.12)"}`, background: d.correct === oi ? "rgba(16,185,129,0.15)" : "transparent", color: d.correct === oi ? "#6EE7B7" : "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
              <input value={d.exp} onChange={e => setDraftField(i, "exp", e.target.value)} placeholder="Explanation (optional)" style={INPUT_S} onFocus={focus} onBlur={blur} />
            </div>
          ))}
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setDrafts(d => [...d, emptyQ()])} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
              <Plus size={14} /> Add Question
            </button>
            <button onClick={saveManual} disabled={saving} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 20px", background: "linear-gradient(135deg,#7C3AED,#6D28D9)", borderRadius: "10px", color: "#fff", fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 2px 16px rgba(124,58,237,0.35)", opacity: saving ? 0.7 : 1 }}>
              {saving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={14} />} Save Questions
            </button>
          </div>
        </div>
      )}

      {qTab === "csv" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "14px" }}>
            <p style={{ color: "#fff", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>CSV Format</p>
            <pre style={{ fontSize: "11px", color: "#67E8F9", background: "rgba(0,0,0,0.3)", borderRadius: "8px", padding: "10px", margin: 0, overflowX: "auto", lineHeight: 1.7, fontFamily: "monospace" }}>{`question,optionA,optionB,optionC,optionD,correct,explanation\nWhat is a derivative?,Rate of change,Area,Vector,Matrix rank,A,Measures rate`}</pre>
          </div>
          <textarea value={csvText} onChange={e => setCsvText(e.target.value)} placeholder="Paste CSV content here..." rows={7} style={{ ...INPUT_S, resize: "vertical", fontFamily: "monospace", fontSize: "12px" }} onFocus={focus} onBlur={blur} />
          <button onClick={saveCSV} disabled={saving} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 20px", background: "linear-gradient(135deg,#7C3AED,#6D28D9)", borderRadius: "10px", color: "#fff", fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 2px 16px rgba(124,58,237,0.35)", width: "fit-content", opacity: saving ? 0.7 : 1 }}>
            {saving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={14} />} Import Questions
          </button>
        </div>
      )}

      {qTab === "settings" && (
        <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "16px" }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0 }}>Pass percentage and questions-per-test settings coming soon.</p>
        </div>
      )}
    </div>
  );
}

export default function CourseManagePage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<AdminModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNum, setExpandedNum] = useState<number | null>(null);
  const [moduleTab, setModuleTab] = useState<Record<number, ModuleTab>>({});

  useEffect(() => {
    Promise.all([
      api.courses.get(id as string),
      api.modules.adminList(id as string),
    ]).then(([c, mods]) => {
      setCourse(c);
      setModules(mods);
      if (mods.length) setExpandedNum(mods[0].num);
    }).catch(() => toast.error("Failed to load course"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "36px", height: "36px", border: "3px solid rgba(124,58,237,0.2)", borderTopColor: "#7C3AED", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: BG, padding: "28px 24px" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>

        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
          <Link href="/admin/courses" style={{ width: "36px", height: "36px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.5)", textDecoration: "none", flexShrink: 0 }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(124,58,237,0.5)"; (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.5)"; }}>
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h1 style={{ color: "#fff", fontWeight: 800, fontSize: "22px", margin: 0 }}>{course?.title ?? "Course"}</h1>
              {course?.is_published
                ? <span style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "20px", background: "rgba(16,185,129,0.15)", color: "#6EE7B7", border: "1px solid rgba(16,185,129,0.3)", fontWeight: 600 }}>Published</span>
                : <span style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "20px", background: "rgba(245,158,11,0.15)", color: "#FCD34D", border: "1px solid rgba(245,158,11,0.3)", fontWeight: 600 }}>Draft</span>}
            </div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", margin: "3px 0 0" }}>{modules.length} modules</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {modules.map(mod => {
            const isOpen = expandedNum === mod.num;
            const tab = moduleTab[mod.num] || "videos";

            return (
              <div key={mod.num} style={{ background: CARD, border: `1px solid ${isOpen ? PBORDER : BORDER}`, borderRadius: "14px", overflow: "hidden", transition: "border-color .2s" }}>
                <button onClick={() => setExpandedNum(isOpen ? null : mod.num)}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: "14px", padding: "16px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.35)", color: "#A78BFA", fontWeight: 800, fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {mod.num}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: "#fff", fontWeight: 700, fontSize: "14px", margin: "0 0 3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{mod.title}</p>
                    <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}><Video size={11} />{mod.videos.length} videos</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}><HelpCircle size={11} />{mod.questions.length} questions</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                    {mod.videos.length > 0 && <CheckCircle size={16} color="#6EE7B7" />}
                    {mod.questions.length > 0 && <CheckCircle size={16} color="#A78BFA" />}
                    {isOpen ? <ChevronUp size={16} color="rgba(255,255,255,0.3)" /> : <ChevronDown size={16} color="rgba(255,255,255,0.3)" />}
                  </div>
                </button>

                {isOpen && (
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      {([["videos", Video, `Videos (${mod.videos.length})`], ["questions", HelpCircle, `Questions (${mod.questions.length})`]] as const).map(([key, Icon, label]) => (
                        <button key={key} onClick={() => setModuleTab(t => ({ ...t, [mod.num]: key as ModuleTab }))}
                          style={{ display: "flex", alignItems: "center", gap: "7px", padding: "12px 18px", fontSize: "13px", fontWeight: 600, cursor: "pointer", background: "none", border: "none", borderBottom: tab === key ? "2px solid #7C3AED" : "2px solid transparent", color: tab === key ? "#A78BFA" : "rgba(255,255,255,0.4)", marginBottom: "-1px", transition: "color .15s" }}>
                          <Icon size={14} /> {label}
                        </button>
                      ))}
                    </div>
                    <div style={{ padding: "20px 18px" }}>
                      {tab === "videos"
                        ? <VideosPanel courseId={id as string} module={mod} />
                        : <QuestionsPanel courseId={id as string} module={mod} />}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {modules.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>
            No modules found. This course has no modules yet.
          </div>
        )}
      </div>
    </div>
  );
}

