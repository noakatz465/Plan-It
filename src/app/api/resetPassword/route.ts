// import connect from "@/app/lib/db/mongoDB";
// import { NextResponse } from "next/server";
// import User from "@/app/lib/models/userSchema";
// import bcrypt from "bcrypt";

// export async function POST(req: Request) {
//   try {
//     await connect();
//     const { email, password } = await req.json();

//     if (!email || !password) {
//       return NextResponse.json(
//         { message: "Email and password are required." },
//         { status: 400 }
//       );
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return NextResponse.json(
//         { message: "User not found. Please try again." },
//         { status: 404 }
//       );
//     }

//     // הצפנת הסיסמה החדשה
//     const hashedPassword = await bcrypt.hash(password, 10);
//     user.password = hashedPassword;

//     // ניקוי קוד האימות לאחר עדכון הסיסמה
//     user.verificationCode = undefined;
//     user.verificationCodeExpiry = undefined;

//     await user.save();

//     return NextResponse.json({ message: "Password updated successfully!" });
//   } catch (error) {
//     console.error("Error resetting password:", error);
//     return NextResponse.json(
//       { message: "Failed to reset password." },
//       { status: 500 }
//     );
//   }
// }
import connect from "@/app/lib/db/mongoDB";
import { NextResponse } from "next/server";
import User from "@/app/lib/models/userSchema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connect();
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and password are required." },
        { status: 400 }
      );
    }

    // בדיקת הטוקן
    let email: string;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as { email: string };
      email = decoded.email;
    } catch (err) {
      return NextResponse.json({ message: "Invalid or expired token." }, { status: 401 });
    }

    // חיפוש המשתמש
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User not found. Please try again." },
        { status: 404 }
      );
    }

    // הצפנת הסיסמה החדשה
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    // ניקוי קוד האימות לאחר עדכון הסיסמה
    user.verificationCode = undefined;
    user.verificationCodeExpiry = undefined;

    await user.save();

    return NextResponse.json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { message: "Failed to reset password." },
      { status: 500 }
    );
  }
}
