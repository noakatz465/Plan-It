import connect from "@/app/lib/db/mongoDB";
import { NextResponse } from "next/server";
import User from '@/app/lib/models/userSchema';
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        await connect();
        const data = await req.json();
        console.log(data);

        const { firstName, lastName, email, password } = data;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return NextResponse.json(
            { message: "User with this email already exists" },
            { status: 409 }
          );
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
          ...data,
         password: hashedPassword,
       })

        await newUser.save();

        return NextResponse.json({ message: "User created!" });


    }
    catch (error) {
        console.error("Error adding user:", error);
        return NextResponse.json(
          { message: "Failed to add user", error: error },
          { status: 500 }
        );
      }
}