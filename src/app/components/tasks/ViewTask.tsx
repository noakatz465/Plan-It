'use client'
import { TaskModel } from '@/app/models/taskModel';
import { deleteTask, updateTask } from '@/app/services/taskService';
import { removeTaskForUsers } from '@/app/services/userService';
import { useUserStore } from '@/app/stores/userStore';
import React, { useState } from 'react'

interface ViewTaskProps {
    task: TaskModel
}

function ViewTask({ task }: ViewTaskProps) {
    const [editMode, setEditMode] = useState(false);
    const [editedTask, setEditedTask] = useState<TaskModel | null>(null);
    const user = useUserStore((state) => state.user);
    const deleteTaskAndRefreshUser = useUserStore((state) => state.deleteTaskAndRefreshUser);

    const handleDeleteTask = async () => {
        if (!task) return;
        if (user?._id === task.creator) {
            if (task._id)
                await deleteTaskAndRefreshUser(task._id);
        } else {
            try {
                const newAssignedUserIdsArr = [...task.assignedUserIds, task.creator];
                let result;
                if (task._id)
                    result = await removeTaskForUsers(newAssignedUserIdsArr, task._id);
                console.log("Update result:", result);
            } catch (error) {
                console.error("Error updating task and users:", error);
            }
        }
    };

    const handleEditClick = () => {
        setEditMode(true);
        if (task)
            setEditedTask({ ...task });
    };

    const handleEditChange = (field: keyof TaskModel, value: unknown) => {
        if (editedTask) {
            setEditedTask({ ...editedTask, [field]: value });
        }
    };

    const handleEditSubmit = async () => {
        if (editedTask) {
            try {
                let updatedTask;
                if (task._id)
                updatedTask = await updateTask(task._id, editedTask);
                // setTask(updatedTask);
                setEditMode(false);
            } catch (error) {
                console.error("Error updating task:", error);
            }
        }
    };

    if (!task) {
        return <div>משימה לא קיימת.</div>;
    }


    return (
        <div className="p-4 border rounded bg-gray-100">
            {!editMode ? (
                <>
                    <h2 className="text-lg font-bold text-blue-500 mb-2">{task.title}</h2>
                    {task.description && <p className="text-gray-700 mb-2">{task.description}</p>}
                    <p className="text-sm text-gray-500">Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</p>
                    <p className="text-sm text-gray-500">Priority: {task.priority}</p>
                    <p className="text-sm text-gray-500">Status: {task.status}</p>
                    <div className="flex justify-end space-x-2">
                        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
                            onClick={handleDeleteTask}>
                            מחיקה
                        </button>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                            onClick={handleEditClick}>
                            עריכה
                        </button>
                    </div>
                </>
            ) : (
                <div>
                    <input type="text" value={editedTask?.title || ""}
                        onChange={(e) => handleEditChange("title", e.target.value)}
                        placeholder="Title" className="mb-2 p-2 border rounded" />
                    <textarea value={editedTask?.description || ""}
                        onChange={(e) => handleEditChange("description", e.target.value)}
                        placeholder="Description" className="mb-2 p-2 border rounded w-full" />
                    <input
                        type="date"
                        value={editedTask?.dueDate ? new Date(editedTask.dueDate).toISOString().split('T')[0] : ""}
                        onChange={(e) => handleEditChange("dueDate", e.target.value)}
                        className="mb-2 p-2 border rounded" />
                    <button
                        onClick={handleEditSubmit}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300">
                        שמור
                    </button>
                    <button
                        onClick={() => setEditMode(false)}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300 ml-2">
                        ביטול
                    </button>
                </div>
            )}
        </div>
    );
}

export default ViewTask;
