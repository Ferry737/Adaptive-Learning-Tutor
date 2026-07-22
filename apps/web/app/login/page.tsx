"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  DEMO_CREDENTIALS,
  USER_STORAGE_KEY,
  authenticateDemoUser,
} from "../../lib/demo-learning";

interface LoginPageProps {
  searchParams?: {
    next?: string | string[];
  };
}

function safeNextPath(value: string | string[] | undefined): string {
  const nextPath = Array.isArray(value) ? value[0] : value;
  return nextPath?.startsWith("/") && !nextPath.startsWith("//")
    ? nextPath
    : "/";
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const user = authenticateDemoUser(email, password);
    if (!user) {
      setError(
        "Those demo credentials do not match. Use the account shown below.",
      );
      setIsSubmitting(false);
      return;
    }

    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      window.location.assign(safeNextPath(searchParams?.next));
    } catch {
      setError(
        "This browser blocked local storage, so the demo session could not be started.",
      );
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setError("");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-white bg-white p-8 shadow-xl">
        <div className="mb-7 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
            Local demo account
          </p>
          <h1 className="mb-2 text-3xl font-bold text-slate-950">
            Adaptive Learning Tutor
          </h1>
          <p className="text-slate-600">Swiss apprenticeship preparation</p>
        </div>

        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          This is browser-local demo authentication. It is not a secure
          production account system.
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-950 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              placeholder={DEMO_CREDENTIALS.email}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-950 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              placeholder="Enter the demo password"
              required
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !email || !password}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? "Starting session…" : "Sign In"}
          </button>
        </form>

        <div className="mt-6 rounded-lg bg-slate-100 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Demo credentials</p>
          <p className="mt-1 font-mono">{DEMO_CREDENTIALS.email}</p>
          <p className="font-mono">{DEMO_CREDENTIALS.password}</p>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="mt-3 text-sm font-semibold text-blue-700 hover:text-blue-900 focus:outline-none focus:underline"
          >
            Fill demo credentials
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          <Link
            href="/"
            className="font-semibold text-blue-700 hover:text-blue-900"
          >
            Back to home
          </Link>
        </p>
      </section>
    </main>
  );
}
