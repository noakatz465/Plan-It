import { create } from "zustand";
import { NotificationModel } from "@/app/models/notificationModel"; // ודא שמודל ההתראות מוגדר
import { fetchNotificationsByUserId } from "../services/notificationService";

interface NotificationsState {
  notifications: NotificationModel[]; // רשימת ההתראות
  fetchNotifications: (userId: string) => Promise<void>; // פונקציה לשליפת ההתראות לפי מזהה משתמש
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
}));
