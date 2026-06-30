import LeadForm from "@/components/LeadForm";
import Link from "next/link";

const PROVIDERS = ["Allente", "Telia", "Tre", "Telenor", "och många fler!"];

const CASES = [
  {
    name: "Lines",
    before: "248 kr/mån",
    after: "0 kr/mån",
    savedPerMonth: 248,
    savedPerYear: 2976,
    description: "Hade ett mobilt bredband-SIM i iPaden hon inte visste om — onödigt abonnemang identifierat och avslutat direkt.",
  },
  {
    name: "Per",
    before: "1 128 kr/mån",
    after: "699 kr/mån",
    savedPerMonth: 429,
    savedPerYear: 5148,
    description: "Bytte från Telenor bredband + TV till Tele2:s paket med 1000/1000 Mbit och fyra streamingtjänster inkluderade.",
  },
  {
    name: "Hans",
    before: "1 546 kr/mån",
    after: "1 336 kr/mån",
    savedPerMonth: 210,
    savedPerYear: 2520,
    description: "Uppgraderade till 1000/1000 Mbit och TV Premium — bättre tjänster till lägre kostnad.",
  },
  {
    name: "Mattias",
    before: "2 077 kr/mån",
    after: "1 269 kr/mån",
    savedPerMonth: 808,
    savedPerYear: 9696,
    description: "Bytte till Tele2 med 1000/1000 Mbit, fem streamingtjänster och sport — sparar nära 10 000 kr första året.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-surface">
      <header className="border-b border-line bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-content mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          <span className="font-display font-bold text-lg tracking-tightest text-ink">NordicSave</span>
          <nav className="hidden sm:flex items-center gap-6">
            <a href="#vision" className="text-sm text-muted/70 hover:text-muted transition-colors">Vision</a>
            <a href="#cases" className="text-sm text-muted/70 hover:text-muted transition-colors">Kundexempel</a>
          </nav>
          <div className="flex items-center gap-4">
            <a href="#lead-form" className="text-sm font-semibold text-action hover:text-action/80 transition-colors">Kom igång →</a>
            <Link href="/login" className="text-sm font-medium px-3.5 py-1.5 rounded-lg border border-line bg-white text-ink hover:border-action/40 transition-colors">Logga in</Link>
          </div>
        </div>
      </header>

      {/* Hero — single column nu när kalkylatorn är borttagen */}
      <section className="relative ledger-grid overflow-hidden border-b border-line">
        <div className="max-w-content mx-auto px-6 sm:px-8 py-16 sm:py-24">
          <p className="inline-flex items-center gap-2 rounded-full border border-gain/30 bg-gain/[0.08] px-3 py-1 text-xs font-medium text-gain_dark mb-6">
            Inga förpliktelser · Du betalar bara om vi lyckas
          </p>
          <h1 className="font-display font-extrabold tracking-tightest text-ink text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.05] mb-6 max-w-3xl">
            Du betalar för mycket för bredband och streaming.{" "}
            <span className="text-action">Vi fixar det.</span>
          </h1>
          <p className="text-lg text-ink_soft leading-relaxed mb-8 max-w-xl">
            NordicSave analyserar dina avtal, förhandlar med leverantörerna och sänker din månadskostnad. Du lägger 2 minuter — vi sköter resten.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
            <span>Förhandlar direkt med:</span>
            <div className="flex flex-wrap gap-3 font-medium text-ink_soft">
              {PROVIDERS.map((p) => (<span key={p}>{p}</span>))}
            </div>
          </div>
        </div>
      </section>

      {/* Tre steg */}
      <section className="max-w-content mx-auto px-6 sm:px-8 py-16 sm:py-24">
        <h2 className="font-display font-bold tracking-tightest text-ink text-2xl sm:text-3xl mb-12 max-w-lg">
          Tre steg. Ingen risk för dig.
        </h2>
        <div className="grid sm:grid-cols-3 gap-8 sm:gap-6">
          <Step label="Dela dina avtal" text="Skicka över dina nuvarande fakturor för bredband och streaming. Tar två minuter." />
          <Step label="Vi förhandlar" text="Med din fullmakt kontaktar vi leverantörerna och hittar bästa möjliga pris." />
          <Step label="Du sparar" text="Vi tar en engångsavgift motsvarande en månads besparing. Resten är din vinst." />
        </div>
      </section>

      {/* Vision */}
      <section id="vision" className="border-t border-line bg-ink">
        <div className="max-w-content mx-auto px-6 sm:px-8 py-16 sm:py-24">
          <p className="text-xs font-medium text-white/50 uppercase tracking-wide mb-4">Vår vision</p>
          <h2 className="font-display font-bold tracking-tightest text-white text-2xl sm:text-3xl mb-12 max-w-2xl">
            Ingen säljare. Inga dolda agendor.
