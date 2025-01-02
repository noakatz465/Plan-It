"use client";

import React, { useState } from "react";
import { useUserStore } from "../../stores/userStore";
import { TaskModel } from "../../models/taskModel";
import TaskKanbanItem from "./TaskKanbanItem";

function TaskKanbanView() {
  const tasks = useUserStore((state) => state.getTasks());
  const updateTaskStatus = useUserStore((state) => state.updateTaskStatus);

  const [draggedTask, setDraggedTask] = useState<TaskModel | null>(null);

  // חלוקת המשימות לפי סטטוס
  const groupedTasks = tasks.reduce<Record<string, TaskModel[]>>(
    (acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = [];
      }
      acc[task.status].push(task);
      return acc;
    },
    {}
  );

  const handleDragStart = (task: TaskModel) => {
    setDraggedTask(task);
  };

  const handleDrop = async (status: "Pending" | "In Progress" | "Completed") => {
    if (draggedTask) {
        // עדכון הסטטוס ב-Store
        if(draggedTask._id) updateTaskStatus(draggedTask._id, status);

        // איפוס המשימה הנגררת
        setDraggedTask(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto flex justify-between">
      {["Pending", "In Progress", "Completed"].map((status) => (
        <div
          key={status}
          className="w-1/3 p-2"
          onDragOver={(e) => e.preventDefault()} // מאפשר שחרור באזור זה
          onDrop={() => handleDrop(status as "Pending" | "In Progress" | "Completed")} // שחרור באזור העמודה
        >
          <div className="pb-2 border-b border-[#3D3BF3] font-bold text-[#3D3BF3] mb-4 p-2">
            <h3 className="text-lg text-center">
              {status === "Pending"
                ? "חדש"
                : status === "In Progress"
                ? "בביצוע"
                : "הושלם"}
            </h3>
          </div>
          <div className="mt-4 flex flex-col items-center space-y-4">
            {groupedTasks[status]?.map((task) => (
              <div
                key={task._id}
                className="w-full"
                draggable
                onDragStart={() => handleDragStart(task)} // התחלת גרירה
              >
                <TaskKanbanItem task={task} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskKanbanView;

