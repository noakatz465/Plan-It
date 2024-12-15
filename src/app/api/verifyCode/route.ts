
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import User from "@/app/lib/models/userSchema";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "Code verification failed." }, { status: 400 });
    }

    if (user.verificationCodeExpiry < Date.now()) {
      return NextResponse.json({ message: "Code verification failed." }, { status: 400 });
    }

    const isCodeValid = await bcrypt.compare(code.toString(), user.verificationCode);
    if (!isCodeValid) {
      return NextResponse.json({ message: "Code verification failed." }, { status: 400 });
    }

    // יצירת טוקן זמני
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "15m" }
    );

    // הגדרת העוגיה עם הטוקן
    const response = NextResponse.json({ message: "Code verified successfully." });
    response.cookies.set("resetToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60, // תוקף של 15 דקות
    });

    return response;
  } catch (error) {
    console.error("Error verifying code:", error);
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
  }
}
