import connect from "@/app/lib/db/mongoDB";
import { NextResponse } from "next/server";
import Task from "@/app/lib/models/taskSchema";

export async function POST(req: Request) {
  try {
    console.log("Connecting to the database...");
    await connect();
    console.log("Database connected.");

    // חישוב תאריך של מחר
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    console.log(`Fetching tasks with dueDate: ${tomorrow.toDateString()}`);

    // שליפת משימות שתאריך היעד שלהן הוא מחר
    const tasksDueTomorrow = await Task.find({
      dueDate: {
        $gte: new Date(tomorrow.setHours(0, 0, 0, 0)), // תחילת היום
        $lt: new Date(tomorrow.setHours(23, 59, 59, 999)), // סוף היום
      },
    });

    console.log(`Tasks found: ${tasksDueTomorrow.length}`);

    if (tasksDueTomorrow.length === 0) {
      return NextResponse.json(
        { message: "No tasks due tomorrow." },
        { status: 200 }
      );
    }

    // קריאה לשרת עבור כל משימה
    const results = await Promise.all(
      tasksDueTomorrow.map(async (task) => {
        try {
          console.log(`Sending server request for task: ${task._id}`);

          const response = await fetch(
            "http://localhost:3000/api/notifications/post/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                notificationType: "TaskDueSoon",
                task: {
                  _id: task._id,
                  title: task.title,
                  description: task.description,
                  dueDate: task.dueDate,
                  frequency: task.frequency,
                  status: task.status,
                  priority: task.priority,
                  creator: task.creator,
                  assignedUsers: task.assignedUsers,
                },
              }),
            }
          );

          console.log(
            `Request sent to notifications API for task: ${task._id}, status: ${response.status}`
          );

          if (!response.ok) {
            console.error(
              `Error in server request for task: ${task._id}, status: ${response.status}`
            );
            return {
              taskId: task._id,
              success: false,
              error: `Server response status: ${response.status}`,
            };
          }

          const responseData = await response.json();
          console.log(`Notification created for task: ${task._id}`);
          return { taskId: task._id, success: true, data: responseData };
        } catch (error) {
          console.error(`Error processing task: ${task._id}`, error);
          return { taskId: task._id, success: false, error: error };
        }
      })
    );

    // בדיקות תוצאות הקריאה
    const successfulCalls = results.filter((result) => result.success);
    const failedCalls = results.filter((result) => !result.success);

    console.log(`Total tasks processed: ${tasksDueTomorrow.length}`);
    console.log(`Successful notifications: ${successfulCalls.length}`);
    console.log(`Failed notifications: ${failedCalls.length}`);

    if (failedCalls.length > 0) {
      console.warn("Some notifications failed to process:", failedCalls);
    }

    console.log("All server requests processed.");
    return NextResponse.json(
      {
        message: "Server requests processed",
        successfulCalls,
        failedCalls,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing tasks:", error);
    return NextResponse.json(
      { message: "Failed to process tasks", error: error },
      { status: 500 }
    );
  }
}
