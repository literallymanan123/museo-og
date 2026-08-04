import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { createSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { username, email, password, confirmPassword } = body as {
      username?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    };

    // ── Field presence validation ────────────────────────────────────────────
    if (!username || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // ── Basic format checks (belt-and-suspenders — client already validates) ─
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address.", field: "email" },
        { status: 400 }
      );
    }

    if (username.trim().length < 3) {
      return NextResponse.json(
        {
          message: "Username must be at least 3 characters.",
          field: "username",
        },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match.", field: "confirmPassword" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          message: "Password must be at least 8 characters.",
          field: "password",
        },
        { status: 400 }
      );
    }

    // Stronger password validation
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return NextResponse.json(
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
          field: "password",
        },
        { status: 400 }
      );
    }

    // ── Hash the password ────────────────────────────────────────────────────
    const passwordHash = await bcrypt.hash(password, 12);

    // ── Create user (let the DB enforce uniqueness) ──────────────────────────
    const user = await prisma.user.create({
      data: {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        passwordHash,
      },
    });

    // ── Success — set session and return safe user data ──────────────────────
    await createSession(user.id, user.email);

    return NextResponse.json(
      {
        message: "Account created successfully.",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // ── Prisma unique-constraint violation (P2002) ───────────────────────────
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // meta.target contains the field(s) that violated the constraint
        const target = error.meta?.target as string[] | string | undefined;
        const targetStr = Array.isArray(target)
          ? target.join(",")
          : String(target ?? "");

        if (targetStr.toLowerCase().includes("username")) {
          return NextResponse.json(
            {
              message: "That username is already taken.",
              field: "username",
            },
            { status: 409 }
          );
        }

        if (targetStr.toLowerCase().includes("email")) {
          return NextResponse.json(
            {
              message: "An account with this email already exists.",
              field: "email",
            },
            { status: 409 }
          );
        }

        // Fallback for other unique constraint violations
        return NextResponse.json(
          {
            message: "Username or email is already registered.",
          },
          { status: 409 }
        );
      }

      // Database unavailable / can't open file
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
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}