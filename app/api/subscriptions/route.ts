import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const VALID_CATEGORIES = ["bredband", "streaming", "mobilabonnemang", "annat"];

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Inte inloggad." }, { status: 401 });
  }
  const result = await pool.query(
    "SELECT id, category, provider, cost, created_at FROM subscriptions WHERE user_id = $1 ORDER BY created_at ASC",
    [session.user.id]
  );
  return NextResponse.json({ subscriptions: result.rows });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Inte inloggad." }, { status: 401 });
  }
  const body = await req.json();
  const { category, provider, cost } = body;
  if (!category || !provider || cost === undefined) {
    return NextResponse.json({ error: "Kategori, leverantör och kostnad krävs." }, { status: 400 });
  }
  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Ogiltig kategori." }, { status: 400 });
  }
  const parsedCost = parseInt(cost, 10);
  if (isNaN(parsedCost) || parsedCost < 0) {
    return NextResponse.json({ error: "Kostnad måste vara ett positivt heltal." }, { status: 400 });
  }
  const result = await pool.query(
    "INSERT INTO subscriptions (user_id, category, provider, cost) VALUES ($1, $2, $3, $4) RETURNING id, category, provider, cost, created_at",
    [session.user.id, category, provider.trim(), parsedCost]
  );
  return NextResponse.json({ subscription: result.rows[0] }, { status: 201 });
}
