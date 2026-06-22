"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Något gick fel. Försök igen.");
      setLoading(false);
      return;
    }
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      router.push("/login");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="border-b border-line bg-surface/80 backdrop-blur-sm">
        <div className="max-w-content mx-auto px-6 sm:px-8 h-16 flex items-center">
          <Link href="/" className="font-display font-bold text-lg tracking-tightest text-ink hover:text-action transition-colors">NordicSave</Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="font-display font-extrabold tracking-tightest text-ink text-3xl mb-2">Skapa konto</h1>
            <p className="text-sm text-muted">Har du redan ett konto? <Link href="/login" className="text-action font-medium hover:text-action/80 transition-colors">Logga in →</Link></p>
          </div>
          <form onSubmit={handleSubmit} className="rounded-2xl border border-line bg-white p-6 sm:p-8 shadow-[0_1px_2px_rgba(11,31,58,0.04),0_12px_32px_-12px_rgba(11,31,58,0.12)]">
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-gain/30 bg-gain/[0.08] px-3 py-1 text-xs font-medium text-gain_dark">Gratis att komma igång · Du betalar bara om vi lyckas</span>
            </div>
            {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm text-ink_soft mb-1.5">Namn</label>
                <input id="name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-ink focus:bg-white transition-colors" placeholder="Anna Andersson" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm text-ink_soft mb-1.5">E-post</label>
                <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-ink focus:bg-white transition-colors" placeholder="anna@exempel.se" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm text-ink_soft mb-1.5">Lösenord <span className="text-muted font-normal">(minst 8 tecken)</span></label>
                <input id="password" type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-ink focus:bg-white transition-colors" placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="mt-6 w-full rounded-xl bg-action px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-action/90 disabled:opacity-60">
              {loading ? "Skapar konto…" : "Skapa konto gratis"}
            </button>
            <p className="mt-4 text-center text-xs text-muted">Genom att skapa ett konto godkänner du våra <span className="text-ink_soft">villkor och vår integritetspolicy</span>.</p>
          </form>
        </div>
      </main>
    </div>
  );
}
