import axios from "axios";
import { TaskModel } from "@/app/models/taskModel";
import { NotificationModel } from "../models/notificationModel";

export async function createNotificationsPerUsers(
  notificationType: "TaskAssigned" | "TaskDueSoon" | "TaskOverdue",
  task: TaskModel,
  userIds: string[]
) {
  try {
    // בדיקה אם כל הנתונים הדרושים נמסרו
    if (!notificationType || !task || !userIds || !userIds.length) {
      throw new Error(
        "Missing required data: notificationType, task, or userIds"
      );
    }

    // הכנת הנתונים לבקשה
    const data = {
      notificationType,
      task,
      userIds,
    };

    // שליחת בקשת POST לשרת
    const response = await axios.post("/api/notifications/post/notificationPerUsers", data);

    // החזרת התגובה מהשרת
    return response.data;
  } catch (error) {
    console.error("Error creating notifications:", error);
    throw new Error("Failed to create notifications");
  }
}


// פונקציה לקבלת התראות לפי מזהה משתמש
export async function fetchNotificationsByUserId(userId: string): Promise<NotificationModel[]> {
  try {
    // בדיקה אם המשתנה userId תקין
    if (!userId) {
      throw new Error("Missing required userId parameter");
    }

    // שליחת בקשת GET לשרת
    const response = await axios.get(`/api/notifications/get/getNotificationsByUserId/${userId}`);

    // החזרת התגובה מהשרת
    console.log(response.data);
    console.log(response.data.notifications);

    return response.data as NotificationModel[];
  } catch (error) {
    console.error(`Error fetching notifications for userId: ${userId}`, error);
    throw new Error("Failed to fetch notifications");
  }
}

