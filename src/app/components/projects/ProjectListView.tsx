"use client";

import React from "react";
import { useUserStore } from "../../stores/userStore";
import ProjectListItem from "./ProjectListItem";

const ProjectListView: React.FC = () => {
  const projects = useUserStore((state) => state.getProjects());

  if (!projects || projects.length === 0) {

    return (
      <div className="text-center text-gray-500 mt-9">
        <p>אין פרויקטים זמינים</p>
        <h1>זה הזמן ליצור פרויקטים חדשים ולהתחיל לעבוד!</h1>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* כותרות לכל שדה */}
      <div className="flex items-center justify-between pb-2 border-b border-[#3D3BF3] font-bold text-[#3D3BF3] mb-4 p-2">
        <div className="flex-1 text-right pr-4">שם הפרויקט</div>
        <div className="flex-1 text-center pr-4"> תיאור</div>
        <div className="flex-1 text-center pr-4">מנהל</div>
        <div className="flex-1 text-left pr-4">חברים</div>
      </div>

      {/* רשימת הפרויקטים */}
      <ul>
        {projects.map((project) => (
          <li key={project._id}>
            <ProjectListItem project={project} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectListView;
