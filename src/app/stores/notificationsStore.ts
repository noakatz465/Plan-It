import { create } from "zustand";
import { NotificationModel } from "@/app/models/notificationModel"; // ודא שמודל ההתראות מוגדר
import { fetchNotificationsByUserId, markNotificationAsRead } from "../services/notificationService"; // שירותים לפעולות נוספות

interface NotificationsState {
  notifications: NotificationModel[]; // רשימת ההתראות
  fetchNotifications: (userId: string) => Promise<void>; // פונקציה לשליפת ההתראות לפי מזהה משתמש
  markAsRead: (notificationId: string) => Promise<void>; // סימון התראה כ"נקראה"
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
}));
