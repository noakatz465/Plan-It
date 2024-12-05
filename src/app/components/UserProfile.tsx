'use client'
import React, { useEffect, useState } from "react";
import { fetchUserDetails } from "../services/authService";
import { UserModel } from "@/app/models/userModel";

function UserProfile() {
  const [user, setUser] = useState<UserModel | null>(null);

  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        const userDetails = await fetchUserDetails();
        const userInstance = new UserModel(
          userDetails.firstName,
          userDetails.lastName,
          userDetails.email,
          userDetails.password,
          new Date(userDetails.joinDate),
          userDetails.notificationsEnabled,
          userDetails.projects || [],
          userDetails.tasks || [],
          userDetails.sharedWith || [],
          userDetails._id,
          userDetails.birthDate ? new Date(userDetails.birthDate) : undefined,
          userDetails.gender
        );
        setUser(userInstance);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    loadUserDetails();
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.firstName} {user.lastName}!</h1>
      <p>Email: {user.email}</p>
      <p>Gender: {user.gender || "Not specified"}</p>
      <p>Birth Date: {user.birthDate ? user.birthDate.toLocaleDateString() : "Not specified"}</p>
      <p>Notifications Enabled: {user.notificationsEnabled ? "Yes" : "No"}</p>

    </div>
  );
}

export default UserProfile;
