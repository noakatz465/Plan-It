// KanbanItem.tsx
import React, { useState } from "react";
import { TaskModel } from "../../models/taskModel";
import ViewTask from "./ViewTask";

interface KanbanItemProps {
  task: TaskModel;
}

const TaskKanbanItem: React.FC<KanbanItemProps> = ({ task }) => {
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
    <div className="p-4 bg-white rounded shadow hover:bg-gray-50 transition">
      <div onClick={() => handleOpenViewTaskModal(task)} >

        <h4 className="font-bold text-gray-800">{task.title}</h4>
        <p className="text-sm text-gray-600">{task.description}</p>
        <span
          className={`text-xs font-semibold ${task.priority === "High"
            ? "text-red-500"
            : task.priority === "Medium"
              ? "text-yellow-500"
              : "text-green-500"
            }`}
        >
          {task.priority} Priority
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

export default TaskKanbanItem;
