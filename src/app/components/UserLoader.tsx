"use client";
import  { useEffect } from "react";
import { useUserStore } from "../stores/userStore";

const UserLoader = ({ onLoadingChange }: { onLoadingChange: (isLoading: boolean) => void }) => {
  const fetchUser = useUserStore((state) => state.fetchUser); // פעולה להבאת משתמש

  useEffect(() => {
    const loadUserAndUsers = async () => {
      try {
        onLoadingChange(true); // התחלת טעינה
        await fetchUser(); // שליפת המשתמש מהחנות
        console.log("User loaded successfully");
      } catch (err) {
        console.error("Error loading user or users:", err);
      } finally {
        onLoadingChange(false); // סיום טעינה
      }
    };

    loadUserAndUsers();
  }, [fetchUser, onLoadingChange]); // התלות כוללת את onLoadingChange

  return null; // הקומפוננטה לא מציגה דבר
};

export default UserLoader;
