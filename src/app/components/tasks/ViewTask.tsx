'use client';
import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import Image from 'next/image';
import { UserOption } from '@/app/types/userOption';
import { MultiValue } from 'react-select';
import { TaskModel } from '@/app/models/taskModel';
import { getUserByEmail, shareTask } from '@/app/services/userService';
import { useUserStore } from '@/app/stores/userStore';
import { HDate } from '@hebcal/core';
import { TrashIcon, PencilSquareIcon, ShareIcon } from '@heroicons/react/24/outline';
import EditTask from './EditTask';
import { useNotificationsStore } from '@/app/stores/notificationsStore';
import { UserModel } from '@/app/models/userModel';
import { useMessageStore } from '@/app/stores/messageStore';

interface ViewTaskProps {
    task: TaskModel;
    onClose: () => void;
}
function ViewTask({ task, onClose }: ViewTaskProps) {
    const [editMode, setEditMode] = useState(false);
    const [shareMode, setShareMode] = useState(false);
    const setMessage = useMessageStore((state) => state.setMessage);

    const [editedTask, setEditedTask] = useState<TaskModel>({
        ...task,
        assignedUsers: task.assignedUsers,
    });
    const [loading, setLoading] = useState(false);
    const user = useUserStore((state) => state.user);
    const projects = useUserStore((state) => state.projects);
    const deleteTaskAndRefreshUser = useUserStore((state) => state.deleteTaskAndRefreshUser);
    const updateTaskInStore = useUserStore((state) => state.updateTaskInStore);
    const removeTaskForUsers = useUserStore((state) => state.removeTaskForUsers);
    const users = useUserStore((state) => state.users);
    const creator = users.find((user) => user._id === task.creator);
    const { createNotificationsPerUsers } = useNotificationsStore();
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
    const getProgressValue = (status: string) => {
        switch (status) {
            case "Completed":
                return 100;
            case "In Progress":
                return 50;
            case "Pending":
                return 20;
            default:
                return 0;
        }
    };
    const getProgressColor = (status: string) => {
        switch (status) {
            case "Completed":
                return "bg-green-500";
            case "In Progress":
                return "bg-yellow-500";
            case "Pending":
                return "bg-[#FF2929]";
            default:
                return "bg-gray-400";
        }
    };
    const handleEditClick = () => {
        setEditMode(true);
    };
    const handleEditCancel = () => {
        setEditMode(false);
    };
    const handleEditSave = () => {
        setEditMode(false);
        onClose();
    };
    const handleDeleteTask = async () => {
        if (!task) return;
        setLoading(true);
        try {
            if (user?._id === task.creator) {
                if (task._id) await deleteTaskAndRefreshUser(task._id);
                setMessage("המשימה נמחקה בהצלחה!", "success"); 
                onClose();
            } else {
                const newAssignedUsersArr = [...task.assignedUsers, task.creator];
                if (task._id) await removeTaskForUsers(newAssignedUsersArr, task._id);
                onClose(); // סגירת מודל תצוגת המשימה

            }
        } catch (error) {
            console.error('Error deleting task:', error);
            setMessage("אירעה שגיאה בעת מחיקת המשימה. נסו שוב מאוחר יותר.", "error");
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
            if (task._id) {
                const mergedAssignedUsers = [
                    ...task.assignedUsers,
                    ...updatedTask.assignedUsers.filter(user => !task.assignedUsers.includes(user)),
                ];
        
                const taskToUpdate = {
                    ...updatedTask,
                    assignedUsers: mergedAssignedUsers,
                };
        
                updateTaskInStore(task._id, taskToUpdate);
            }
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
                            } catch (error) {
                                console.error(`Failed to share task with user ${userId}:`, error);
                            }
                    })
                );

            if (failedUsers.length) {
                setMessage("אירעה שגיאה בעת שיתוף המשימה. נסו שוב מאוחר יותר.", "error");

            } else {
                setMessage("המשימה שותפה בהצלחה!", "success");
                if (user?.notificationsEnabled) {
                    // קריאה לפונקציה לשליחת התראות אם כל השיתופים הצליחו
                    const newUserIds = updatedTask.assignedUsers.filter(
                        (userId) => !task.assignedUsers.includes(userId)
                    );
                    try {
                        await createNotificationsPerUsers(
                            "TaskAssigned",
                            task,
                            newUserIds
                        );

                    } catch (error) {
                        console.error('Failed to send notifications:', error);
                    }
                }

                setShareMode(false);
                onClose()
            }
        } catch (error) {
            console.error("Error sharing task:", error);
        } finally {
            setLoading(false);
        }
    };
    const userOptions = React.useMemo(() =>
        user?.sharedWith.map((user: UserModel) => ({
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
        <div className="max-w-2xl mx-auto bg-white rounded">
            {loading && <p>Loading...</p>}
            {!loading && !editMode && !shareMode && (
                <>
                    <h2 className="text-xl font-bold text-[#3D3BF3] mb-4">{task.title}</h2>
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-lg text-black ">
                            <p >{task.description || 'ללא תיאור'}</p>
                        </p>
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-lg text-black font-medium w-1/3 text-right">
                            <strong>תאריך יעד:</strong>
                        </p>
                        <p className="text-lg text-black w-2/3">
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('he-IL') : 'ללא תאריך יעד'}{' / '}
                            {task.dueDate ? new HDate(new Date(task.dueDate)).renderGematriya() : 'ללא תאריך עברי'}
                        </p>
                    </div>
                    <div className="mb-4 flex items-center">
                        <p className="text-lg text-black font-medium w-1/3 text-right">
                            <strong>סטטוס:</strong>
                        </p>
                        <div className="relative w-2/3 h-6 bg-gray-300 rounded-full">
                            <div
                                className={`absolute h-full rounded-full ${getProgressColor(task.status)}`}
                                style={{ width: `${getProgressValue(task.status)}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-lg text-black font-medium w-1/3 text-right">
                            <strong>תדירות:</strong>
                        </p>
                        <p className="text-lg text-black w-2/3">
                            {translateFrequency(task.frequency)}
                        </p>
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-lg text-black font-medium w-1/3 text-right">
                            <strong>עדיפות:</strong>
                        </p>
                        <div className="w-2/3 flex items-center">{renderPriorityStars(task.priority)}</div>
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-lg text-black font-medium w-1/3 text-right">
                            <strong>יוצר המשימה:</strong>
                        </p>
                        <div className="w-2/3 flex items-center">
                            {creator && creator._id !== user?._id ? (
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={creator.profileImage || "https://res.cloudinary.com/ddbitajje/image/upload/v1735038509/t7ivdaq3nznunpxv2soc.png"}
                                        alt="Profile"
                                        width={30}
                                        height={30}
                                        className="rounded-full"
                                        style={{
                                            objectFit: "cover",
                                            width: "30px",
                                            height: "30px",
                                            borderRadius: "50%",
                                        }}
                                        unoptimized
                                    />
                                    <span>
                                        {`${creator.firstName} ${creator.lastName}`}
                                    </span>
                                </div>
                            ) : (
                                <p > אני</p>
                            )}
                        </div>

                    </div>
                    <div className="mb-4">
                        <p className="text-lg text-black-500">
                            <strong>משתמשים משותפים:</strong>
                        </p>
                        {task.assignedUsers?.length > 0 ? (
                            <ul className="flex flex-wrap gap-4 mt-2">
                                {task.assignedUsers
                                    .map((userId, index) => {
                                        const sharedUser = users.find((u) => u._id === userId);
                                        return (
                                            <li key={index} className="flex items-center gap-2">
                                                {sharedUser?.profileImage ? (
                                                    <Image
                                                        src={sharedUser.profileImage}
                                                        alt={`${sharedUser.firstName} ${sharedUser.lastName}`}
                                                        width={32}
                                                        height={32}
                                                        className="rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <Image
                                                        src="/default-profile.png"
                                                        alt="Anonymous Profile"
                                                        width={32}
                                                        height={32}
                                                        className="rounded-full object-cover"
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
                        <p className="text-lg text-black-500">
                            <strong>פרויקט:</strong>{' '}
                            {task.projectId ? (
                                (() => {
                                    const project = projects?.find((project) => project._id === task.projectId); // חיפוש הפרויקט פעם אחת בלבד
                                    return project ? (
                                        <span>{project.name || 'פרויקט ללא שם'}</span> // הצגת שם הפרויקט אם קיים
                                    ) : (
                                        'פרויקט לא נמצא'
                                    );
                                })()
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
                        {task.creator == user?._id && <button
                            className="group p-2 bg-white rounded-full hover:bg-green-500 focus:outline-none focus:ring focus:ring-green-300"
                            title="שיתוף"
                            onClick={handleShareClick}
                        >
                            <ShareIcon className="w-7 h-7 text-green-500 group-hover:text-white" />
                        </button>}
                    </div>
                </>
            )}
            {editMode && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded shadow-lg max-h-[90vh] overflow-y-auto modal-content w-full max-w-md">
                        <button
                            onClick={handleEditCancel}
                            className="text-red-500 float-right font-bold">
                            ✖
                        </button>
                        <EditTask
                            task={task}
                            onSave={handleEditSave}
                            onCancel={handleEditCancel}
                        />
                    </div>
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
