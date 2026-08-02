import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, password } = body as {
      email?: string;
      password?: string;
    };

    // ── Field presence validation ────────────────────────────────────────────
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address.", field: "email" },
        { status: 400 }
      );
    }

    // ── Look up the user ─────────────────────────────────────────────────────
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    // Constant-time compare even when user is not found (prevent timing attacks)
    const passwordToCheck = user?.passwordHash ?? "$2b$12$invalidhashforcomparison";
    const passwordMatch = await bcrypt.compare(password, passwordToCheck);

    if (!user || !passwordMatch) {
      // Intentionally vague — don't reveal whether the email exists
      return NextResponse.json(
        { message: "Incorrect email or password." },
        { status: 401 }
      );
    }

    // ── Success — return safe user data ──────────────────────────────────────
    // NOTE: In production you would set a session cookie or JWT here.
    // For now we return the user data so the client can store it.
    return NextResponse.json(
      {
        message: "Login successful.",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    // ── Database connectivity errors ─────────────────────────────────────────
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (
        error.code === "P1001" ||
        error.code === "P1002" ||
        error.code === "P1003"
      ) {
        console.error("Database connection error:", error.code, error.message);
        return NextResponse.json(
          {
            message:
              "Service temporarily unavailable. Please try again in a moment.",
          },
          { status: 503 }
        );
      }
    }

    // ── Unknown / unexpected error ───────────────────────────────────────────
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
