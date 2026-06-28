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