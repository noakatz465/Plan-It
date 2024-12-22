// KanbanItem.tsx
import React from "react";
import { TaskModel } from "../../models/taskModel";
import Link from "next/link";

interface KanbanItemProps {
  task: TaskModel;
}

const TaskKanbanItem: React.FC<KanbanItemProps> = ({ task }) => {
  return (
    <div className="p-4 bg-white rounded shadow hover:bg-gray-50 transition">
              <Link href={`/pages/viewTask/${task._id}`} >

      <h4 className="font-bold text-gray-800">{task.title}</h4>
      <p className="text-sm text-gray-600">{task.description}</p>
      <span
        className={`text-xs font-semibold ${
          task.priority === "High"
            ? "text-red-500"
            : task.priority === "Medium"
            ? "text-yellow-500"
            : "text-green-500"
        }`}
      >
        {task.priority} Priority
      </span>
      </Link>
    </div>
  );
};

export default TaskKanbanItem;
