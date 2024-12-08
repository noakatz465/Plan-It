'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchUserDetailsByCookie, logoutUser } from "../services/authService";
import { UserModel } from "@/app/models/userModel";

function UserProfile() {
  const [user, setUser] = useState<UserModel | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        const userDetails = await fetchUserDetailsByCookie();
        setUser(userDetails);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        router.push("/"); // ניתוב למסך התחברות אם יש שגיאה
      }
    };

    loadUserDetails();
  }, [router]);

  const handleLogout = async () => {
    try {
      await logoutUser(router); // ניתוב מבוצע דרך הפונקציה
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}

export default UserProfile;
