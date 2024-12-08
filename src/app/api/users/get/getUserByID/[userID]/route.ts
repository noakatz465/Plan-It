import connect from "@/app/lib/db/mongoDB";
import User from "@/app/lib/models/userSchema";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        await connect();

        const  userId  = req.url.split('/').pop();
        const user = await User.findById(userId)
            .populate("projects") // שליפה של אוסף projects
            .populate("tasks") // שליפה של אוסף tasks
            .populate("sharedWith"); // שליפה של אוסף sharedWith
        return NextResponse.json({
            message: "User fetched successfully",
            user,
          });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
          { message: "Failed to fetch user", error: error },
          { status: 500 }
        );
      }
}
