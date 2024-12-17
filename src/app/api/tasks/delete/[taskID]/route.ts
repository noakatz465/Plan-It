import connect from "@/app/lib/db/mongoDB";
import Task from "@/app/lib/models/taskSchema";
import User from "@/app/lib/models/userSchema";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    try {
        await connect();

        const taskId = req.url.split('/').pop();
        const deletedTask = await Task.findByIdAndDelete(taskId);
        if (!deletedTask) {
            return NextResponse.json(
                { message: "Task not found" },
                { status: 404 }
            );
        }
        const assignedUsers = deletedTask.assignedUsers;
        if (assignedUsers && assignedUsers.length > 0) {
            await User.updateMany(
                { _id: { $in: assignedUsers } },
                { $pull: { tasks: taskId } }
            );
        }
        if (deletedTask.creator) {
            await User.updateOne(
                { _id: deletedTask.creator },
                { $pull: { tasks: taskId } }
            );
        }
        return NextResponse.json(
            { message: "Task deleted successfully and users updated", task: deletedTask },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error deleting task:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error },
            { status: 500 }
        );
    }
}