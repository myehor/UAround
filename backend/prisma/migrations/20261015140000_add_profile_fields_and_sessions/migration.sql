-- Add profile fields without changing existing user records.
ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "bio" TEXT,
  ADD COLUMN IF NOT EXISTS "phone" TEXT,
  ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "coverUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "languages" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "profileCompleted" BOOLEAN NOT NULL DEFAULT false;

-- Track the existing PostgreSQL session table used by connect-pg-simple.
CREATE TABLE IF NOT EXISTS "user_sessions" (
  "sid" VARCHAR NOT NULL,
  "sess" JSON NOT NULL,
  "expire" TIMESTAMP(6) NOT NULL,
  CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("sid")
);

CREATE INDEX IF NOT EXISTS "IDX_session_expire"
  ON "user_sessions" ("expire");
