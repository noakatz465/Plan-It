'use client';
import React, { useState } from 'react';
import { ProjectModel } from '@/app/models/projectModel';
import { updateProject } from '@/app/services/projectService';

interface ViewProjectProps {
    project: ProjectModel;
}

function ViewProject({ project }: ViewProjectProps) {
    const [editMode, setEditMode] = useState(false);
    const [editedProject, setEditedProject] = useState<ProjectModel>({
        ...project,
    });

    const handleEditClick = () => {
        setEditMode(true);
        setEditedProject({ ...project });
    };

    const handleEditChange = (field: keyof ProjectModel, value: string) => {
        setEditedProject({ ...editedProject, [field]: value });
    };

    const handleSave = async () => {
        console.log(editedProject);
        
        if (project._id)
            await updateProject(project._id, editedProject)
        setEditMode(false);
    };

    const handleCancel = () => {
        setEditMode(false);
    };

    if (!project) {
        return <div>פרויקט לא קיים.</div>;
    }

    return (
        <div className="p-4 border rounded bg-gray-100">
            {editMode ? (
                <>
                    <h2 className="text-lg font-bold text-blue-500 mb-2">ערוך פרויקט</h2>
                    <input
                        type="text"
                        value={editedProject.name || ''}
                        onChange={(e) => handleEditChange('name', e.target.value)}
                        placeholder="שם הפרויקט"
                        className="mb-2 p-2 border rounded w-full"
                    />
                    <textarea
                        value={editedProject.description || ''}
                        onChange={(e) => handleEditChange('description', e.target.value)}
                        placeholder="תיאור"
                        className="mb-2 p-2 border rounded w-full"
                    />
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
                    >
                        שמור
                    </button>
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300 ml-2"
                    >
                        ביטול
                    </button>
                </>
            ) : (
                <>
                    <h2 className="text-lg font-bold text-blue-500 mb-2">{project.name}</h2>
                    {project.description && <p className="text-gray-700 mb-2">{project.description}</p>}
                    <p className="text-sm text-gray-500">תאריך עדכון אחרון: {project.lastModified ? new Date(project.lastModified).toLocaleDateString() : 'לא עודכן עדיין'}</p>
                    <div className="flex justify-end space-x-2">
                        <button
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
                        >
                            מחיקה
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                            onClick={handleEditClick}
                        >
                            עריכה
                        </button>
                        <button
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
                        >
                            שיתוף
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default ViewProject;

