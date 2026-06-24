import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "E-post", type: "email" },
        password: { label: "Lösenord", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Ange e-post och lösenord.");
        }
        const email = (credentials.email as string).toLowerCase().trim();
        const password = credentials.password as string;
        const result = await pool.query(
          "SELECT id, name, email, password FROM users WHERE email = $1 LIMIT 1",
          [email]
        );
        const user = result.rows[0];
        if (!user || !user.password) {
          throw new Error("Fel e-post eller lösenord.");
        }
        const passwordOk = await bcrypt.compare(password, user.password);
        if (!passwordOk) {
          throw new Error("Fel e-post eller lösenord.");
        }
        return { id: user.id, email: user.email, name: user.name ?? null };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
