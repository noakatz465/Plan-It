'use client';
import React, { useState } from 'react';
import { ProjectModel } from '@/app/models/projectModel';
import { createProject } from '@/app/services/projectService';
import { useUserStore } from '@/app/stores/userStore';

function AddProject() {
    const [newProject, setNewProject] = useState<ProjectModel>({
        name: '',
        manager: '',
        description: '',
        linkedTasks: [],
        members: [],
        lastModified: new Date(),
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const userFromStore = useUserStore((state) => state.user);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewProject((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddProject = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // המרת linkedTasks ל-array של IDs
            const linkedTaskIds = newProject.linkedTasks.map((task) => task._id || "");
            // המרת members ל-array של IDs
            const memberIds = newProject.members.map((member) => member._id || "");
            await createProject({
                ...newProject,
                manager: userFromStore?._id || ' ',
                linkedTasks: linkedTaskIds,
                members: memberIds,
            });
        } catch (err) {
            console.log('Failed to create project. Please try again.' + err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 border rounded bg-gray-100">
            <h2 className="text-lg font-bold text-blue-500 mb-4">הוסף פרויקט חדש</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleAddProject}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium">שם פרויקט</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={newProject.name}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 w-full border rounded"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium">תיאור</label>
                    <textarea
                        id="description"
                        name="description"
                        value={newProject.description}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="members" className="block text-sm font-medium">חברים</label>
                    <input
                        type="text"
                        id="members"
                        name="members"
                        value={newProject.members.join(', ')}
                        onChange={(e) => setNewProject({
                            ...newProject
                            // members: e.target.value.split(',').map(member => member.trim())
                        })}
                        className="mt-1 p-2 w-full border rounded"
                        placeholder="הכנס כתובות דואל של חברים"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="linkedTasks" className="block text-sm font-medium">משימות קשורות</label>
                    <input
                        type="text"
                        id="linkedTasks"
                        name="linkedTasks"
                        value={newProject.linkedTasks.join(', ')}
                        onChange={(e) => setNewProject({
                            ...newProject
                            // linkedTasks: e.target.value.split(',').map(task => task.trim())
                        })}
                        className="mt-1 p-2 w-full border rounded"
                        placeholder="הכנס מזהי משימות מופרדים בפסיק"
                    />
                </div>

                <div className="mb-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        {loading ? 'שומר...' : 'הוסף פרויקט'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddProject;
