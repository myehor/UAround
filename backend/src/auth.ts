import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "./lib/prisma.js";

const router = Router();

const registerSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z
    .string()
    .trim()
    .email()
    .max(254)
    .transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(72),
  bundesland: z.string().trim().min(1).max(100),
  city: z.string().trim().min(1).max(100),
});

router.post("/register", async (req, res) => {
  const validation = registerSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      message: "Please check the registration data.",
      errors: validation.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  const { firstName, lastName, email, password, bundesland, city } =
    validation.data;

  try {
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        bundesland,
        city,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        emailVerified: true,
        bundesland: true,
        city: true,
        createdAt: true,
      },
    });

    req.session.regenerate((sessionError) => {
      if (sessionError) {
        console.error("Failed to regenerate session:", sessionError);
        res.status(500).json({ message: "Failed to create a session." });
        return;
      }

      req.session.userId = user.id;

      req.session.save((saveError) => {
        if (saveError) {
          console.error("Failed to save session:", saveError);
          res.status(500).json({ message: "Failed to create a session." });
          return;
        }

        res.status(201).json({
          message: "Account created successfully.",
          user,
        });
      });
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      res.status(409).json({
        message: "An account with this email already exists.",
      });
      return;
    }

    console.error("Registration failed:", error);

    res.status(500).json({
      message: "Registration failed. Please try again later.",
    });
  }
});

router.post("/login", async (req, res) => {
  const loginSchema = z.object({
    email: z
      .string()
      .trim()
      .email()
      .max(254)
      .transform((value) => value.toLowerCase()),
    password: z.string().min(1).max(72),
  });

  const validation = loginSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({ message: "Invalid email or password." });
    return;
  }

  try {
    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    await new Promise<void>((resolve, reject) => {
      req.session.regenerate((error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    req.session.userId = user.id;

    await new Promise<void>((resolve, reject) => {
      req.session.save((error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    res.json({
      message: "Logged in successfully.",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        emailVerified: user.emailVerified,
        bundesland: user.bundesland,
        city: user.city,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ message: "Login failed. Please try again later." });
  }
});

router.get("/me", async (req, res) => {
  if (!req.session.userId) {
    res.status(401).json({ message: "Not authenticated." });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        emailVerified: true,
        bundesland: true,
        city: true,
        createdAt: true,
      },
    });

    if (!user) {
      req.session.destroy(() => {});
      res.clearCookie("uaround.sid");
      res.status(401).json({ message: "Not authenticated." });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error("Failed to load current user:", error);
    res.status(500).json({ message: "Failed to load current user." });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Failed to destroy session:", error);
      res.status(500).json({ message: "Logout failed." });
      return;
    }

    res.clearCookie("uaround.sid", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ message: "Logged out successfully." });
  });
});

export default router;
