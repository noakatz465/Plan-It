"use client";

import React from "react";
import { useSession } from "next-auth/react";

function formatDate(date: Date | null | undefined): string {
  return date ? new Date(date).toLocaleDateString() : "Not provided";
}

function UserInfo() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>; // טוען אם המידע עדיין לא נטען
  }

  if (!session?.user) {
    return <p>No user logged in</p>; // אם אין משתמש מחובר
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-100 shadow">
      <h2 className="text-lg font-bold">User Info</h2>
      <p>
        <strong>ID:</strong> {session.user.id}
      </p>
      <p>
        <strong>First Name:</strong> {session.user.firstName || "Not provided"}
      </p>
      <p>
        <strong>Last Name:</strong> {session.user.lastName || "Not provided"}
      </p>
      <p>
        <strong>Email:</strong> {session.user.email || "Not provided"}
      </p>
      <p>
        <strong>Birth Date:</strong> {formatDate(session.user.birthDate)}
      </p>
      <p>
        <strong>Gender:</strong> {session.user.gender || "Not provided"}
      </p>
      <p>
        <strong>Notifications Enabled:</strong>{" "}
        {session.user.notificationsEnabled ? "Yes" : "No"}
      </p>
      <p>
        <strong>Projects:</strong>{" "}
        {session.user.projects?.join(", ") || "No projects assigned"}
      </p>
      <p>
        <strong>Tasks:</strong>{" "}
        {session.user.tasks?.join(", ") || "No tasks assigned"}
      </p>
      <p>
        <strong>Shared With:</strong>{" "}
        {session.user.sharedWith?.join(", ") || "No shared users"}
      </p>
      <p>
        <strong>Image:</strong>
      </p>
      {session.user.image ? (
        <img
          src={session.user.image}
          alt={session.user.firstName || "User Image"}
          className="w-16 h-16 rounded-full mt-2"
        />
      ) : (
        <p>No image provided</p>
      )}
    </div>
  );
}

export default UserInfo;
