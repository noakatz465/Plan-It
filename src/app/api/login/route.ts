

import connect from "@/app/lib/db/mongoDB";
import { NextResponse } from "next/server";
import User from "@/app/lib/models/userSchema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export async function POST(req: Request) {
  try {
    await connect();

    const { email, password } = await req.json();

    // בדיקת קיום המשתמש
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found. Please sign up." }, { status: 404 });
    }

    // בדיקת הסיסמה
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Incorrect password. Please try again." }, { status: 401 });
    }

    // יצירת טוקן
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "default_secret", { expiresIn: "1h" });

    // הגדרת עוגיה
    const cookie = serialize("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60, // שעה
    });

    // תגובה
    const response = NextResponse.json({ message: "Login successful" });
    response.headers.append("Set-Cookie", cookie);

    return response;
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({ message: "An error occurred. Please try again." }, { status: 500 });
  }
}

