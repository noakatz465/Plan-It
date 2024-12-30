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

  const getProgressValue = (status: string) => {
    switch (status) {
      case "Completed":
        return 100;
      case "In Progress":
        return 50;
      case "Pending":
        return 20;
      default:
        return 0;
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500";
      case "In Progress":
        return "bg-yellow-500";
      case "Pending":
        return "bg-blue-500";
      default:
        return "bg-gray-400";
    }
  };

  const translateFrequency = (frequency: string) => {
    switch (frequency) {
      case "Once":
        return "חד פעמי";
      case "Daily":
        return "יומי";
      case "Weekly":
        return "שבועי";
      case "Monthly":
        return "חודשי";
      case "Yearly":
        return "שנתי";
      default:
        return "לא מוגדר";
    }
  };

  const renderPriorityStars = (priority: string) => {
    const stars =
      priority === "High" ? 3 : priority === "Medium" ? 2 : priority === "Low" ? 1 : 0;

    return (
      <div className="flex items-center">
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
    <>
      {/* תצוגת המשימה */}
      <div
        onClick={() => handleOpenViewTaskModal(task)}
        className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition cursor-pointer mb-4"
      >
        {/* כותרת */}
        <div className="flex-1 text-right pr-4">
          <span className="text-gray-800 font-medium">{task.title}</span>
        </div>

        {/* תדירות */}
        <div className="flex-1 text-right pr-4">
          <span className="text-sm text-gray-700">
            {translateFrequency(task.frequency)}
          </span>
        </div>

        {/* עדיפות בכוכבים */}
        <div className="flex-1  text-center items-center">{renderPriorityStars(task.priority)}</div>
{/* עדיפות בכוכבים */}
{/* <div className="flex-1 flex justify-center items-center">
  {renderPriorityStars(task.priority)}
</div> */}

        {/* פס התקדמות */}
        <div className="flex-1 flex justify-center pr-4">
          <div className="relative w-24 h-3 bg-gray-300 rounded-full">
            <div
              className={`absolute h-full rounded-full ${getProgressColor(
                task.status
              )} transition-all duration-300`}
              style={{ width: `${getProgressValue(task.status)}%` }}
            ></div>
          </div>
        </div>

        {/* תאריך יעד */}
        <div className="flex-1 text-left">
          <span className="text-gray-500 text-sm">
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString("he-IL")
              : "ללא תאריך יעד"}
          </span>
        </div>
      </div>

      {/* חלון מודאלי להצגת פרטי המשימה */}
      {isViewTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            className="bg-white p-5 rounded shadow-lg w-1/3"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCloseModal();
              }}
              className="text-red-500 float-right font-bold"
            >
              X
            </button>
            {selectedTask ? (
              <ViewTask task={selectedTask} />
            ) : (
              <p>אין נתונים להצגה</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TaskListItem;
