"use client";

import React from "react";
import { useUserStore } from "../../stores/userStore";
import TaskListItem from "./TaskListItem"; // ייבוא הקומפוננטה שמציגה משימה בודדת

const TaskListView: React.FC = () => {
  const tasks = useUserStore((state) => state.tasks);

  if (!tasks || tasks.length === 0) {
    return <p className="text-center text-gray-500">אין משימות זמינות.</p>;
  }

  return (
    <div className="p-6">
      {/* כותרות לכל שדה */}
      <div className="flex items-center justify-between pb-2 border-b border-[#3D3BF3] font-bold text-[#3D3BF3] mb-4 p-2">
        <div className="flex-1 text-right pr-4">כותרת המשימה</div>
        <div className="flex-1 text-right pr-4">תדירות</div>
        <div className="flex-1 text-right pr-4">עדיפות</div>
        <div className="flex-1 text-center">סטטוס</div>
        <div className="flex-1 text-left">תאריך יעד</div>
      </div>

      {/* רשימת המשימות */}
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <TaskListItem task={task} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskListView;
