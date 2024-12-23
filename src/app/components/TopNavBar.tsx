"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUserStore } from "../stores/userStore";
import { UserModel } from "../models/userModel";


function TopNavBar() {
    const userFromStore = useUserStore((state) => state.user);
    const [user, setUser] = useState<UserModel | null>(userFromStore);
    useEffect(() => {
        console.log("User profileImage:", user?.profileImage);
      }, [user]);
    

    return (
        <div className="flex items-center justify-between bg-blue-600 text-white px-6 py-4 shadow-md">
            {/* לוגו */}
            <div className="text-2xl font-bold">
                PlanIt
            </div>

            {/* תפריט אייקונים */}
            <div className="flex items-center space-x-4 space-x-reverse">
                <button className="flex items-center hover:text-gray-200 transition duration-200">
                    🔍 <span className="ml-1">חיפוש</span>
                </button>
                <Link href="/settings" className="flex items-center hover:text-gray-200 transition duration-200">
                    ⚙️ <span className="ml-1">הגדרות</span>
                </Link>
                <Link href="/notifications" className="flex items-center hover:text-gray-200 transition duration-200">
                    🔔 <span className="ml-1">התראות</span>
                </Link>
                <Link href="/pages/main/profile" className="flex items-center hover:text-gray-200 transition duration-200">
                    {user?.profileImage ? (
                        <Image
                            src={user.profileImage}
                            alt="Profile"
                            width={32}
                            height={32}
                            className="rounded-full object-cover"
                            unoptimized
                        />
                    ) : (
                        <Image
                            src="" // תמונת ברירת מחדל
                            alt="Anonymous Profile"
                            width={32}
                            height={32}
                            className="rounded-full object-cover"
                        />
                    )}
                </Link>
            </div>
        </div>
    );
}

export default TopNavBar;
