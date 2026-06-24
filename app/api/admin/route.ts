import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Inte inloggad." }, { status: 401 });
  }
  const adminCheck = await pool.query(
    "SELECT is_admin FROM users WHERE id = $1",
    [session.user.id]
  );
  if (!adminCheck.rows[0]?.is_admin) {
    return NextResponse.json({ error: "Åtkomst nekad." }, { status: 403 });
  }
  const result = await pool.query(`
    SELECT
      u.id, u.name, u.email, u.created_at,
      COALESCE(
        json_agg(
          json_build_object('id', s.id, 'category', s.category, 'provider', s.provider, 'cost', s.cost)
          ORDER BY s.created_at ASC
        ) FILTER (WHERE s.id IS NOT NULL),
        '[]'
      ) AS subscriptions,
      COALESCE(SUM(s.cost), 0) AS total_cost
    FROM users u
    LEFT JOIN subscriptions s ON s.user_id = u.id
    GROUP BY u.id, u.name, u.email, u.created_at
    ORDER BY u.created_at DESC
  `);
  return NextResponse.json({ users: result.rows });
}
