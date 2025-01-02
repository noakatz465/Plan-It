"use client";
import React from "react";
import { NotificationModel } from "@/app/models/notificationModel";
import { CheckIcon } from "@heroicons/react/24/outline";

interface NotificationItemProps {
  notification: NotificationModel;
  onMarkAsRead: (notificationId: string) => void;
  onViewTask?: (taskId: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onViewTask,
}) => {
  const getBorderColor = () => {
    if (notification.notificationType === "TaskDueSoon") return "border-[#FFA500]"; // כתום
    return notification.isRead ? "border-[#9694FF]" : "border-[#FF2929]";
  };

  const getBackgroundColor = () => {
    if (notification.notificationType === "TaskDueSoon") return "bg-[#FFF5E6] hover:bg-[#FFE4B2]"; // כתום בהיר
    return notification.isRead ? "bg-[#E0E0E0] hover:bg-gray-300" : "bg-white hover:bg-red-50";
  };

  const renderTitle = () => {
    if (notification.notificationType === "TaskAssigned") return "שותפת במשימה";
    if (notification.notificationType === "TaskDueSoon") return "משימה מתקרבת לתאריך יעד";
    return `Notification Type: ${notification.notificationType}`;
  };

  return (
    <div
      className={`relative p-4 shadow-md transition-all duration-300 rounded-xl h-auto max-w-sm mx-auto ${getBackgroundColor()} border-l-4 ${getBorderColor()}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3
          className={`text-lg font-semibold ${
            notification.isRead ? "text-gray-600" : "text-black"
          }`}
        >
          {renderTitle()}
        </h3>
        {!notification.isRead && (
          <button
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-green-500 transition-all duration-200 hover:text-white"
            onClick={() => onMarkAsRead(notification._id)}
          >
            <CheckIcon className="w-5 h-5 text-gray-600 hover:text-white" />
          </button>
        )}
      </div>
      <p className="mb-2">{notification.notificationText}</p>
      {notification.notificationType === "TaskAssigned" &&  <p className="text-sm text-gray-500 mb-2">
        <strong>שותף בתאריך:</strong> {" "}
        {new Date(notification.notificationDate).toLocaleDateString()} {" "}
        <strong>בשעה:</strong> {" "}
        {new Date(notification.notificationDate).toLocaleTimeString()}
      </p>}
      

      {/* {notification.notificationType === "TaskDueSoon" && (
        <p className="text-sm text-gray-500 mb-2">
          <strong>תאריך יעד:</strong> {" "}
          {new Date(notification.dueDate).toLocaleDateString()}
        </p>
      )} */}

      {notification.notificationType === "TaskAssigned" && onViewTask && (
        <button
          className="mt-2 text-blue-600 underline hover:text-blue-800"
          onClick={() => onViewTask(notification.taskId)}
        >
          לצפייה במשימה
        </button>
      )}

      {notification.notificationType === "TaskDueSoon" && onViewTask && (
        <button
          className="mt-2 text-blue-600 underline hover:text-blue-800"
          onClick={() => onViewTask(notification.taskId)}
        >
          לצפייה במשימה
        </button>
      )}
    </div>
  );
};

export default NotificationItem;
