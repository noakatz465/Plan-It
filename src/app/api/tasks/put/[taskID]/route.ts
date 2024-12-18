import connect from "@/app/lib/db/mongoDB";
import Task from "@/app/lib/models/taskSchema";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        await connect();
        const data = await req.json();
        const  taskId  = req.url.split('/').pop();

        const task = await Task.findById(taskId);
        if (!task) {
            return NextResponse.json(
                { message: "Task not found" },
                { status: 404 }
            );
        }
        if (data.title) task.title = data.title;
        if (data.description) task.description = data.description;
        if (data.dueDate) task.dueDate = data.dueDate;
        if (data.frequency) task.frequency = data.frequency;
        if (data.status) task.status = data.status;
        if (data.priority) task.priority = data.priority;

        await task.save();
        return NextResponse.json({
            message: "Task updated successfully",
            task,
        });
    } catch (error) {
        console.error("Error updating task:", error);
        return NextResponse.json(
            { message: "Failed to update task", error: error },
            { status: 500 }
        );
    }
}