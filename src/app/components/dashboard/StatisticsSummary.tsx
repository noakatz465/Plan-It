"use client";
import React from "react";
import { useUserStore } from "@/app/stores/userStore";

const StatisticsSummary: React.FC = () => {
  const tasks = useUserStore((state) => state.getTasks());
  const projects = useUserStore((state) => state.getProjects());

  // חישוב נתונים מספריים
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "Completed").length;
  const pendingTasks = tasks.filter((task) => task.status === "Pending").length;
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress").length;
  const totalProjects = projects.length;

  // חישוב אחוזי השלמה
  const completionRate = totalTasks ? ((completedTasks / totalTasks) * 100).toFixed(1) : "0";

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      <div className="flex flex-col items-center justify-center p-3 rounded-lg shadow-lg">
        <span className="text-7xl font-bold text-blue-600">{totalProjects}</span>
        <p className="text-gray-600 text-sm ">פרויקטים</p>
      </div>
      <div className="flex flex-col items-center justify-center p-3 rounded-lg shadow-lg">
        <span className="text-7xl font-bold text-purple-600">{totalTasks}</span>
        <p className="text-gray-600 text-sm ">משימות</p>
      </div>
      <div className="flex flex-col items-center justify-center p-3 rounded-lg shadow-lg">
        <span className="text-4xl font-bold text-green-600">{completedTasks}</span>
        <p className="text-gray-600 text-sm mt-2">משימות הושלמו</p>
      </div>
      <div className="flex flex-col items-center justify-center p-3 rounded-lg shadow-lg">
        <span className="text-4xl font-bold text-orange-600">{inProgressTasks}</span>
        <p className="text-gray-600 text-sm mt-2">משימות בתהליך</p>
      </div>
      <div className="flex flex-col items-center justify-center p-3 rounded-lg shadow-lg">
        <span className="text-4xl font-bold text-red-500">{pendingTasks}</span>
        <p className="text-gray-600 text-sm mt-2">משימות מתינות </p>
      </div>
      <div className="flex flex-col items-center justify-center p-3 rounded-lg shadow-lg">
        <span className="text-4xl font-bold text-indigo-600">{completionRate}%</span>
        <p className="text-gray-600 text-sm mt-2">אחוזי השלמה</p>
      </div>
    </div>
  );
};

export default StatisticsSummary;
