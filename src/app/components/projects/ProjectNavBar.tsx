"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AddProject from "./AddProject";

const ProjectNavBar: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleNavigation = (route: string) => {
    router.push(route); // מנתב לדף המתאים
  };

  return (
    <div className="bg-white p-4 flex items-center justify-between w-full shadow-md">
      {/* כפתור הפרויקטים שלי */}
      <button
        onClick={() => handleNavigation("/pages/main/projects/my-projects")}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
      >
        הפרויקטים שלי
      </button>

      {/* כפתור הוספת פרויקט */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        onClick={handleOpenModal}
      >
        +
      </button>

      {/* שורת חיפוש */}
      <div className="flex-1 mx-4">
        <input
          type="text"
          placeholder="חיפוש פרויקטים"
          className="w-42 px-4 py-1 rounded-full bg-purple-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
      </div>

      {/* כפתור סינון */}
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">
        סינון
      </button>

      {/* מודאל הוספת פרויקט */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-h-[90vh] overflow-y-auto modal-content w-full max-w-md">

            <AddProject />
            <button
              onClick={() => setOpenModal(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              סגור
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectNavBar;
