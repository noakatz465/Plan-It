import React from "react";

function TopNavBar() {
    return (
        <div className="flex items-center justify-between bg-blue-600 text-white px-6 py-4 shadow-md">
            {/* תפריט אייקונים */}
            <div className="flex items-center space-x-6">
                <button className="hover:text-gray-200 transition duration-200">
                פרופיל
                </button>
                <button className="hover:text-gray-200 transition duration-200">
                    התראות
                </button>
                <button className="hover:text-gray-200 transition duration-200">
                    חיפוש
                </button>

            </div>

            {/* לוגו */}
            <div className="text-2xl font-bold">
                PlanIt
            </div>
        </div>


    );
}

export default TopNavBar;
