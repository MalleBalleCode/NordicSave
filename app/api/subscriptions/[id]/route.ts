import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Inte inloggad." }, { status: 401 });
  }
  const { id } = params;
  const result = await pool.query(
    "DELETE FROM subscriptions WHERE id = $1 AND user_id = $2 RETURNING id",
    [id, session.user.id]
  );
  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Abonnemanget hittades inte." }, { status: 404 });
  }
  return NextResponse.json({ message: "Borttaget." });
}
