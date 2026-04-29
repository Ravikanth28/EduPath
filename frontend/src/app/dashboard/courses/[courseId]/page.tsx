"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle, Lock, ChevronDown, ChevronUp, PlayCircle, FileQuestion, BookOpen, Sparkles, Network, Globe, Trophy, PanelLeft } from "lucide-react";
import { VideoPlayer } from "@/components/student/VideoPlayer";
import { MindMap } from "@/components/student/MindMap";
import { api, type Course, type CourseModule } from "@/lib/api";

type AITool = "quiz" | "notes" | "resources" | "mindmap" | null;

export default function CoursePage() {
  const params = useParams();
  const courseId = String(params.courseId);
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingModule, setSavingModule] = useState<number | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<{ moduleId: string; index: number } | null>(null);
  const [aiTool, setAiTool] = useState<AITool>(null);
  const [quizQuestions, setQuizQuestions] = useState<{ q: string; opts: string[]; correct: number; exp: string }[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const refreshModules = async (cId: string, cData: Course) => {
    const mods = await api.modules.list(cId).catch(() => [] as CourseModule[]);
    setModules(mods);
    const currentMod = mods.find(m => !m.completed && m.unlocked) ?? mods[0];
    if (currentMod) {
      setExpandedModule(String(currentMod.num));
      setCurrentVideo({ moduleId: String(currentMod.num), index: 0 });
      setSidebarOpen(false);
    }
    return mods;
  };

  useEffect(() => {
    setLoading(true);
    api.courses.get(courseId)
      .then(async data => {
        setCourse(data);
        await refreshModules(courseId, data);
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  // Load quiz questions when Practice Quiz is opened
  useEffect(() => {
    if (aiTool === "quiz" && currentVideo && quizQuestions.length === 0) {
      const modNum = Number(currentVideo.moduleId);
      api.modules.getQuestions(courseId, modNum)
        .then(qs => {
          setQuizQuestions(qs);
          setQuizAnswers(qs.map(() => null));
          setQuizSubmitted(false);
        })
        .catch(() => {});
    }
    if (aiTool !== "quiz") {
      setQuizQuestions([]);
      setQuizAnswers([]);
      setQuizSubmitted(false);
    }
  }, [aiTool, currentVideo, courseId]);

  const activeModule = currentVideo ? modules.find(m => String(m.num) === currentVideo.moduleId) : null;
  const activeVideo = activeModule && currentVideo ? activeModule.videos[currentVideo.index] : null;
  const progress = course?.progress ?? 0;
  const completedModules = modules.filter(m => m.completed).length;
  const courseComplete = progress >= 100;

  // Called by VideoPlayer when the video finishes
  const handleVideoEnd = async () => {
    if (!activeModule || !currentVideo) return;
    const nextIdx = currentVideo.index + 1;
    if (nextIdx < activeModule.videos.length) {
      // Advance to next video in this module
      setCurrentVideo({ moduleId: currentVideo.moduleId, index: nextIdx });
    } else if (!activeModule.completed && activeModule.unlocked) {
      // All videos watched — auto-complete this module
      await completeActiveModule();
    }
  };

  const completeActiveModule = async () => {
    if (!activeModule || !course || activeModule.completed || !activeModule.unlocked) return;
    setSavingModule(activeModule.num);
    try {
      const result = await api.courses.completeModule(course.id, activeModule.num);
      setCourse(prev => prev ? { ...prev, progress: result.progress, completed: result.completed, enrolled: true } : prev);
      // Refresh modules list from API
      const mods = await api.modules.list(course.id).catch(() => modules);
      setModules(mods);
      const nextMod = mods.find(m => !m.completed && m.unlocked) ?? mods[mods.length - 1];
      if (nextMod) {
        setExpandedModule(String(nextMod.num));
        setCurrentVideo({ moduleId: String(nextMod.num), index: 0 });
      }
    } finally {
      setSavingModule(null);
    }
  };

  const TOOLS = [
    { key: "quiz"      as AITool, label: "Practice Quiz", icon: BookOpen, color: "#2F45D8", bg: "rgba(47,69,216,0.1)", border: "rgba(47,69,216,0.3)" },
    { key: "notes"     as AITool, label: "Study Notes",   icon: Sparkles, color: "#111322", bg: "rgba(47,69,216,0.1)",  border: "rgba(47,69,216,0.3)" },
    { key: "resources" as AITool, label: "Find Resources",icon: Globe,    color: "#111322", bg: "rgba(106,112,133,0.1)", border: "rgba(106,112,133,0.3)" },
    { key: "mindmap"   as AITool, label: "Mind Map",      icon: Network,  color: "#111322", bg: "rgba(106,112,133,0.1)", border: "rgba(106,112,133,0.3)" },
  ];

  if (loading || !course) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#DDE7FF 0%,#EEF3FF 52%,#CAD8FF 100%)" }}>
        <div style={{ width: "32px", height: "32px", border: "3px solid rgba(47,69,216,0.25)", borderTopColor: "#2F45D8", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "linear-gradient(135deg,#DDE7FF 0%,#EEF3FF 52%,#CAD8FF 100%)", overflow: "hidden" }}>

      {/* -- Top header bar -- */}
      <div style={{ background: "linear-gradient(180deg,rgba(238,243,255,0.98),rgba(225,232,255,0.94))", borderBottom: "1px solid rgba(17,19,34,0.06)", padding: "12px 20px", display: "flex", alignItems: "center", gap: "14px", flexShrink: 0, zIndex: 10 }}>
        <button onClick={() => setSidebarOpen(o => !o)} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "34px", height: "34px", borderRadius: "10px", background: sidebarOpen ? "rgba(47,69,216,0.1)" : "rgba(17,19,34,0.05)", border: `1px solid ${sidebarOpen ? "rgba(47,69,216,0.25)" : "rgba(17,19,34,0.08)"}`, color: sidebarOpen ? "#2F45D8" : "rgba(17,19,34,0.6)", cursor: "pointer", flexShrink: 0, outline: "none" }}>
          <PanelLeft size={16} />
        </button>
        <Link href="/dashboard/courses" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "34px", height: "34px", borderRadius: "10px", background: "rgba(17,19,34,0.05)", border: "1px solid rgba(17,19,34,0.08)", color: "rgba(17,19,34,0.6)", textDecoration: "none", flexShrink: 0, transition: "background .15s" }}>
          <ArrowLeft size={16} />
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ color: "#111322", fontWeight: 700, fontSize: "14px", margin: "0 0 1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{course.title}</h1>
          <p style={{ color: "rgba(17,19,34,0.38)", fontSize: "12px", margin: 0 }}>{completedModules}/{course.modules} modules completed</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0, minWidth: "180px" }}>
          <div style={{ flex: 1, height: "6px", borderRadius: "9999px", background: "rgba(17,19,34,0.07)" }}>
            <div style={{ height: "100%", borderRadius: "9999px", width: `${progress}%`, background: "linear-gradient(135deg,#2F45D8,#2336B8)", transition: "width .4s" }} />
          </div>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#2F45D8", flexShrink: 0 }}>{progress}%</span>
        </div>
      </div>

      {/* -- Completion banner -- */}
      {courseComplete && (
        <div style={{ margin: "12px 16px 0", padding: "14px 18px", borderRadius: "12px", border: "1px solid rgba(106,112,133,0.3)", background: "rgba(106,112,133,0.05)", display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          <Trophy size={20} style={{ color: "#111322", flexShrink: 0 }} />
          <p style={{ color: "#111322", fontWeight: 600, fontSize: "14px", flex: 1, margin: 0 }}>Course Complete! You&apos;ve finished all modules.</p>
          <Link href="/dashboard/certificates" className="btn-primary" style={{ padding: "8px 16px", fontSize: "13px", flexShrink: 0, textDecoration: "none" }}>View Certificate</Link>
        </div>
      )}

      {/* -- Two-column body -- */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* -- Module sidebar -- */}
        <div style={{ width: sidebarOpen ? "272px" : "0", minWidth: 0, overflow: "hidden", flexShrink: 0, borderRight: sidebarOpen ? "1px solid rgba(17,19,34,0.06)" : "none", background: "linear-gradient(180deg,rgba(238,243,255,0.98),rgba(225,232,255,0.94))", display: "flex", flexDirection: "column", transition: "width .25s ease" }}>
          <div style={{ width: "272px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "14px 10px", display: "flex", flexDirection: "column", gap: "4px" }}>
            {modules.map(mod => {
              const modId = String(mod.num);
              const isExpanded = expandedModule === modId;
              const isActive = currentVideo?.moduleId === modId;
              return (
                <div key={modId}>
                  {/* Module header button */}
                  <button
                    onClick={() => {
                      if (!mod.unlocked) return;
                      setExpandedModule(isExpanded ? null : modId);
                      setCurrentVideo({ moduleId: modId, index: 0 });
                    }}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "12px", textAlign: "left", cursor: mod.unlocked ? "pointer" : "not-allowed", background: isExpanded ? "rgba(47,69,216,0.08)" : "transparent", border: `1px solid ${isExpanded ? "rgba(47,69,216,0.2)" : "transparent"}`, opacity: mod.unlocked ? 1 : 0.45, transition: "all .15s", outline: "none" }}
                  >
                    <div style={{ width: "28px", height: "28px", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "12px", fontWeight: 700, background: mod.completed ? "rgba(47,69,216,0.15)" : !mod.unlocked ? "rgba(17,19,34,0.05)" : isActive ? "rgba(47,69,216,0.2)" : "rgba(17,19,34,0.06)", color: mod.completed ? "#2F45D8" : !mod.unlocked ? "rgba(17,19,34,0.25)" : isActive ? "#2F45D8" : "rgba(17,19,34,0.5)" }}>
                      {mod.completed ? <CheckCircle size={14} /> : !mod.unlocked ? <Lock size={12} /> : mod.num}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: isActive ? "#111322" : "rgba(17,19,34,0.75)", fontWeight: isActive ? 700 : 500, fontSize: "13px", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{mod.title}</p>
                      <p style={{ color: "rgba(17,19,34,0.35)", fontSize: "11px", margin: 0 }}>{mod.videos.length} video{mod.videos.length !== 1 ? "s" : ""}</p>
                    </div>
                    {mod.unlocked && (
                      isExpanded
                        ? <ChevronUp size={13} style={{ color: "rgba(17,19,34,0.3)", flexShrink: 0 }} />
                        : <ChevronDown size={13} style={{ color: "rgba(17,19,34,0.3)", flexShrink: 0 }} />
                    )}
                  </button>

                  {/* Expanded video list */}
                  {isExpanded && mod.unlocked && (
                    <div style={{ marginTop: "4px", marginLeft: "12px", paddingLeft: "12px", borderLeft: "1px solid rgba(17,19,34,0.07)", display: "flex", flexDirection: "column", gap: "3px", paddingBottom: "6px" }}>
                      {mod.videos.map((v, idx) => {
                        const isCurrent = currentVideo?.moduleId === modId && currentVideo?.index === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => setCurrentVideo({ moduleId: modId, index: idx })}
                            style={{ display: "flex", alignItems: "center", gap: "9px", padding: "8px 10px", borderRadius: "9px", textAlign: "left", cursor: "pointer", background: isCurrent ? "rgba(47,69,216,0.12)" : "transparent", border: `1px solid ${isCurrent ? "rgba(47,69,216,0.35)" : "transparent"}`, outline: "none", width: "100%", transition: "all .15s" }}
                          >
                            <div style={{ width: "20px", height: "20px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: v.watched ? "rgba(106,112,133,0.15)" : "rgba(17,19,34,0.06)" }}>
                              {v.watched
                                ? <CheckCircle size={11} style={{ color: "#111322" }} />
                                : <span style={{ fontSize: "9px", color: "rgba(17,19,34,0.4)", fontWeight: 600 }}>{idx + 1}</span>}
                            </div>
                            <span style={{ fontSize: "12px", color: isCurrent ? "#5368F0" : "rgba(17,19,34,0.62)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.title}</span>
                          </button>
                        );
                      })}
                      {mod.unlocked ? (
                        <Link
                          href={`/dashboard/courses/${course.id}/test/${modId}`}
                          style={{ display: "flex", alignItems: "center", gap: "9px", padding: "8px 10px", borderRadius: "9px", textDecoration: "none", fontSize: "12px", color: mod.completed ? "#111322" : "#2F45D8", background: mod.completed ? "rgba(106,112,133,0.06)" : "rgba(47,69,216,0.07)", border: `1px solid ${mod.completed ? "rgba(106,112,133,0.2)" : "rgba(47,69,216,0.2)"}` }}
                        >
                          <FileQuestion size={13} />
                          {mod.completed ? `Test Passed - ${mod.score}%` : "Take Module Test"}
                        </Link>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "9px", padding: "8px 10px", borderRadius: "9px", fontSize: "12px", color: "rgba(17,19,34,0.35)", background: "rgba(17,19,34,0.03)", border: "1px solid rgba(17,19,34,0.08)" }}>
                          <Lock size={13} /> Complete previous module
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          </div>
        </div>

        {/* -- Main content area -- */}
        <div style={{ flex: 1, overflowY: "auto", minWidth: 0, display: "flex", flexDirection: "column", gap: "0" }}>
          {!currentVideo ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: "14px", color: "rgba(17,19,34,0.25)" }}>
              <PlayCircle size={48} />
              <p style={{ fontSize: "15px" }}>Select a module to start learning</p>
            </div>
          ) : (
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Module title + test CTA */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "11px", color: "rgba(17,19,34,0.35)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 4px" }}>Now Playing</p>
                  <h2 style={{ color: "#111322", fontWeight: 800, fontSize: "20px", margin: 0 }}>{activeModule?.title}</h2>
                </div>
                {activeModule && !activeModule.completed && activeModule.unlocked && (
                  <Link
                    href={`/dashboard/courses/${course.id}/test/${String(activeModule.num)}`}
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "12px", background: "linear-gradient(135deg,#2F45D8,#2336B8)", color: "#FFFFFF", fontSize: "13px", fontWeight: 700, textDecoration: "none", flexShrink: 0 }}
                  >
                    <FileQuestion size={15} /> Take Module Test
                  </Link>
                )}
                {activeModule?.completed && (
                  <Link
                    href={`/dashboard/courses/${course.id}/test/${String(activeModule.num)}`}
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "12px", background: "rgba(106,112,133,0.1)", border: "1px solid rgba(106,112,133,0.3)", color: "#111322", fontSize: "13px", fontWeight: 700, textDecoration: "none", flexShrink: 0 }}
                  >
                    <CheckCircle size={15} /> Retake Test - {activeModule.score}%
                  </Link>
                )}
              </div>

              {/* Video player */}
              {activeVideo && (
                <div style={{ borderRadius: "16px", overflow: "hidden" }}>
                  <VideoPlayer videoId={activeVideo.youtube_id} title={activeVideo.title} onComplete={handleVideoEnd} />
                </div>
              )}

              {/* Tool buttons */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {TOOLS.map(({ key, label, icon: Icon, color, bg, border }) => {
                  const active = aiTool === key;
                  return (
                    <button
                      key={key as string}
                      onClick={() => setAiTool(aiTool === key ? null : key)}
                      style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "12px", fontSize: "13px", fontWeight: 600, cursor: "pointer", background: active ? bg : "transparent", border: `1px solid ${active ? border : "rgba(17,19,34,0.1)"}`, color: active ? color : "rgba(17,19,34,0.5)", outline: "none", transition: "all .15s" }}
                    >
                      <Icon size={15} /> {label}
                    </button>
                  );
                })}
              </div>

              {/* -- Practice Quiz -- */}
              {aiTool === "quiz" && (
                <div style={{ background: "rgba(47,69,216,0.06)", border: "1px solid rgba(47,69,216,0.2)", borderRadius: "16px", padding: "22px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                    <h3 style={{ color: "#111322", fontWeight: 700, fontSize: "15px", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                      <BookOpen size={16} style={{ color: "#2F45D8" }} /> Practice Quiz
                    </h3>
                    <button onClick={() => setAiTool(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(17,19,34,0.3)", fontSize: "12px" }}>Close</button>
                  </div>
                  {quizQuestions.length === 0 ? (
                    <p style={{ color: "rgba(17,19,34,0.45)", fontSize: "14px" }}>Loading questions…</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      {quizQuestions.map((q, qi) => (
                        <div key={qi}>
                          <p style={{ color: "#111322", fontWeight: 600, fontSize: "14px", margin: "0 0 12px" }}>Q{qi + 1}. {q.q}</p>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {q.opts.map((opt, oi) => {
                              let bg = "rgba(17,19,34,0.03)", border = "rgba(17,19,34,0.08)", color = "rgba(17,19,34,0.65)";
                              if (quizSubmitted) {
                                if (oi === q.correct) { bg = "rgba(106,112,133,0.1)"; border = "rgba(106,112,133,0.5)"; color = "#111322"; }
                                else if (oi === quizAnswers[qi] && oi !== q.correct) { bg = "rgba(47,69,216,0.1)"; border = "rgba(47,69,216,0.5)"; color = "#2F45D8"; }
                                else { color = "rgba(17,19,34,0.3)"; }
                              } else if (quizAnswers[qi] === oi) { bg = "rgba(47,69,216,0.12)"; border = "rgba(47,69,216,0.5)"; color = "#5368F0"; }
                              return (
                                <button key={oi} onClick={() => !quizSubmitted && setQuizAnswers(a => { const n = [...a]; n[qi] = oi; return n; })}
                                  style={{ width: "100%", textAlign: "left", padding: "12px 16px", borderRadius: "12px", fontSize: "13px", cursor: quizSubmitted ? "default" : "pointer", background: bg, border: `1px solid ${border}`, color, outline: "none", transition: "all .15s" }}>
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                          {quizSubmitted && <p style={{ fontSize: "12px", color: "rgba(17,19,34,0.5)", background: "rgba(17,19,34,0.03)", padding: "12px 14px", borderRadius: "10px", marginTop: "10px" }}>{q.exp}</p>}
                        </div>
                      ))}
                      {!quizSubmitted ? (
                        <button onClick={() => setQuizSubmitted(true)} className="btn-primary" style={{ padding: "11px 24px", fontSize: "13px", alignSelf: "flex-start" }}>Check Answers</button>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                          <span style={{ color: "#111322", fontWeight: 700, fontSize: "14px" }}>Score: {quizAnswers.filter((a, i) => a === quizQuestions[i].correct).length}/{quizQuestions.length}</span>
                          <button onClick={() => { setQuizSubmitted(false); setQuizAnswers(quizQuestions.map(() => null)); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#2F45D8", fontSize: "13px", fontWeight: 600 }}>Retry Quiz</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* -- Study Notes -- */}
              {aiTool === "notes" && (
                <div style={{ background: "rgba(47,69,216,0.06)", border: "1px solid rgba(47,69,216,0.2)", borderRadius: "16px", padding: "22px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <h3 style={{ color: "#111322", fontWeight: 700, fontSize: "15px", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                      <Sparkles size={16} style={{ color: "#111322" }} /> Study Notes
                    </h3>
                    <button onClick={() => setAiTool(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(17,19,34,0.3)", fontSize: "12px" }}>Close</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "14px", color: "rgba(17,19,34,0.7)", lineHeight: "1.7" }}>
                    <p><strong style={{ color: "#111322" }}>Limits:</strong> A limit describes the value a function approaches as the input approaches a point. Notation: lim(x -&gt; a) f(x). L'Hopital's Rule resolves 0/0 or infinity/infinity indeterminate forms.</p>
                    <p><strong style={{ color: "#111322" }}>Derivatives:</strong> The derivative f'(x) = lim(h -&gt; 0) [f(x+h)-f(x)]/h measures instantaneous rate of change. Key rules: Power, Product, Quotient, and Chain Rule.</p>
                    <p><strong style={{ color: "#111322" }}>Common Derivatives:</strong> d/dx[x^n] = nx^(n-1) - d/dx[sin x] = cos x - d/dx[e^x] = e^x - d/dx[ln x] = 1/x</p>
                  </div>
                </div>
              )}

              {/* -- Resources -- */}
              {aiTool === "resources" && (
                <div style={{ background: "rgba(106,112,133,0.05)", border: "1px solid rgba(106,112,133,0.2)", borderRadius: "16px", padding: "22px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <h3 style={{ color: "#111322", fontWeight: 700, fontSize: "15px", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                      <Globe size={16} style={{ color: "#111322" }} /> Learning Resources
                    </h3>
                    <button onClick={() => setAiTool(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(17,19,34,0.3)", fontSize: "12px" }}>Close</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
                    {[
                      { type: "Article", title: "Khan Academy Calculus", source: "Khan Academy", desc: "Free step-by-step calculus lessons with exercises." },
                      { type: "PDF",     title: "Thomas' Calculus",       source: "Textbook",    desc: "Standard engineering calculus textbook." },
                      { type: "Video",   title: "3Blue1Brown Calculus",   source: "YouTube",     desc: "Visual intuition for calculus concepts." },
                      { type: "Practice","title": "MIT OCW 18.01",        source: "MIT",         desc: "MIT OpenCourseWare single-variable calculus." },
                    ].map(({ type, title, source, desc }) => (
                      <div key={title} style={{ background: "rgba(17,19,34,0.03)", border: "1px solid rgba(17,19,34,0.07)", borderRadius: "12px", padding: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                          <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "20px", background: "rgba(106,112,133,0.12)", color: "#111322", border: "1px solid rgba(106,112,133,0.25)" }}>{type}</span>
                          <span style={{ fontSize: "11px", color: "rgba(17,19,34,0.3)" }}>{source}</span>
                        </div>
                        <p style={{ color: "#111322", fontWeight: 600, fontSize: "13px", margin: "0 0 4px" }}>{title}</p>
                        <p style={{ color: "rgba(17,19,34,0.45)", fontSize: "12px", margin: 0 }}>{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* -- Mind Map -- */}
              {aiTool === "mindmap" && (
                <MindMap title={course.title} topics={modules.slice(0, 6).map(m => m.title)} />
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
