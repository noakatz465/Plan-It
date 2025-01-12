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
import { useNotificationsStore } from "../stores/notificationsStore";

function TopNavBar() {
  const userFromStore = useUserStore((state) => state.user);
  const router = useRouter();
  const [user, setUser] = useState<UserModel | null>(userFromStore);
  const [activeLink, setActiveLink] = useState<string>("");
  const { data: session } = useSession();
  const { notifications } = useNotificationsStore();
  const unreadCount = notifications.filter((notification) => !notification.isRead).length; // ספירת ההתראות שלא נקראו

  const handleLinkClick = (link: string) => {
    setActiveLink(link); // סימון קישור כפעיל

    if (link === "logout") {
      handleSignOut(); // קריאה לפונקציית היציאה
    }
  };

  const handleSignOut = async () => {
    try {
      if (session) {
        await signOut();
      } else {
        await logoutUser(router);
      }
    } catch (error) {
      console.error("Error during sign-out:", error);
      console.error("Error during logout:", error);
    }
  };

  const getButtonClass = (link: string) =>
    `flex items-center justify-center w-10 h-10 rounded transition duration-200 ${activeLink === link ? "bg-[#9694FF]" : "hover:bg-[#3D3BF3]"
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
      }}>
      <div className="text-lg font-bold">PlanIt</div>

      {/* תפריט אייקונים */}
      <div className="flex items-center space-x-8 space-x-reverse">
        {/* יציאה */}
        <button
          title="יציאה"
          className={getButtonClass("logout")}
          onClick={() => handleLinkClick("logout")}>
          <ArrowRightOnRectangleIcon className="h-6 w-6 text-white ml-1" />
        </button>

        {/* הגדרות */}
        <Link href="/pages/main/setting">
          <button
            className={getButtonClass("settings")}
            onClick={() => handleLinkClick("settings")}
            title="הגדרות">
            <Cog6ToothIcon className="h-6 w-6 text-white ml-1" />
          </button>
        </Link>

        {/* התראות */}
        <Link href="/pages/main/notifications">
          <button
            className={getButtonClass("notifications")}
            onClick={() => handleLinkClick("notifications")}
            title="התראות">
            <div className="relative">
              <BellAlertIcon className="h-6 w-6 text-white ml-1" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF2929] text-white text-xs  rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                  {unreadCount}
                </span>
              )}
            </div>
          </button>
        </Link>


        {/* פרופיל */}
        <Link href="/pages/main/profile">
          <button
            className={getButtonClass("profile")}
            onClick={() => handleLinkClick("profile")}
            title="פרופיל">
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
