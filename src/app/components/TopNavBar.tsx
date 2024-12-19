import React from "react";
import Link from "next/link";

function TopNavBar() {
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
                    👩‍🎨 <span className="ml-1">פרופיל</span>
                </Link>
            </div>
        </div>
    );
}

export default TopNavBar;
