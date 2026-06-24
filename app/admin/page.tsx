"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

type Subscription = {
  id: string;
  category: string;
  provider: string;
  cost: number;
};

type User = {
  id: string;
  name: string | null;
  email: string;
  created_at: string;
  subscriptions: Subscription[];
  total_cost: number;
};

const CATEGORY_LABELS: Record<string, string> = {
  bredband: "Bredband",
  streaming: "Streaming",
  mobilabonnemang: "Mobilabonnemang",
  annat: "Annat",
};

function formatSEK(n: number) {
  return Math.round(n).toLocaleString("sv-SE");
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          setError(d.error);
        } else {
          setUsers(d.users ?? []);
        }
        setLoading(false);
      });
  }, []);

  const totalUsers = users.length;
  const totalRevenue = users.reduce((sum, u) => sum + Number(u.total_cost), 0);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="border-b border-line bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-content mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-display font-bold text-lg tracking-tightest text-ink hover:text-action transition-colors">
              NordicSave
            </Link>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted border border-line rounded-full px-3 py-1">Admin</span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm font-medium text-muted hover:text-ink transition-colors"
          >
            Logga ut
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-content mx-auto w-full px-6 sm:px-8 py-12">
        <div className="mb-10">
          <h1 className="font-display font-extrabold tracking-tightest text-ink text-3xl sm:text-4xl mb-2">Adminpanel</h1>
          <p className="text-ink_soft">Översikt över alla kunder och deras abonnemang.</p>
        </div>

        {loading && <p className="text-muted text-sm">Laddar…</p>}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-red-700">
            {error === "Åtkomst nekad." ? "Du har inte adminbehörighet." : error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Sammanfattning */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              <div className="rounded-2xl border border-line bg-white p-6">
                <p className="text-xs font-medium text-muted uppercase tracking-widest mb-2">Antal kunder</p>
                <p className="font-display font-bold text-3xl tracking-tightest text-ink tabnum">{totalUsers}</p>
              </div>
              <div className="rounded-2xl border border-gain/20 bg-gain/[0.07] p-6">
                <p className="text-xs font-medium text-muted uppercase tracking-widest mb-2">Total månadskostnad (alla kunder)</p>
                <p className="font-display font-bold text-3xl tracking-tightest text-gain_dark tabnum">{formatSEK(totalRevenue)} kr</p>
              </div>
            </div>

            {/* Kundlista */}
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="rounded-2xl border border-line bg-white p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-display font-semibold text-ink text-lg">{user.name ?? "Inget namn"}</p>
                      <p className="text-sm text-muted">{user.email}</p>
                      <p className="text-xs text-muted mt-1">
                        Registrerad {new Date(user.created_at).toLocaleDateString("sv-SE")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted uppercase tracking-widest mb-1">Totalt/mån</p>
                      <p className="font-display font-bold text-xl text-ink tabnum">{formatSEK(Number(user.total_cost))} kr</p>
                    </div>
                  </div>

                  {user.subscriptions.length === 0 ? (
                    <p className="text-sm text-muted italic">Inga abonnemang tillagda.</p>
                  ) : (
                    <div className="border-t border-line pt-4 space-y-2">
                      {user.subscriptions.map((s) => (
                        <div key={s.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-3">
                            <span className="inline-block rounded-full bg-action/10 text-action px-2.5 py-0.5 text-xs font-medium">
                              {CATEGORY_LABELS[s.category] ?? s.category}
                            </span>
                            <span className="text-ink">{s.provider}</span>
                          </div>
                          <span className="text-ink font-medium tabnum">{formatSEK(s.cost)} kr/mån</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
