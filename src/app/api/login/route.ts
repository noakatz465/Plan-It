import connect from "@/app/lib/db/mongoDB";
import { NextResponse } from "next/server";
import User from "@/app/lib/models/userSchema";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        await connect();
        const { email, password } = await req.json();

        // בדוק אם המשתמש קיים
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "User not found. Please sign up." }, { status: 404 });
        }

        // בדוק אם הסיסמה נכונה
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: "Incorrect password. Please try again." }, { status: 401 });
        }

        // הצלחה - החזרת כל פרטי המשתמש (ללא הסיסמה)
        const { password: _, ...userWithoutPassword } = user.toObject(); // מסיר את השדה password
        return NextResponse.json({ message: "Login successful", user: userWithoutPassword });
    } catch (error) {
        console.error("Error during login:", error);
        return NextResponse.json({ message: "An error occurred. Please try again." }, { status: 500 });
    }
}


