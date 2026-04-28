"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Trophy, XCircle, CheckCircle, AlertCircle } from "lucide-react";

const QUESTIONS = [
  { q: "What is supervised learning?", opts: ["Learning from labeled data", "Learning without labels", "Reinforcement only", "None of the above"], correct: 0, exp: "Supervised learning uses labeled data to train models." },
  { q: "Which metric measures classification accuracy?", opts: ["MSE", "MAE", "F1 Score", "R-squared"], correct: 2, exp: "F1 Score balances precision and recall for classification tasks." },
  { q: "What does overfitting mean?", opts: ["Model too simple", "Model memorizes training data", "Model has low variance", "Model underfits test data"], correct: 1, exp: "Overfitting occurs when the model performs well on training data but poorly on new data." },
  { q: "Which algorithm is a lazy learner?", opts: ["Linear Regression", "Decision Tree", "K-Nearest Neighbors", "Naive Bayes"], correct: 2, exp: "KNN is lazy because it doesn't build an explicit model during training." },
  { q: "What is a hyperparameter?", opts: ["A learned weight", "A parameter set before training", "An output neuron", "A training example"], correct: 1, exp: "Hyperparameters are configuration settings that must be set before the learning process begins." },
];

const MODULE_TITLES: Record<string, string[]> = {
  "1": ["Limits & Derivatives", "Integration Techniques", "Differential Equations", "Linear Algebra", "Probability & Statistics", "Final Examination"],
  "2": ["Kinematics", "Newton's Laws", "Work & Energy", "Rotational Motion", "Fluid Mechanics"],
  "3": ["Atomic Structure", "Chemical Bonding", "Thermodynamics", "Equilibrium", "Organic Basics", "Electrochemistry", "Kinetics", "Lab Methods"],
  "4": ["Programming Basics", "Control Flow", "Functions", "Arrays", "Data Structures", "Algorithms", "Final Project"],
  "5": ["Circuit Laws", "Diodes", "Transistors", "Amplifiers"],
};

const PASSING_SCORE = 70;
const LABELS = ["A", "B", "C", "D"];

export default function TestPage() {
  const params = useParams();
  const courseId = String(params.courseId);
  const moduleIndex = Number(params.moduleId) - 1;
  const moduleTitle = MODULE_TITLES[courseId]?.[moduleIndex] ?? `Module ${params.moduleId}`;
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(QUESTIONS.map(() => null));
  const [submitted, setSubmitted] = useState(false);

  const answered = answers.filter(a => a !== null).length;
  const numCorrect = answers.filter((a, i) => a === QUESTIONS[i].correct).length;
  const score = submitted ? Math.round((numCorrect / QUESTIONS.length) * 100) : 0;
  const passed = score >= PASSING_SCORE;

  const handleSubmit = () => {
    if (answered < QUESTIONS.length) return;
    setSubmitted(true);
  };

  /* -- Results screen -- */
  if (submitted) {
    return (
      <div style={{ padding: "28px 24px", maxWidth: "680px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>

        <Link href={`/dashboard/courses/${params.courseId}`} style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "rgba(17,19,34,0.50)", textDecoration: "none", fontSize: "14px", fontWeight: 600, width: "fit-content" }}>
          <ArrowLeft size={16} /> Back to Course
        </Link>

        {/* Score card */}
        <div style={{ background: "rgba(17,19,34,0.03)", border: `1px solid ${passed ? "rgba(106,112,133,0.25)" : "rgba(47,69,216,0.25)"}`, borderRadius: "20px", padding: "40px 32px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          {passed
            ? <Trophy size={52} style={{ color: "#111322" }} />
            : <XCircle size={52} style={{ color: "#2F45D8" }} />}
          <p style={{ fontSize: "64px", fontWeight: 900, margin: 0, background: "linear-gradient(135deg,#2F45D8,#2336B8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{score}%</p>
          <p style={{ fontSize: "22px", fontWeight: 700, color: passed ? "#111322" : "#2F45D8", margin: 0 }}>{passed ? "Passed!" : "Not Passed"}</p>
          <p style={{ fontSize: "14px", color: "rgba(17,19,34,0.45)", margin: 0 }}>{numCorrect} / {QUESTIONS.length} correct &middot; Passing: {PASSING_SCORE}%</p>
          {passed && (
            <span style={{ padding: "4px 14px", borderRadius: "20px", background: "rgba(106,112,133,0.12)", border: "1px solid rgba(106,112,133,0.3)", color: "#111322", fontSize: "13px", fontWeight: 700 }}>
              Certificate Earned!
            </span>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center", marginTop: "8px" }}>
            <Link href={`/dashboard/courses/${params.courseId}`} style={{ display: "inline-flex", alignItems: "center", padding: "10px 24px", borderRadius: "12px", background: "rgba(17,19,34,0.06)", border: "1px solid rgba(17,19,34,0.12)", color: "#111322", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}>
              Back to Course
            </Link>
            {passed && (
              <Link href="/dashboard/certificates" style={{ display: "inline-flex", alignItems: "center", padding: "10px 24px", borderRadius: "12px", background: "linear-gradient(135deg,#2F45D8,#2336B8)", color: "#FFFFFF", fontSize: "14px", fontWeight: 700, textDecoration: "none" }}>
                View Certificate
              </Link>
            )}
            {!passed && (
              <button onClick={() => { setSubmitted(false); setAnswers(QUESTIONS.map(() => null)); setCurrent(0); }} style={{ display: "inline-flex", alignItems: "center", padding: "10px 24px", borderRadius: "12px", background: "linear-gradient(135deg,#2F45D8,#2336B8)", color: "#FFFFFF", fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer" }}>
                Try Again
              </button>
            )}
          </div>
        </div>

        {/* Question review */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {QUESTIONS.map((q, i) => {
            const isCorrect = answers[i] === q.correct;
            return (
              <div key={i} style={{ background: "rgba(17,19,34,0.02)", border: `1px solid ${isCorrect ? "rgba(106,112,133,0.20)" : "rgba(47,69,216,0.20)"}`, borderRadius: "14px", padding: "18px 20px", display: "flex", gap: "14px" }}>
                <div style={{ flexShrink: 0, marginTop: "2px" }}>
                  {isCorrect
                    ? <CheckCircle size={18} style={{ color: "#111322" }} />
                    : <XCircle    size={18} style={{ color: "#2F45D8" }} />}
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
    );
  }

  /* -- Quiz screen -- */
  const q = QUESTIONS[current];

  return (
    <div style={{ padding: "28px 24px", maxWidth: "680px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Link href={`/dashboard/courses/${params.courseId}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "10px", background: "rgba(17,19,34,0.05)", border: "1px solid rgba(17,19,34,0.10)", color: "rgba(17,19,34,0.60)", textDecoration: "none", flexShrink: 0 }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p style={{ fontSize: "11px", color: "rgba(17,19,34,0.35)", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Module Test</p>
          <h1 style={{ fontSize: "18px", fontWeight: 800, color: "#111322", margin: 0 }}>{moduleTitle}</h1>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: "rgba(17,19,34,0.03)", border: "1px solid rgba(17,19,34,0.07)", borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "18px" }}>
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <p style={{ fontSize: "28px", fontWeight: 900, color: "#111322", margin: 0, lineHeight: 1 }}>{current + 1}</p>
          <p style={{ fontSize: "11px", color: "rgba(17,19,34,0.35)", margin: "3px 0 0" }}>of {QUESTIONS.length}</p>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "rgba(17,19,34,0.45)" }}>Answered: {answered}/{QUESTIONS.length}</span>
            <span style={{ fontSize: "12px", color: "rgba(17,19,34,0.45)" }}>{Math.round((answered / QUESTIONS.length) * 100)}%</span>
          </div>
          <div style={{ height: "8px", borderRadius: "99px", background: "rgba(17,19,34,0.07)" }}>
            <div style={{ height: "100%", borderRadius: "99px", width: `${(answered / QUESTIONS.length) * 100}%`, background: "linear-gradient(135deg,#2F45D8,#2336B8)", transition: "width .3s" }} />
          </div>
        </div>
      </div>

      {/* Question card */}
      <div style={{ background: "rgba(17,19,34,0.03)", border: "1px solid rgba(17,19,34,0.08)", borderRadius: "16px", padding: "24px" }}>
        {/* Question text */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "20px" }}>
          <span style={{ padding: "4px 12px", borderRadius: "20px", background: "rgba(47,69,216,0.15)", border: "1px solid rgba(47,69,216,0.35)", color: "#2F45D8", fontSize: "12px", fontWeight: 700, flexShrink: 0, marginTop: "2px" }}>
            Q{current + 1}
          </span>
          <p style={{ color: "#111322", fontWeight: 600, fontSize: "16px", margin: 0, lineHeight: "1.5" }}>{q.q}</p>
        </div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {q.opts.map((opt, i) => {
            const isSelected = answers[current] === i;
            return (
              <button
                key={i}
                onClick={() => setAnswers(a => { const n = [...a]; n[current] = i; return n; })}
                style={{
                  display: "flex", alignItems: "center", gap: "14px",
                  width: "100%", textAlign: "left", padding: "14px 18px",
                  borderRadius: "12px", fontSize: "14px", cursor: "pointer",
                  background: isSelected ? "rgba(47,69,216,0.12)" : "rgba(17,19,34,0.02)",
                  border: `1px solid ${isSelected ? "rgba(47,69,216,0.50)" : "rgba(17,19,34,0.08)"}`,
                  color: isSelected ? "#5368F0" : "rgba(17,19,34,0.70)",
                  outline: "none", transition: "all .15s",
                }}
              >
                <span style={{ width: "28px", height: "28px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "13px", fontWeight: 700, background: isSelected ? "rgba(47,69,216,0.25)" : "rgba(17,19,34,0.06)", color: isSelected ? "#2F45D8" : "rgba(17,19,34,0.40)" }}>
                  {LABELS[i]}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Warning: unanswered on last page */}
      {answered < QUESTIONS.length && current === QUESTIONS.length - 1 && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 18px", borderRadius: "12px", background: "rgba(106,112,133,0.06)", border: "1px solid rgba(106,112,133,0.25)" }}>
          <AlertCircle size={16} style={{ color: "#111322", flexShrink: 0 }} />
          <p style={{ color: "#111322", fontSize: "13px", margin: 0 }}>
            {QUESTIONS.length - answered} question{QUESTIONS.length - answered !== 1 ? "s" : ""} still unanswered.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <button
          onClick={() => setCurrent(c => Math.max(0, c - 1))}
          disabled={current === 0}
          style={{ padding: "10px 22px", borderRadius: "12px", fontSize: "14px", fontWeight: 600, cursor: current === 0 ? "default" : "pointer", opacity: current === 0 ? 0.35 : 1, background: "rgba(17,19,34,0.06)", border: "1px solid rgba(17,19,34,0.12)", color: "#111322" }}
        >
          Previous
        </button>

        {/* Question dots */}
        <div style={{ display: "flex", gap: "8px" }}>
          {QUESTIONS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{ width: "34px", height: "34px", borderRadius: "10px", fontSize: "13px", fontWeight: 700, cursor: "pointer", border: "none", outline: "none", transition: "all .15s",
                background: i === current ? "#2F45D8" : answers[i] !== null ? "rgba(106,112,133,0.15)" : "rgba(17,19,34,0.07)",
                color: i === current ? "#111322" : answers[i] !== null ? "#111322" : "rgba(17,19,34,0.45)",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {current < QUESTIONS.length - 1 ? (
          <button
            onClick={() => setCurrent(c => c + 1)}
            style={{ padding: "10px 22px", borderRadius: "12px", fontSize: "14px", fontWeight: 700, cursor: "pointer", background: "linear-gradient(135deg,#2F45D8,#2336B8)", border: "none", color: "#FFFFFF" }}
          >
            Next
          </button>
        ) : answered === QUESTIONS.length ? (
          <button
            onClick={handleSubmit}
            style={{ padding: "10px 22px", borderRadius: "12px", fontSize: "14px", fontWeight: 700, cursor: "pointer", background: "linear-gradient(135deg,#2F45D8,#2336B8)", border: "none", color: "#FFFFFF" }}
          >
            Submit
          </button>
        ) : (
          <button
            disabled
            style={{ padding: "10px 22px", borderRadius: "12px", fontSize: "14px", fontWeight: 700, cursor: "default", opacity: 0.35, background: "linear-gradient(135deg,#2F45D8,#2336B8)", border: "none", color: "#FFFFFF" }}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
