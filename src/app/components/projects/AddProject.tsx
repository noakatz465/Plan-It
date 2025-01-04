'use client';
import React, { useState } from 'react';
import { ProjectModel } from '@/app/models/projectModel';
import { createProject } from '@/app/services/projectService';
import { useUserStore } from '@/app/stores/userStore';
import CreatableSelect from 'react-select/creatable';
import Image from "next/image";
import { getUserByEmail } from '@/app/services/userService';
import { MultiValue } from 'react-select';
import { UserModel } from '@/app/models/userModel';
import { useMessageStore } from '@/app/stores/messageStore';

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
    const [successMessage, setSuccessMessage] = useState('');
    const userFromStore = useUserStore((state) => state.user);
    const setMessage = useMessageStore((state) => state.setMessage);


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
            const userIds = await Promise.all(
                newProject.members.map(async (email) => {
                    try {
                        const user = await getUserByEmail(email);
                        return user?.toString();
                    } catch {
                        throw new Error(`Failed to find user with email ${email}`);
                    }
                })
            );

            newProject.members = userIds.filter((id) => id !== undefined);
            await createProject({
                ...newProject,
                managerID: userFromStore?._id || ' ',
                LinkedTasks: newProject.LinkedTasks?.map(task => task._id || '') || [],
                members: newProject.members,
            });
            setSuccessMessage(`הפרויקט "${newProject.name}" נוסף בהצלחה!`);
            setMessage("הפרויקט נוסף בהצלחה!", "success"); // הודעת הצלחה

            setNewProject({
                name: '',
                managerID: '',
                description: '',
                LinkedTasks: [],
                members: [],
                lastModified: new Date(),
            });
        } catch {
            setError('Failed to create project. Please try again.' );
            setMessage("אירעה שגיאה בעת הוספת הפרויקט. נסו שוב מאוחר יותר.", "error"); // הודעת שגיאה

        } finally {
            setLoading(false);
        }
    };

    const handleUserSelect = (
        selectedOptions: MultiValue<{ value: string; label: React.ReactNode }>
      ) => {
        const selectedEmails = selectedOptions.map((option) => option.value);
      
        setNewProject((prev) => ({
          ...prev,
          members: selectedEmails,
        }));
      };

    const userOptions = userFromStore?.sharedWith?.map((user: UserModel) => ({
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
        <div className="max-w-2xl mx-auto bg-white rounded">
            <h2 className="text-xl mb-4">פרויקט חדש</h2>
            {error && <p className="text-red-500">{error}</p>}
            {successMessage && <p className="text-green-500">{successMessage}</p>}
            <form onSubmit={handleAddProject} className="flex flex-col gap-4">
                <div>
                    <label htmlFor="name" className="block">שם פרויקט</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={newProject.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block">תיאור</label>
                    <textarea
                        id="description"
                        name="description"
                        value={newProject.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                    ></textarea>
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
                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        disabled={loading}
                    >
                        {loading ? 'מוסיף...' : 'הוסף פרויקט'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddProject;
