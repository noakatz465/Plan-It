'use client';

import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import Image from 'next/image';
import { TrashIcon, PencilSquareIcon, ShareIcon } from '@heroicons/react/24/outline';
import { MultiValue } from 'react-select';
import { ProjectModel } from '@/app/models/projectModel';
import { TaskModel } from '@/app/models/taskModel';
import { deleteProject, updateProject } from '@/app/services/projectService';
import { useUserStore } from '@/app/stores/userStore';
import TaskListItem from '../tasks/TaskListItem';

interface ViewProjectProps {
    project: ProjectModel;
}

function ViewProject({ project }: ViewProjectProps) {
    const [editMode, setEditMode] = useState(false);
    const [shareMode, setShareMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editedProject, setEditedProject] = useState<ProjectModel>({ ...project });
    const user = useUserStore((state) => state.user);

    // משימות הקשורות לפרויקט הנוכחי
    const tasks = project.LinkedTasks || [];

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleEditCancel = () => {
        setEditMode(false);
    };

    const handleEditSave = async () => {
        if (project._id) {
            await updateProject(project._id, editedProject);
            setEditMode(false);
        }
    };

    const handleDeleteProject = async () => {
        if (!project) return;
        setLoading(true);
        try {
            if (project._id) await deleteProject(project._id);
            alert('Project deleted successfully.');
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project.');
        } finally {
            setLoading(false);
        }
    };

    const handleUserSelect = (selectedOptions: MultiValue<{ value: string }>) => {
        const newUsers = selectedOptions.map((option) => option.value);
        setEditedProject((prev) => ({ ...prev, members: newUsers }));
    };

    const userOptions = React.useMemo(() =>
        user?.sharedWith.map((user) => ({
            value: user.email,
            label: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {user?.profileImage ? (
                        <Image
                            src={user.profileImage}
                            alt={`${user.firstName} ${user.lastName}`}
                            width={32}
                            height={32}
                            style={{
                                borderRadius: '50%',
                                objectFit: 'cover',
                            }}
                        />
                    ) : (
                        <Image
                            src="/default-profile.png"
                            alt="Anonymous Profile"
                            width={32}
                            height={32}
                            style={{
                                borderRadius: '50%',
                                objectFit: 'cover',
                            }}
                        />
                    )}
                    <span>{`${user.firstName} ${user.lastName}`}</span>
                </div>
            ),
        })), [user?.sharedWith]);

    return (
        <div className="max-w-2xl mx-auto bg-white rounded p-4">
            {loading && <p>Loading...</p>}
            {!loading && !editMode && !shareMode && (
                <>
                    <h2 className="text-xl font-bold text-[#3D3BF3] mb-4">{project.name}</h2>
                    <p className="text-lg text-black mb-4">{project.description || 'ללא תיאור'}</p>
                    <p className="text-sm text-gray-500 mb-4">
                        <strong>תאריך עדכון אחרון:</strong>{' '}
                        {project.lastModified ? new Date(project.lastModified).toLocaleDateString('he-IL') : 'לא עודכן'}
                    </p>

                    {/* משימות הקשורות לפרויקט */}
                    <div className="mt-8">
                        <h3 className="text-lg font-bold text-[#3D3BF3] mb-4">משימות בפרויקט</h3>
                        {tasks.length > 0 ? (
                            <ul>
                                {tasks.map((task: TaskModel) => (
                                    <li key={task._id}>
                                        <TaskListItem task={task} />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-gray-500">
                                אין משימות בפרויקט זה. זה הזמן להוסיף משימות חדשות!
                            </p>
                        )}
                    </div>

                    <div className="flex justify-between items-center mr-8 ml-8 mt-8">
                        <button
                            className="group p-2 bg-white rounded-full hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-300"
                            title="מחיקה"
                            onClick={handleDeleteProject}
                        >
                            <TrashIcon className="w-7 h-7 text-red-500 group-hover:text-white" />
                        </button>
                        <button
                            className="group p-2 bg-white rounded-full hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300"
                            title="עריכה"
                            onClick={handleEditClick}
                        >
                            <PencilSquareIcon className="w-7 h-7 text-blue-500 group-hover:text-white" />
                        </button>
                        <button
                            className="group p-2 bg-white rounded-full hover:bg-green-500 focus:outline-none focus:ring focus:ring-green-300"
                            title="שיתוף"
                            onClick={() => setShareMode(true)}
                        >
                            <ShareIcon className="w-7 h-7 text-green-500 group-hover:text-white" />
                        </button>
                    </div>
                </>
            )}

            {editMode && (
                <div className="mt-4">
                    <h2 className="text-lg font-bold text-blue-500 mb-2">ערוך פרויקט</h2>
                    <input
                        type="text"
                        value={editedProject.name || ''}
                        onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
                        placeholder="שם הפרויקט"
                        className="mb-2 p-2 border rounded w-full"
                    />
                    <textarea
                        value={editedProject.description || ''}
                        onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
                        placeholder="תיאור"
                        className="mb-2 p-2 border rounded w-full"
                    />
                    <button
                        onClick={handleEditSave}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
                    >
                        שמור
                    </button>
                    <button
                        onClick={handleEditCancel}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300 ml-2"
                    >
                        ביטול
                    </button>
                </div>
            )}

            {shareMode && (
                <div className="mt-4">
                    <label htmlFor="members" className="block font-medium">משתמשים מוצמדים</label>
                    <CreatableSelect
                        id="members"
                        isMulti
                        options={userOptions}
                        onChange={handleUserSelect}
                        placeholder="בחר או הוסף משתמשים"
                        styles={{
                            control: (base) => ({
                                ...base,
                                borderColor: '#ccc',
                                borderRadius: '8px',
                                padding: '5px',
                            }),
                        }}
                    />
                    <button
                        onClick={() => setShareMode(false)}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300 mt-2"
                    >
                        ביטול
                    </button>
                </div>
            )}
        </div>
    );
}

export default ViewProject;
