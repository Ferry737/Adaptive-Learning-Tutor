"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  MODE_CONFIG,
  PROGRESS_STORAGE_KEY,
  USER_STORAGE_KEY,
  createEmptyProgress,
  evaluateAnswer,
  parseDemoUser,
  parseLearningMode,
  parseProgress,
  questionsForSession,
  recordAttempt,
  type AnswerEvaluation,
  type DemoUser,
  type LearningProgress,
  type LearningQuestion,
} from "../../lib/demo-learning";

interface DiagnosticPageProps {
  searchParams?: {
    mode?: string | string[];
    review?: string | string[];
  };
}

interface SessionResult {
  question: LearningQuestion;
  answer: string;
  evaluation: AnswerEvaluation;
}

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default function DiagnosticPage({ searchParams }: DiagnosticPageProps) {
  const modeParam = firstParam(searchParams?.mode);
  const reviewParam = firstParam(searchParams?.review);
  const mode = parseLearningMode(modeParam);
  const config = MODE_CONFIG[mode];
  const reviewRequested = mode === "study" && reviewParam === "1";

  const [user, setUser] = useState<DemoUser | null>(null);
  const [progress, setProgress] =
    useState<LearningProgress>(createEmptyProgress);
  const [questions, setQuestions] = useState<LearningQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<AnswerEvaluation | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [results, setResults] = useState<SessionResult[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    setIsHydrated(false);
    const storedUser = parseDemoUser(localStorage.getItem(USER_STORAGE_KEY));

    if (!storedUser) {
      localStorage.removeItem(USER_STORAGE_KEY);
      const currentPath = `/diagnostic?mode=${mode}${reviewRequested ? "&review=1" : ""}`;
      window.location.replace(`/login?next=${encodeURIComponent(currentPath)}`);
      return;
    }

    const storedProgress = parseProgress(
      localStorage.getItem(PROGRESS_STORAGE_KEY),
    );
    const mistakeIds = reviewRequested
      ? storedProgress.mistakes.map((mistake) => mistake.questionId)
      : [];

    setUser(storedUser);
    setProgress(storedProgress);
    setQuestions(questionsForSession(mode, mistakeIds));
    setQuestionIndex(0);
    setAnswer("");
    setFeedback(null);
    setHintsUsed(0);
    setResults([]);
    setIsComplete(false);
    setStorageError("");
    setIsHydrated(true);
  }, [mode, reviewRequested]);

  const question = questions[questionIndex];
  const correctCount = useMemo(
    () => results.filter((result) => result.evaluation.correct).length,
    [results],
  );

  const persistAttempt = (evaluation: AnswerEvaluation) => {
    if (!question) return;

    const updatedProgress = recordAttempt(progress, {
      question,
      mode,
      answer,
      correct: evaluation.correct,
      hintsUsed,
    });

    setProgress(updatedProgress);
    try {
      localStorage.setItem(
        PROGRESS_STORAGE_KEY,
        JSON.stringify(updatedProgress),
      );
      setStorageError("");
    } catch {
      setStorageError(
        "Your answer was graded, but this browser could not save the updated progress.",
      );
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!question || !answer.trim() || feedback) return;

    const evaluation = evaluateAnswer(question, answer);
    persistAttempt(evaluation);
    setFeedback(evaluation);
  };

  const moveToNextQuestion = () => {
    if (!question || !feedback) return;

    const nextResults = [
      ...results,
      { question, answer, evaluation: feedback },
    ];
    setResults(nextResults);

    if (questionIndex >= questions.length - 1) {
      setIsComplete(true);
      return;
    }

    setQuestionIndex((current) => current + 1);
    setAnswer("");
    setFeedback(null);
    setHintsUsed(0);
  };

  const retryQuestion = () => {
    setAnswer("");
    setFeedback(null);
  };

  const revealHint = () => {
    if (!question || !config.allowHints) return;
    setHintsUsed((current) => Math.min(current + 1, question.hints.length));
  };

  const restartSession = () => {
    setQuestionIndex(0);
    setAnswer("");
    setFeedback(null);
    setHintsUsed(0);
    setResults([]);
    setIsComplete(false);
    setStorageError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const signOut = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    window.location.assign("/login");
  };

  if (!isHydrated || !user || questions.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 grid place-items-center px-4">
        <p className="text-slate-600" role="status">
          Preparing your session…
        </p>
      </main>
    );
  }

  if (isComplete) {
    const score =
      results.length === 0
        ? 0
        : Math.round((correctCount / results.length) * 100);

    return (
      <div className="min-h-screen bg-slate-50">
        <SessionNav user={user} onSignOut={signOut} />
        <main className="mx-auto max-w-4xl px-4 py-10">
          <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-700">
              {config.label} complete
            </p>
            <h1 className="text-3xl font-bold text-slate-950">
              You scored {correctCount} of {results.length}
            </h1>
            <p className="mt-3 text-lg text-slate-600">
              Session accuracy:{" "}
              <span className="font-bold text-slate-950">{score}%</span>
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={restartSession}
                className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                Repeat Session
              </button>
              <Link
                href="/"
                className="rounded-lg border border-slate-300 px-5 py-3 text-center font-semibold text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
              >
                Back to Dashboard
              </Link>
            </div>
          </section>

          <section
            aria-labelledby="review-results"
            className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2
              id="review-results"
              className="text-xl font-bold text-slate-950"
            >
              Answer review
            </h2>
            <div className="mt-4 space-y-4">
              {results.map((result, index) => (
                <article
                  key={`${result.question.id}-${index}`}
                  className={`rounded-xl border p-4 ${result.evaluation.correct ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {result.question.subject}
                      </p>
                      <h3 className="mt-1 font-semibold text-slate-950">
                        {result.question.prompt}
                      </h3>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${result.evaluation.correct ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}
                    >
                      {result.evaluation.correct ? "Correct" : "Review"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-700">
                    Your answer:{" "}
                    <span className="font-semibold">{result.answer}</span>
                  </p>
                  {!result.evaluation.correct && (
                    <p className="mt-1 text-sm text-slate-700">
                      Expected:{" "}
                      <span className="font-semibold">
                        {result.question.answerLabel}
                      </span>
                    </p>
                  )}
                  <p className="mt-2 text-sm text-slate-700">
                    {result.question.explanation}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }

  const progressPercentage = (questionIndex / questions.length) * 100;
  const isMockExam = mode === "mock-exam";
  const canRetry = Boolean(feedback && !feedback.correct && config.allowRetry);

  return (
    <div className="min-h-screen bg-slate-50">
      <SessionNav user={user} onSignOut={signOut} />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
        <header className="mb-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
                {config.label}
              </p>
              <h1 className="mt-1 text-3xl font-bold text-slate-950">
                {config.title}
              </h1>
              <p className="mt-2 max-w-2xl text-slate-600">
                {config.description}
              </p>
            </div>
            <Link
              href="/"
              className="text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              Change mode
            </Link>
          </div>
          {isMockExam && (
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
              This is a short, original practice set. It is not an official
              Multicheck exam.
            </p>
          )}
          {reviewRequested && progress.mistakes.length === 0 && (
            <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
              Your mistake notebook is clear, so this session uses the regular
              study set.
            </p>
          )}
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7">
            <div className="mb-2 flex justify-between text-sm text-slate-600">
              <span>
                Question {questionIndex + 1} of {questions.length}
              </span>
              <span>{question.subject}</span>
            </div>
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-slate-200"
              aria-hidden="true"
            >
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <fieldset disabled={Boolean(feedback)}>
              <legend className="text-2xl font-bold leading-snug text-slate-950">
                {question.prompt}
              </legend>

              {question.type === "multiple-choice" && question.options && (
                <div className="mt-6 space-y-3">
                  {question.options.map((option) => (
                    <label
                      key={option}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-colors ${answer === option ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-slate-400"} ${feedback ? "cursor-default" : ""}`}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={option}
                        checked={answer === option}
                        onChange={(event) => setAnswer(event.target.value)}
                        className="h-4 w-4 accent-blue-600"
                      />
                      <span className="font-medium text-slate-900">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === "calculation" && (
                <label className="mt-6 block">
                  <span className="sr-only">Your answer</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    placeholder="Enter your answer"
                    autoFocus
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-xl text-slate-950 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50"
                  />
                </label>
              )}
            </fieldset>

            {config.allowHints && !feedback && (
              <div className="mt-5">
                {hintsUsed > 0 && (
                  <div
                    className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"
                    role="status"
                  >
                    <p className="font-semibold">
                      Hint {hintsUsed} of {question.hints.length}
                    </p>
                    <p className="mt-1">{question.hints[hintsUsed - 1]}</p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={revealHint}
                  disabled={hintsUsed >= question.hints.length}
                  className="rounded-lg border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50 focus:outline-none focus:ring-4 focus:ring-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {hintsUsed === 0
                    ? "Show a hint"
                    : hintsUsed < question.hints.length
                      ? "Show another hint"
                      : "All hints shown"}
                </button>
              </div>
            )}

            {!feedback && (
              <button
                type="submit"
                disabled={!answer.trim()}
                className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                Submit Answer
              </button>
            )}
          </form>

          {feedback && (
            <div className="mt-6 space-y-4" aria-live="polite">
              {config.revealFeedback ? (
                <div
                  className={`rounded-xl border-2 p-5 ${feedback.correct ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}
                >
                  <h2
                    className={`text-xl font-bold ${feedback.correct ? "text-emerald-800" : "text-red-800"}`}
                  >
                    {feedback.correct ? "✓ " : "✕ "}
                    {feedback.title}
                  </h2>
                  <p className="mt-2 text-slate-800">{feedback.message}</p>
                  <p className="mt-2 text-sm text-slate-700">
                    {feedback.explanation}
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-blue-950">
                  <h2 className="font-bold">Answer saved</h2>
                  <p className="mt-1 text-sm">
                    Your result will be shown after the final question.
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                {canRetry && (
                  <button
                    type="button"
                    onClick={retryQuestion}
                    className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                  >
                    Try Again
                  </button>
                )}
                <button
                  type="button"
                  onClick={moveToNextQuestion}
                  className="flex-1 rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300"
                >
                  {questionIndex === questions.length - 1
                    ? "Finish Session"
                    : canRetry
                      ? "Continue Anyway"
                      : "Next Question"}
                </button>
              </div>
            </div>
          )}

          {storageError && (
            <p
              role="alert"
              className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
            >
              {storageError}
            </p>
          )}
        </section>

        {!isMockExam && progress.mistakes.length > 0 && (
          <section
            aria-labelledby="notebook-heading"
            className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2
                  id="notebook-heading"
                  className="text-xl font-bold text-slate-950"
                >
                  Mistake notebook
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {progress.mistakes.length} unresolved{" "}
                  {progress.mistakes.length === 1 ? "question" : "questions"}
                </p>
              </div>
              <Link
                href="/diagnostic?mode=study&review=1"
                className="text-sm font-semibold text-blue-700 hover:text-blue-900"
              >
                Review queue
              </Link>
            </div>
            <ul className="mt-4 space-y-3">
              {progress.mistakes.slice(0, 4).map((mistake) => (
                <li
                  key={mistake.questionId}
                  className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-slate-800"
                >
                  <p className="font-semibold text-slate-950">
                    {mistake.question}
                  </p>
                  <p className="mt-1">Last answer: {mistake.lastAnswer}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}

function SessionNav({
  user,
  onSignOut,
}: {
  user: DemoUser;
  onSignOut: () => void;
}) {
  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="font-bold text-slate-950">
          Adaptive Learning Tutor
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-slate-600 sm:inline">
            {user.name}
          </span>
          <button
            type="button"
            onClick={onSignOut}
            className="rounded-md px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
