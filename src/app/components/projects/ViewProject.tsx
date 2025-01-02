'use client';
import React, { useState } from 'react';
import { MultiValue } from 'react-select';
import { ProjectModel } from '@/app/models/projectModel';
import { deleteProject, updateProject } from '@/app/services/projectService';
import CreatableSelect from 'react-select/creatable';
import { getUserByEmail, shareProject } from '@/app/services/userService';
import { useUserStore } from '@/app/stores/userStore';
import Image from 'next/image';
import { UserOption } from '@/app/types/userOption';

interface ViewProjectProps {
    project: ProjectModel;
}

function ViewProject({ project }: ViewProjectProps) {
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [shareMode, setShareMode] = useState(false);
    const [editedProject, setEditedProject] = useState<ProjectModel>({
        ...project,
    });
    const user = useUserStore((state) => state.user);


    const handleEditClick = () => {
        setEditMode(true);
        setEditedProject({ ...project });
    };

    const handleShareClick = () => {
        setShareMode(true);
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
    const handleDeleteTask = async () => {
        if (!project) return;
        setLoading(true);
        try {
            if (project._id)
                await deleteProject(project._id);
            alert('Task deleted successfully.');
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task.');
        } finally {
            setLoading(false);
        }
    };

    const handleShareSubmit = async () => {
        setLoading(true);
        const failedUsers: string[] = [];
        try {
            const updatedProject = { ...project, managerID: user?._id || '' };

            // יצירת רשימת IDs לפי אימיילים
            const userIds = await Promise.all(
                editedProject.members.map(async (email) => {
                    try {
                        const user = await getUserByEmail(email);
                        return user?.toString();
                    } catch {
                        throw new Error(`Failed to find user with email ${email}`);
                    }
                })
            );

            updatedProject.members = userIds.filter((id) => id !== undefined);
            if (updatedProject.members)
                await Promise.all(
                    updatedProject.members.map(async (userId) => {
                        if (editedProject._id)
                            try {
                                await shareProject({
                                    projectId: editedProject._id,
                                    targetUserId: userId,
                                    sharedByUserId: user?._id || '',
                                });
                                console.log(`Project successfully shared with user ${userId}`);
                            } catch (error) {
                                console.error(`Failed to share project with user ${userId}:`, error);
                            }
                    })
                );

            if (failedUsers.length) {
                alert(`Failed to share with users: ${failedUsers.join(", ")}`);
            } else {
                alert("Project shared successfully!");
                setShareMode(false);
            }
        } catch (error) {
            console.error("Error sharing project:", error);
            alert("Failed to share project.");
        } finally {
            setLoading(false);
        }
    };

    const handleUserSelect = (selectedOptions: MultiValue<UserOption>) => {
        const newUsers = selectedOptions.map((option) => ({
            value: option.value,
            label: option.label,
            isNew: option.__isNew__ || false,
        }));
        setEditedProject((prev) => ({
            ...prev,
            members: newUsers.map((user: { value: string; }) => user.value),
        }));
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

    if (!project) {
        return <div>פרויקט לא קיים.</div>;
    }

    return (
        <div className="p-4 border rounded bg-gray-100">
            {loading && <p>Loading...</p>}
            {!loading && !shareMode &&
                editMode ? (
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
                            onClick={handleDeleteTask}
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
                            onClick={handleShareClick}
                        >
                            שיתוף
                        </button>
                    </div>
                </>
            )}
            {shareMode && (
                <div className="mt-4">
                    <label htmlFor="assignedUsers" className="block font-medium">משתמשים מוצמדים</label>
                    <CreatableSelect
                        id="assignedUsers"
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
                        onClick={handleShareSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        שתף
                    </button>
                    <button
                        onClick={() => setShareMode(false)}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300 ml-2"
                    >
                        ביטול
                    </button>
                </div>
            )}
        </div>
    );
}

export default ViewProject;

