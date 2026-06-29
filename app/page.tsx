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

      {/* Kundcase */}
      <section className="border-t border-line bg-white">
        <div className="max-w-content mx-auto px-6 sm:px-8 py-16 sm:py-24">
          <h2 className="font-display font-bold tracking-tightest text-ink text-2xl sm:text-3xl mb-4">
            Kunder vi redan har hjälpt
          </h2>
          <p className="text-ink_soft leading-relaxed max-w-xl mb-12">
            Här är några exempel på vad vi åstadkommit. Använd formuläret nedan om du också vill sänka dina månadskostnader — vi tar kontakt med dig!
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {CASES.map((c) => (
              <CaseCard key={c.name} {...c} />
            ))}
          </div>
        </div>
      </section>

      {/* Lead-formulär */}
      <section id="lead-form" className="border-t border-line">
        <div className="max-w-content mx-auto px-6 sm:px-8 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display font-bold tracking-tightest text-ink text-2xl sm:text-3xl mb-4">
              Redo att sänka din räkning?
            </h2>
            <p className="text-ink_soft leading-relaxed max-w-md">
              Lämna dina uppgifter och vi återkommer med en kostnadsfri analys av vad du kan spara — utan förpliktelser.
            </p>
          </div>
          <LeadForm />
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="max-w-content mx-auto px-6 sm:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-muted">
          <span>© 2026 NordicSave</span>
          <span>info@nordicsave.se</span>
        </div>
      </footer>
    </main>
  );
}

function Step({ label, text }: { label: string; text: string }) {
  return (
    <div className="border-t-2 border-ink pt-5">
      <p className="font-display font-semibold text-lg text-ink mb-2">{label}</p>
      <p className="text-sm text-muted leading-relaxed">{text}</p>
    </div>
  );
}

function CaseCard({
  name,
  before,
  after,
  savedPerMonth,
  savedPerYear,
  description,
}: {
  name: string;
  before: string;
  after: string;
  savedPerMonth: number;
  savedPerYear: number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="font-display font-bold text-ink text-lg">{name}</span>
        <span className="rounded-full bg-gain/[0.1] border border-gain/30 px-3 py-0.5 text-xs font-semibold text-gain_dark">
          −{savedPerMonth} kr/mån
        </span>
      </div>
      <p className="text-sm text-muted leading-relaxed">{description}</p>
      <div className="grid grid-cols-2 gap-3 mt-auto">
        <div className="rounded-xl bg-white border border-line px-4 py-3">
          <p className="text-[10px] font-medium text-muted uppercase tracking-wide mb-1">Innan</p>
          <p className="font-semibold text-ink text-sm">{before}</p>
        </div>
        <div className="rounded-xl bg-gain/[0.07] border border-gain/20 px-4 py-3">
          <p className="text-[10px] font-medium text-gain_dark uppercase tracking-wide mb-1">Efter</p>
          <p className="font-semibold text-gain_dark text-sm">{after}</p>
        </div>
      </div>
      <div className="border-t border-line pt-3">
        <p className="text-xs text-muted">
          Besparing på ett år:{" "}
          <span className="font-bold text-ink">{savedPerYear.toLocaleString("sv-SE")} kr</span>
        </p>
      </div>
    </div>
  );
}
