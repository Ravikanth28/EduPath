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

const PASSING_SCORE = 70;

export default function TestPage() {
  const params = useParams();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(QUESTIONS.map(() => null));
  const [submitted, setSubmitted] = useState(false);

  const answered = answers.filter(a => a !== null).length;
  const score = submitted ? Math.round((answers.filter((a, i) => a === QUESTIONS[i].correct).length / QUESTIONS.length) * 100) : 0;
  const passed = score >= PASSING_SCORE;

  const handleSubmit = () => {
    if (answered < QUESTIONS.length) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-5">
        <Link href={`/dashboard/courses/${params.courseId}`} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
          <ArrowLeft size={16} /> Back to Course
        </Link>

        {/* Score card */}
        <div className={`glass-card p-8 text-center border ${passed ? "border-green-500/20" : "border-red-500/20"}`}>
          {passed ? <Trophy size={48} className="text-amber-400 mx-auto mb-4" /> : <XCircle size={48} className="text-red-400 mx-auto mb-4" />}
          <p className="text-6xl font-black gradient-text mb-2">{score}%</p>
          <p className={`text-xl font-bold mb-2 ${passed ? "text-green-400" : "text-red-400"}`}>{passed ? "Passed!" : "Not Passed"}</p>
          <p className="text-white/50 text-sm mb-4">{answers.filter((a, i) => a === QUESTIONS[i].correct).length} / {QUESTIONS.length} correct · Passing score: {PASSING_SCORE}%</p>
          {passed && <span className="badge-green">Certificate Earned!</span>}
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            <Link href={`/dashboard/courses/${params.courseId}`} className="btn-secondary px-5 py-2.5 text-sm">Back to Course</Link>
            {passed && <Link href="/dashboard/certificates" className="btn-primary px-5 py-2.5 text-sm">View Certificate</Link>}
            {!passed && <button onClick={() => { setSubmitted(false); setAnswers(QUESTIONS.map(() => null)); setCurrent(0); }} className="btn-primary px-5 py-2.5 text-sm">Try Again</button>}
          </div>
        </div>

        {/* Review */}
        <div className="space-y-3">
          {QUESTIONS.map((q, i) => {
            const isCorrect = answers[i] === q.correct;
            return (
              <div key={i} className={`glass-card p-4 border ${isCorrect ? "border-green-500/15" : "border-red-500/15"}`}>
                <div className="flex items-start gap-3">
                  {isCorrect ? <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" /> : <XCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />}
                  <div>
                    <p className="text-sm text-white font-medium mb-2">Q{i + 1}. {q.q}</p>
                    <p className="text-xs text-green-400 mb-1">✓ {q.opts[q.correct]}</p>
                    {!isCorrect && answers[i] !== null && <p className="text-xs text-red-400 mb-1">✗ {q.opts[answers[i]!]}</p>}
                    <p className="text-xs text-white/40">{q.exp}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={`/dashboard/courses/${params.courseId}`} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="text-xs text-white/40">Module Test</p>
          <h1 className="font-bold text-white">Linear Regression</h1>
        </div>
      </div>

      {/* Progress */}
      <div className="glass-card p-4 flex items-center gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{current + 1}</p>
          <p className="text-xs text-white/40">of {QUESTIONS.length}</p>
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-xs text-white/50 mb-1"><span>Answered: {answered}/{QUESTIONS.length}</span></div>
          <div className="h-2 rounded-full bg-white/[0.06]">
            <div className="h-full rounded-full transition-all" style={{ width: `${(answered / QUESTIONS.length) * 100}%`, background: "linear-gradient(90deg, #7C3AED, #22D3EE)" }} />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-start gap-3">
          <span className="badge-purple flex-shrink-0">Q{current + 1}</span>
          <p className="text-white font-medium leading-relaxed">{QUESTIONS[current].q}</p>
        </div>
        <div className="space-y-2">
          {QUESTIONS[current].opts.map((opt, i) => (
            <button
              key={i}
              onClick={() => setAnswers(a => { const n = [...a]; n[current] = i; return n; })}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition-all ${answers[current] === i ? "border-purple-500/60 bg-purple-500/10 text-purple-300" : "border-white/[0.08] text-white/70 hover:border-white/20 hover:bg-white/[0.04]"}`}
            >
              <span className="font-bold mr-3 text-white/40">{["A", "B", "C", "D"][i]}.</span>{opt}
            </button>
          ))}
        </div>
      </div>

      {/* Nav */}
      {answered < QUESTIONS.length && current === QUESTIONS.length - 1 && (
        <div className="glass-card p-4 flex items-center gap-3 border border-amber-500/20 bg-amber-500/5">
          <AlertCircle size={16} className="text-amber-400 flex-shrink-0" />
          <p className="text-sm text-amber-400">{QUESTIONS.length - answered} question{QUESTIONS.length - answered !== 1 ? "s" : ""} unanswered.</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0} className="btn-secondary px-5 py-2.5 text-sm disabled:opacity-40">Previous</button>
        <div className="flex gap-1.5">
          {QUESTIONS.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${i === current ? "bg-purple-600 text-white" : answers[i] !== null ? "bg-green-500/20 text-green-400" : "bg-white/[0.06] text-white/40"}`}>
              {i + 1}
            </button>
          ))}
        </div>
        {current < QUESTIONS.length - 1 ? (
          <button onClick={() => setCurrent(c => c + 1)} className="btn-primary px-5 py-2.5 text-sm">Next</button>
        ) : answered === QUESTIONS.length ? (
          <button onClick={handleSubmit} className="btn-primary px-5 py-2.5 text-sm">Submit</button>
        ) : (
          <button disabled className="btn-primary px-5 py-2.5 text-sm opacity-40">Submit</button>
        )}
      </div>
    </div>
  );
}
