import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-post och lösenord krävs." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Lösenordet måste vara minst 8 tecken." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1 LIMIT 1",
      [normalizedEmail]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: "Det finns redan ett konto med den e-postadressen." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING id, name, email`,
      [name?.trim() || null, normalizedEmail, hashedPassword]
    );

    const newUser = result.rows[0];

    return NextResponse.json(
      {
        message: "Konto skapat.",
        user: { id: newUser.id, email: newUser.email, name: newUser.name },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[register] Error:", err);
    return NextResponse.json(
      { error: "Något gick fel. Försök igen." },
      { status: 500 }
    );
  }
}
