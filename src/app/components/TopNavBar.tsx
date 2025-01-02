"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUserStore } from "../stores/userStore";
import { UserModel } from "../models/userModel";
import {
  ArrowRightOnRectangleIcon,
  BellAlertIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { logoutUser } from "../services/authService";
import { signOut, useSession } from "next-auth/react";

function TopNavBar() {
  const userFromStore = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser); // פונקציה לניקוי פרטי המשתמש
  const router = useRouter();
  const [user, setUser] = useState<UserModel | null>(userFromStore);
  const [activeLink, setActiveLink] = useState<string>("");
  const { data: session, status } = useSession();

  const handleLinkClick = (link: string) => {
    setActiveLink(link); // סימון קישור כפעיל

    if (link === "logout") {
      handleSignOut(); // קריאה לפונקציית היציאה
    }
  };

  const handleSignOut = async () => {
    try {
      // console.log("Attempting to sign out...");
      // await signOut(); // התנתקות עם NextAuth
      // console.log("Sign-out successful");
      if (session) {
        console.log("User has a valid session. Using NextAuth sign out...");
        await signOut();
        console.log("Sign-out successful via NextAuth.");
      } else {
        console.log("No session detected. Using manual logout...");
        await logoutUser(router);
        console.log("Manual logout successful.");
      }
    } catch (error) {
      console.error("Error during sign-out:", error);
      console.error("Error during logout:", error);
    }
  };
  // const handleLogout = async () => {
    
  //   try {
  //     await logoutUser(router); // ניתוב מבוצע דרך הפונקציה
  //   } catch (error) {
  //     console.error("Logout failed:", error);
  //   }
  // };

  const getButtonClass = (link: string) =>
    `flex items-center justify-center w-10 h-10 rounded transition duration-200 ${
      activeLink === link ? "bg-[#9694FF]" : "hover:bg-[#3D3BF3]"
    }`;

  useEffect(() => {
    setUser(userFromStore);
  }, [user?.profileImage, userFromStore]);

  return (
    <div
      className="flex items-center justify-between bg-[#3D3BF3] text-white px-6 shadow-md"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "50px",
        zIndex: 10, // גובה הניווט העליון
      }}
    >
      {/* לוגו */}
      <div className="text-lg font-bold">PlanIt</div>

      {/* תפריט אייקונים */}
      <div className="flex items-center space-x-8 space-x-reverse">
        {/* יציאה */}
        <button
          title="יציאה"
          className={getButtonClass("logout")}
          onClick={() => handleLinkClick("logout")}
        >
          <ArrowRightOnRectangleIcon className="h-6 w-6 text-white ml-1" />
        </button>

        {/* הגדרות */}
        <Link href="/settings">
          <button
            className={getButtonClass("settings")}
            onClick={() => handleLinkClick("settings")}
            title="הגדרות"
          >
            <Cog6ToothIcon className="h-6 w-6 text-white ml-1" />
          </button>
        </Link>

        {/* התראות */}
        <Link href="/pages/main/notifications">
          <button
            className={getButtonClass("notifications")}
            onClick={() => handleLinkClick("notifications")}
            title="התראות"
          >
            <BellAlertIcon className="h-6 w-6 text-white ml-1" />
          </button>
        </Link>

        {/* פרופיל */}
        <Link href="/pages/main/profile">
          <button
            className={getButtonClass("profile")}
            onClick={() => handleLinkClick("profile")}
            title="פרופיל"
          >
            {user?.profileImage ? (
              <Image
                src={user.profileImage}
                alt="Profile"
                width={30}
                height={30}
                className="rounded-full"
                style={{
                  objectFit: "cover",
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                }}
                unoptimized
              />
            ) : (
              <Image
                src="https://res.cloudinary.com/ddbitajje/image/upload/v1735038509/t7ivdaq3nznunpxv2soc.png"
                alt="Anonymous Profile"
                width={30}
                height={30}
                className="rounded-full"
                style={{
                  objectFit: "cover",
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                }}
                unoptimized
              />
            )}
          </button>
        </Link>
      </div>
    </div>
  );
}

export default TopNavBar;
