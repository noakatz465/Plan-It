"use client";

import React from "react";
import { useRouter } from "next/navigation";

const TaskNavBar: React.FC = () => {
  const router = useRouter();

  const handleViewChange = (view: "list" | "calendar" | "kanban") => {
    
    router.push(`/pages/main/tasks/${view}`); // מנתב לדף המתאים
  };
  const handleNavigateToAddTask = () => {
    // ניתוב לדף הוספת משימה
    router.push("/pages/main/tasks/addTask/");
  };

  return (
    <div className="bg-white p-4 flex items-center justify-between w-full shadow-md">
      {/* כפתור המשימות שלי */}
      <div className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200">
        המשימות שלי
      </div>
      <button
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
      onClick={handleNavigateToAddTask}
    >
      +
    </button>


      {/* שורת חיפוש */}
      <div className="flex-1 mx-4">
        <input
          type="text"
          placeholder="חיפוש"
          className="w-42 px-4 py-1 rounded-full bg-purple-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">
        סינון
      </button>
 
      {/* תפריט בחירת תצוגה */}
      <div className="flex space-x-4 items-center">
        <select
          onChange={(e) => handleViewChange(e.target.value as "list" | "calendar" | "kanban")}
          className="px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
        >
          <option value="list">📋 רשימה</option>
          <option value="calendar">📅 לוח שנה</option>
          <option value="kanban">🗂️ קנבן</option>
        </select>
      </div>
    </div>
  );
};

export default TaskNavBar;
