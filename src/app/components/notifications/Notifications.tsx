"use client";
import React, { useEffect, useState } from "react";
import { useNotificationsStore } from "@/app/stores/notificationsStore";
import { NotificationModel } from "@/app/models/notificationModel";
import { useUserStore } from "@/app/stores/userStore";
import { TaskModel } from "@/app/models/taskModel";
import ViewTask from "@/app/components/tasks/ViewTask";
import NotificationItem from "@/app/components/notifications/NotificationItem";

const NotificationsList = () => {
  const { notifications, fetchNotifications, markAsRead } = useNotificationsStore();
  const userFromStore = useUserStore((state) => state.user);
  const [selectedTask, setSelectedTask] = useState<TaskModel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // סטייט לחיווי טעינה

  useEffect(() => {
    const loadNotifications = async () => {
      if (userFromStore?._id) {
        setLoading(true); // חיווי על תחילת טעינה
        await fetchNotifications(userFromStore?._id);
        setLoading(false); // חיווי על סיום טעינה
      }
    };
    loadNotifications();
  }, [fetchNotifications, userFromStore?._id]);

  // סינון ומיון ההתראות הפעילות
  const activeNotifications = notifications
    .filter((notification: NotificationModel) => notification.status === "Active")
    .sort(
      (a, b) =>
        new Date(b.notificationDate).getTime() - new Date(a.notificationDate).getTime()
    ); // מיון לפי תאריך ושעה (בסדר יורד)

  const handleViewTask = (taskId: string) => {
    const task = userFromStore?.tasks.find((task) => task._id === taskId);
    if (task) {
      setSelectedTask(task);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    console.log(`Marking notification ${notificationId} as read.`);
    await markAsRead(notificationId);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-[#3D3BF3]">
        התראות פעילות
      </h2>
      {loading ? ( // חיווי על טעינה
        <p className="text-center italic text-gray-500">טוען התראות...</p>
      ) : activeNotifications.length === 0 ? (
        <p className="text-center italic text-gray-500">
          אין התראות פעילות
        </p>
      ) : (
        <div className="space-y-4">
          {activeNotifications.map((notification: NotificationModel) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              onViewTask={handleViewTask}
            />
          ))}
        </div>
      )}

      {isModalOpen && selectedTask && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}>
          <div
            className="bg-white p-4 rounded shadow-lg max-h-[90vh] overflow-y-auto modal-content w-full max-w-md"
            // onClick={(e) => e.stopPropagation()}
            >
            <button
              className="absolute top-4 right-4 text-red-600 hover:text-red-800"
              onClick={closeModal}>
              ✖
            </button>

            <ViewTask task={selectedTask} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsList;
