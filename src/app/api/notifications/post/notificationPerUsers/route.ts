import connect from "@/app/lib/db/mongoDB";
import { NextResponse } from "next/server";
import AlertNotification from "@/app/lib/models/alertNotificationSchema";
import mongoose from "mongoose";
import User from "@/app/lib/models/userSchema"; // הוספת מודל המשתמש

export async function POST(req: Request) {
    try {
        console.log("Connecting to the database...");
        await connect();
        console.log("Database connected.");

        const { notificationType, task, userIds } = await req.json();
        console.log("Request data received:", { notificationType, task, userIds });

        // בדיקה אם כל הנתונים הנדרשים נמסרו
        if (!notificationType || !task || !task._id || !userIds || !userIds.length) {
            console.error("Missing required data:", { notificationType, task, userIds });
            return NextResponse.json(
                { message: "Missing required data: notificationType, task, or userIds" },
                { status: 400 }
            );
        }

        // שליפת פרטי המשתמש מהשדה creator של המשימה
        const creator = await User.findById(task.creator);
        if (!creator) {
            console.error("Creator not found:", task.creator);
            return NextResponse.json(
                { message: "Creator not found", creatorId: task.creator },
                { status: 404 }
            );
        }
        console.log("Creator found:", creator);

        // יצירת התראות עבור כל משתמש במערך
        console.log("Creating notifications...");
        const notifications = await Promise.all(
            userIds.map(async (userId: string) => {
                try {
                    console.log(`Creating notification for userId: ${userId}`);
                    const newNotification = new AlertNotification({
                        taskId: task._id, // מזהה המשימה
                        notificationType, // סוג ההתראה (לדוגמה: TaskAssigned)
                        notificationText: `${creator.firstName} ${creator.lastName} (${creator.email}) הזמינה אותך להשתתף במשימה:  ${task.title}`, // טקסט ההתראה
                        recipientUserId: userId, // המשתמש אליו ההתראה מיועדת
                        notificationDate: new Date(), // מועד יצירת ההתראה
                        isRead: false, // ההתראה לא נקראה
                        status: "Active" // סטטוס ההתראה: פעילה
                    });

                    const savedNotification = await newNotification.save(); // שמירת ההתראה במסד הנתונים
                    console.log(`Notification saved for userId: ${userId}`, savedNotification);
                    return savedNotification;
                } catch (error) {
                    console.error(`Error saving notification for userId: ${userId}`, error);
                    throw error; // שומר על השגיאה בתוך Promise.all
                }
            })
        );

        // החזרת ההתראות שנוצרו כתגובה
        console.log("All notifications created successfully:", notifications);
        return NextResponse.json(notifications, { status: 200 });

    } catch (error) {
        console.error("Error creating notifications:", error);
        return NextResponse.json(
            { message: "Failed to create notifications", error: error },
            { status: 500 }
        );
    }
}
