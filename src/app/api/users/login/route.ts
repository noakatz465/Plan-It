// import connect from "@/app/lib/db/mongoDB";
// import User from "@/app/lib/models/userSchema";
// import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";

// export async function POST(req: Request) {
//     try {
//         await connect();
//         const { email, password } = await req.json();

//         const user = await User.findOne({ email }).populate('tasks').populate('projects');;
//         if (!user) {
//             return NextResponse.json(
//                 { message: "User not found" },
//                 { status: 404 }
//             );
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return NextResponse.json(
//                 { message: "Invalid password" },
//                 { status: 401 }
//             );
//         }
//         return NextResponse.json({
//             message: "User authenticated successfully",
//             user,
//         });
//     } catch (error) {
//         console.error("Error authenticating user:", error);
//         return NextResponse.json(
//             { message: "Failed to authenticate user", error: error },
//             { status: 500 }
//         );
//     }
// }