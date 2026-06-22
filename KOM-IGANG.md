# NordicSave – Fas 1: Kom igång-guide

Den här guiden tar dig från noll till ett fungerande inloggningssystem, steg för steg.

---

## Vilka filer du fått (och vad de gör)

| Fil | Vad den gör |
|-----|-------------|
| `auth.ts` | Hjärtat i autentiseringen – konfigurerar NextAuth |
| `middleware.ts` | Blockerar /dashboard för utloggade, automatiskt |
| `app/layout.tsx` | Uppdaterad med SessionProvider (krävs av NextAuth) |
| `app/api/auth/[...nextauth]/route.ts` | NextAuths egna API-endpoints |
| `app/api/auth/register/route.ts` | Skapar nya konton |
| `app/login/page.tsx` | Inloggningssida |
| `app/register/page.tsx` | Registreringssida |
| `app/dashboard/page.tsx` | Skyddad sida (platshållare för Fas 2) |
| `components/SignOutButton.tsx` | Utloggningsknapp |
| `types/next-auth.d.ts` | TypeScript-typer för sessionen |
| `supabase-setup.sql` | SQL som skapar databasens tabeller |
| `package.json` | Uppdaterad med nya beroenden |

---

## Steg 1 – Ladda upp filerna till GitHub

Ladda upp **alla** filer från den här mappen till ditt GitHub-repo (MalleBalleCode/NordicSave).
Behåll mappstrukturen precis som den är.

> ⚠️ Ladda **inte** upp `.env.local` – den ska aldrig ligga på GitHub.

---

## Steg 2 – Skapa ett Supabase-projekt

1. Gå till [app.supabase.com](https://app.supabase.com)
2. Klicka **New project**
3. Välj ett namn (t.ex. "nordicsave"), välj region **eu-north-1 (Stockholm)**
4. Välj ett starkt databaslösenord – spara det på ett säkert ställe
5. Vänta ~2 minuter tills projektet startat

---

## Steg 3 – Skapa databastabellerna

1. I Supabase, klicka **SQL Editor** i menyn till vänster
2. Klicka **New query**
3. Öppna filen `supabase-setup.sql` och kopiera hela innehållet
4. Klistra in i SQL Editor och klicka **Run**
5. Du ska se "Success. No rows returned" – det är rätt!

---

## Steg 4 – Hämta dina nycklar från Supabase

Gå till **Settings → API** i Supabase och kopiera:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

Gå sedan till **Settings → Database → Connection string**:
- Välj fliken **Transaction** (för Vercel)
- Kopiera URI:n → `DATABASE_URL`
- Ersätt `[YOUR-PASSWORD]` i URI:n med ditt databaslösenord från Steg 2

---

## Steg 5 – Skapa .env.local lokalt

```bash
cp .env.local.example .env.local
```

Öppna `.env.local` och fyll i alla värden.

Generera NEXTAUTH_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Steg 6 – Installera nya beroenden

```bash
npm install
```

De nya paketen som installeras:
- `next-auth` – autentiseringsramverket
- `@auth/pg-adapter` – kopplar NextAuth till PostgreSQL
- `bcryptjs` – krypterar lösenord säkert
- `pg` – PostgreSQL-klient för Node.js

---

## Steg 7 – Testa lokalt

```bash
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000)

Testa flödet:
1. Gå till `/register` → skapa ett testkonto
2. Du skickas automatiskt till `/dashboard`
3. Logga ut
4. Gå direkt till `/dashboard` → du ska skickas till `/login`
5. Logga in → tillbaka till `/dashboard`

---

## Steg 8 – Lägg till miljövariabler på Vercel

1. Gå till [vercel.com](https://vercel.com) → ditt NordicSave-projekt
2. **Settings → Environment Variables**
3. Lägg till **alla** variabler från `.env.local`
4. För `NEXTAUTH_URL`: byt till `https://nordicsave.se` (inte localhost)
5. Klicka **Save** och sedan **Redeploy**

---

## Om något inte fungerar

**"PG::UndefinedTable" eller databas-fel**
→ Kör SQL-filen igen i Supabase SQL Editor

**"NEXTAUTH_SECRET is missing"**
→ Dubbelkolla att `.env.local` finns och har rätt värde

**Inloggning fungerar men session visas inte**
→ Kör `npm run dev` om (Ctrl+C och sedan `npm run dev`)

**TypeScript-fel på `session.user.id`**
→ Kontrollera att `types/next-auth.d.ts` finns och att `tsconfig.json` är uppdaterad

---

## Fas 2 – Vad händer härnäst?

När Fas 1 fungerar bygger vi:
- Formulär för att lägga till prenumerationer (namn + pris)
- Tabell i Supabase för att spara dem per användare
- Dashboard som visar total månadskostnad och möjlig besparing
