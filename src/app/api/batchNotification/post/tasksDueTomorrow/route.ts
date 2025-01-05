import connect from "@/app/lib/db/mongoDB";
import { NextResponse } from "next/server";
import Task from "@/app/lib/models/taskSchema";
import User from "@/app/lib/models/userSchema";
import { TaskModel } from "@/app/models/taskModel";

export async function POST() {
  try {
    console.log("Connecting to the database...");
    await connect();
    console.log("Database connected.");

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    console.log(`Fetching tasks with dueDate: ${tomorrow.toDateString()}`);

    const tasksDueTomorrow = await Task.find({
      dueDate: {
        $gte: new Date(tomorrow.setHours(0, 0, 0, 0)),
        $lt: new Date(tomorrow.setHours(23, 59, 59, 999)),
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

    // שליחת המיילים למשתמשים
    const tasksByUser: { [userId: string]: TaskModel[] } = {};

    // לולאה על כל המשימות להוספת המשתמשים והיוצרים
    tasksDueTomorrow.forEach((task) => {
      // הוספת המשתמשים שהוקצו למשימה
      task.assignedUsers.forEach((userId: string) => {
        if (!tasksByUser[userId]) {
          tasksByUser[userId] = [];
        }
        tasksByUser[userId].push(task);
      });

      // הוספת יוצר המשימה (creator) לרשימת המיילים
      const creatorId = task.creator.toString(); // ID של יוצר המשימה
      if (!tasksByUser[creatorId]) {
        tasksByUser[creatorId] = [];
      }
      tasksByUser[creatorId].push(task);
    });

    // שליפת פרטי המשתמשים לפי מזהי userId
    const userIds = Object.keys(tasksByUser);
    const users = await User.find({ _id: { $in: userIds } });

    // יצירת רשימת המיילים לשליחה
    const emails = users
      .filter((user) => user.email) // סינון משתמשים ללא אימייל
      .map((user) => {
        const tasksList = tasksByUser[user._id.toString()]
          .map(
            (task) =>
              `<li><strong>${task.title}</strong> - ${task.description || "ללא תיאור"} (מועד: ${new Date().toLocaleDateString()})</li>`
          )
          .join("");

          return {
            to: user.email, // כתובת האימייל של המשתמש
            subject: "התראות למשימות מחר",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #9694FF; border-radius: 8px; padding: 20px; background-color: #EBEAFF;">
                <h2 style="color: #3D3BF3; text-align: center;">PlanIt - התראות יומיות</h2>
                <p style="font-size: 18px; color: #3D3BF3;">שלום ${user.firstName},</p>
                <p style="font-size: 16px; color: #000;">אלה המשימות שלך למחר:</p>
                <ul style="padding-left: 20px; color: #000; list-style-type: disc;">
                  ${tasksList}
                </ul>
                <p style="font-size: 16px; color: #000;">נא לשים לב למועדים ולהיערך בהתאם.</p>
                <p style="text-align: center; font-size: 14px; color: #FF2929; margin-top: 20px;">הודעה זו נשלחה מ-<strong>PlanIt</strong></p>
              </div>
            `,
          };
          
      });

    console.log(`Sending ${emails.length} emails`);
    console.log("Emails to send:", emails);

    // שליחת המיילים לשרת המייל
    const emailResponse = await fetch(
      "http://localhost:3000/api/notifications/post/sendEmail",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emails),
      }
    );

    // תוצאות שליחת המיילים
    const emailResults = {
      success: emailResponse.ok,
      message: emailResponse.ok
        ? "Emails sent successfully"
        : `Failed to send emails: ${emailResponse.statusText}`,
    };

    if (!emailResponse.ok) {
      console.error(`Error sending emails: ${emailResponse.statusText}`);
    } else {
      console.log("All emails sent successfully.");
    }

    return NextResponse.json(
      {
        message: "All tasks notifications and emails sent successfully.",
        successfulCalls: results.filter((result) => result.success),
        failedCalls: results.filter((result) => !result.success),
        emailResults,
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
