import React from "react";
import { TaskModel } from "../../models/taskModel";
import Link from "next/link";

interface TaskItemListProps {
  task: TaskModel; // המשימה הבודדת
}

const TaskListItem: React.FC<TaskItemListProps> = ({ task }) => {
  return (
    <div >
      <Link href={`/pages/viewTask/${task._id}`} className="flex items-center justify-between p-4 border-b hover:bg-gray-50 transition">
      {/* כותרת */}
      <span className="text-gray-800">{task.title}</span>
      {/* סטטוס */}
      <span
        className={`px-2 py-1 rounded text-white ${
          task.status === "Completed"
            ? "bg-green-500"
            : task.status === "In Progress"
            ? "bg-yellow-500"
            : "bg-gray-400"
        }`}
      >
        {task.status}
      </span>
      {/* עדיפות */}
      <span
        className={`font-semibold ${
          task.priority === "High"
            ? "text-red-500"
            : task.priority === "Medium"
            ? "text-yellow-500"
            : "text-green-500"
        }`}
      >
        {task.priority}
      </span>
      {/* תאריך יעד */}
      <span className="text-gray-500">
        {task.dueDate
          ? new Date(task.dueDate).toLocaleDateString()
          : "No due date"}
      </span>
      </Link>
    </div>
  );
};

export default TaskListItem;
