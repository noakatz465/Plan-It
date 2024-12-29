import React, { useState } from "react";
import { TaskModel } from "../../models/taskModel";
import ViewTask from "./ViewTask";

interface TaskItemListProps {
  task: TaskModel; // המשימה הבודדת
}

const TaskListItem: React.FC<TaskItemListProps> = ({ task }) => {
  const [selectedTask, setSelectedTask] = useState<TaskModel | null>(null);
  const [isViewTaskModalOpen, setIsViewTaskModalOpen] = useState(false);

  const handleOpenViewTaskModal = (task: TaskModel) => {
    setSelectedTask(task);
    setIsViewTaskModalOpen(true);
  };
  const handleCloseModal = () => {
    setSelectedTask(null);
    setIsViewTaskModalOpen(false);
  };

  return (
    <div >
      <div onClick={() => handleOpenViewTaskModal(task)} className="flex items-center justify-between p-4 border-b hover:bg-gray-50 transition">
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
      </div>
      {isViewTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded shadow-lg w-1/3"
            onClick={(e) => e.stopPropagation()}
          >                                            <button
            onClick={(e) => {
              e.stopPropagation();
              handleCloseModal();
            }}
            className="text-red-500 float-right font-bold">X</button>
            {selectedTask ? <ViewTask task={selectedTask} /> : ""}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskListItem;
