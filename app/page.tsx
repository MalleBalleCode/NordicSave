import SavingsCalculator from "@/components/SavingsCalculator";
import LeadForm from "@/components/LeadForm";
import Link from "next/link";

const PROVIDERS = ["Telia", "Tele2", "Bahnhof", "Telenor", "Comhem"];

export default function Home() {
  return (
    <main className="min-h-screen bg-surface">
      <header className="border-b border-line bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-content mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          <span className="font-display font-bold text-lg tracking-tightest text-ink">
            NordicSave
          </span>
          <div className="flex items-center gap-4">
            
              href="#lead-form"
              className="text-sm font-semibold text-action hover:text-action/80 transition-colors"
            >
              Kom igång →
            </a>
            <Link
              href="/login"
              className="text-sm font-medium px-3.5 py-1.5 rounded-lg border border-line bg-white text-ink hover:border-action/40 transition-colors"
            >
              Logga in
            </Link>
          </div>
        </div>
      </header>

      <section className="relative ledger-grid overflow-hidden border-b border-line">
        <div className="max-w-content mx-auto px-6 sm:px-8 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-gain/30 bg-gain/[0.08] px-3 py-1 text-xs font-medium text-gain_dark mb-6">
              Inga förpliktelser
