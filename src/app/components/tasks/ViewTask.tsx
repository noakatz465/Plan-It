'use client';
import { TaskModel } from '@/app/models/taskModel';
import { updateTask } from '@/app/services/taskService';
import { getUserByEmail, removeTaskForUsers, shareTask } from '@/app/services/userService';
import { useUserStore } from '@/app/stores/userStore';
import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import Image from 'next/image';
import { UserOption } from '@/app/types/userOption';
import { MultiValue } from 'react-select';

interface ViewTaskProps {
    task: TaskModel;
}

function ViewTask({ task }: ViewTaskProps) {
    const [editMode, setEditMode] = useState(false);
    const [shareMode, setShareMode] = useState(false);
    const [editedTask, setEditedTask] = useState<TaskModel>({
        ...task,
        assignedUsers: task.assignedUsers,
    });
    const [loading, setLoading] = useState(false);
    const user = useUserStore((state) => state.user);
    const deleteTaskAndRefreshUser = useUserStore((state) => state.deleteTaskAndRefreshUser);

    const handleDeleteTask = async () => {
        if (!task) return;
        setLoading(true);
        try {
            if (user?._id === task.creator) {
                if (task._id) await deleteTaskAndRefreshUser(task._id);
            } else {
                const newAssignedUsersArr = [...task.assignedUsers, task.creator];
                if (task._id) await removeTaskForUsers(newAssignedUsersArr, task._id);
            }
            alert('Task deleted successfully.');
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = () => {
        setEditMode(true);
        if (task) setEditedTask({ ...task });
    };

    const handleEditChange = (field: keyof TaskModel, value: unknown) => {
        if (editedTask) {
            setEditedTask({ ...editedTask, [field]: value });
        }
    };

    const handleEditSubmit = async () => {
        if (!editedTask) return;
        setLoading(true);
        try {
            if (task._id) await updateTask(task._id, editedTask);
            setEditMode(false);
            alert('Task updated successfully.');
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Failed to update task.');
        } finally {
            setLoading(false);
        }
    };

    const handleShareClick = () => {
        setShareMode(true);
    };

    const handleUserSelect = (selectedOptions: MultiValue<UserOption>) => {
        const newUsers = selectedOptions.map((option) => ({
            value: option.value,
            label: option.label,
            isNew: option.__isNew__ || false,
        }));
        setEditedTask((prev) => ({
            ...prev,
            assignedUsers: newUsers.map((user: { value: string; }) => user.value),
        }));
    };

    const handleShareSubmit = async () => {
        setLoading(true);
        const failedUsers: string[] = [];
        try {
            const updatedTask = { ...task, creator: user?._id || '' };

            // יצירת רשימת IDs לפי אימיילים
            const userIds = await Promise.all(
                editedTask.assignedUsers.map(async (email) => {
                    try {
                        const user = await getUserByEmail(email);
                        return user?.toString();
                    } catch {
                        throw new Error(`Failed to find user with email ${email}`);
                    }
                })
            );

            updatedTask.assignedUsers = userIds.filter((id) => id !== undefined);
            if (updatedTask.assignedUsers)
                await Promise.all(
                    updatedTask.assignedUsers.map(async (userId) => {
                        if (editedTask._id)
                            try {
                                await shareTask({
                                    taskId: editedTask._id,
                                    targetUserId: userId,
                                    sharedByUserId: user?._id || '',
                                });
                                console.log(`Task successfully shared with user ${userId}`);
                            } catch (error) {
                                console.error(`Failed to share task with user ${userId}:`, error);
                            }
                    })
                );

            if (failedUsers.length) {
                alert(`Failed to share with users: ${failedUsers.join(", ")}`);
            } else {
                alert("Task shared successfully!");
                setShareMode(false);
            }
        } catch (error) {
            console.error("Error sharing task:", error);
            alert("Failed to share task.");
        } finally {
            setLoading(false);
        }
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

    if (!task) {
        return <div>משימה לא קיימת.</div>;
    }

    return (
        <div className="p-4 border rounded bg-gray-100">
            {loading && <p>Loading...</p>}
            {!loading && !editMode && !shareMode && (
                <>
                    <h2 className="text-lg font-bold text-blue-500 mb-2">{task.title}</h2>
                    {task.description && <p className="text-gray-700 mb-2">{task.description}</p>}
                    <p className="text-sm text-gray-500">Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>
                    <p className="text-sm text-gray-500">Priority: {task.priority}</p>
                    <p className="text-sm text-gray-500">Status: {task.status}</p>
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
            {editMode && (
                <div>
                    <input
                        type="text"
                        value={editedTask?.title || ''}
                        onChange={(e) => handleEditChange('title', e.target.value)}
                        placeholder="Title"
                        className="mb-2 p-2 border rounded"
                    />
                    <textarea
                        value={editedTask?.description || ''}
                        onChange={(e) => handleEditChange('description', e.target.value)}
                        placeholder="Description"
                        className="mb-2 p-2 border rounded w-full"
                    />
                    <input
                        type="date"
                        value={editedTask?.dueDate ? new Date(editedTask.dueDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => handleEditChange('dueDate', e.target.value)}
                        className="mb-2 p-2 border rounded"
                    />
                    <button
                        onClick={handleEditSubmit}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
                    >
                        שמור
                    </button>
                    <button
                        onClick={() => setEditMode(false)}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300 ml-2"
                    >
                        ביטול
                    </button>
                </div>
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

export default ViewTask;
