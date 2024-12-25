"use client";

import React, { useEffect, useState } from "react";
import { useUserStore } from "../stores/userStore";
import { UserModel } from "../models/userModel";
const UserInfo: React.FC = () => {
  // const fetchUser = useUserStore((state) => state.fetchUser); // פעולה להבאת משתמש
  // const fetchUsers = useUserStore((state) => state.fetchUsers); // פעולה להבאת משתמשים
  // const users = useUserStore((state) => state.users); // רשימת המשתמשים מהחנות

  const userFromStore = useUserStore((state) => state.user); // הנתונים מהחנות
  const [user, setUser] = useState<UserModel | null>(userFromStore); // סטייט למשתמש
  const [loading, setLoading] = useState(true); // סטייט למצב טעינה
  const [error, setError] = useState<string | null>(null); // סטייט למצב שגיאה



  if (error) {
    return (
      <p className="text-center text-red-500">
        {error}
      </p>
    );
  }

  if (!user) {
    return (
      <p className="text-center text-gray-500">
        No user details available.
      </p>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-100 shadow">
      <div className="flex items-center mb-4">
        <img
          src={user.profileImage } // הצגת תמונה אם קיימת, אחרת תמונת ברירת מחדל
          alt={`${user.firstName} ${user.lastName}'s Profile`}
          className="w-16 h-16 rounded-full border shadow mr-4"
        />
        <h1 className="text-xl font-bold">
          Welcome, {user.firstName} {user.lastName}!
        </h1>
      </div>
      <ul className="list-disc list-inside">
      <li><strong>ID:</strong> {user._id}</li>
        <li><strong>Email:</strong> {user.email}</li>
        <li><strong>Gender:</strong> {user.gender || "Not specified"}</li>
        <li><strong>Birth Date:</strong> {user.birthDate ? new Date(user.birthDate).toLocaleDateString() : "Not specified"}</li>
        <li><strong>Join Date:</strong> {new Date(user.joinDate).toLocaleDateString()}</li>
        <li><strong>Notifications Enabled:</strong> {user.notificationsEnabled ? "Yes" : "No"}</li>
        <li><strong>Projects:</strong> {user.projects?.length > 0 ? user.projects.map((project) => project).join(", ") : "No projects available"}</li>
        <li><strong>Tasks:</strong> {user.tasks?.length > 0 ? user.tasks.map((task) => task).join(", ") : "No tasks available"}</li>
        <li><strong>Shared With:</strong> {user.sharedWith?.length > 0 ? user.sharedWith.join(", ") : "No shared users available"}</li>
        <li><strong>פרופיל</strong> {user.profileImage}</li>

      </ul>
    </div>
  );
};

export default UserInfo;
