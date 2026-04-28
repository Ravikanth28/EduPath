"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ChevronDown, ChevronUp, Video, HelpCircle, Plus, Trash2, Save, Link2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const COURSE = {
  id: "1", title: "Engineering Mathematics", published: true,
  modules: [
    { id: "1", num: 1, title: "Limits & Derivatives", videos: 3, questions: 12, passPct: 70, qPerTest: 6 },
    { id: "2", num: 2, title: "Integration Techniques", videos: 3, questions: 10, passPct: 70, qPerTest: 5 },
    { id: "3", num: 3, title: "Differential Equations", videos: 2, questions: 10, passPct: 70, qPerTest: 5 },
    { id: "4", num: 4, title: "Linear Algebra", videos: 3, questions: 10, passPct: 70, qPerTest: 5 },
    { id: "5", num: 5, title: "Probability & Statistics", videos: 2, questions: 8, passPct: 70, qPerTest: 4 },
    { id: "6", num: 6, title: "Final Examination", videos: 0, questions: 30, passPct: 75, qPerTest: 30 },
  ],
};

type ModuleTab = "videos" | "questions";

const QUESTION_TABS = ["Add Manually", "Bulk CSV/Excel", "Checkpoint Qs", "Test Settings"] as const;

export default function CourseManagePage() {
  const params = useParams();
  const [expandedModule, setExpandedModule] = useState<string | null>("1");
  const [moduleTab, setModuleTab] = useState<Record<string, ModuleTab>>({});
  const [qTab, setQTab] = useState<Record<string, number>>({});
  const [videoForms, setVideoForms] = useState<Record<string, { title: string; url: string }[]>>({});
  const [passPct, setPassPct] = useState<Record<string, number>>({});

  const getVideos = (mid: string) => videoForms[mid] || [{ title: "", url: "" }];
  const addVideo = (mid: string) => setVideoForms(v => ({ ...v, [mid]: [...getVideos(mid), { title: "", url: "" }] }));
  const removeVideo = (mid: string, idx: number) => setVideoForms(v => ({ ...v, [mid]: getVideos(mid).filter((_, i) => i !== idx) }));

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/courses" className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-bold text-white text-lg">{COURSE.title}</h1>
            {COURSE.published ? <span className="badge-green">Published</span> : <span className="badge-amber">Draft</span>}
          </div>
          <p className="text-xs text-white/40">{COURSE.modules.length} modules</p>
        </div>
      </div>

      {/* Module accordion */}
      <div className="space-y-3">
        {COURSE.modules.map(mod => {
          const tab = moduleTab[mod.id] || "videos";
          const qTabIdx = qTab[mod.id] || 0;
          const isOpen = expandedModule === mod.id;

          return (
            <div key={mod.id} className="glass-card overflow-hidden">
              {/* Module header */}
              <button
                onClick={() => setExpandedModule(isOpen ? null : mod.id)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {mod.num}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white">{mod.title}</p>
                  <div className="flex gap-4 text-xs text-white/40 mt-0.5 flex-wrap">
                    <span className="flex items-center gap-1"><Video size={10} />{mod.videos} videos</span>
                    <span className="flex items-center gap-1"><HelpCircle size={10} />{mod.questions} questions</span>
                    <span>Pass: {passPct[mod.id] ?? mod.passPct}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {mod.videos > 0 && <CheckCircle size={14} className="text-green-400" />}
                  {isOpen ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-white/[0.06]">
                  {/* Tab selector */}
                  <div className="flex border-b border-white/[0.06]">
                    {["Videos", "Questions"].map((t, i) => (
                      <button
                        key={t}
                        onClick={() => setModuleTab(m => ({ ...m, [mod.id]: i === 0 ? "videos" : "questions" }))}
                        className={`px-5 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${tab === (i === 0 ? "videos" : "questions") ? "text-purple-400 border-b-2 border-purple-500 -mb-[1px]" : "text-white/50 hover:text-white"}`}
                      >
                        {i === 0 ? <Video size={14} /> : <HelpCircle size={14} />} {t}
                      </button>
                    ))}
                  </div>

                  <div className="p-5">
                    {tab === "videos" && (
                      <div className="space-y-4">
                        {getVideos(mod.id).map((v, idx) => (
                          <div key={idx} className="glass-card p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-white/40 font-mono">Video #{idx + 1}</span>
                              {getVideos(mod.id).length > 1 && (
                                <button onClick={() => removeVideo(mod.id, idx)} className="text-red-400 hover:text-red-300">
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                            <input
                              value={v.title}
                              onChange={e => { const n = [...getVideos(mod.id)]; n[idx] = { ...n[idx], title: e.target.value }; setVideoForms(vf => ({ ...vf, [mod.id]: n })); }}
                              placeholder="Video title"
                              className="input-field text-sm"
                            />
                            <div className="relative">
                              <Link2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                              <input
                                value={v.url}
                                onChange={e => { const n = [...getVideos(mod.id)]; n[idx] = { ...n[idx], url: e.target.value }; setVideoForms(vf => ({ ...vf, [mod.id]: n })); }}
                                placeholder="YouTube URL"
                                className="input-field pl-10 text-sm"
                              />
                              {v.url.includes("youtube.com") && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-green-400">Valid URL</span>}
                            </div>
                          </div>
                        ))}
                        <button onClick={() => addVideo(mod.id)} className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm">
                          <Plus size={14} /> Add Another Video
                        </button>
                        <button onClick={() => toast.success("Videos saved!")} className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm">
                          <Save size={14} /> Save Videos
                        </button>
                      </div>
                    )}

                    {tab === "questions" && (
                      <div>
                        {/* Question sub-tabs */}
                        <div className="flex gap-1 mb-4 flex-wrap">
                          {QUESTION_TABS.map((t, i) => (
                            <button key={t} onClick={() => setQTab(q => ({ ...q, [mod.id]: i }))}
                              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${(qTabIdx) === i ? "bg-purple-600/20 text-purple-400 border border-purple-600/30" : "text-white/50 hover:text-white border border-white/[0.06]"}`}>
                              {t}
                            </button>
                          ))}
                        </div>

                        {qTabIdx === 0 && (
                          <div className="space-y-4">
                            <div className="glass-card p-4 space-y-3">
                              <span className="badge-purple text-xs">Q1</span>
                              <textarea placeholder="Question text..." rows={2} className="input-field resize-none text-sm" />
                              <div className="grid grid-cols-2 gap-2">
                                {["A", "B", "C", "D"].map(l => (
                                  <div key={l} className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-white/40 font-bold">{l}.</span>
                                    <input placeholder={`Option ${l}`} className="input-field pl-8 text-sm" />
                                  </div>
                                ))}
                              </div>
                              <div>
                                <label className="text-xs text-white/40 mb-1 block">Correct Option</label>
                                <div className="flex gap-2">
                                  {["A", "B", "C", "D"].map(l => (
                                    <button key={l} className="w-8 h-8 rounded-lg border border-white/20 text-xs text-white/60 hover:border-green-500/60 hover:text-green-400 hover:bg-green-500/10 transition-all">{l}</button>
                                  ))}
                                </div>
                              </div>
                              <input placeholder="Explanation (optional)" className="input-field text-sm" />
                            </div>
                            <div className="flex gap-3">
                              <button onClick={() => toast.success("Question added")} className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm"><Plus size={13} /> Add Question</button>
                              <button onClick={() => toast.success("Questions saved!")} className="btn-primary flex items-center gap-2 px-4 py-2 text-sm"><Save size={13} /> Save Questions</button>
                            </div>
                          </div>
                        )}

                        {qTabIdx === 1 && (
                          <div className="space-y-4">
                            <div className="glass-card p-4 text-xs text-white/50 space-y-1">
                              <p className="text-white font-semibold mb-2">CSV Format Guide</p>
                              <code className="block bg-white/[0.04] p-3 rounded-lg font-mono text-xs leading-relaxed text-cyan-400">
                                question,optionA,optionB,optionC,optionD,correct,explanation<br/>
                                What is a derivative?,Rate of change,Area under curve,Vector cross product,Matrix rank,A,Derivative measures instantaneous rate of change
                              </code>
                            </div>
                            <textarea rows={6} placeholder="Paste CSV content here..." className="input-field resize-none text-sm font-mono" />
                            <button onClick={() => toast.success("Questions imported!")} className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm"><Save size={13} /> Import Questions</button>
                          </div>
                        )}

                        {qTabIdx === 2 && (
                          <div className="space-y-4">
                            <div className="glass-card p-4 text-sm text-white/50 border border-cyan-600/20">
                              Checkpoint questions pause the video at a specified timestamp and require a correct answer to continue.
                            </div>
                            <div className="glass-card p-4 space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-xs text-white/40 mb-1 block">Video</label>
                                  <select className="input-field text-sm"><option>Video #1</option><option>Video #2</option></select>
                                </div>
                                <div>
                                  <label className="text-xs text-white/40 mb-1 block">Timestamp (MM:SS)</label>
                                  <input placeholder="02:30" className="input-field text-sm" />
                                </div>
                              </div>
                              <textarea placeholder="Checkpoint question text..." rows={2} className="input-field resize-none text-sm" />
                              <div className="grid grid-cols-2 gap-2">
                                {["A", "B", "C", "D"].map(l => (
                                  <input key={l} placeholder={`Option ${l}`} className="input-field text-sm" />
                                ))}
                              </div>
                              <button onClick={() => toast.success("Checkpoint saved!")} className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm"><Save size={13} /> Save Checkpoints</button>
                            </div>
                          </div>
                        )}

                        {qTabIdx === 3 && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs text-white/40 uppercase tracking-wider mb-1.5 block">Passing Score (%)</label>
                                <input type="number" defaultValue={passPct[mod.id] ?? mod.passPct} onChange={e => setPassPct(p => ({ ...p, [mod.id]: Number(e.target.value) }))} min={1} max={100} className="input-field" />
                              </div>
                              <div>
                                <label className="text-xs text-white/40 uppercase tracking-wider mb-1.5 block">Questions per Test</label>
                                <input type="number" defaultValue={mod.qPerTest} min={1} className="input-field" />
                              </div>
                            </div>
                            <button onClick={() => toast.success("Settings saved!")} className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm"><Save size={13} /> Save Settings</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
