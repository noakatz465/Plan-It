import connect from "@/app/lib/db/mongoDB";
import Task from "@/app/lib/models/taskSchema";
import User from "@/app/lib/models/userSchema";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        await connect();
        const data = await req.json();
        const { usertIdArr, taskId } = data;
        // מחיקה של מזהה המשימה ממערך המשימות של כל משתמש
        for (const userId of usertIdArr) {
            await User.findByIdAndUpdate(
                userId,
                { $pull: { tasks: taskId } },
                { new: true }
            );
        }
        // מחיקת המשתמשים ממערך המשתמשים המוצמדים למשימה
        await Task.findByIdAndUpdate(
            taskId,
            { $pull: { assignedUsers: { $in: usertIdArr } } },
            { new: true }
        );
        return NextResponse.json({
            message: "Task deleted"
        });

    } catch (error) {
        console.error("Error handling task-user updates:", error);
        return NextResponse.json(
            { message: "Failed to delete task", error: error },
            { status: 500 }
        );

    }
}