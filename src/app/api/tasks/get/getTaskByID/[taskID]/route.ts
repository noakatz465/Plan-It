import connect from "@/app/lib/db/mongoDB";
import Task from "@/app/lib/models/taskSchema";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        await connect();

        const  taskId  = req.url.split('/').pop();
        const task = await Task.findById(taskId);

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