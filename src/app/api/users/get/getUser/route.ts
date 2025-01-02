import connect from "@/app/lib/db/mongoDB";
import { NextResponse } from "next/server";
import User from "@/app/lib/models/userSchema";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    await connect();

    // חילוץ עוגיה
    const cookies = req.headers.get("cookie");
    if (!cookies) {
      return NextResponse.json({ message: "No cookies found." }, { status: 401 });
    }

    const token = cookies
      .split("; ")
      .find((cookie) => cookie.startsWith("auth_token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ message: "Authorization token missing." }, { status: 401 });
    }

    // אימות הטוקן
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as { id: string };

    // שליפת המשתמש
    const user = await User.findById(decoded.id)
      .populate("projects") // שליפת כל המידע על projects
      .populate("tasks") // שליפת כל המידע על tasks
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // הסרת הסיסמה והחזרת הנתונים
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    const userObject = user.toObject();
    userObject.password = ""; // השארת השדה עם ערך ריק
    return NextResponse.json({ user: userObject });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json({ message: "An error occurred. Please try again." }, { status: 500 });
  }
}
