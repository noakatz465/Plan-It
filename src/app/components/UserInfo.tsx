"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserModel } from "../models/userModel";
import { fetchUserDetailsByCookie, fetchUserDetailsBySession, logoutUser } from "../services/authService";
import { log } from "console";

function UserInfo() {
  const { data: session, status } = useSession();
  const [userDetails, setUserDetails] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState(true); // מצב טעינה
  const router = useRouter();

  const fetchBySession = async () => {
    if (session?.user?._id) {
      console.log("Session user object:", session?.user);
      console.log("Fetching user details via session:", session.user._id);
      const details = await fetchUserDetailsBySession(session.user._id);
      setUserDetails(details);
      console.log(userDetails);

    } else {
      console.error("Session does not contain _id.");
    }
  };

  const fetchByCookie = async () => {
    console.log("Fetching user details via cookie...");
    const userDetails = await fetchUserDetailsByCookie();
    setUserDetails(userDetails);
    console.log(userDetails);

  };

  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        if (session?.user?._id) {
          console.log("if", session);
          await fetchBySession();
          console.log(userDetails);

        } else if (session) {
          console.log("else", session);
          // await fetchByCookie();
        } else {
          console.log("Session is still undefined");
          await fetchByCookie();

        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        // router.push("/"); // ניתוב למסך התחברות במקרה של שגיאה
      } finally {
        setLoading(false); // סיום טעינה
      }
    };

    if (status !== "loading") {
      // להריץ רק כאשר session לא במצב 'loading'
      loadUserDetails();
    }
  }, [session]);


  const handleSignOut = async () => {
    try {
      if (session) {
        console.log("User has a valid session. Using NextAuth sign out...");
        await signOut({ callbackUrl: "/" }); 
        console.log("Sign-out successful via NextAuth.");
      } else {
        console.log("No session detected. Using manual logout...");
        await logoutUser(router);
        console.log("Manual logout successful.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };



  if (status === "loading" || loading) {
    return <p>Loading...</p>; // הודעת טעינה
  }

  if (!userDetails) {
    return <p>Failed to load user details</p>; // הודעה במקרה ואין פרטי משתמש
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-100 shadow">
      <h1>
        Welcome, {userDetails.firstName} {userDetails.lastName}!
      </h1>
      <p>Email: {userDetails.email}</p>
      <p>Gender: {userDetails.gender || "Not specified"}</p>
      <p>
        Birth Date:{" "}
        {userDetails.birthDate
          ? userDetails.birthDate.toLocaleDateString()
          : "Not specified"}
      </p>
      <p>
        Notifications Enabled:{" "}
        {userDetails.notificationsEnabled ? "Yes" : "No"}
      </p>
      <button
        onClick={handleSignOut}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
      >
        Sign Out
      </button>

    </div>
  );
}

export default UserInfo;
