import connect from "@/app/lib/db/mongoDB";
import Task from "@/app/lib/models/taskSchema";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        await connect();

        // שליפת ה- taskId מה-URL
        const taskId = req.url.split('/').pop();

        // חיפוש המשימה עם הפופולציה של המשתמשים והפרויקט
        const task = await Task.findById(taskId)
            .populate("assignedUsers") // פופיולט למשתמשים מקושרים
            .populate("projectId"); // פופיולט לפרויקט המקושר

        if (!task) {
            return NextResponse.json(
                { message: "Task not found" },
                { status: 404 }
            );
        }

        // החזרת המשימה
        return NextResponse.json({
            message: "Task fetched successfully",
            task,
        });
    } catch (error) {
        console.error("Error fetching task:", error);
        return NextResponse.json(
            { message: "Failed to fetch task", error: error },
            { status: 500 }
        );
    }
}
