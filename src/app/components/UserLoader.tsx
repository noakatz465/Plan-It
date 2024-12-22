"use client";
import React, { useEffect } from "react";
import { useUserStore } from "../stores/userStore";

const UserLoader = () => {
  const fetchUser = useUserStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser(); // שליפת המשתמש
  }, []);

  return null; // הקומפוננטה לא מציגה דבר
};

export default UserLoader;
