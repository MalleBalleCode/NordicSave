import SavingsCalculator from "@/components/SavingsCalculator";
import LeadForm from "@/components/LeadForm";
import Link from "next/link";

const PROVIDERS = ["Telia", "Tele2", "Bahnhof", "Telenor", "Comhem"];

export default function Home() {
  return (
    <main className="min-h-screen bg-surface">
      <header className="border-b border-line bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-content mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          <span className="font-display font-bold text-lg tracking-tightest text-ink">NordicSave</span>
          <div className="flex items-center gap-4">
            <a href="#lead-form" className="text-sm font-semibold text-action hover:text-action/80 transition-colors">Kom igång →</a>
            <Link href="/login" className="text-sm font-medium px-3.5
