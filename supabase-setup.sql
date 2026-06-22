-- ============================================================
-- NordicSave – Supabase-tabeller för Fas 1 (autentisering)
-- ============================================================
-- Kör detta i Supabase SQL Editor:
-- https://app.supabase.com → ditt projekt → SQL Editor → New query
-- Klistra in allt, klicka Run.
-- ============================================================

-- Tabell för användare
-- "password" är ett bcrypt-hash, aldrig klartext
CREATE TABLE IF NOT EXISTS users (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT,
  email         TEXT        UNIQUE NOT NULL,
  email_verified TIMESTAMPTZ,
  image         TEXT,
  password      TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Tabell för sessioner (NextAuth hanterar detta automatiskt)
CREATE TABLE IF NOT EXISTS sessions (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires       TIMESTAMPTZ NOT NULL,
  session_token TEXT        UNIQUE NOT NULL
);

-- Tabell för e-postverifiering och lösenordsåterställning (Fas 3)
CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT        NOT NULL,
  token      TEXT        NOT NULL,
  expires    TIMESTAMPTZ NOT NULL,
  UNIQUE(identifier, token)
);

-- Tabell för kopplade konton (krävs av NextAuth-adaptern)
-- Används om du vill lägga till Google OAuth i framtiden
CREATE TABLE IF NOT EXISTS accounts (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type                 TEXT NOT NULL,
  provider             TEXT NOT NULL,
  provider_account_id  TEXT NOT NULL,
  refresh_token        TEXT,
  access_token         TEXT,
  expires_at           INTEGER,
  token_type           TEXT,
  scope                TEXT,
  id_token             TEXT,
  session_state        TEXT,
  UNIQUE(provider, provider_account_id)
);

-- Index för snabbare uppslag
CREATE INDEX IF NOT EXISTS idx_sessions_user_id  ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id  ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email        ON users(email);

-- Auto-uppdatera updated_at vid varje ändring
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
