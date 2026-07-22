import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      username,
      email,
      password,
      confirmPassword,
    } = body;

    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return NextResponse.json(
        {
          message: "All fields are required.",
        },
        {
          status: 400,
        }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          message: "Passwords do not match.",
        },
        {
          status: 400,
        }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          message: "Password must be at least 8 characters.",
        },
        {
          status: 400,
        }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username,
          },
          {
            email,
          },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message:
            "Username or email is already registered.",
        },
        {
          status: 409,
        }
      );
    }

    const passwordHash = await bcrypt.hash(
      password,
      12
    );

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
      },
    });

    return NextResponse.json(
      {
        message: "Account created successfully.",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Signup error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}