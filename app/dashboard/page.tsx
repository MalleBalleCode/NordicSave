import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="border-b border-line bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-content mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-display font-bold text-lg tracking-tightest text-ink hover:text-action transition-colors">NordicSave</Link>
          <SignOutButton />
        </div>
      </header>
      <main className="flex-1 max-w-content mx-auto w-full px-6 sm:px-8 py-12">
        <div className="mb-10">
          <h1 className="font-display font-extrabold tracking-tightest text-ink text-3xl sm:text-4xl mb-2">Välkommen!</h1>
          <p className="text-ink_soft">Här ser du dina tjänster och vad NordicSave kan spara åt dig.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="rounded-2xl border border-line bg-white p-6">
            <p className="text-xs font-medium text-muted uppercase tracking-widest mb-2">Aktiva tjänster</p>
            <p className="font-display font-bold text-2xl tracking-tightest text-ink mb-1">—</p>
            <p className="text-xs text-muted">Kommer i nästa steg</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-6">
            <p className="text-xs font-medium text-muted uppercase tracking-widest mb-2">Månadskostnad</p>
            <p className="font-display font-bold text-2xl tracking-tightest text-ink mb-1">— kr</p>
            <p className="text-xs text-muted">Kommer i nästa steg</p>
          </div>
          <div className="rounded-2xl border border-gain/20 bg-gain/[0.07] p-6">
            <p className="text-xs font-medium text-muted uppercase tracking-widest mb-2">Möjlig besparing</p>
            <p className="font-display font-bold text-2xl tracking-tightest text-gain_dark mb-1">— kr</p>
            <p className="text-xs text-muted">Beräknas när du lagt till tjänster</p>
          </div>
        </div>
        <div className="rounded-2xl border-2 border-dashed border-line bg-white p-10 text-center">
          <p className="font-display font-semibold text-ink text-lg mb-2">Inga tjänster tillagda än</p>
          <p className="text-sm text-muted max-w-xs mx-auto mb-6">I nästa steg kan du lägga till dina abonnemang och se vad du kan spara.</p>
          <button disabled className="rounded-xl bg-action px-5 py-2.5 text-sm font-semibold text-white opacity-40 cursor-not-allowed">Lägg till tjänst (kommer snart)</button>
        </div>
      </main>
    </div>
  );
}
