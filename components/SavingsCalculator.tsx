"use client";

import { useMemo, useState } from "react";

// Enkel, transparent uppskattningsmodell: branschsnittet visar att hushåll
// typiskt kan sänka bredband + streaming med 18–32% genom omförhandling/byte.
// Vi visar ett konservativt spann, inte ett skarpt löfte.
const LOW_RATE = 0.18;
const HIGH_RATE = 0.32;

function formatSEK(value: number): string {
  return Math.round(value).toLocaleString("sv-SE");
}

export default function SavingsCalculator() {
  const [monthlyCost, setMonthlyCost] = useState<string>("799");

  const parsed = useMemo(() => {
    const n = parseInt(monthlyCost.replace(/[^\d]/g, ""), 10);
    return Number.isFinite(n) ? n : 0;
  }, [monthlyCost]);

  const lowSaving = parsed * LOW_RATE;
  const highSaving = parsed * HIGH_RATE;
  const yearlyLow = lowSaving * 12;
  const yearlyHigh = highSaving * 12;

  return (
    <div className="rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(11,31,58,0.04),0_12px_32px_-12px_rgba(11,31,58,0.12)] p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted mb-4">
        Räkna ut din besparing
      </p>

      <label htmlFor="cost" className="block text-sm text-ink_soft mb-2">
        Vad betalar du idag för bredband + streaming, per månad?
      </label>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <input
            id="cost"
            type="text"
            inputMode="numeric"
            value={monthlyCost}
            onChange={(e) => setMonthlyCost(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface px-4 py-3.5 text-2xl font-display font-semibold tracking-tightest text-ink tabnum focus:bg-white transition-colors"
            aria-describedby="cost-currency"
          />
          <span
            id="cost-currency"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted"
          >
            kr/mån
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-gain/[0.07] border border-gain/20 p-4">
          <p className="text-xs text-gain_dark font-medium mb-1">
            Möjlig besparing / mån
          </p>
          <p className="text-2xl sm:text-3xl font-display font-bold tracking-tightest text-gain_dark tabnum">
            {formatSEK(lowSaving)}–{formatSEK(highSaving)} kr
          </p>
        </div>
        <div className="rounded-xl bg-ink/[0.04] border border-ink/10 p-4">
          <p className="text-xs text-ink_soft font-medium mb-1">Per år</p>
          <p className="text-2xl sm:text-3xl font-display font-bold tracking-tightest text-ink tabnum">
            {formatSEK(yearlyLow)}–{formatSEK(yearlyHigh)} kr
          </p>
        </div>
      </div>

      <p className="text-xs text-muted mt-4 leading-relaxed">
        Baserat på genomsnittlig besparing bland NordicSaves kunder. Du
        betalar oss en engångsavgift motsvarande en månads besparing —
        ingenting om vi inte lyckas.
      </p>
    </div>
  );
}
