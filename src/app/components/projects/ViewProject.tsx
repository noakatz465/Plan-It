'use client';

import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import Image from 'next/image';
import { TrashIcon, PencilSquareIcon, ShareIcon, PlusIcon } from '@heroicons/react/24/outline';
import { MultiValue } from 'react-select';
import { ProjectModel } from '@/app/models/projectModel';
import { TaskModel } from '@/app/models/taskModel';
import { deleteProject, updateProject } from '@/app/services/projectService';
import { useUserStore } from '@/app/stores/userStore';
import TaskListItem from '../tasks/TaskListItem';
import { UserModel } from '@/app/models/userModel';
import AddTask from '../tasks/AddTask';
import { getUserByEmail, shareProject } from '@/app/services/userService';
import { useMessageStore } from '@/app/stores/messageStore';
import { useNotificationsStore } from '@/app/stores/notificationsStore';

interface ViewProjectProps {
    project: ProjectModel;
    onClose: () => void;
}

function ViewProject({ project, onClose }: ViewProjectProps) {
    const [editMode, setEditMode] = useState(false);
    const [shareMode, setShareMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editedProject, setEditedProject] = useState<ProjectModel>({ ...project });
    const user = useUserStore((state) => state.user);
    const users = useUserStore((state) => state.users);
    const manager = users.find((user) => user._id === project.managerID); // מציאת היוצר לפי ID
    const [addTaskModal, SetAddTaskModal] = useState(false);
    const setMessage = useMessageStore((state) => state.setMessage);
  const { createProjectNotifications } = useNotificationsStore();

    // משימות הקשורות לפרויקט הנוכחי
    const tasks = project.LinkedTasks || [];

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleEditCancel = () => {
        setEditMode(false);
    };

    const handleEditSave = async () => {
        try {
            if (project._id) {
                await updateProject(project._id, editedProject); // עדכון הפרויקט בשרת או ב-store
                setEditMode(false); // יציאה ממצב עריכה
                setMessage(`הפרויקט "${editedProject.name}" עודכן בהצלחה!`, "success"); // הודעת הצלחה
            } else {
                throw new Error("Project ID is missing.");
            }
        } catch (error) {
            console.error("Error updating project:", error);
            setMessage("אירעה שגיאה בעת עדכון הפרויקט. נסו שוב מאוחר יותר.", "error"); // הודעת שגיאה
        }
    };


    const handleDeleteProject = async () => {
        if (!project) return;
        setLoading(true);
        try {
            if (project._id) await deleteProject(project._id);
            onClose()
            setMessage(`הפרויקט "${project.name}" נמחק בהצלחה!`, "success"); // הודעת הצלחה


        } catch (error) {
            console.error('Error deleting project:', error);
            setMessage("אירעה שגיאה בעת מחיקת הפרויקט. נסו שוב מאוחר יותר.", "error"); // הודעת שגיאה

        } finally {
            setLoading(false);
        }
    };

    const handleShareClick = () => {
        setShareMode(true);
    };

    const handleUserSelect = (selectedOptions: MultiValue<{ value: string }>) => {
        const newUsers = selectedOptions.map((option) => option.value);
        setEditedProject((prev) => ({ ...prev, members: newUsers }));
    };

    const handleShareSubmit = async () => {
        setLoading(true);
        const failedUsers: string[] = [];
        try {
            const updatedProject = { ...project, manager: user?._id || '' };

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
            } else {
                if (user?.notificationsEnabled) {
                    // קריאה לפונקציה לשליחת התראות אם כל השיתופים הצליחו
                    const newUserIds = updatedProject.members.filter(
                        (userId) => !project.members.includes(userId)
                    );
                    try {
                        await createProjectNotifications(
                            "ProjectAssigned",
                            project,
                            newUserIds
                        );

                        console.log('Notifications sent successfully.');
                        setMessage(`הפרויקט "${project.name}" שותף בהצלחה !`, "success"); // הודעת הצלחה

                    } catch (error) {
                        console.error('Failed to send notifications:', error);
                        setMessage("אירעה שגיאה בעת שיתוף הפרויקט. נסו שוב מאוחר יותר.", "error"); // הודעת שגיאה

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

    return (
        <div className="max-w-3xl mx-auto bg-white rounded p-4">
            {loading && <p>Loading...</p>}
            {!loading && !editMode && !shareMode && (
                <>
                    <h2 className="text-xl font-bold text-[#3D3BF3] mb-4">{project.name}</h2>
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-lg text-black ">
                            <p >{project.description || 'ללא תיאור'}</p>
                        </p>
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-lg text-black font-medium w-1/3 text-right">
                            <strong>מנהל הפרויקט :</strong>
                        </p>
                        <div className="w-2/3 flex items-center">
                            {manager && manager._id !== user?._id ? (
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={manager.profileImage || "https://res.cloudinary.com/ddbitajje/image/upload/v1735038509/t7ivdaq3nznunpxv2soc.png"}
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
                                        {`${manager.firstName} ${manager.lastName}`}
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
                        {project.members.length > 0 ? (
                            <ul className="flex flex-wrap gap-4 mt-2">
                                {project.members
                                    .map((userId, index) => {
                                        const sharedUser = users.find((u) => u._id === userId); // חיפוש המשתמש במערך users
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


                    {/* משימות הקשורות לפרויקט */}
                    <div className="mt-8">
                        <h3 className="text-lg font-bold  mb-4">משימות בפרויקט:</h3>
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
                    <p className="text-sm  mb-4">
                        <strong>תאריך עדכון אחרון:</strong>{' '}
                        {project.lastModified ? new Date(project.lastModified).toLocaleDateString('he-IL') : 'לא עודכן'}
                    </p>


                    <div className="flex justify-between items-center mr-8 ml-8 mt-8">
                        <button
                            className="group p-2 bg-white rounded-full hover:bg-purple-500 focus:outline-none focus:ring focus:ring-purple-300"
                            title="הוספת משימה"
                            onClick={() => SetAddTaskModal(true)}
                        >
                            <PlusIcon className="w-7 h-7 text-purple-500 group-hover:text-white" />
                        </button>
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
                        {project.managerID == user?._id && <button
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
                        onClick={handleShareSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        שתף
                    </button>
                    <button
                        onClick={() => setShareMode(false)}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300 mt-2"
                    >
                        ביטול
                    </button>
                </div>
            )}
            {addTaskModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded shadow-lg max-h-[90vh] overflow-y-auto modal-content w-full max-w-md">
                        <button
                            onClick={(e) => { e.stopPropagation(); SetAddTaskModal(false) }}
                            className="text-red-500 float-right font-bold">
                            ✖
                        </button>
                        <AddTask projectId={project._id} assignedUsers={project.members}
                            onClose={() => SetAddTaskModal(false)} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewProject;
