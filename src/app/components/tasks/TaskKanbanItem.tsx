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

  const renderPriorityStars = (priority: string) => {
    const stars =
      priority === "High" ? 3 : priority === "Medium" ? 2 : priority === "Low" ? 1 : 0;

    return (
      <div className="flex items-center justify-center">
        {Array.from({ length: stars }).map((_, index) => (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-yellow-400"
          >
            <path d="M12 .587l3.668 7.568L24 9.423l-6 5.843 1.418 8.23L12 18.986l-7.418 4.51L6 15.266 0 9.423l8.332-1.268L12 .587z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow hover:bg-gray-50 transition w-full max-w-xs mx-auto hover:shadow-md cursor-pointer">
      <div
        onClick={() => handleOpenViewTaskModal(task)}
        className="flex flex-col items-center text-center space-y-2"
      >
        {/* כותרת המשימה */}
        <h4 className="font-bold text-gray-800">{task.title}</h4>

        {/* עדיפות בכוכבים */}
        <div>{renderPriorityStars(task.priority)}</div>

        {/* תאריך יעד */}
        <span className="text-sm text-gray-500">
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString("he-IL")
            : "ללא תאריך יעד"}
        </span>
      </div>

      {/* חלון מודאלי להצגת פרטי המשימה */}
      {isViewTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white p-4 rounded shadow-lg max-h-[90vh] overflow-y-auto modal-content w-full max-w-md"
            onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCloseModal();
              }}
              className="text-red-500 float-right font-bold">
              ✖
            </button>
            {selectedTask ?

              <ViewTask task={selectedTask} onClose={handleCloseModal} />
              : ""}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskKanbanItem;
