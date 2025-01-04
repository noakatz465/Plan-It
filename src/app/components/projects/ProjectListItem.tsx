import React, { useState } from "react";
import ViewProject from "./ViewProject";
import { ProjectModel } from "@/app/models/projectModel";
import { useUserStore } from "@/app/stores/userStore";

interface ProjectItemListProps {
  project: ProjectModel;
}

const ProjectListItem: React.FC<ProjectItemListProps> = ({ project }) => {
  const [selectedProject, setSelectedProject] = useState<ProjectModel | null>(null);
  const [isViewProjectModalOpen, setIsViewProjectModalOpen] = useState(false);
  const users = useUserStore((state) => state.users);
  const manager = users.find((user) => user._id === project.managerID); // מציאת היוצר לפי ID
  const handleOpenViewProjectModal = (project: ProjectModel) => {
    setSelectedProject(project);
    setIsViewProjectModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    setIsViewProjectModalOpen(false);
  };

  return (
    <>
      {/* תצוגת הפרויקט */}
      <div
        onClick={() => handleOpenViewProjectModal(project)}
        className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition cursor-pointer mb-4"
      >
        {/* שם הפרויקט */}
        <div className="flex-1 text-right pr-4">
          <span className="text-gray-800 font-medium">{project.name}</span>
        </div>

        {/* תיאור הפרויקט */}
        <div className="flex-1 text-right pr-4">
          <span className="text-sm text-gray-700">
            {project.description || "ללא תיאור"}
          </span>
        </div>

        {/* מנהל הפרויקט */}
        <div className="flex-1 text-center pr-4">
          <span className="text-gray-800">
            מנהל: {manager ? `${manager.firstName} ${manager.lastName}` : "לא הוגדר מנהל"}
          </span>
        </div>

        {/* חברים בפרויקט */}
        <div className="flex-1 text-left pr-4">
          <span className="text-gray-500 text-sm">
            חברים: {project.members.length}
          </span>
        </div>
      </div>

      {/* חלון מודאלי להצגת פרטי הפרויקט */}
      {isViewProjectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white p-4 rounded shadow-lg max-h-[90vh] overflow-y-auto modal-content w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCloseModal();
              }}
              className="text-red-500 float-right font-bold"
            >
              ✖
            </button>
            {selectedProject ? (
              <ViewProject project={selectedProject} />
            ) : (
              <p>אין נתונים להצגה</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectListItem;
