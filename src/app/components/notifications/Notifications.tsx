"use client";
import React, { useEffect, useState } from "react";
import { useNotificationsStore } from "@/app/stores/notificationsStore";
import { NotificationModel } from "@/app/models/notificationModel";
import { useUserStore } from "@/app/stores/userStore";
import { TaskModel } from "@/app/models/taskModel"; // ייבוא מודל המשימה
import ViewTask from "@/app/components/tasks/ViewTask"; // ייבוא רכיב תצוגת משימה

const Notifications = () => {
  const { notifications, fetchNotifications } = useNotificationsStore();
  const userFromStore = useUserStore((state) => state.user);
  const [selectedTask, setSelectedTask] = useState<TaskModel | null>(null); // משימה נבחרת
  const [isModalOpen, setIsModalOpen] = useState(false); // מצב המודל

  useEffect(() => {
    if (userFromStore?._id) {
      fetchNotifications(userFromStore?._id); // שליפת התראות עבור המשתמש
    }
  }, [userFromStore?._id, fetchNotifications]);

  // מסנן רק את ההתראות האקטיביות
  const activeNotifications = notifications.filter(
    (notification: NotificationModel) => notification.status === "Active"
  );

  const handleViewTask = (taskId: string) => {
    const task = userFromStore?.tasks.find((task) => task._id === taskId);
    if (task) {
      setSelectedTask(task);
      setIsModalOpen(true); // פתיחת המודל
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // סגירת המודל
    setSelectedTask(null); // ניקוי המשימה הנבחרת
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-[#3D3BF3]">
        Active Notifications
      </h2>
      {activeNotifications.length === 0 ? (
        <p className="text-center italic text-gray-500">
          No active notifications available.
        </p>
      ) : (
        <div className="space-y-4">
          {activeNotifications.map((notification: NotificationModel) => (
            <div
              key={notification._id}
              className={`relative p-4 shadow-md transition-all duration-300 rounded-xl h-auto max-w-sm mx-auto ${
                notification.isRead
                  ? "bg-[#E0E0E0] border-l-4 border-[#9694FF] hover:bg-gray-300"
                  : "bg-white border-l-4 border-[#FF2929] hover:bg-red-50"
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-2 ${
                  notification.isRead ? "text-gray-600" : "text-black"
                }`}
              >
                {notification.notificationType === "TaskAssigned"
                  ? "שותפת במשימה"
                  : `Notification Type: ${notification.notificationType}`}
              </h3>
              <p className="mb-2">{notification.notificationText}</p>
              {notification.notificationType === "TaskAssigned" && (
                <button
                  className="mt-2 text-blue-600 underline hover:text-blue-800"
                  onClick={() => handleViewTask(notification.taskId)}
                >
                  לצפייה במשימה
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* מודל תצוגה */}
      {isModalOpen && selectedTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal} // סגירת המודל בלחיצה על הרקע
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg relative"
            onClick={(e) => e.stopPropagation()} // מניעת סגירת המודל בלחיצה בתוך התוכן
          >
            <button
              className="absolute top-4 right-4 text-red-600 hover:text-red-800"
              onClick={closeModal}
            >
              ✖
            </button>
            <ViewTask task={selectedTask} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
