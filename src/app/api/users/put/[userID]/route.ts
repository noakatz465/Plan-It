import connect from "@/app/lib/db/mongoDB";
import User from "@/app/lib/models/userSchema";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        await connect();
        const data = await req.json();
        const  userId  = req.url.split('/').pop();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }
        if (data.firstName) user.firstName = data.firstName;
        if (data.lastName) user.lastName = data.lastName;
        if (data.email) user.email = data.email;
        if (data.gender) user.gender = data.gender;
        if (data.birthDate) user.birthDate = data.birthDate;
        if (data.profileImage) user.profileImage = data.profileImage;

        await user.save();
        return NextResponse.json({
            message: "User updated successfully",
            user,
        });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            { message: "Failed to update user", error: error },
            { status: 500 }
        );
    }
}