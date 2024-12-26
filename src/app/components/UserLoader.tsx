"use client";
import React, { useEffect, useState } from "react";
import { useUserStore } from "../stores/userStore";

const UserLoader = ({ onLoadingChange }: { onLoadingChange: (isLoading: boolean) => void }) => {
  const fetchUser = useUserStore((state) => state.fetchUser); // פעולה להבאת משתמש
  const fetchUsers = useUserStore((state) => state.fetchUsers); // פעולה להבאת משתמשים

  useEffect(() => {
    const loadUserAndUsers = async () => {
      try {
        onLoadingChange(true); // התחלת טעינה
        await fetchUser(); // שליפת המשתמש מהחנות
        await fetchUsers(); // שליפת המשתמשים מהחנות
        console.log("User and users loaded successfully");
      } catch (err) {
        console.error("Error loading user or users:", err);
      } finally {
        onLoadingChange(false); // סיום טעינה
      }
    };

    loadUserAndUsers();
  }, [fetchUser, fetchUsers, onLoadingChange]); // התלות כוללת את onLoadingChange

  return null; // הקומפוננטה לא מציגה דבר
};

export default UserLoader;
