import React, { useState } from "react";
import ViewProject from "./ViewProject";
import { ProjectModel } from "@/app/models/projectModel";

interface ProjectItemListProps {
  project: ProjectModel;
}

const ProjectListItem: React.FC<ProjectItemListProps> = ({ project }) => {
  const [selectedProject, setSelectedProject] = useState<ProjectModel | null>(null);
  const [isViewProjectModalOpen, setIsViewProjectModalOpen] = useState(false);

  const handleOpenViewProjectModal = (project: ProjectModel) => {
    setSelectedProject(project);
    setIsViewProjectModalOpen(true);
  };
  const handleCloseModal = () => {
    setSelectedProject(null);
    setIsViewProjectModalOpen(false);
  };

  return (
    <div >
      <div onClick={() => handleOpenViewProjectModal(project)} className="flex items-center justify-between p-4 border-b hover:bg-gray-50 transition">
        <span className="text-gray-800">{project.name}</span>
        <span className="text-gray-800">{project.description}</span>
      </div>
      {isViewProjectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded shadow-lg w-1/3"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCloseModal();
              }}
              className="text-red-500 float-right font-bold">X</button>
            {selectedProject ? <ViewProject project={selectedProject} /> : ""}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectListItem;
