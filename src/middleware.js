import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Middleware för att kontrollera JWT-token
export async function middleware(req) {
  const token = req.headers.get("Authorization")?.split(" ")[1]; // Hämta JWT från Authorizaton-header

  if (token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verifiera token
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

// Specifikt för att skydda /items och /items/[id] rutter
export const config = {
  matcher: ["/items/:path", "/items/[id]"],
};
