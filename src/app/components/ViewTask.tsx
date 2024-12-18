'use client'
import React, { useEffect, useState } from 'react'
import { TaskModel } from '../models/taskModel';
import { deleteTask, getTaskByID, updateTask } from '../services/taskService';
import { removeTaskForUsers } from '../services/userService';

function ViewTask({ params }: { params: { taskId: string } }) {
    const [task, setTask] = useState<TaskModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editedTask, setEditedTask] = useState<TaskModel | null>(null);
    const userId = '674ed2c952ef7d7732ebb3e7';

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const fetchedTask = await getTaskByID(params.taskId);
                setTask(fetchedTask);
            } catch (error) {
                console.error("Failed to fetch task:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [params.taskId]);

    const handleDeleteTask = async () => {
        if (!task) return;
        if (userId === task.creator) {
            await deleteTask(params.taskId);
        } else {
            try {
                const newAssignedUserIdsArr = [...task.assignedUserIds, task.creator];
                const result = await removeTaskForUsers(newAssignedUserIdsArr, params.taskId);
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
                const updatedTask = await updateTask(params.taskId, editedTask);
                setTask(updatedTask);
                setEditMode(false);
            } catch (error) {
                console.error("Error updating task:", error);
            }
        }
    };

    if (loading) {
        return <div className="p-4 text-center text-gray-500">טוען משימה...</div>;
    }

    if (!task) {
        return <div className="p-4 text-center text-red-500">המשימה לא נמצאה.</div>;
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
