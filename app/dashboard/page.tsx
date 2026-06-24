"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

const CATEGORIES = [
  { value: "bredband", label: "Bredband" },
  { value: "streaming", label: "Streaming" },
  { value: "mobilabonnemang", label: "Mobilabonnemang" },
  { value: "annat", label: "Annat" },
];

const LOW_RATE = 0.18;
const HIGH_RATE = 0.32;

type Subscription = {
  id: string;
  category: string;
  provider: string;
  cost: number;
};

function formatSEK(n: number) {
  return Math.round(n).toLocaleString("sv-SE");
}

export default function DashboardPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("bredband");
  const [provider, setProvider] = useState("");
  const [cost, setCost] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/subscriptions")
      .then((r) => r.json())
      .then((d) => {
        setSubscriptions(d.subscriptions ?? []);
        setLoading(false);
      });
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSaving(true);
    const res = await fetch("/api/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, provider, cost }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setFormError(data.error ?? "Något gick fel.");
      return;
    }
    setSubscriptions((prev) => [...prev, data.subscription]);
    setProvider("");
    setCost("");
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/subscriptions/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    }
  }

  const totalCost = subscriptions.reduce((sum, s) => sum + s.cost, 0);
  const lowSaving = totalCost * LOW_RATE;
  const highSaving = totalCost * HIGH_RATE;
  const categoryLabel = (value: string) => CATEGORIES.find((c) => c.value === value)?.label ?? value;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="border-b border-line bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-content mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-display font-bold text-lg tracking-tightest text-ink hover:text-action transition-colors">NordicSave</Link>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="text-sm font-medium text-muted hover:text-ink transition-colors">Logga ut</button>
        </div>
      </header>
      <main className="flex-1 max-w-content mx-auto w-full px-6 sm:px-8 py-12">
        <div className="mb-10">
          <h1 className="font-display font-extrabold tracking-tightest text-ink text-3xl sm:text-4xl mb-2">Mina abonnemang</h1>
          <p className="text-ink_soft">Lägg till dina nuvarande abonnemang så beräknar vi vad du kan spara.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="rounded-2xl border border-line bg-white p-6">
            <p className="text-xs font-medium text-muted uppercase tracking-widest mb-2">Aktiva abonnemang</p>
            <p className="font-display font-bold text-3xl tracking-tightest text-ink tabnum">{subscriptions.length}</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-6">
            <p className="text-xs font-medium text-muted uppercase tracking-widest mb-2">Månadskostnad</p>
            <p className="font-display font-bold text-3xl tracking-tightest text-ink tabnum">{formatSEK(totalCost)} kr</p>
          </div>
          <div className="rounded-2xl border border-gain/20 bg-gain/[0.07] p-6">
            <p className="text-xs font-medium text-muted uppercase tracking-widest mb-2">Möjlig besparing / mån</p>
            <p className="font-display font-bold text-3xl tracking-tightest text-gain_dark tabnum">
              {totalCost > 0 ? `${formatSEK(lowSaving)}–${formatSEK(highSaving)} kr` : "—"}
            </p>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-line bg-white p-6 sm:p-8 shadow-[0_1px_2px_rgba(11,31,58,0.04),0_12px_32px_-12px_rgba(11,31,58,0.12)]">
            <p className="font-display font-semibold text-xl text-ink tracking-tightest mb-6">Lägg till abonnemang</p>
            <form onSubmit={handleAdd} className="space-y-4">
              {formError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div>}
              <div>
                <label className="block text-sm text-ink_soft mb-1.5">Kategori</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-ink focus:bg-white transition-colors">
                  {CATEGORIES.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-ink_soft mb-1.5">Leverantör</label>
                <input type="text" required value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="t.ex. Telia, Netflix, Comviq" className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-ink focus:bg-white transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-ink_soft mb-1.5">Månadskostnad (kr)</label>
                <input type="number" required min="0" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="t.ex. 399" className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-ink focus:bg-white transition-colors tabnum" />
              </div>
              <button type="submit" disabled={saving} className="w-full rounded-xl bg-action px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-action/90 disabled:opacity-60">
                {saving ? "Sparar…" : "Lägg till"}
              </button>
            </form>
          </div>
          <div>
            {loading ? (
              <p className="text-muted text-sm">Laddar…</p>
            ) : subscriptions.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-line p-10 text-center">
                <p className="font-display font-semibold text-ink text-lg mb-2">Inga abonnemang ännu</p>
                <p className="text-sm text-muted">Lägg till ditt första abonnemang till vänster.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {subscriptions.map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-2xl border border-line bg-white px-5 py-4">
                    <div>
                      <p className="font-medium text-ink">{s.provider}</p>
                      <p className="text-xs text-muted mt-0.5">{categoryLabel(s.category)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-display font-semibold text-ink tabnum">{formatSEK(s.cost)} kr/mån</p>
                      <button onClick={() => handleDelete(s.id)} className="text-xs text-muted hover:text-red-500 transition-colors" aria-label={`Ta bort ${s.provider}`}>Ta bort</button>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between rounded-2xl border border-ink/10 bg-ink/[0.03] px-5 py-4">
                  <p className="font-medium text-ink">Totalt per månad</p>
                  <p className="font-display font-bold text-ink tabnum">{formatSEK(totalCost)} kr/mån</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
