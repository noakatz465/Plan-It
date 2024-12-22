// // import connect from "@/app/lib/db/mongoDB";
// // import { NextResponse } from "next/server";
// // import User from '@/app/lib/models/userSchema';
// // import bcrypt from "bcrypt";

// // export async function POST(req: Request) {
// //     try {
// //         await connect();
// //         const data = await req.json();
// //         console.log(data);

// //         const { email, password } = data;
// //         const existingUser = await User.findOne({ email });
// //         if (existingUser) {
// //           return NextResponse.json(
// //             { message: "User with this email already exists" },
// //             { status: 409 }
// //           );
// //         }
// //         const hashedPassword = await bcrypt.hash(password, 10);

// //         const newUser = new User({
// //            ...data,
// //           password: hashedPassword,
// //         });

// //         await newUser.save();

// //         return NextResponse.json({ message: "User created!" });


// //     }
// //     catch (error) {
// //         console.error("Error adding user:", error);
// //         return NextResponse.json(
// //           { message: "Failed to add user", error: error },
// //           { status: 500 }
// //         );
// //       }
// // }



// import connect from "@/app/lib/db/mongoDB";
// import { NextResponse } from "next/server";
// import User from "@/app/lib/models/userSchema";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { serialize } from "cookie";

// export async function POST(req: Request) {
//   try {
//     await connect();
//     const data = await req.json();
//     console.log(data);

//     const { email, password } = data;

//     // בדיקת קיום משתמש
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json(
//         { message: "User with this email already exists" },
//         { status: 409 }
//       );
//     }

//     // הצפנת סיסמה
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // יצירת משתמש חדש
//     const newUser = new User({
//       ...data,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     // יצירת טוקן
//     const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || "default_secret", {
//       expiresIn: "1h",
//     });

//     // הגדרת עוגיה
//     const cookie = serialize("auth_token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       path: "/",
//       maxAge: 60 * 60, // שעה
//     });

//     // תגובה
//     const response = NextResponse.json({ message: "User created and logged in!" });
//     response.headers.append("Set-Cookie", cookie);

//     return response;
//   } catch (error) {
//     console.error("Error adding user:", error);
//     return NextResponse.json(
//       { message: "Failed to add user", error: error },
//       { status: 500 }
//     );
//   }
// }
