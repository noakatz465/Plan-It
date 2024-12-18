import React from "react";

interface TaskNavBarProps {
  onChangeView: (view: "list" | "calendar" | "kanban") => void;
}

function TaskNavBar({ onChangeView }: TaskNavBarProps) {
  return (
    <div className="bg-white p-4 flex items-center justify-between w-full shadow-md">
      {/* כפתור המשימות שלי */}
      <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200">
        ➕ המשימות שלי
      </button>

      {/* שורת חיפוש */}
      <div className="flex-1 mx-4">
        <input
          type="text"
          placeholder="חיפוש"
          className="w-42 px-4 py-1 rounded-full bg-purple-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
      </div>

      {/* תפריט בחירת תצוגה */}
      <div className="flex space-x-4 items-center">
        <select
          onChange={(e) => onChangeView(e.target.value as "list" | "calendar" | "kanban")}
          className="px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
        >
          <option value="list">📋 רשימה</option>
          <option value="calendar">📅 לוח שנה</option>
          <option value="kanban">🗂️ קנבן</option>
        </select>
      </div>
    </div>
  );
}

export default TaskNavBar;
