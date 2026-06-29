"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

const CATEGORIES = [
  { value: "bredband", label: "Bredband", placeholder: "t.ex. Telia, Bahnhof, Telenor" },
  { value: "streaming", label: "Streaming", placeholder: "t.ex. Netflix, Spotify, HBO Max" },
  { value: "mobilabonnemang", label: "Mobilabonnemang", placeholder: "t.ex. Comviq, Tele2, Halebop" },
];

const LOW_RATE = 0.18;
const HIGH_RATE = 0.32;

type Subscription = {
  id: string;
  category: string;
  provider: string;
  cost: number;
  contract_start: string | null;
  contract_end: string | null;
};

function formatSEK(n: number) {
  return Math.round(n).toLocaleString("sv-SE");
}

function formatDate(d: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("sv-SE", { year: "numeric", month: "short" });
}

export default function DashboardPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [category, setCategory] = useState("bredband");
  const [provider, setProvider] = useState("");
  const [cost, setCost] = useState("");
  const [contractStart, setContractStart] = useState("");
  const [contractEnd, setContractEnd] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const currentCategory = CATEGORIES.find((c) => c.value === category)!;

  useEffect(() => {
    fetch("/api/subscriptions")
      .then((r) => r.json())
      .then((d) => { setSubscriptions(d.subscriptions ?? []); setLoading(false); });
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSaving(true);
    const res = await fetch("/api/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, provider, cost, contract_start: contractStart || null, contract_end: contractEnd || null }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setFormError(data.error ?? "Något gick fel."); return; }
    setSubscriptions((prev) => [...prev, data.subscription]);
    setProvider(""); setCost(""); setContractStart(""); setContractEnd("");
    setFormOpen(false);
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/subscriptions/${id}`, { method: "DELETE" });
    if (res.ok) setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  }

  const totalCost = subscriptions.reduce((sum, s) => sum + s.cost, 0);
  const lowSaving = totalCost * LOW_RATE;
  const highSaving = totalCost * HIGH_RATE;

  const grouped = CATEGORIES.map((cat) => ({
    ...cat,
    items: subscriptions.filter((s) => s.category === cat.value),
  })).filter((g) => g.items.length > 0);

  const allSubscriptions = grouped.flatMap((group) =>
    group.items.map((s) => ({ data: s, groupLabel: group.label }))
  );

  const SubCard = ({ s, groupLabel }: { s: Subscription; groupLabel: string }) => (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-1">{groupLabel}</p>
          <p className="font-display font-semibold text-ink text-lg">{s.provider}</p>
        </div>
        <button onClick={() => handleDelete(s.id)} className="text-xs text-muted hover:text-red-500 transition-colors ml-2 mt-1">Ta bort</button>
      </div>
      <p className="font-display font-bold text-2xl text-ink tabnum mt-2">{formatSEK(s.cost)} <span className="text-sm font-normal text-muted">kr/mån</span></p>
      {(s.contract_start || s.contract_end) && (
        <p className="text-xs text-muted mt-2">Bindningstid: {formatDate(s.contract_start) ?? "?"} – {formatDate(s.contract_end) ?? "?"}</p>
      )}
    </div>
  );

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
            <p className="font-display font-bold text-3xl tracking-tightest text-gain_dark tabnum">{totalCost > 0 ? `${formatSEK(lowSaving)}–${formatSEK(highSaving)} kr` : "—"}</p>
          </div>
        </div>
        <div className="mb-6">
          <button onClick={() => setFormOpen((v) => !v)} className="inline-flex items-center gap-2 rounded-xl bg-action px-5 py-2.5 text-sm font-semibold text-white hover:bg-action/90 transition-colors">
            <span>{formOpen ? "−" : "+"}</span>
            <span>{formOpen ? "Stäng" : "Lägg till abonnemang"}</span>
          </button>
        </div>
        {loading ? (
          <p className="text-muted text-sm">Laddar…</p>
        ) : (
          <div className="space-y-8">
            {(formOpen || allSubscriptions.length > 0) && (
              <div className="grid sm:grid-cols-2 gap-4 items-start">
                <div className="flex flex-col gap-4">
                  {formOpen && (
                    <div className="rounded-2xl border border-action/30 bg-white p-6 shadow-[0_1px_2px_rgba(11,31,58,0.04),0_12px_32px_-12px_rgba(11,31,58,0.12)]">
                      <p className="font-display font-semibold text-lg text-ink tracking-tightest mb-4">Nytt abonnemang</p>
                      <form onSubmit={handleAdd} className="space-y-4">
                        {formError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div>}
                        <div>
                          <label className="block text-sm text-ink_soft mb-1.5">Kategori</label>
                          <select value={category} onChange={(e) => { setCategory(e.target.value); setProvider(""); }} className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-ink focus:bg-white transition-colors">
                            {CATEGORIES.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-ink_soft mb-1.5">Leverantör</label>
                          <input type="text" required value={provider} onChange={(e) => setProvider(e.target.value)} placeholder={currentCategory.placeholder} className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-ink focus:bg-white transition-colors" />
                        </div>
                        <div>
                          <label className="block text-sm text-ink_soft mb-1.5">Månadskostnad (kr)</label>
                          <input type="number" required min="0" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="t.ex. 399" className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-ink focus:bg-white transition-colors tabnum" />
                        </div>
                        <div>
                          <label className="block text-sm text-ink_soft mb-1.5">Bindningstid <span className="text-muted font-normal">(valfritt)</span></label>
                          <p className="text-xs text-muted mb-2">Den hittar du oftast på din faktura eller i operatörens app. Du kan även kontakta deras kundtjänst om du är osäker.</p>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-muted mb-1">Från</p>
                              <input type="date" value={contractStart} onChange={(e) => setContractStart(e.target.value)} className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink focus:bg-white transition-colors" />
                            </div>
                            <div>
                              <p className="text-xs text-muted mb-1">Till</p>
                              <input type="date" value={contractEnd} onChange={(e) => setContractEnd(e.target.value)} className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink focus:bg-white transition-colors" />
                            </div>
                          </div>
                        </div>
                        <button type="submit" disabled={saving} className="w-full rounded-xl bg-action px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-action/90 disabled:opacity-60">{saving ? "Sparar…" : "Lägg till"}</button>
                      </form>
                    </div>
                  )}
                  {allSubscriptions.filter((_, i) => i % 2 === 0).map(({ data: s, groupLabel }) => (
                    <SubCard key={s.id} s={s} groupLabel={groupLabel} />
                  ))}
                </div>
                <div className="flex flex-col gap-4">
                  {allSubscriptions.filter((_, i) => i % 2 === 1).map(({ data: s, groupLabel }) => (
                    <SubCard key={s.id} s={s} groupLabel={groupLabel} />
                  ))}
                </div>
              </div>
            )}
            {allSubscriptions.length === 0 && !formOpen && (
              <div className="rounded-2xl border-2 border-dashed border-line p-10 text-center max-w-lg">
                <p className="font-display font-semibold text-ink text-lg mb-2">Inga abonnemang ännu</p>
                <p className="text-sm text-muted">Klicka på "Lägg till abonnemang" ovan för att komma igång.</p>
              </div>
            )}
            {subscriptions.length > 0 && (
              <div className="flex items-center justify-between rounded-2xl border border-ink/10 bg-ink/[0.03] px-5 py-4">
                <p className="font-medium text-ink">Totalt per månad</p>
                <p className="font-display font-bold text-ink tabnum">{formatSEK(totalCost)} kr/mån</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
