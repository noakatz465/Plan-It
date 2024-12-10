
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { NextResponse } from "next/server";
// import User from "@/app/lib/models/userSchema";

// export async function POST(req: Request) {
//   try {
//     const { email, code } = await req.json();

//     // בדוק אם האימייל והקוד הגיעו
//     console.log("Email received:", email);
//     console.log("Code received:", code);

//     // חפש את המשתמש לפי האימייל
//     const user = await User.findOne({ email });
//     console.log("User found:", user);

//     if (!user) {
//       console.error("User not found.");
//       return NextResponse.json({ message: "User not found." }, { status: 404 });
//     }

//     // בדוק אם הקוד פג תוקף
//     console.log("Verification code expiry:", user.verificationCodeExpiry);
//     if (user.verificationCodeExpiry < Date.now()) {
//       console.error("Verification code expired.");
//       return NextResponse.json({ message: "Verification code expired." }, { status: 401 });
//     }

//     // השוואת הקוד שהוזן עם הקוד המוצפן במסד הנתונים
//     const isCodeValid = await bcrypt.compare(code.toString(), user.verificationCode);
//     if (!isCodeValid) {
//       console.error("Invalid verification code.");
//       return NextResponse.json({ message: "Invalid verification code." }, { status: 401 });
//     }

//     // יצירת טוקן לאימות נוסף
//     const token = jwt.sign({ email }, process.env.JWT_SECRET || "default_secret", {
//       expiresIn: "15m", // הטוקן יפוג לאחר 15 דקות
//     });

//     // שמירת הטוקן במסד הנתונים
//     user.resetToken = token;
//     await user.save();

//     console.log("Token generated and saved:", token);

//     return NextResponse.json({
//       message: "Code verified successfully.",
//       resetToken: token, // מחזיר את הטוקן ללקוח
//     });
//   } catch (error) {
//     console.error("Error verifying code:", error);
//     return NextResponse.json({ message: "Failed to verify code." }, { status: 500 });
//   }
// }
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import User from "@/app/lib/models/userSchema";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    if (user.verificationCodeExpiry < Date.now()) {
      return NextResponse.json({ message: "Verification code expired." }, { status: 401 });
    }

    const isCodeValid = await bcrypt.compare(code.toString(), user.verificationCode);
    if (!isCodeValid) {
      return NextResponse.json({ message: "Invalid verification code." }, { status: 401 });
    }

    // יצירת טוקן זמני
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "15m" } // הטוקן בתוקף ל-15 דקות
    );

    return NextResponse.json({
      message: "Code verified successfully.",
      resetToken: token, // שליחת הטוקן ללקוח
    });
  } catch (error) {
    console.error("Error verifying code:", error);
    return NextResponse.json({ message: "Failed to verify code." }, { status: 500 });
  }
}
