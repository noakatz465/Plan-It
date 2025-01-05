'use client'
import { TaskModel } from '@/app/models/taskModel';
import { TemplateModel } from '@/app/models/templateModel'
import { UserModel } from '@/app/models/userModel';
import { useUserStore } from '@/app/stores/userStore';
import React, { useState } from 'react'
import Image from "next/image";
import { MultiValue } from 'react-select';
import { getUserByEmail, shareTask } from '@/app/services/userService';
import { createNotificationsPerUsers } from '@/app/services/notificationService';
import { addTask } from '@/app/services/taskService';
import CreatableSelect from 'react-select/creatable';

interface UseTemplateProps {
    template: TemplateModel
    onClose: () => void;
}

function UseTemplate(props: UseTemplateProps) {
    const initialTask = new TaskModel('', 'Pending', '', undefined);
    const [task, setTask] = useState<TaskModel>({ ...initialTask, description: props.template.description });
    const user = useUserStore((state) => state.user);
    const addTaskToStore = useUserStore((state) => state.addTaskToStore);
    
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTask((prev) => ({ ...prev, [name]: value }));
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTask((prev) => ({ ...prev, dueDate: new Date(e.target.value) }));
    };

    const handleSave = async () => {
        try {
            const updatedTask = { ...task, creator: user?._id || '' };
            const userIds = await Promise.all(
                task.assignedUsers.map(async (email) => {
                    try {
                        const user = await getUserByEmail(email);
                        return user?.toString();
                    } catch {
                        throw new Error(`Failed to find user with email ${email}`);
                    }
                })
            );

            updatedTask.assignedUsers = userIds.filter((id) => id !== undefined);
            const newTaskResponse = await addTask(updatedTask);

            if (updatedTask.assignedUsers && updatedTask.assignedUsers.length > 0) {
                const shareResults = await Promise.all(
                    updatedTask.assignedUsers.map(async (userId) => {
                        try {
                            await shareTask({
                                taskId: newTaskResponse._id,
                                targetUserId: userId,
                                sharedByUserId: user?._id || '',
                            });
                            return true;
                        } catch (error) {
                            console.error(`Failed to share task with user ${userId}:`, error);
                            return false;
                        }
                    })
                );

                const allSharesSucceeded = shareResults.every((result) => result);
                if (allSharesSucceeded && user?.notificationsEnabled) {
                    try {
                        await createNotificationsPerUsers(
                            "TaskAssigned",
                            newTaskResponse,
                            updatedTask.assignedUsers
                        );
                    } catch (error) {
                        console.error('Failed to send notifications:', error);
                    }
                }
            }

            addTaskToStore({ ...updatedTask, _id: user?._id });
            setTask(initialTask);

        } catch (error) {
            console.log('Failed to add task. Please try again.');
            console.error(error);
        } finally {
            if (props.onClose) {
                props.onClose();
            }
        }
    }

    const handleUserSelect = (
        selectedOptions: MultiValue<{ value: string; label: React.ReactNode }>,
    ) => {
        const newUsers = selectedOptions.map((option) => ({
            value: option.value,
            label: option.label,
        }));

        setTask((prev) => ({
            ...prev,
            assignedUsers: newUsers.map((user) => user.value),
        }));
    };

    const userOptions = user?.sharedWith?.map((user: UserModel) => ({
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
            <div className="bg-gradient-to-r from-pink-50 via-blue-50 to-purple-50 p-8 shadow-lg rounded-2xl w-full max-w-lg relative border border-pastel-purple overflow-y-auto max-h-[90vh]">
                <h3 className="text-2xl font-bold mb-6 text-purple-600 text-center">צור משימה על ידי תבנית</h3>
                <form className="space-y-6">
                    <div>
                        <label className="block text-gray-700 mb-2">כותרת</label>
                        <input
                            type="text"
                            value={task.title}
                            onChange={handleTextChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-200"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">תיאור</label>
                        <textarea
                            value={task.description}
                            onChange={handleTextChange}
                            className="w-full h-48 p-4 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-200"
                        />
                    </div>
                    <div>
                        <label htmlFor="dueDate" className="block text-gray-700 mb-2">תאריך </label>
                        <input
                            id="dueDate"
                            name="dueDate"
                            type="date"
                            value={task.dueDate?.toISOString().split('T')[0] || ''}
                            onChange={handleDateChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-200"
                        />
                    </div>
                    <div>
                        <label htmlFor="assignedUsers" className="block text-gray-700 mb-2 font-medium">משתמשים מוצמדים</label>
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
                                    padding: '8px',
                                }),
                            }}
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={props.onClose}
                            className="bg-gray-300 text-gray-800 py-2 px-5 rounded-md hover:bg-gray-400"
                        >
                            ביטול
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="bg-purple-500 text-white py-2 px-5 rounded-md hover:bg-purple-600"
                        >
                            שמור
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UseTemplate;
