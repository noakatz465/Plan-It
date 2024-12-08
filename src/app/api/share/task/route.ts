import connect from "@/app/lib/db/mongoDB";
import Task from "@/app/lib/models/taskSchema";
import User from "@/app/lib/models/userSchema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        await connect();
        const data = await req.json();
        const { taskId, sharedByUserId, targetUserId } = data;

        const sharedByUser = await User.findById(sharedByUserId);
        const targetUser = await User.findById(targetUserId);
        const task = await Task.findById(taskId);

        if (!sharedByUser || !targetUser || !task) {
            return NextResponse.json(
                { message: "User or Task not found" },
                { status: 404 }
            );
        }

        // בדיקה אם המשתמש לא מופיע כבר במערך sharedWith של המשימה
        const isAlreadyShared = task.assignedUsers.includes(targetUserId);
        if (!isAlreadyShared) {
            task.assignedUsers.push(targetUserId);
            targetUser.tasks.push(taskId);

            await task.save();
            await targetUser.save();

            return NextResponse.json({
                message: "Task has been shared successfully.",
            });
        } else {
            return NextResponse.json({
                message: "Task is already shared with this user.",
            });
        }
    } catch (error) {
        console.error("Error accepting share:", error);
        return NextResponse.json(
            { message: "Failed to accept share", error: error },
            { status: 500 }
        );
    }
}