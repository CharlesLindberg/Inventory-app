import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// POST: Registrera ny användare
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body;
    console.log("REGISTER...");

    // Kontrollera att alla fält är ifyllda
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Kontrollera om epost redan är redistrerad
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exist with this email" },
        { status: 400 }
      );
    }

    // Kryptera lösenordet
    const hashedPassword = await bcrypt.hash(password, 10);

    // Skapa användaren i databasen
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      message: "User registrated successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
