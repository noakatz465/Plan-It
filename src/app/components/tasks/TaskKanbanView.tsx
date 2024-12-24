"use client";

import React, { useState } from "react";
import { useUserStore } from "../../stores/userStore";
import { TaskModel } from "../../models/taskModel";
import TaskKanbanItem from "./TaskKanbanItem";

function TaskKanbanView() {
  const tasks = useUserStore((state) => state.tasks);
  // const [tasks, setTasks] = useState<TaskModel[]>(tasksFromStore);

  // חלוקת המשימות לפי סטטוס
  const groupedTasks = tasks.reduce<Record<string, TaskModel[]>>(
    (acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = []; // אתחול המפתח כמערך ריק אם אינו קיים
      }
      acc[task.status].push(task); // הוספת המשימה לקטגוריה המתאימה
      return acc;
    },
    {} // אובייקט ריק כמצטבר התחלתי
  );

  return (
    <div className="p-4 bg-purple-50 rounded shadow flex justify-between">
      {/* עמודה: חדש */}
      <div className="w-1/3 p-2">
        <h3 className="text-lg font-bold text-center text-purple-700">חדש</h3>
        <div className="mt-4 space-y-2">
          {groupedTasks.Pending?.map((task) => (
            <TaskKanbanItem key={task._id} task={task} />
          ))}
        </div>
      </div>

      {/* עמודה: בביצוע */}
      <div className="w-1/3 p-2">
        <h3 className="text-lg font-bold text-center text-purple-700">בביצוע</h3>
        <div className="mt-4 space-y-2">
          {groupedTasks["In Progress"]?.map((task) => (
            <TaskKanbanItem key={task._id} task={task} />
          ))}
        </div>
      </div>

      {/* עמודה: הושלם */}
      <div className="w-1/3 p-2">
        <h3 className="text-lg font-bold text-center text-purple-700">הושלם</h3>
        <div className="mt-4 space-y-2">
          {groupedTasks.Completed?.map((task) => (
            <TaskKanbanItem key={task._id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TaskKanbanView;
