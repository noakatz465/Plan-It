"use client";
import React from "react";
import { useUserStore } from "@/app/stores/userStore";
import TaskListItem from "../tasks/TaskListItem";

function ClosestTasks() {
  const tasks = useUserStore((state) => state.getTasks());

  // חישוב 3 המשימות הקרובות להיום
  const closestTasks = tasks
  .filter((task) => {
    if (!task.dueDate) return false; // אם אין תאריך יעד, המשימה לא נחשבת
    const taskDate = new Date(task.dueDate).setHours(0, 0, 0, 0); // מחזיר את תחילת היום של תאריך המשימה
    const todayDate = new Date().setHours(0, 0, 0, 0); // תחילת היום הנוכחי
    return taskDate > todayDate; // רק אם המשימה עתידית
  })
  .sort(
    (a, b) =>
      new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime() // מיון המשימות לפי הקרובות ביותר
  )
  .slice(0, 3); // לקיחת 3 המשימות הקרובות ביותר

  return (
    <div >
      {closestTasks.length === 0 ? (
        <p className="text-gray-500 text-center">אין משימות קרובות לביצוע</p>
      ) : (
        <ul className="space-y-2">
          {closestTasks.map((task) => (
            <li key={task._id} className=" bg-gray-50 rounded-lg hover:bg-gray-100">
              <TaskListItem task={task} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ClosestTasks;
