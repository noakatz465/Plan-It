"use client";

import React from "react";
import { useUserStore } from "../stores/userStore";

const UserInfo: React.FC = () => {
  const user = useUserStore((state) => state.user); // שליפת המשתמש מהחנות

  // הצגת הודעה אם אין מידע על המשתמש
  if (!user) {
    return (
      <div className="text-center text-gray-500">
        <p>Loading user details...</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-100 shadow">
      <div className="flex items-center mb-4">
        <img
          src={user.profileImage || "/default-profile.png"} // הצגת תמונה אם קיימת, אחרת תמונת ברירת מחדל
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
        <li><strong>Projects:</strong> {user.projects?.length > 0 ? user.projects.map((project) => project.name).join(", ") : "No projects available"}</li>
        <li><strong>Tasks:</strong> {user.tasks?.length > 0 ? user.tasks.map((task) => task.title).join(", ") : "No tasks available"}</li>
        <li><strong>Shared With:</strong> {user.sharedWith?.length > 0 ? user.sharedWith.join(", ") : "No shared users available"}</li>
      </ul>
    </div>
  );
};

export default UserInfo;
