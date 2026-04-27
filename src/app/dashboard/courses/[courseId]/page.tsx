"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle, Lock, ChevronDown, ChevronUp, PlayCircle, FileQuestion, BookOpen, Sparkles, Network, Globe, Trophy } from "lucide-react";
import { VideoPlayer } from "@/components/student/VideoPlayer";
import { MindMap } from "@/components/student/MindMap";

const COURSE = {
  id: "1",
  title: "Engineering Mathematics",
  totalModules: 6,
  completedModules: 3,
  modules: [
    { id: "1", num: 1, title: "Limits & Derivatives", videos: [{ id: "dQw4w9WgXcQ", title: "Introduction to Limits", watched: true }, { id: "dQw4w9WgXcQ", title: "Differentiation Rules", watched: true }], testAvailable: true, testPassed: true, score: 88, unlocked: true },
    { id: "2", num: 2, title: "Integration Techniques", videos: [{ id: "dQw4w9WgXcQ", title: "Definite & Indefinite Integrals", watched: true }, { id: "dQw4w9WgXcQ", title: "Integration by Parts", watched: false }], testAvailable: true, testPassed: false, score: null, unlocked: true },
    { id: "3", num: 3, title: "Differential Equations", videos: [{ id: "dQw4w9WgXcQ", title: "First-Order ODEs", watched: false }], testAvailable: false, testPassed: false, score: null, unlocked: true },
    { id: "4", num: 4, title: "Linear Algebra", videos: [{ id: "dQw4w9WgXcQ", title: "Matrices & Determinants", watched: false }], testAvailable: false, testPassed: false, score: null, unlocked: false },
    { id: "5", num: 5, title: "Probability & Statistics", videos: [], testAvailable: false, testPassed: false, score: null, unlocked: false },
    { id: "6", num: 6, title: "Final Examination", videos: [], testAvailable: false, testPassed: false, score: null, unlocked: false },
  ],
};

type AITool = "quiz" | "notes" | "resources" | "mindmap" | null;

const MOCK_QUIZ = [
  { q: "What is the derivative of sin(x)?", opts: ["cos(x)", "-cos(x)", "tan(x)", "-sin(x)"], correct: 0, exp: "The derivative of sin(x) is cos(x). This is a fundamental trigonometric derivative rule." },
  { q: "Which rule is used to differentiate a product of two functions?", opts: ["Chain Rule", "Product Rule", "Quotient Rule", "Power Rule"], correct: 1, exp: "The Product Rule: d/dx[uÂ·v] = u'v + uv'. It applies when differentiating the product of two functions." },
];

export default function CoursePage() {
  const params = useParams();
  const [expandedModule, setExpandedModule] = useState<string | null>("2");
  const [currentVideo, setCurrentVideo] = useState<{ moduleId: string; index: number } | null>({ moduleId: "2", index: 0 });
  const [aiTool, setAiTool] = useState<AITool>(null);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>(MOCK_QUIZ.map(() => null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const activeModule = currentVideo ? COURSE.modules.find(m => m.id === currentVideo.moduleId) : null;
  const activeVideo = activeModule && currentVideo ? activeModule.videos[currentVideo.index] : null;
  const progress = Math.round((COURSE.completedModules / COURSE.totalModules) * 100);
  const courseComplete = COURSE.completedModules === COURSE.totalModules;

  const TOOLS = [
    { key: "quiz"      as AITool, label: "Practice Quiz", icon: BookOpen, color: "#A78BFA", bg: "rgba(124,58,237,0.1)", border: "rgba(124,58,237,0.3)" },
    { key: "notes"     as AITool, label: "Study Notes",   icon: Sparkles, color: "#22D3EE", bg: "rgba(6,182,212,0.1)",  border: "rgba(6,182,212,0.3)" },
    { key: "resources" as AITool, label: "Find Resources",icon: Globe,    color: "#34D399", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)" },
    { key: "mindmap"   as AITool, label: "Mind Map",      icon: Network,  color: "#FBBF24", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#050508", overflow: "hidden" }}>

      {/* â”€â”€ Top header bar â”€â”€ */}
      <div style={{ background: "#0A0A12", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "12px 20px", display: "flex", alignItems: "center", gap: "14px", flexShrink: 0, zIndex: 10 }}>
        <Link href="/dashboard/courses" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "34px", height: "34px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", textDecoration: "none", flexShrink: 0, transition: "background .15s" }}>
          <ArrowLeft size={16} />
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ color: "#fff", fontWeight: 700, fontSize: "14px", margin: "0 0 1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{COURSE.title}</h1>
          <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "12px", margin: 0 }}>{COURSE.completedModules}/{COURSE.totalModules} modules completed</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0, minWidth: "180px" }}>
          <div style={{ flex: 1, height: "6px", borderRadius: "9999px", background: "rgba(255,255,255,0.07)" }}>
            <div style={{ height: "100%", borderRadius: "9999px", width: `${progress}%`, background: "linear-gradient(90deg,#7C3AED,#06B6D4)", transition: "width .4s" }} />
          </div>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#A78BFA", flexShrink: 0 }}>{progress}%</span>
        </div>
      </div>

      {/* â”€â”€ Completion banner â”€â”€ */}
      {courseComplete && (
        <div style={{ margin: "12px 16px 0", padding: "14px 18px", borderRadius: "12px", border: "1px solid rgba(245,158,11,0.3)", background: "rgba(245,158,11,0.05)", display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          <Trophy size={20} style={{ color: "#FBBF24", flexShrink: 0 }} />
          <p style={{ color: "#FBBF24", fontWeight: 600, fontSize: "14px", flex: 1, margin: 0 }}>Course Complete! You&apos;ve finished all modules.</p>
          <Link href="/dashboard/certificates" className="btn-primary" style={{ padding: "8px 16px", fontSize: "13px", flexShrink: 0, textDecoration: "none" }}>View Certificate</Link>
        </div>
      )}

      {/* â”€â”€ Two-column body â”€â”€ */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* â”€â”€ Module sidebar â”€â”€ */}
        <div style={{ width: "272px", flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.06)", background: "#0A0A12", overflowY: "auto", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "14px 10px", display: "flex", flexDirection: "column", gap: "4px" }}>
            {COURSE.modules.map(mod => {
              const isExpanded = expandedModule === mod.id;
              const isActive = currentVideo?.moduleId === mod.id;
              return (
                <div key={mod.id}>
                  {/* Module header button */}
                  <button
                    onClick={() => mod.unlocked && setExpandedModule(isExpanded ? null : mod.id)}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "12px", textAlign: "left", cursor: mod.unlocked ? "pointer" : "not-allowed", background: isExpanded ? "rgba(124,58,237,0.08)" : "transparent", border: `1px solid ${isExpanded ? "rgba(124,58,237,0.2)" : "transparent"}`, opacity: mod.unlocked ? 1 : 0.45, transition: "all .15s", outline: "none" }}
                  >
                    <div style={{ width: "28px", height: "28px", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "12px", fontWeight: 700, background: mod.testPassed ? "rgba(16,185,129,0.15)" : !mod.unlocked ? "rgba(255,255,255,0.05)" : isActive ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.06)", color: mod.testPassed ? "#34D399" : !mod.unlocked ? "rgba(255,255,255,0.25)" : isActive ? "#A78BFA" : "rgba(255,255,255,0.5)" }}>
                      {mod.testPassed ? <CheckCircle size={14} /> : !mod.unlocked ? <Lock size={12} /> : mod.num}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.75)", fontWeight: isActive ? 700 : 500, fontSize: "13px", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{mod.title}</p>
                      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", margin: 0 }}>{mod.videos.length} video{mod.videos.length !== 1 ? "s" : ""}</p>
                    </div>
                    {mod.unlocked && (
                      isExpanded
                        ? <ChevronUp size={13} style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
                        : <ChevronDown size={13} style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
                    )}
                  </button>

                  {/* Expanded video list */}
                  {isExpanded && mod.unlocked && (
                    <div style={{ marginTop: "4px", marginLeft: "12px", paddingLeft: "12px", borderLeft: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", gap: "3px", paddingBottom: "6px" }}>
                      {mod.videos.map((v, idx) => {
                        const isCurrent = currentVideo?.moduleId === mod.id && currentVideo?.index === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => setCurrentVideo({ moduleId: mod.id, index: idx })}
                            style={{ display: "flex", alignItems: "center", gap: "9px", padding: "8px 10px", borderRadius: "9px", textAlign: "left", cursor: "pointer", background: isCurrent ? "rgba(124,58,237,0.12)" : "transparent", border: `1px solid ${isCurrent ? "rgba(124,58,237,0.35)" : "transparent"}`, outline: "none", width: "100%", transition: "all .15s" }}
                          >
                            <div style={{ width: "20px", height: "20px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: v.watched ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)" }}>
                              {v.watched
                                ? <CheckCircle size={11} style={{ color: "#34D399" }} />
                                : <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>{idx + 1}</span>}
                            </div>
                            <span style={{ fontSize: "12px", color: isCurrent ? "#C4B5FD" : "rgba(255,255,255,0.62)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.title}</span>
                          </button>
                        );
                      })}
                      {mod.testAvailable && (
                        <Link
                          href={`/dashboard/courses/${params.courseId}/test/${mod.id}`}
                          style={{ display: "flex", alignItems: "center", gap: "9px", padding: "8px 10px", borderRadius: "9px", textDecoration: "none", fontSize: "12px", color: mod.testPassed ? "#34D399" : "#A78BFA", background: mod.testPassed ? "rgba(16,185,129,0.06)" : "rgba(124,58,237,0.07)", border: `1px solid ${mod.testPassed ? "rgba(16,185,129,0.2)" : "rgba(124,58,237,0.2)"}` }}
                        >
                          <FileQuestion size={13} />
                          {mod.testPassed ? `Test Passed â€” ${mod.score}%` : "Take Module Test"}
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* â”€â”€ Main content area â”€â”€ */}
        <div style={{ flex: 1, overflowY: "auto", minWidth: 0, display: "flex", flexDirection: "column", gap: "0" }}>
          {!currentVideo ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: "14px", color: "rgba(255,255,255,0.25)" }}>
              <PlayCircle size={48} />
              <p style={{ fontSize: "15px" }}>Select a module to start learning</p>
            </div>
          ) : (
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Module title + test CTA */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 4px" }}>Now Playing</p>
                  <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "20px", margin: 0 }}>{activeModule?.title}</h2>
                </div>
                {activeModule?.testAvailable && !activeModule.testPassed && (
                  <Link
                    href={`/dashboard/courses/${params.courseId}/test/${activeModule.id}`}
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "12px", background: "linear-gradient(135deg,#7C3AED,#0891B2)", color: "#fff", fontSize: "13px", fontWeight: 700, textDecoration: "none", flexShrink: 0 }}
                  >
                    <FileQuestion size={15} /> Take Module Test
                  </Link>
                )}
                {activeModule?.testPassed && (
                  <Link
                    href={`/dashboard/courses/${params.courseId}/test/${activeModule.id}`}
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "12px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#34D399", fontSize: "13px", fontWeight: 700, textDecoration: "none", flexShrink: 0 }}
                  >
                    <CheckCircle size={15} /> Retake Test â€” {activeModule.score}%
                  </Link>
                )}
              </div>

              {/* Video player */}
              {activeVideo && (
                <div style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <VideoPlayer videoId={activeVideo.id} title={activeVideo.title} />
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
                      style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "12px", fontSize: "13px", fontWeight: 600, cursor: "pointer", background: active ? bg : "transparent", border: `1px solid ${active ? border : "rgba(255,255,255,0.1)"}`, color: active ? color : "rgba(255,255,255,0.5)", outline: "none", transition: "all .15s" }}
                    >
                      <Icon size={15} /> {label}
                    </button>
                  );
                })}
              </div>

              {/* â”€â”€ Practice Quiz â”€â”€ */}
              {aiTool === "quiz" && (
                <div style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "16px", padding: "22px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                    <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "15px", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                      <BookOpen size={16} style={{ color: "#A78BFA" }} /> Practice Quiz
                    </h3>
                    <button onClick={() => setAiTool(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>Close</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {MOCK_QUIZ.map((q, qi) => (
                      <div key={qi}>
                        <p style={{ color: "#fff", fontWeight: 600, fontSize: "14px", margin: "0 0 12px" }}>Q{qi + 1}. {q.q}</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {q.opts.map((opt, oi) => {
                            let bg = "rgba(255,255,255,0.03)", border = "rgba(255,255,255,0.08)", color = "rgba(255,255,255,0.65)";
                            if (quizSubmitted) {
                              if (oi === q.correct) { bg = "rgba(16,185,129,0.1)"; border = "rgba(16,185,129,0.5)"; color = "#34D399"; }
                              else if (oi === quizAnswers[qi] && oi !== q.correct) { bg = "rgba(239,68,68,0.1)"; border = "rgba(239,68,68,0.5)"; color = "#F87171"; }
                              else { color = "rgba(255,255,255,0.3)"; }
                            } else if (quizAnswers[qi] === oi) { bg = "rgba(124,58,237,0.12)"; border = "rgba(124,58,237,0.5)"; color = "#C4B5FD"; }
                            return (
                              <button key={oi} onClick={() => !quizSubmitted && setQuizAnswers(a => { const n = [...a]; n[qi] = oi; return n; })}
                                style={{ width: "100%", textAlign: "left", padding: "12px 16px", borderRadius: "12px", fontSize: "13px", cursor: quizSubmitted ? "default" : "pointer", background: bg, border: `1px solid ${border}`, color, outline: "none", transition: "all .15s" }}>
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {quizSubmitted && <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.03)", padding: "12px 14px", borderRadius: "10px", marginTop: "10px" }}>{q.exp}</p>}
                      </div>
                    ))}
                    {!quizSubmitted ? (
                      <button onClick={() => setQuizSubmitted(true)} className="btn-primary" style={{ padding: "11px 24px", fontSize: "13px", alignSelf: "flex-start" }}>Check Answers</button>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <span style={{ color: "#fff", fontWeight: 700, fontSize: "14px" }}>Score: {quizAnswers.filter((a, i) => a === MOCK_QUIZ[i].correct).length}/{MOCK_QUIZ.length}</span>
                        <button onClick={() => { setQuizSubmitted(false); setQuizAnswers(MOCK_QUIZ.map(() => null)); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#A78BFA", fontSize: "13px", fontWeight: 600 }}>Retry Quiz</button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* â”€â”€ Study Notes â”€â”€ */}
              {aiTool === "notes" && (
                <div style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: "16px", padding: "22px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "15px", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                      <Sparkles size={16} style={{ color: "#22D3EE" }} /> Study Notes
                    </h3>
                    <button onClick={() => setAiTool(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>Close</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "14px", color: "rgba(255,255,255,0.7)", lineHeight: "1.7" }}>
                    <p><strong style={{ color: "#fff" }}>Limits:</strong> A limit describes the value a function approaches as the input approaches a point. Notation: lim(xâ†’a) f(x). L'HÃ´pital's Rule resolves 0/0 or âˆž/âˆž indeterminate forms.</p>
                    <p><strong style={{ color: "#fff" }}>Derivatives:</strong> The derivative f'(x) = lim(hâ†’0) [f(x+h)-f(x)]/h measures instantaneous rate of change. Key rules: Power, Product, Quotient, and Chain Rule.</p>
                    <p><strong style={{ color: "#fff" }}>Common Derivatives:</strong> d/dx[xâ¿] = nxâ¿â»Â¹ Â· d/dx[sin x] = cos x Â· d/dx[eË£] = eË£ Â· d/dx[ln x] = 1/x</p>
                  </div>
                </div>
              )}

              {/* â”€â”€ Resources â”€â”€ */}
              {aiTool === "resources" && (
                <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "16px", padding: "22px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "15px", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                      <Globe size={16} style={{ color: "#34D399" }} /> Learning Resources
                    </h3>
                    <button onClick={() => setAiTool(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>Close</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
                    {[
                      { type: "Article", title: "Khan Academy Calculus", source: "Khan Academy", desc: "Free step-by-step calculus lessons with exercises." },
                      { type: "PDF",     title: "Thomas' Calculus",       source: "Textbook",    desc: "Standard engineering calculus textbook." },
                      { type: "Video",   title: "3Blue1Brown Calculus",   source: "YouTube",     desc: "Visual intuition for calculus concepts." },
                      { type: "Practice","title": "MIT OCW 18.01",        source: "MIT",         desc: "MIT OpenCourseWare single-variable calculus." },
                    ].map(({ type, title, source, desc }) => (
                      <div key={title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                          <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "20px", background: "rgba(16,185,129,0.12)", color: "#34D399", border: "1px solid rgba(16,185,129,0.25)" }}>{type}</span>
                          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{source}</span>
                        </div>
                        <p style={{ color: "#fff", fontWeight: 600, fontSize: "13px", margin: "0 0 4px" }}>{title}</p>
                        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", margin: 0 }}>{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* â”€â”€ Mind Map â”€â”€ */}
              {aiTool === "mindmap" && (
                <MindMap title="Engineering Mathematics" topics={["Limits", "Derivatives", "Integration", "Differential Eq.", "Linear Algebra", "Probability"]} />
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
