'use client'
import React, { useEffect, useState } from 'react'
import { TaskModel } from '../models/taskModel';
import { deleteTask, getTaskByID } from '../services/taskService';
import { removeTaskForUsers } from '../services/userService';

function ViewTask({ params }: { params: { taskId: string } }) {
    const [task, setTask] = useState<TaskModel>(new TaskModel("","Pending",""));
    const userId = '674ed2c952ef7d7732ebb3e7';
    useEffect(() => {
        const fetchTask = async () => {
            try {
                const fetchedTask = await getTaskByID(params.taskId);
                setTask(fetchedTask);
            } catch (error) {
                console.error("Failed to fetch task:", error);
            }
        };
        fetchTask();
    }, [params.taskId]);

    const handleDeleteTask = async () => {
        console.log(`Task Details:
            Title: ${task.title}
            Description: ${task.description}
            Due Date: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
            Priority: ${task.priority}
            Status: ${task.status}
            Creator ID: ${task.creator}`);
        if (userId === task.creator) {
            await deleteTask(params.taskId)
        }
        else{
            try {
                const newAssignedUserIdsArr = [...task.assignedUserIds, task.creator]
                const result = await removeTaskForUsers (newAssignedUserIdsArr, params.taskId);
                console.log("Update result:", result);
            } catch (error) {
                console.error("Error updating task and users:", error);
            }
        }
    }

    return (
        <div className="p-4 border rounded bg-gray-100">
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
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
                    עריכה
                </button>
            </div>
        </div>
    )
}

export default ViewTask
