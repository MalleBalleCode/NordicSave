// app/dashboard/page.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ─── Typer ───────────────────────────────────────────────────────────────────

type Subscription = {
  id: string;
  category: "bredband" | "streaming" | "mobilabonnemang";
  provider: string;
  cost: number;
  contract_start: string;
  contract_end: string;
  created_at: string;
};

type FormState = {
  category: Subscription["category"];
  provider: string;
  cost: string;
  contract_start: string;
  contract_end: string;
};

const EMPTY_FORM: FormState = {
  category: "bredband",
  provider: "",
  cost: "",
  contract_start: "",
  contract_end: "",
};

// ─── Hjälpfunktioner ─────────────────────────────────────────────────────────

function categoryLabel(cat: Subscription["category"]) {
  return { bredband: "Bredband", streaming: "Streaming", mobilabonnemang: "Mobilabonnemang" }[cat];
}

function categoryColor(cat: Subscription["category"]) {
  return {
    bredband: "#2E6DA4",
    streaming: "#1FA67D",
    mobilabonnemang: "#6B7280",
  }[cat];
}

function formatDate(dateStr: string) {
  if (!dateStr) return "–";
  return new Date(dateStr).toLocaleDateString("sv-SE");
}

// ─── Komponenter ─────────────────────────────────────────────────────────────

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #E2E8F1",
        borderRadius: "12px",
        padding: "24px",
        breakInside: "avoid",
        marginBottom: "20px",
        display: "inline-block",
        width: "100%",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 600,
        color: "#fff",
        background: color,
        marginBottom: "12px",
      }}
    >
      {label}
    </span>
  );
}

// ─── Huvudkomponent ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/subscriptions")
      .then((r) => r.json())
      .then((data) => {
        setSubscriptions(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Kunde inte hämta abonnemang.");
        setLoading(false);
      });
  }, [status]);

  async function handleAdd() {
    setError("");
    if (!form.provider || !form.cost) {
      setError("Fyll i leverantör och kostnad.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, cost: parseFloat(form.cost) }),
      });
      if (!res.ok) throw new Error();
      const newSub = await res.json();
      setSubscriptions((prev) => [newSub, ...prev]);
      setForm(EMPTY_FORM);
    } catch {
      setError("Kunde inte spara abonnemanget. Försök igen.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/subscriptions/${id}`, { method: "DELETE" });
      setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setError("Kunde inte ta bort abonnemanget.");
    }
  }

  if (status === "loading" || loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#F7F9FC", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#6B7280", fontFamily: "system-ui, sans-serif" }}>Laddar…</p>
      </div>
    );
  }

  const totalCost = subscriptions.reduce((sum, s) => sum + (s.cost || 0), 0);

  return (
    <div style={{ minHeight: "100vh", background: "#F7F9FC", fontFamily: "system-ui, -apple-system, sans-serif" }}>

      {/* ── Topbar ── */}
      <header style={{
        background: "#0B1F3A",
        padding: "0 24px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: "18px", letterSpacing: "-0.3px" }}>
          NordicSave
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "#E2E8F1", fontSize: "14px" }}>
            {session?.user?.email}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{
              background: "transparent",
              border: "1px solid #E2E8F1",
              borderRadius: "6px",
              color: "#E2E8F1",
              padding: "6px 14px",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Logga ut
          </button>
        </div>
      </header>

      {/* ── Innehåll ── */}
      <main style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 20px" }}>

        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: "#0B1F3A" }}>
            Mina abonnemang
          </h1>
          <p style={{ margin: "6px 0 0", color: "#6B7280", fontSize: "14px" }}>
            {subscriptions.length} abonnemang · Total kostnad{" "}
            <strong style={{ color: "#0B1F3A" }}>{totalCost.toFixed(0)} kr/mån</strong>
          </p>
        </div>

        {error && (
          <div style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: "8px",
            padding: "12px 16px",
            color: "#B91C1C",
            fontSize: "14px",
            marginBottom: "20px",
          }}>
            {error}
          </div>
        )}

        <div style={{
          columns: "2",
          columnGap: "20px",
        }}>

          {/* ── Formulärkort ── */}
          <Card>
            <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600, color: "#0B1F3A" }}>
              Lägg till abonnemang
            </h2>

            <label style={labelStyle}>Kategori</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as Subscription["category"] })}
              style={inputStyle}
            >
              <option value="bredband">Bredband</option>
              <option value="streaming">Streaming</option>
              <option value="mobilabonnemang">Mobilabonnemang</option>
            </select>

            <label style={labelStyle}>Leverantör</label>
            <input
              type="text"
              placeholder="t.ex. Telia, Netflix"
              value={form.provider}
              onChange={(e) => setForm({ ...form, provider: e.target.value })}
              style={inputStyle}
            />

            <label style={labelStyle}>Kostnad (kr/mån)</label>
            <input
              type="number"
              placeholder="399"
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: e.target.value })}
              style={inputStyle}
            />

            <label style={labelStyle}>Avtalets start</label>
            <input
              type="date"
              value={form.contract_start}
              onChange={(e) => setForm({ ...form, contract_start: e.target.value })}
              style={inputStyle}
            />

            <label style={labelStyle}>Avtalets slut</label>
            <input
              type="date"
              value={form.contract_end}
              onChange={(e) => setForm({ ...form, contract_end: e.target.value })}
              style={inputStyle}
            />

            <button
              onClick={handleAdd}
              disabled={saving}
              style={{
                marginTop: "4px",
                width: "100%",
                background: saving ? "#93b9d8" : "#2E6DA4",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "11px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Sparar…" : "Lägg till"}
            </button>
          </Card>

          {/* ── Abonnemangskort ── */}
          {subscriptions.length === 0 ? (
            <Card>
              <p style={{ color: "#6B7280", fontSize: "14px", margin: 0 }}>
                Inga abonnemang registrerade än. Fyll i formuläret till vänster för att börja.
              </p>
            </Card>
          ) : (
            subscriptions.map((sub) => (
              <Card key={sub.id}>
                <Badge label={categoryLabel(sub.category)} color={categoryColor(sub.category)} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: "16px", color: "#0B1F3A" }}>
                      {sub.provider}
                    </p>
                    <p style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#1FA67D" }}>
                      {sub.cost} <span style={{ fontSize: "13px", fontWeight: 400, color: "#6B7280" }}>kr/mån</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(sub.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#6B7280",
                      fontSize: "18px",
                      cursor: "pointer",
                      padding: "0",
                      lineHeight: 1,
                    }}
                    title="Ta bort"
                  >
                    ×
                  </button>
                </div>
                {(sub.contract_start || sub.contract_end) && (
                  <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #E2E8F1" }}>
                    <p style={{ margin: 0, fontSize: "12px", color: "#6B7280" }}>
                      {sub.contract_start && <>Från {formatDate(sub.contract_start)}</>}
                      {sub.contract_start && sub.contract_end && " · "}
                      {sub.contract_end && <>Till {formatDate(sub.contract_end)}</>}
                    </p>
                  </div>
                )}
              </Card>
            ))
          )}

        </div>
      </main>
    </div>
  );
}

// ── Delade stilar ─────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 500,
  color: "#0B1F3A",
  marginBottom: "4px",
  marginTop: "12px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  border: "1px solid #E2E8F1",
  borderRadius: "7px",
  fontSize: "14px",
  color: "#0B1F3A",
  background: "#F7F9FC",
  boxSizing: "border-box",
  outline: "none",
};