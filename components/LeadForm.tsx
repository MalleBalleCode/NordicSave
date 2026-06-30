"use client";
import { useState, FormEvent } from "react";
type Status = "idle" | "submitting" | "success" | "error";
const FORMSPREE_URL = "https://formspree.io/f/xlgyelqy";
export default function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const response = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, email, phone }),
      });
      if (response.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }
  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-gain/30 bg-gain/[0.08] p-6 sm:p-8 text-center"
      >
        <p className="font-display font-semibold text-lg text-ink mb-1">
          Tack, {name || "du"}.
        </p>
        <p className="text-sm text-ink_soft">
          Vi hör av oss inom 1–2 arbetsdagar med nästa steg.
        </p>
      </div>
    );
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-line bg-white p-6 sm:p-8 shadow-[0_1px_2px_rgba(11,31,58,0.04),0_12px_32px_-12px_rgba(11,31,58,0.12)]"
    >
      <p className="font-display font-semibold text-xl text-ink tracking-tightest mb-1">
        Få din kostnadsanalys
      </p>
      <p className="text-sm text-muted mb-6">
        Inga förpliktelser. Du betalar bara om vi faktiskt sänker din kostnad.
      </p>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm text-ink_soft mb-1.5">
            Namn
          </label>
          <input
            id="name"
            type="text"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-ink focus:bg-white transition-colors"
            placeholder="Anna Andersson"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm text-ink_soft mb-1.5">
            E-post
          </label>
          <input
            id="email"
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-ink focus:bg-white transition-colors"
            placeholder="anna@exempel.se"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm text-ink_soft mb-1.5">
            Telefonnummer
          </label>
          <input
            id="phone"
            type="tel"
            name="phone"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-ink focus:bg-white transition-colors"
            placeholder="070-123 45 67"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 w-full rounded-xl bg-action px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-action/90 disabled:opacity-60"
      >
        {status === "submitting" ? "Skickar…" : "Kom igång gratis"}
      </button>
      {status === "error" && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          Något gick fel. Försök igen, eller mejla oss direkt på
          info@nordicsave.se.
        </p>
      )}
    </form>
  );
}
