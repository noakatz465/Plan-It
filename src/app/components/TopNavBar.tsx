"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUserStore } from "../stores/userStore";
import { UserModel } from "../models/userModel";
import { BellAlertIcon, CogIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function TopNavBar() {
  const userFromStore = useUserStore((state) => state.user);
  const [user, setUser] = useState<UserModel | null>(userFromStore);

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
        height: "50px", // גובה הניווט העליון
      }}
    >
      {/* לוגו */}
      <div className="text-lg font-bold">PlanIt</div>

      {/* תפריט אייקונים */}
      <div className="flex items-center space-x-4 space-x-reverse">
        <button className="flex items-center hover:text-gray-200 transition duration-200">
          <MagnifyingGlassIcon className="h-6 w-6 text-white ml-1" />
        </button>
        <Link
          href="/settings"
          className="flex items-center hover:text-gray-200 transition duration-200"
          title="הגדרות"
        >
          <CogIcon className="h-6 w-6 text-white ml-1" />
        </Link>
        <Link
          href="/pages/main/notifications"
          className="flex items-center hover:text-gray-200 transition duration-200"
          title="התראות"
        >
          <BellAlertIcon className="h-6 w-6 text-white ml-1" />
        </Link>
        <Link
          href="/pages/main/profile"
          className="flex items-center hover:text-gray-200 transition duration-200"
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
        </Link>
      </div>
    </div>
  );
}

export default TopNavBar;
