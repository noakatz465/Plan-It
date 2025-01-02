"use client";

import React from "react";
import { useUserStore } from "../../stores/userStore";
import { TaskModel } from "../../models/taskModel";
import TaskKanbanItem from "./TaskKanbanItem";

function TaskKanbanView() {
  const tasks = useUserStore((state) => state.getTasks());

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

  return (
    <div className="p-6 max-w-5xl mx-auto  flex justify-between">
      {/* עמודה: חדש */}
      <div className="w-1/3 p-2">
        <div className="pb-2 border-b border-[#3D3BF3] font-bold text-[#3D3BF3] mb-4 p-2">
          <h3 className="text-lg text-center">חדש</h3>
        </div>
        <div className="mt-4 flex flex-col items-center space-y-4">
          {groupedTasks.Pending?.map((task) => (
            <TaskKanbanItem key={task._id} task={task} />
          ))}
        </div>
      </div>

      {/* עמודה: בביצוע */}
      <div className="w-1/3 p-2">
        <div className="pb-2 border-b border-[#3D3BF3] font-bold text-[#3D3BF3] mb-4 p-2">
          <h3 className="text-lg text-center">בביצוע</h3>
        </div>
        <div className="mt-4 flex flex-col items-center space-y-4">
          {groupedTasks["In Progress"]?.map((task) => (
            <TaskKanbanItem key={task._id} task={task} />
          ))}
        </div>
      </div>

      {/* עמודה: הושלם */}
      <div className="w-1/3 p-2">
        <div className="pb-2 border-b border-[#3D3BF3] font-bold text-[#3D3BF3] mb-4 p-2">
          <h3 className="text-lg text-center">הושלם</h3>
        </div>
        <div className="mt-4 flex flex-col items-center space-y-4">
          {groupedTasks.Completed?.map((task) => (
            <TaskKanbanItem key={task._id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TaskKanbanView;

