

"use client";
import React, { useState } from "react";
// import { useRouter } from "next/navigation";
import AddProject from "./AddProject";
import { PlusIcon } from "@heroicons/react/24/outline";

const ProjectNavBar: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  // const router = useRouter();

  const handleOpenModal = () => {
    setOpenModal(true);
  };


  return (
    <div className="bg-white px-2 py-2 flex items-center justify-between shadow-md h-12 fixed left-0 right-[50px] w-[calc(100%-50px)] z-50">
      {/* עטיפת הכותרת והכפתור במעטפת משותפת */}
      <div className="flex items-center space-x-2">
        {/* כותרת הפרויקטים שלי */}
        <div className="text-green-500 font-bold">הפרויקטים שלי</div>

        {/* כפתור הוספת פרויקט */}
        <button
          className="text-green-500 hover:text-green-700 transition duration-200 flex items-center justify-center"
          onClick={handleOpenModal}
          title="הוספת פרויקט"
        >
          <PlusIcon className=" mr-3 h-6 w-6 stroke-[2]" />
        </button>
      </div>

      {/* מודאל הוספת פרויקט */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg max-h-[90vh] overflow-y-auto modal-content w-full max-w-md">
            {/* כפתור לסגירת המודאל */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenModal(false);
              }}
              className="text-red-500 float-right font-bold"
            >
              ✖
            </button>
            <AddProject />
            <button
              onClick={() => setOpenModal(false)}
              className="mt-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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
