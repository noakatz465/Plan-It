"use client"
import React, { useState, useEffect } from "react";
import ClosestTasks from "./ClosestTasks";
import TasksStatusBarChart from "./TasksStatusBarChart";
import TasksStatusPieChart from "./TasksStatusPieChart";
import { useUserStore } from "@/app/stores/userStore";
import StatisticsSummary from "./StatisticsSummary";

function Dashboard() {
  const user = useUserStore((state) => state.user); // שליפת המשתמש מהחנות

  // בדיקה אם היום הוא יום חמישי
  const today = new Date();
  const isThursday = today.getDay() === 4; // getDay() מחזיר 4 עבור יום חמישי

  // בדיקה אם היום יום ההולדת של המשתמש
  const isBirthday = user?.birthDate
    ? new Date(user.birthDate).getDate() === today.getDate() &&
    new Date(user.birthDate).getMonth() === today.getMonth()
    : false;

  // מצבים להצגת מודאלים
  const [showThursdayModal, setShowThursdayModal] = useState(isThursday);
  const [showBirthdayAnimation, setShowBirthdayAnimation] = useState(isBirthday);

  useEffect(() => {
    if (isBirthday) {
      const timeout = setTimeout(() => setShowBirthdayAnimation(false), 5000); // סגור אחרי 5 שניות
      return () => clearTimeout(timeout);
    }
  }, [isBirthday]);

  return (
    <div className="grid grid-rows-2 grid-cols-2 gap-4 h-screen p-4 ">
      {/* חלק עליון שמאלי */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-center font-bold text-gray-700">משימות עם יעד קרוב!</h2>
        <ClosestTasks />
      </div>

      {/* חלק תחתון שמאלי */}
      <div className="bg-white rounded-lg shadow-md">
        <TasksStatusPieChart />
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <TasksStatusBarChart />
      </div>

      {/* חלק תחתון ימני */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <StatisticsSummary />
      </div>

      {/* מודאל ליום חמישי */}
      {showThursdayModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-yellow-600 mb-4">יום חמישי היום!</h2>
            <p className="text-lg text-gray-700 mb-4">לא לשכוח להתארגן לשבת!</p>
            <button
              onClick={() => setShowThursdayModal(false)}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              הבנתי!
            </button>
          </div>
        </div>
      )}

      {/* אנימציית יום הולדת */}
      {showBirthdayAnimation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative text-center">
            <div className="text-4xl font-bold text-pink-500 animate-bounce">
              🎉 מזל טוב ליום הולדתך! 🎉
            </div>
            <p className="text-xl text-white mt-4">שיהיה לך יום מלא בשמחה ואושר!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
