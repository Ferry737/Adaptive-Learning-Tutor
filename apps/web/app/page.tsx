"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  PROGRESS_STORAGE_KEY,
  USER_STORAGE_KEY,
  createEmptyProgress,
  getProgressStats,
  parseDemoUser,
  parseProgress,
  type DemoUser,
  type LearningProgress,
} from "../lib/demo-learning";

const learningModes = [
  {
    href: "/diagnostic?mode=diagnostic",
    title: "Start Diagnostic",
    description: "Six mixed questions to establish a baseline.",
    className:
      "border-blue-200 bg-blue-50 text-blue-950 hover:border-blue-400 hover:bg-blue-100",
  },
  {
    href: "/diagnostic?mode=study",
    title: "Study Mode",
    description: "Guided questions with progressive hints and explanations.",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-950 hover:border-emerald-400 hover:bg-emerald-100",
  },
  {
    href: "/diagnostic?mode=practice",
    title: "Practice Mode",
    description: "A complete mixed set with immediate feedback.",
    className:
      "border-violet-200 bg-violet-50 text-violet-950 hover:border-violet-400 hover:bg-violet-100",
  },
  {
    href: "/diagnostic?mode=mock-exam",
    title: "Take Mock Exam",
    description: "Eight original questions with results held until the end.",
    className:
      "border-amber-200 bg-amber-50 text-amber-950 hover:border-amber-400 hover:bg-amber-100",
  },
];

export default function HomePage() {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [progress, setProgress] =
    useState<LearningProgress>(createEmptyProgress);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedUser = parseDemoUser(localStorage.getItem(USER_STORAGE_KEY));
    if (!storedUser) {
      localStorage.removeItem(USER_STORAGE_KEY);
    }

    setUser(storedUser);
    setProgress(parseProgress(localStorage.getItem(PROGRESS_STORAGE_KEY)));
    setIsHydrated(true);
  }, []);

  const stats = useMemo(() => getProgressStats(progress), [progress]);

  const signOut = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
    window.location.assign("/login");
  };

  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-slate-50 grid place-items-center px-4">
        <p className="text-slate-600" role="status">
          Loading your learning dashboard…
        </p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <section className="max-w-md w-full rounded-2xl border border-white bg-white p-8 text-center shadow-xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
            Local demo
          </p>
          <h1 className="mb-4 text-3xl font-bold text-slate-950">
            Adaptive Learning Tutor
          </h1>
          <p className="mb-7 text-slate-600">
            Sign in to start a diagnostic, guided study session, practice set,
            or short mock exam.
          </p>
          <Link
            href="/login"
            className="block w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            Sign In
          </Link>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
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
              onClick={signOut}
              className="rounded-md px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
        <section className="mb-8 rounded-2xl bg-slate-950 p-7 text-white shadow-lg sm:p-9">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-300">
            Your learning space
          </p>
          <h1 className="mb-3 text-3xl font-bold sm:text-4xl">
            Welcome back, {user.name}
          </h1>
          <p className="max-w-2xl text-slate-300">
            Choose a mode below. Every answer updates your accuracy and review
            queue on this device.
          </p>
        </section>

        <section aria-labelledby="mode-heading" className="mb-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2
                id="mode-heading"
                className="text-2xl font-bold text-slate-950"
              >
                Choose a session
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Each mode has distinct hint, retry, and feedback rules.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {learningModes.map((mode) => (
              <Link
                key={mode.href}
                href={mode.href}
                className={`rounded-xl border-2 p-5 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-200 ${mode.className}`}
              >
                <span className="block text-lg font-bold">{mode.title}</span>
                <span className="mt-1 block text-sm opacity-80">
                  {mode.description}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section
          aria-label="Learning statistics"
          className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-3xl font-bold text-blue-700">{stats.attempts}</p>
            <p className="mt-1 text-sm text-slate-600">Answers submitted</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-3xl font-bold text-emerald-700">
              {stats.accuracy}%
            </p>
            <p className="mt-1 text-sm text-slate-600">Attempt accuracy</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-3xl font-bold text-amber-700">
              {stats.openMistakes}
            </p>
            <p className="mt-1 text-sm text-slate-600">Open mistakes</p>
          </div>
        </section>

        {progress.mistakes.length > 0 && (
          <section
            aria-labelledby="review-heading"
            className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-6"
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2
                  id="review-heading"
                  className="text-xl font-bold text-amber-950"
                >
                  Mistake notebook
                </h2>
                <p className="mt-1 text-sm text-amber-900">
                  Review unresolved questions. A correct answer removes the item
                  from this queue.
                </p>
              </div>
              <Link
                href="/diagnostic?mode=study&review=1"
                className="shrink-0 rounded-lg bg-amber-700 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-amber-800 focus:outline-none focus:ring-4 focus:ring-amber-200"
              >
                Review mistakes
              </Link>
            </div>
            <ul className="mt-4 space-y-2">
              {progress.mistakes.slice(0, 3).map((mistake) => (
                <li
                  key={mistake.questionId}
                  className="rounded-lg bg-white/80 px-4 py-3 text-sm text-amber-950"
                >
                  <span className="font-semibold">{mistake.subject}:</span>{" "}
                  {mistake.question}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h2 className="mb-3 font-bold text-blue-950">Learning tips</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-blue-900">
            <li>Try each question before opening a hint.</li>
            <li>
              Use Study Mode when a topic is new and Practice Mode when it feels
              familiar.
            </li>
            <li>
              Return to the mistake notebook until every item is resolved.
            </li>
            <li>Take a short break between sessions to support retention.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
