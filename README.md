# NordicSave — landningssida

Next.js 14 (App Router) + TypeScript + Tailwind. Byggd som en redigerbar
startpunkt för NordicSaves landningssida.

## Köra lokalt

Detta projekt kunde inte byggas/testas i den här sandlådan (inget nätverk
för `npm install`). Kör följande på din egen dator:

```bash
npm install
npm run dev
```

Öppna sedan http://localhost:3000

## Struktur

```
app/
  layout.tsx       — root layout, typsnitt (Inter + Inter Tight), metadata
  page.tsx          — hela landningssidan (hero, hur det fungerar, lead-form, footer)
  globals.css       — design tokens, fokus-styles, reduced-motion
components/
  SavingsCalculator.tsx  — interaktiv besparingsräknare i hero
  LeadForm.tsx            — leadformulär (namn + e-post)
tailwind.config.ts  — färgpalett och typografi-tokens
```

## Designtokens

| Namn      | Hex       | Användning                          |
|-----------|-----------|--------------------------------------|
| ink       | `#0B1F3A` | Brödtext, rubriker, mörk bas         |
| surface   | `#F7F9FC` | Sidbakgrund                          |
| action    | `#2E6DA4` | Knappar, länkar, CTA                 |
| gain      | `#1FA67D` | Besparing/positiva siffror           |
| muted     | `#6B7280` | Stödtext                             |
| line      | `#E2E8F1` | Dividers, kantlinjer                 |

Typografi: **Inter Tight** (display/rubriker, tight letter-spacing) +
**Inter** (brödtext). Båda laddas via `next/font/google` — kräver
internetåtkomst vid build-tid hos dig (fungerar i alla normala
hosting-miljöer, t.ex. Vercel).

## Nästa steg att bygga vidare på

- Koppla `LeadForm.tsx` mot ett riktigt API/CRM (just nu simuleras bara ett
  lyckat svar — sök efter `TODO` i filen)
- Lägg till fler sidor under `app/` (t.ex. `app/om-oss/page.tsx`)
- Byt ut platshållartexter mot riktiga kundcase när ni har dem
- Deploya till Vercel och koppla domänen via Cloudflare DNS (CNAME till
  Vercel, proxy avstängd/grått moln)
