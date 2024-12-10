// import nodemailer from "nodemailer";
// import connect from "@/app/lib/db/mongoDB";
// import { NextResponse } from "next/server";
// import User from "@/app/lib/models/userSchema";

// export async function POST(req: Request) {
//   try {
//     await connect();
//     const { email } = await req.json();

//     const user = await User.findOne({ email });
//     if (!user) {
//       return NextResponse.json({ message: "User not found." }, { status: 404 });
//     }

//     // יצירת קוד אימות
//     const verificationCode = Math.floor(100000 + Math.random() * 900000); // קוד בן 6 ספרות
//     user.verificationCode = verificationCode; // שמירת הקוד במסד הנתונים
//     user.verificationCodeExpiry = Date.now() + 10 * 60 * 1000; // תוקף ל-15 דקות
//     await user.save();

//     // שליחת הקוד למייל
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Your Password Reset Code",
//       text: `Your verification code is ${verificationCode}`,
//     });

//     return NextResponse.json({ message: "Verification code sent." });
//   } catch (error) {
//     console.error("Error sending verification code:", error);
//     return NextResponse.json({ message: "Failed to send verification code." }, { status: 500 });
//   }
// }
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import connect from "@/app/lib/db/mongoDB";
import { NextResponse } from "next/server";
import User from "@/app/lib/models/userSchema";

export async function POST(req: Request) {
  try {
    await connect();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // יצירת קוד אימות
    const verificationCode = Math.floor(100000 + Math.random() * 900000); // קוד בן 6 ספרות

    // הצפנת קוד האימות
    const saltRounds = 10;
    const hashedCode = await bcrypt.hash(verificationCode.toString(), saltRounds);

    user.verificationCode = hashedCode; // שמירת הקוד המוצפן במסד הנתונים
    user.verificationCodeExpiry = Date.now() + 10 * 60 * 1000; // תוקף ל-10 דקות
    await user.save();

    // שליחת הקוד למייל
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Password Reset Code",
      text: `Your verification code is ${verificationCode}`,
    });

    return NextResponse.json({ message: "Verification code sent." });
  } catch (error) {
    console.error("Error sending verification code:", error);
    return NextResponse.json({ message: "Failed to send verification code." }, { status: 500 });
  }
}
