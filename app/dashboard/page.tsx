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
  const [contractStart, setContractStart] = useState("")
  const [contractEnd, setContractEnd] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const