import { create } from "zustand";
import { NotificationModel } from "@/app/models/notificationModel"; // ודא שמודל ההתראות מוגדר
import { fetchNotificationsByUserId, markNotificationAsRead, createNotificationsPerUsers, createProjectNotificationsPerUsers } from "../services/notificationService"; // שירותים לפעולות נוספות
import { TaskModel } from "../models/taskModel";
import { ProjectModel } from "../models/projectModel";

interface NotificationsState {
  notifications: NotificationModel[]; // רשימת ההתראות
  fetchNotifications: (userId: string) => Promise<void>; // פונקציה לשליפת ההתראות לפי מזהה משתמש
  createProjectNotifications:(
    notificationType: "ProjectAssigned",
    project: ProjectModel,
    userIds: string[]
  ) => Promise<void>; // יצירת התראות פר משתמשים
  markAsRead: (notificationId: string) => Promise<void>; // סימון התראה כ"נקראה"
  createNotificationsPerUsers: (
    notificationType: "TaskAssigned" | "TaskDueSoon" | "TaskOverdue",
    task: TaskModel,
    userIds: string[]
  ) => Promise<void>; // יצירת התראות פר משתמשים
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: [],

  // שליפת התראות מהשרת לפי userId
  fetchNotifications: async (userId: string) => {
    try {
      const fetchedNotifications = await fetchNotificationsByUserId(userId);
      set({ notifications: fetchedNotifications });
      console.log("Notifications fetched successfully:", fetchedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  },

  // סימון התראה כ"נקראה"
  markAsRead: async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId); // קריאה ל-API לעדכון בשרת
      set((state) => ({
        notifications: state.notifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        ),
      }));
      console.log(`Notification ${notificationId} marked as read.`);
    } catch (error) {
      console.error(`Error marking notification ${notificationId} as read:`, error);
    }
  },

  // יצירת התראות פר משתמשים
  createNotificationsPerUsers: async (
    notificationType: "TaskAssigned" | "TaskDueSoon" | "TaskOverdue",
    task: TaskModel,
    userIds: string[]
  ) => {
    try {
      await createNotificationsPerUsers(notificationType, task, userIds);
      console.log("Notifications created successfully.");
    } catch (error) {
      console.error("Error creating notifications:", error);
    }

  },
  createProjectNotifications: async (
    notificationType: "ProjectAssigned",
    project: ProjectModel,
    userIds: string[]
  ) => {
    try {
      await createProjectNotificationsPerUsers(notificationType, project, userIds);
      console.log("Notifications created successfully.");
    } catch (error) {
      console.error("Error creating notifications:", error);
    }
  }
}));
