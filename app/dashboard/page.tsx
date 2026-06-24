"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

const CATEGORIES = [
  { value: "bredband", label: "Bredband", placeholder: "t.ex. Telia, Bahnhof, Telenor" },
  { value: "streaming", label: "Streaming", placeholder: "t.ex. Netflix, Spotify, HBO Max" },
  { value: "mobilabonnemang", label: "Mobilabonnemang", placeholder: "t.ex. Comviq, Tele2, Halebop" },
  { value: "annat", label: "Annat", placeholder: "t.ex. El, Försäkring" },
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

function InfoTooltip() {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block ml-1.5">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted/20 text-muted text-[10px] font-bold hover:bg-action/20 hover:text-action transition-colors"
        aria-label="Hur hittar jag bindningstiden?"
      >
        ?
