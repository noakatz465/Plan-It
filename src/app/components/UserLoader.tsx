"use client";
import { useEffect } from "react";
import { useUserStore } from "../stores/userStore";
import { useNotificationsStore } from "../stores/notificationsStore";

const UserLoader = ({ onLoadingChange }: { onLoadingChange: (isLoading: boolean) => void }) => {
  const fetchUser = useUserStore((state) => state.fetchUser); // פעולה להבאת משתמש
  const { fetchNotifications } = useNotificationsStore();
  const userFromStore = useUserStore((state) => state.user); // המשתמש מהחנות

  useEffect(() => {
    const loadUserAndNotifications = async () => {
      try {
        onLoadingChange(true); // התחלת טעינה
        await fetchUser(); // שליפת המשתמש מהחנות

        if (userFromStore?._id) {
          await fetchNotifications(userFromStore._id); // שליפת התראות למשתמש אם קיים מזהה
          console.log("User and notifications loaded successfully");
        } else {
          console.warn("User ID not found; skipping notifications fetch");
        }
      } catch (err) {
        console.error("Error loading user or notifications:", err);
      } finally {
        onLoadingChange(false); // סיום טעינה
      }
    };

    loadUserAndNotifications();
  }, [fetchUser, userFromStore?._id, onLoadingChange]); // הוספת התלות על `userFromStore?._id`

  return null; // הקומפוננטה לא מציגה דבר
};

export default UserLoader;
