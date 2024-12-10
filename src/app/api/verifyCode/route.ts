import { NextResponse } from "next/server";
import User from "@/app/lib/models/userSchema";
export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    // בדוק אם האימייל והקוד הגיעו
    console.log("Email received:", email);
    console.log("Code received:", code);

    // חפש את המשתמש לפי האימייל
    const user = await User.findOne({ email });
    console.log("User found:", user);

    if (!user) {
      console.error("User not found.");
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // בדוק אם קוד האימות תואם
    console.log("Stored verification code:", user.verificationCode);
    if (user.verificationCode !== Number(code)) {
      console.error("Invalid verification code.");
      return NextResponse.json({ message: "Invalid verification code." }, { status: 401 });
    }

    // בדוק אם הקוד פג תוקף
    console.log("Verification code expiry:", user.verificationCodeExpiry);
    if (user.verificationCodeExpiry < Date.now()) {
      console.error("Verification code expired.");
      return NextResponse.json({ message: "Verification code expired." }, { status: 401 });
    }

    return NextResponse.json({ message: "Code verified successfully." });
  } catch (error) {
    console.error("Error verifying code:", error);
    return NextResponse.json({ message: "Failed to verify code." }, { status: 500 });
  }
}
