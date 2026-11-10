import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { Pool } from "pg";

import eventsRouter from "./events.js";
import authRouter from "./auth.js";
import profileRouter from "./profile.js";

const app = express();
const PORT = Number(process.env.PORT ?? 3000);
const uploadsDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "uploads",
);

app.use("/uploads", express.static(uploadsDir));

const databaseUrl = process.env.DATABASE_URL;
const sessionSecret = process.env.SESSION_SECRET;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured");
}

if (!sessionSecret || sessionSecret.length < 32) {
  throw new Error("SESSION_SECRET must contain at least 32 characters");
}

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: databaseUrl,
});

const PgSession = connectPgSimple(session);

app.disable("x-powered-by");

if (isProduction) {
  app.set("trust proxy", 1);
}

app.use(express.json({ limit: "7mb" }));

app.use(
  session({
    name: "uaround.sid",
    store: new PgSession({
      pool,
      createTableIfMissing: true,
      tableName: "user_sessions",
    }),
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "UAround API is running",
  });
});

app.use("/api/events", eventsRouter);
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);

const server = app.listen(PORT, () => {
  console.log(`UAround API is running at http://localhost:${PORT}`);
});

function shutdown() {
  server.close(() => {
    void pool.end().finally(() => {
      process.exit(0);
    });
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
