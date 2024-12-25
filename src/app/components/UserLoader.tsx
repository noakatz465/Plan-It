"use client";
import React, { useEffect } from "react";
import { useUserStore } from "../stores/userStore";

const UserLoader = () => {
  const fetchUser = useUserStore((state) => state.fetchUser); // פעולה להבאת משתמש
  const fetchUsers = useUserStore((state) => state.fetchUsers); // פעולה להבאת משתמשים

  useEffect(() => {
    const loadUserAndUsers = async () => {
      try {
        await fetchUser(); // שליפת המשתמש מהחנות
        await fetchUsers(); // שליפת המשתמשים מהחנות
        console.log("User and users loaded successfully");
      } catch (err) {
        console.error("Error loading user or users:", err);
      }
    };

    loadUserAndUsers();
  }, [fetchUser, fetchUsers]); // התלות מתייחסת רק לפונקציות fetch

  return null; // הקומפוננטה לא מציגה דבר
};

export default UserLoader;
