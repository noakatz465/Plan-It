"use client";
import React from "react";
import { useUserStore } from "@/app/stores/userStore";
import TaskListItem from "../tasks/TaskListItem";

function ClosestTasks() {
  const tasks = useUserStore((state) => state.getTasks());

  // חישוב 4 המשימות הקרובות להיום
  const closestTasks = tasks
    .filter((task) => task.dueDate && new Date(task.dueDate) >= new Date()) // וידוא תאריך תקין וסינון משימות
    .sort(
      (a, b) =>
        new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime() // שימוש ב-`!` להבטחת קיום תאריך
    )
    .slice(0, 3); // לקיחת 4 המשימות הקרובות

  return (
    <ul>
    {closestTasks.map((task) => (
      <li key={task._id}>
        <TaskListItem task={task} />
      </li>
    ))}
  </ul>
  );
}

export default ClosestTasks;
