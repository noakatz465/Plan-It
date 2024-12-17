import Link from "next/link";
import React from "react";

function SideNavBar() {
    return (
        <div
            className="w-16 bg-blue-500 h-full flex flex-col items-center py-4 space-y-6 text-white shadow-md">
            <Link href="/pages/main/tasks">
                <button className="hover:bg-blue-600 p-2 rounded transition duration-200">
                    📋משימות
                </button>
            </Link>

            <Link href="/pages/main/projects">
                <button className="hover:bg-blue-600 p-2 rounded transition duration-200">
                    📄פרויקטים
                </button>
            </Link>

            <Link href="/pages/main/dashboard">
                <button className="hover:bg-blue-600 p-2 rounded transition duration-200">
                    📊דשבורד
                </button>
            </Link>
            {/* קו מפריד */}
            <div className="border-t border-blue-300 w-10"></div>

            <Link href="/pages/main/dashboard">
                <button className="hover:bg-blue-600 p-2 rounded transition duration-200">
                    ⚙️
                </button>
            </Link>

        </div>
    );
}

export default SideNavBar;
