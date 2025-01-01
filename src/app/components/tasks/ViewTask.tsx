'use client';
import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import Image from 'next/image';
import { TaskModel } from '@/app/models/taskModel';
import { updateTask } from '@/app/services/taskService';
import { getUserByEmail, removeTaskForUsers, shareTask } from '@/app/services/userService';
import { useUserStore } from '@/app/stores/userStore';
import { HDate } from '@hebcal/core';
import { TrashIcon, PencilSquareIcon, ShareIcon } from '@heroicons/react/24/outline';

interface ViewTaskProps {
    task: TaskModel;
}

function ViewTask({ task }: ViewTaskProps) {
    const [editMode, setEditMode] = useState(false);
    const [shareMode, setShareMode] = useState(false);
    const [editedTask, setEditedTask] = useState<TaskModel>({ ...task, assignedUsers: task.assignedUsers });
    const [loading, setLoading] = useState(false);
    const user = useUserStore((state) => state.user);
    const projects = useUserStore((state) => state.projects);

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

    const handleUserSelect = (selectedOptions: any) => {
        const newUsers = selectedOptions.map((option: any) => ({
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
                alert(`Failed to share with users: ${failedUsers.join(', ')}`);
            } else {
                alert('Task shared successfully!');
                setShareMode(false);
            }
        } catch (error) {
            console.error('Error sharing task:', error);
            alert('Failed to share task.');
        } finally {
            setLoading(false);
        }
    };

    const userOptions = user?.sharedWith.map((user) => ({
        value: user.email,
        label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {user?.profileImage ? (
                    <Image
                        src={user.profileImage}
                        alt={`${user.firstName} ${user.lastName}`}
                        width={32}
                        height={32}
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                    />
                ) : (
                    <Image
                        src="/default-profile.png"
                        alt="Anonymous Profile"
                        width={32}
                        height={32}
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                    />
                )}
                <span>{`${user.firstName} ${user.lastName}`}</span>
            </div>
        ),
    }));
    const translateFrequency = (frequency: string) => {
        switch (frequency) {
            case "Once":
                return "חד פעמי";
            case "Daily":
                return "יומי";
            case "Weekly":
                return "שבועי";
            case "Monthly":
                return "חודשי";
            case "Yearly":
                return "שנתי";
            default:
                return "לא מוגדר";
        }
    };

    const renderPriorityStars = (priority: string) => {
        const stars =
            priority === 'High' ? 3 : priority === 'Medium' ? 2 : priority === 'Low' ? 1 : 0;

        return (
            <div className="flex items-center">
                {Array.from({ length: stars }).map((_, index) => (
                    <svg
                        key={index}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 text-yellow-400"
                    >
                        <path d="M12 .587l3.668 7.568L24 9.423l-6 5.843 1.418 8.23L12 18.986l-7.418 4.51L6 15.266 0 9.423l8.332-1.268L12 .587z" />
                    </svg>
                ))}
            </div>
        );
    };

    return (
        <div className=" bg-white rounded  max-w-md mx-auto">
            {loading && <p>Loading...</p>}
            {!loading && !editMode && !shareMode && (
                <>
                    <h2 className="text-xl font-bold text-[#3D3BF3] mb-4">{task.title}</h2>
                    <p className="text-gray-600 mb-4">{task.description || 'ללא תיאור'}</p>

                    <div className="mb-4">
                        <p className="text-lg text-gray-500">
                            <strong>תאריך יעד:</strong>{' '}
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('he-IL') : 'ללא תאריך יעד'}{' / '}  {task.dueDate ? new HDate(new Date(task.dueDate)).renderGematriya() : 'ללא תאריך עברי'}
                        </p>
                    </div>

                    <div className="mb-4">
                        <p className="text-lg text-gray-500">
                            <strong>תדירות:</strong>
                            {translateFrequency(task.frequency)}

                        </p>
                    </div>

                    <div className="mb-4 flex items-center">
                        <p className="text-lg text-gray-500 ">
                            <strong>עדיפות:</strong>
                        </p>
                        {renderPriorityStars(task.priority)}
                    </div>

                    <div className="mb-4">
                        <p className="text-lg text-gray-500">
                            <strong>סטטוס:</strong>
                        </p>
                        <div className="relative w-48 h-3 bg-gray-300 rounded-full mt-2">
                            <div
                                className={`absolute h-full rounded-full bg-green-500`}
                                style={{ width: `${task.status === 'Completed' ? 100 : task.status === 'In Progress' ? 50 : 20}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <p className="text-lg text-gray-500">
                            <strong>משתמשים משותפים:</strong>
                        </p>
                        {task.assignedUsers.filter((userId) => userId !== user?._id).length > 0 ? (
                            <ul className="flex flex-wrap gap-4 mt-2">
                                {task.assignedUsers
                                    .filter((userId) => userId !== user?._id)
                                    .map((userId, index) => {
                                        const sharedUser = user?.sharedWith.find((u) => u._id === userId);
                                        return (
                                            <li key={index} className="flex items-center gap-2">
                                                {sharedUser?.profileImage ? (
                                                    <Image
                                                        src={sharedUser.profileImage}
                                                        alt={`${sharedUser.firstName} ${sharedUser.lastName}`}
                                                        width={32}
                                                        height={32}
                                                        className="rounded-full"
                                                    />
                                                ) : (
                                                    <Image
                                                        src="/default-profile.png"
                                                        alt="Anonymous Profile"
                                                        width={32}
                                                        height={32}
                                                        className="rounded-full"
                                                    />
                                                )}
                                                <span className="text-gray-500 text-sm">
                                                    {sharedUser
                                                        ? `${sharedUser.firstName} ${sharedUser.lastName}`
                                                        : `משתמש לא מזוהה (${userId})`}
                                                </span>
                                            </li>
                                        );
                                    })}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500 mt-2">אין משתמשים משותפים.</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <p className="text-lg text-gray-500">
                            <strong>פרויקט:</strong>{' '}
                            {task.projectId ? (
                                projects?.find((project) => project._id === task.projectId) ? (
                                    <a
                                        href={`/projects/${task.projectId}`}
                                        className="text-blue-500 underline"
                                    >
                                        {
                                            projects.find((project) => project._id === task.projectId)
                                                ?.name
                                        }
                                    </a>
                                ) : (
                                    'פרויקט לא נמצא'
                                )
                            ) : (
                                'אין פרויקט משויך'
                            )}
                        </p>
                    </div>


                    <div className="flex justify-between items-center mr-8 ml-8 mt-8">
                        <button
                            className="group p-2 bg-white rounded-full hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-300"
                            title="מחיקה"
                            onClick={handleDeleteTask}
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
                            onClick={handleShareClick}
                        >
                            <ShareIcon className="w-7 h-7 text-green-500 group-hover:text-white" />
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
