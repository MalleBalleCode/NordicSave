// app/login/page.tsx
//
// Inloggningssida. Designad med NordicSaves tokens (ink, action, surface etc.)
// och samma typografi som landningssidan (Inter Tight display, Inter body).
//
// Efter lyckad inloggning skickar NextAuth användaren till /dashboard
// (eller callbackUrl om de kom hit från en skyddad sida).

"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

// Error-meddelandena från NextAuth är engelska koder – vi översätter dem.
const ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: "Fel e-post eller lösenord.",
  Default: "Något gick fel. Försök igen.",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    urlError ? (ERROR_MESSAGES[urlError] ?? ERROR_MESSAGES.Default) : null
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // signIn() från next-auth/react anropar /api/auth/callback/credentials
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Vi hanterar redirect manuellt
    });

    setLoading(false);

    if (result?.error) {
      setError(ERROR_MESSAGES[result.error] ?? ERROR_MESSAGES.Default);
      return;
    }

    // Lyckat! Skicka vidare.
    router.push(callbackUrl);
    router.refresh(); // Uppdaterar Server Components som läser sessionen
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Nav */}
      <header className="border-b border-line bg-surface/80 backdrop-blur-sm">
        <div className="max-w-content mx-auto px-6 sm:px-8 h-16 flex items-center">
          <Link
            href="/"
            className="font-display font-bold text-lg tracking-tightest text-ink hover:text-action transition-colors"
          >
            NordicSave
          </Link>
        </div>
      </header>

      {/* Centrerat formulär */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          {/* Rubrik */}
          <div className="mb-8">
            <h1 className="font-display font-extrabold tracking-tightest text-ink text-3xl mb-2">
              Logga in
            </h1>
            <p className="text-sm text-muted">
              Inget konto?{" "}
              <Link
                href="/register"
                className="text-action font-medium hover:text-action/80 transition-colors"
              >
                Skapa ett gratis →
              </Link>
            </p>
          </div>

          {/* Formulärkort */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-line bg-white p-6 sm:p-8 shadow-[0_1px_2px_rgba(11,31,58,0.04),0_12px_32px_-12px_rgba(11,31,58,0.12)]"
          >
            {/* Felmeddelande */}
            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm text-ink_soft mb-1.5"
                >
                  E-post
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-ink focus:bg-white transition-colors"
                  placeholder="anna@exempel.se"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm text-ink_soft">
                    Lösenord
                  </label>
                  {/* Plats för "Glömt lösenord?" i Fas 3 */}
                </div>
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-ink focus:bg-white transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-action px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-action/90 disabled:opacity-60"
            >
              {loading ? "Loggar in…" : "Logga in"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

// Suspense krävs för useSearchParams() i Next.js App Router
export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
