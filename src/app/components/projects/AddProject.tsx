'use client';
import React, { useEffect, useState } from 'react';
import { ProjectModel } from '@/app/models/projectModel';
import { createProject } from '@/app/services/projectService';
import { useUserStore } from '@/app/stores/userStore';
import CreatableSelect from 'react-select/creatable';
import Image from "next/image";
import { getUserByEmail } from '@/app/services/userService';
import AddTask from '../tasks/AddTask';

function AddProject() {
    const [newProject, setNewProject] = useState<ProjectModel>({
        name: '',
        managerID: '',
        description: '',
        LinkedTasks: [],
        members: [],
        lastModified: new Date(),
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAddTask, setShowAddTask] = useState(false); // state חדש להחביא או להציג את AddTask
    const [projectCreated, setProjectCreated] = useState(false); // state להחביא הודעה אחרי יצירת פרויקט
    const [addedProject, setAddedProject] = useState<string>('');
    const userFromStore = useUserStore((state) => state.user);

    useEffect(() => {
        if (projectCreated && addedProject) {
            setShowAddTask(true);
        }
        console.log(addedProject + 'addedProject');
        
    }, [projectCreated, addedProject]);

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
            // יצירת רשימת IDs לפי אימיילים
            const userIds = await Promise.all(
                newProject.members.map(async (email) => {
                    try {
                        const user = await getUserByEmail(email);
                        return user?.toString(); // המרת ה-ID למחרוזת
                    } catch {
                        throw new Error(`Failed to find user with email ${email}`);
                    }
                })
            );

            newProject.members = userIds.filter((id) => id !== undefined);
            setAddedProject(await createProject({
                ...newProject,
                managerID: userFromStore?._id || ' ',
                LinkedTasks: newProject.LinkedTasks?.map(task => task._id || '') || [],
                members: newProject.members,
            }));
            setProjectCreated(true); // להציג את ההודעה אחרי יצירת הפרויקט
        } catch (err) {
            console.log('Failed to create project. Please try again.' + err);
        } finally {
            setLoading(false);
        }
    };

    const handleUserSelect = (selectedOptions: any) => {
        const newUsers = selectedOptions.map((option: any) => ({
            value: option.value,
            label: option.label,
            isNew: option.__isNew__ || false,
        }));
        setNewProject((prev) => ({
            ...prev,
            members: newUsers.map((option: { value: string }) => option.value),
        }));
    };

    const userOptions = userFromStore?.sharedWith?.map((user) => ({
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
    }));

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

                <div>
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

            {projectCreated && (
                <div className="mt-4">
                    <p className="text-green-500">הפרויקט נוצר בהצלחה!</p>
                    <p>האם אתה רוצה להוסיף משימות לפרויקט שיצרת?</p>
                    <button
                        onClick={() => setShowAddTask(true)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        כן, הוסף משימות
                    </button>
                </div>
            )}

            {showAddTask && addedProject ? (
                <AddTask projectId={addedProject} assignedUsers={newProject.members} />
            ) : (
                projectCreated && <p>טוען מידע...</p>
            )}        </div>
    );
}

export default AddProject;
