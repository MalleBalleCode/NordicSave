// auth.ts – Konfigurationsfil för NextAuth.js (Auth.js v5 beta)
//
// Placeras i projektets rot (bredvid package.json).
// Den här filen gör tre saker:
//   1. Definierar hur inloggning fungerar (e-post + lösenord)
//   2. Kopplar till Supabase-databasen via pg-adaptern
//   3. Exporterar hjälpfunktioner som används i resten av appen

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PostgresAdapter } from "@auth/pg-adapter";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

// Pool = en "pool" av databasanslutningar som återanvänds.
// Utan pool öppnas en ny anslutning per request, vilket är ineffektivt.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl krävs för Supabase – de accepterar inte okrypterade anslutningar
  ssl: { rejectUnauthorized: false },
  max: 10,
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Adaptern berättar för NextAuth var sessioner och användare ska sparas.
  // @auth/pg-adapter pratar direkt med PostgreSQL (Supabase är PostgreSQL).
  adapter: PostgresAdapter(pool),

  // "jwt" = sessionen lagras i en signerad cookie i webbläsaren, inte i databasen.
  // Det gör att det fungerar på Vercel Edge utan problem.
  session: { strategy: "jwt" },

  // Egna sidor istället för NextAuths standardsidor
  pages: {
    signIn: "/login",
    error: "/login",   // Felkoder skickas som ?error= till loginsidan
    newUser: "/dashboard", // Efter första inloggning (via register) → dashboard
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "E-post", type: "email" },
        password: { label: "Lösenord", type: "password" },
      },

      // authorize() körs varje gång någon försöker logga in med e-post + lösenord.
      // Returnerar ett user-objekt vid lyckad inloggning, annars throw.
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Ange e-post och lösenord.");
        }

        const email = (credentials.email as string).toLowerCase().trim();
        const password = credentials.password as string;

        // Hämta användaren från databasen
        const result = await pool.query(
          "SELECT id, name, email, password FROM users WHERE email = $1 LIMIT 1",
          [email]
        );

        const user = result.rows[0];

        // Viktigt: samma felmeddelande oavsett om e-posten finns eller inte.
        // Annars kan en angripare ta reda på vilka e-postadresser som är registrerade.
        if (!user || !user.password) {
          throw new Error("Fel e-post eller lösenord.");
        }

        // bcrypt.compare() kör aldrig det faktiska lösenordet i databasen.
        // Det jämför det du skriver med en hash (en envägskrypterad sträng).
        const passwordOk = await bcrypt.compare(password, user.password);

        if (!passwordOk) {
          throw new Error("Fel e-post eller lösenord.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? null,
        };
      },
    }),
  ],

  callbacks: {
    // jwt() körs när en token skapas eller förnyas.
    // Vi lägger till user.id i tokenen så vi har det tillgängligt senare.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },

    // session() körs varje gång klienten frågar "är jag inloggad?".
    // Vi kopierar id:t från tokenen till session-objektet.
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
