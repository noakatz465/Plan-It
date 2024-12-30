"use client";

import React from "react";
import { useUserStore } from "../../stores/userStore";
import ProjectListItem from "./ProjectListItem";

const ProjectListView: React.FC = () => {
  const projects = useUserStore((state) => state.projects);

  if (!projects || projects.length === 0) {
    return <p className="text-center text-gray-500">No projects available.</p>;
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">פרויקטים</h2>
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
