import connect from "@/app/lib/db/mongoDB";
import { NextResponse } from "next/server";
import AlertNotification from "@/app/lib/models/alertNotificationSchema";
import User from "@/app/lib/models/userSchema"; // הוספת מודל המשתמש

export async function POST(req: Request) {
    try {
        console.log("Connecting to the database...");
        await connect();
        console.log("Database connected.");

        const { notificationType, task, userIds } = await req.json();
        console.log("Request data received:", { notificationType, task, userIds });

        // בדיקה אם כל הנתונים הנדרשים נמסרו
        if (!notificationType) {
            console.error("Missing notificationType");
            return NextResponse.json(
              { message: "Missing required data: notificationType" },
              { status: 400 }
            );
          }
          
          if (!task) {
            console.error("Missing task object");
            return NextResponse.json(
              { message: "Missing required data: task object" },
              { status: 400 }
            );
          }
          
          if (!task._id) {
            console.error("Missing task ID");
            return NextResponse.json(
              { message: "Missing required data: task ID (_id)" },
              { status: 400 }
            );
          }
          
          if (!userIds || !userIds.length) {
            console.error("Missing user IDs");
            return NextResponse.json(
              { message: "Missing required data: user IDs (userIds)" },
              { status: 400 }
            );
          }
          
        const creatorId = task.managerID ? task.managerID : task.creator;


        // שליפת פרטי המשתמש מהשדה creator של המשימה
        const creator = await User.findById(creatorId);
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
                    
                    // התאמת טקסט ההתראה לפי סוג המשימה
                    const notificationText =
                        task.type === "project"
                            ? `הוזמנת להשתתף בפרויקט "${task.name}" על ידי המנהל: ${creator.firstName} ${creator.lastName} (${creator.email})`
                            : `הוזמנת להשתתף במשימה "${task.title}" על ידי היוצר: ${creator.firstName} ${creator.lastName} (${creator.email})`;

                    const newNotification = new AlertNotification({
                        taskId: task._id, // מזהה המשימה
                        notificationType, // סוג ההתראה (לדוגמה: TaskAssigned)
                        notificationText, // טקסט ההתראה המותאם לפי סוג המשימה
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
