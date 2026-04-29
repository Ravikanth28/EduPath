"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Trophy, XCircle, CheckCircle, AlertCircle } from "lucide-react";
import { api, type QuizQuestion } from "@/lib/api";

const PASSING_SCORE = 70;
const LABELS = ["A", "B", "C", "D"];

export default function TestPage() {
  const params = useParams();
  const courseId = String(params.courseId);
  const moduleNum = Number(params.moduleId);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [moduleTitle, setModuleTitle] = useState(`Module ${moduleNum}`);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState(0);
  const [numCorrect, setNumCorrect] = useState(0);
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.modules.getQuestions(courseId, moduleNum),
      api.modules.list(courseId).catch(() => []),
    ])
      .then(([qs, mods]) => {
        setQuestions(qs);
        setAnswers(qs.map(() => null));
        const mod = mods.find(m => m.num === moduleNum);
        if (mod) setModuleTitle(mod.title);
      })
      .catch(e => setError((e as Error).message ?? "Failed to load questions"))
      .finally(() => setLoading(false));
  }, [courseId, moduleNum]);

  const answered = answers.filter(a => a !== null).length;

  const handleSubmit = async () => {
    if (answered < questions.length) return;
    setSubmitting(true);
    try {
      const result = await api.modules.submitTest(courseId, moduleNum, answers as number[]);
      setScore(result.score);
      setNumCorrect(result.correct);
      setPassed(result.passed);
      setSubmitted(true);
    } catch {
      const correct = answers.filter((a, i) => a === questions[i].correct).length;
      const s = Math.round((correct / questions.length) * 100);
      setScore(s);
      setNumCorrect(correct);
      setPassed(s >= PASSING_SCORE);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const PAGE_BG: React.CSSProperties = {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#DDE7FF 0%,#EEF3FF 52%,#CAD8FF 100%)",
    padding: "32px 24px",
    overflowY: "auto",
  };

  if (loading) {
    return (
      <div style={PAGE_BG}>
        <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
          <Link href={`/dashboard/courses/${courseId}`} style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "rgba(17,19,34,0.50)", textDecoration: "none", fontSize: "14px", fontWeight: 600, width: "fit-content" }}>
            <ArrowLeft size={16} /> Back to Course
          </Link>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px" }}>
            <div style={{ width: "36px", height: "36px", border: "3px solid rgba(47,69,216,0.20)", borderTopColor: "#2F45D8", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div style={PAGE_BG}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <Link href={`/dashboard/courses/${courseId}`} style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "rgba(17,19,34,0.50)", textDecoration: "none", fontSize: "14px", fontWeight: 600, marginBottom: "24px" }}>
            <ArrowLeft size={16} /> Back to Course
          </Link>
          <p style={{ color: "#2F45D8", fontWeight: 600 }}>{error ?? "No questions available for this module yet."}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={PAGE_BG}>
      <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
        <Link href={`/dashboard/courses/${courseId}`} style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "rgba(17,19,34,0.50)", textDecoration: "none", fontSize: "14px", fontWeight: 600, width: "fit-content" }}>
          <ArrowLeft size={16} /> Back to Course
        </Link>
        <div style={{ background: "#FFFFFF", border: `1px solid ${passed ? "rgba(47,69,216,0.20)" : "rgba(220,60,60,0.20)"}`, boxShadow: "0 4px 24px rgba(47,69,216,0.10)", borderRadius: "20px", padding: "40px 32px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          {passed ? <Trophy size={52} style={{ color: "#111322" }} /> : <XCircle size={52} style={{ color: "#2F45D8" }} />}
          <p style={{ fontSize: "64px", fontWeight: 900, margin: 0, background: "linear-gradient(135deg,#2F45D8,#2336B8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{score}%</p>
          <p style={{ fontSize: "22px", fontWeight: 700, color: passed ? "#111322" : "#2F45D8", margin: 0 }}>{passed ? "Passed!" : "Not Passed"}</p>
          <p style={{ fontSize: "14px", color: "rgba(17,19,34,0.45)", margin: 0 }}>{numCorrect} / {questions.length} correct &middot; Passing: {PASSING_SCORE}%</p>
          {passed && (
            <span style={{ padding: "4px 14px", borderRadius: "20px", background: "rgba(106,112,133,0.12)", border: "1px solid rgba(106,112,133,0.3)", color: "#111322", fontSize: "13px", fontWeight: 700 }}>
              Module Unlocked!
            </span>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center", marginTop: "8px" }}>
            <Link href={`/dashboard/courses/${courseId}`} style={{ display: "inline-flex", alignItems: "center", padding: "10px 24px", borderRadius: "12px", background: "rgba(17,19,34,0.06)", border: "1px solid rgba(17,19,34,0.12)", color: "#111322", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}>
              Back to Course
            </Link>
            {passed && (
              <Link href="/dashboard/certificates" style={{ display: "inline-flex", alignItems: "center", padding: "10px 24px", borderRadius: "12px", background: "linear-gradient(135deg,#2F45D8,#2336B8)", color: "#FFFFFF", fontSize: "14px", fontWeight: 700, textDecoration: "none" }}>
                View Certificates
              </Link>
            )}
            {!passed && (
              <button onClick={() => { setSubmitted(false); setAnswers(questions.map(() => null)); setCurrent(0); }} style={{ display: "inline-flex", alignItems: "center", padding: "10px 24px", borderRadius: "12px", background: "linear-gradient(135deg,#2F45D8,#2336B8)", color: "#FFFFFF", fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer" }}>
                Try Again
              </button>
            )}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {questions.map((q, i) => {
            const isCorrect = answers[i] === q.correct;
            return (
              <div key={i} style={{ background: "#FFFFFF", border: `1px solid ${isCorrect ? "rgba(47,69,216,0.15)" : "rgba(220,60,60,0.20)"}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", borderRadius: "14px", padding: "18px 20px", display: "flex", gap: "14px" }}>
                <div style={{ flexShrink: 0, marginTop: "2px" }}>
                  {isCorrect ? <CheckCircle size={18} style={{ color: "#111322" }} /> : <XCircle size={18} style={{ color: "#2F45D8" }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: "#111322", fontWeight: 600, fontSize: "14px", margin: "0 0 8px" }}>Q{i + 1}. {q.q}</p>
                  <p style={{ color: "#111322", fontSize: "13px", margin: "0 0 4px" }}>Correct: {q.opts[q.correct]}</p>
                  {!isCorrect && answers[i] !== null && (
                    <p style={{ color: "#2F45D8", fontSize: "13px", margin: "0 0 4px" }}>Your answer: {q.opts[answers[i]!]}</p>
                  )}
                  <p style={{ color: "rgba(17,19,34,0.40)", fontSize: "12px", margin: "6px 0 0", lineHeight: "1.5" }}>{q.exp}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div style={PAGE_BG}>
    <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Link href={`/dashboard/courses/${courseId}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "10px", background: "rgba(17,19,34,0.05)", border: "1px solid rgba(17,19,34,0.10)", color: "rgba(17,19,34,0.60)", textDecoration: "none", flexShrink: 0 }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p style={{ fontSize: "11px", color: "rgba(17,19,34,0.35)", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Module Test</p>
          <h1 style={{ fontSize: "18px", fontWeight: 800, color: "#111322", margin: 0 }}>{moduleTitle}</h1>
        </div>
      </div>

      <div style={{ background: "#FFFFFF", border: "1px solid rgba(47,69,216,0.12)", boxShadow: "0 2px 12px rgba(47,69,216,0.08)", borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "18px" }}>
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <p style={{ fontSize: "28px", fontWeight: 900, color: "#111322", margin: 0, lineHeight: 1 }}>{current + 1}</p>
          <p style={{ fontSize: "11px", color: "rgba(17,19,34,0.35)", margin: "3px 0 0" }}>of {questions.length}</p>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "rgba(17,19,34,0.45)" }}>Answered: {answered}/{questions.length}</span>
            <span style={{ fontSize: "12px", color: "rgba(17,19,34,0.45)" }}>{Math.round((answered / questions.length) * 100)}%</span>
          </div>
          <div style={{ height: "8px", borderRadius: "99px", background: "rgba(17,19,34,0.07)" }}>
            <div style={{ height: "100%", borderRadius: "99px", width: `${(answered / questions.length) * 100}%`, background: "linear-gradient(135deg,#2F45D8,#2336B8)", transition: "width .3s" }} />
          </div>
        </div>
      </div>

      <div style={{ background: "#FFFFFF", border: "1px solid rgba(47,69,216,0.12)", boxShadow: "0 2px 16px rgba(47,69,216,0.08)", borderRadius: "16px", padding: "28px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "20px" }}>
          <span style={{ padding: "4px 12px", borderRadius: "20px", background: "rgba(47,69,216,0.15)", border: "1px solid rgba(47,69,216,0.35)", color: "#2F45D8", fontSize: "12px", fontWeight: 700, flexShrink: 0, marginTop: "2px" }}>
            Q{current + 1}
          </span>
          <p style={{ color: "#111322", fontWeight: 600, fontSize: "16px", margin: 0, lineHeight: "1.5" }}>{q.q}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {q.opts.map((opt, i) => {
            const isSelected = answers[current] === i;
            return (
              <button
                key={i}
                onClick={() => setAnswers(a => { const n = [...a]; n[current] = i; return n; })}
                style={{ display: "flex", alignItems: "center", gap: "14px", width: "100%", textAlign: "left", padding: "14px 18px", borderRadius: "12px", fontSize: "14px", cursor: "pointer", background: isSelected ? "rgba(47,69,216,0.10)" : "rgba(47,69,216,0.02)", border: `2px solid ${isSelected ? "#2F45D8" : "rgba(47,69,216,0.12)"}`, color: isSelected ? "#2F45D8" : "#111322", outline: "none", transition: "all .15s", fontWeight: isSelected ? 600 : 400 }}
              >
                <span style={{ width: "28px", height: "28px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "13px", fontWeight: 700, background: isSelected ? "#2F45D8" : "rgba(47,69,216,0.08)", color: isSelected ? "#FFFFFF" : "#2F45D8" }}>
                  {LABELS[i]}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {answered < questions.length && current === questions.length - 1 && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 18px", borderRadius: "12px", background: "rgba(106,112,133,0.06)", border: "1px solid rgba(106,112,133,0.25)" }}>
          <AlertCircle size={16} style={{ color: "#111322", flexShrink: 0 }} />
          <p style={{ color: "#111322", fontSize: "13px", margin: 0 }}>
            {questions.length - answered} question{questions.length - answered !== 1 ? "s" : ""} still unanswered.
          </p>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}
          style={{ padding: "10px 22px", borderRadius: "12px", fontSize: "14px", fontWeight: 600, cursor: current === 0 ? "default" : "pointer", opacity: current === 0 ? 0.35 : 1, background: "#FFFFFF", border: "1px solid rgba(47,69,216,0.20)", color: "#2F45D8" }}>
          Previous
        </button>
        <div style={{ display: "flex", gap: "8px" }}>
          {questions.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              style={{ width: "34px", height: "34px", borderRadius: "10px", fontSize: "13px", fontWeight: 700, cursor: "pointer", border: "none", outline: "none", transition: "all .15s",
                background: i === current ? "#2F45D8" : answers[i] !== null ? "rgba(106,112,133,0.15)" : "rgba(17,19,34,0.07)",
                color: i === current ? "#fff" : answers[i] !== null ? "#111322" : "rgba(17,19,34,0.45)",
              }}>
              {i + 1}
            </button>
          ))}
        </div>
        {current < questions.length - 1 ? (
          <button onClick={() => setCurrent(c => c + 1)}
            style={{ padding: "10px 22px", borderRadius: "12px", fontSize: "14px", fontWeight: 700, cursor: "pointer", background: "linear-gradient(135deg,#2F45D8,#2336B8)", border: "none", color: "#FFFFFF" }}>
            Next
          </button>
        ) : answered === questions.length ? (
          <button onClick={handleSubmit} disabled={submitting}
            style={{ padding: "10px 22px", borderRadius: "12px", fontSize: "14px", fontWeight: 700, cursor: submitting ? "default" : "pointer", opacity: submitting ? 0.7 : 1, background: "linear-gradient(135deg,#2F45D8,#2336B8)", border: "none", color: "#FFFFFF" }}>
            {submitting ? "Submitting…" : "Submit"}
          </button>
        ) : (
          <button disabled
            style={{ padding: "10px 22px", borderRadius: "12px", fontSize: "14px", fontWeight: 700, cursor: "default", opacity: 0.35, background: "linear-gradient(135deg,#2F45D8,#2336B8)", border: "none", color: "#FFFFFF" }}>
            Submit
          </button>
        )}
      </div>
    </div>
    </div>
  );
}
