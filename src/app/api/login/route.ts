// import connect from "@/app/lib/db/mongoDB";
// import { NextResponse } from "next/server";
// import User from "@/app/lib/models/userSchema";
// import bcrypt from "bcrypt";

// export async function POST(req: Request) {
//     try {
//         await connect();
//         const { email, password } = await req.json();

//         // בדוק אם המשתמש קיים
//         const user = await User.findOne({ email });
//         if (!user) {
//             return NextResponse.json({ message: "User not found. Please sign up." }, { status: 404 });
//         }

//         // בדוק אם הסיסמה נכונה
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return NextResponse.json({ message: "Incorrect password. Please try again." }, { status: 401 });
//         }

//         // הצלחה - החזרת כל פרטי המשתמש (ללא הסיסמה)
//         const { password: _, ...userWithoutPassword } = user.toObject(); // מסיר את השדה password
//         return NextResponse.json({ message: "Login successful", user: userWithoutPassword });
//     } catch (error) {
//         console.error("Error during login:", error);
//         return NextResponse.json({ message: "An error occurred. Please try again." }, { status: 500 });
//     }
// }


// // ייבוא החיבורים הדרושים
// import connect from "@/app/lib/db/mongoDB";
// import { NextResponse } from "next/server";
// import User from "@/app/lib/models/userSchema";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken"; // לניהול טוקנים
// import { serialize } from "cookie"; // לניהול עוגיות

// // פונקציית POST - מטפלת בבקשות התחברות משתמשים
// export async function POST(req: Request) {
//     try {
//         // חיבור למסד הנתונים
//         await connect();

//         // חילוץ אימייל וסיסמה מהבקשה
//         const { email, password } = await req.json();

//         // בדיקת קיום המשתמש במסד הנתונים
//         const user = await User.findOne({ email });
//         if (!user) {
//             return NextResponse.json({ message: "User not found. Please sign up." }, { status: 404 });
//         }

//         // בדיקת תקינות הסיסמה
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return NextResponse.json({ message: "Incorrect password. Please try again." }, { status: 401 });
//         }

//         // יצירת JWT Token עם פרטי המשתמש
//         const token = jwt.sign(
//             { id: user._id },
//             process.env.JWT_SECRET || "default_secret", // שימוש במפתח הסודי
//             { expiresIn: "1h" } // תוקף של שעה
//         );

//         // יצירת עוגיה עם הטוקן
//         const cookie = serialize("auth_token", token, {
//             httpOnly: true, // העוגיה נגישה רק ב-HTTP
//             secure: process.env.NODE_ENV === "production", // מאובטח בסביבת Production
//             sameSite: "strict", // מגן מפני CSRF
//             path: "/", // זמין לכל הנתיבים באתר
//             maxAge: 60 * 60, // תוקף של שעה
//         });

//         // לוג לצורך בדיקה ודיבוג
//         console.log("JWT Token created:", token);

//         // יצירת תגובה עם פרטי המשתמש (ללא הסיסמה)
//         const response = NextResponse.json({
//             message: "Login successful",
//             user: { ...user.toObject(), password: undefined },
//         });

//         // הגדרת העוגיה בכותרת התגובה
//         response.headers.append("Set-Cookie", cookie);

//         // החזרת התגובה ללקוח
//         return response;
//     } catch (error) {
//         // טיפול בשגיאות והדפסתן בקונסול
//         console.error("Error during login:", error);

//         // החזרת הודעת שגיאה ללקוח
//         return NextResponse.json({ message: "An error occurred. Please try again." }, { status: 500 });
//     }
// }




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

