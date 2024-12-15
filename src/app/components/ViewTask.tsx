'use client'
import React, { useEffect, useState } from 'react'
import { TaskModel } from '../models/taskModel';
import { getTaskByID } from '../services/taskService';

function ViewTask({ params }: { params: { taskId: string } }) {
    const [task, setTask] = useState<TaskModel>(new TaskModel("", "Pending", ""));
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
    
    return (
        <div className="p-4 border rounded bg-gray-100">
            <h2 className="text-lg font-bold text-blue-500 mb-2">{task.title}</h2>
            {task.description && <p className="text-gray-700 mb-2">{task.description}</p>}
            <p className="text-sm text-gray-500">Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</p>
            <p className="text-sm text-gray-500">Priority: {task.priority}</p>
            <p className="text-sm text-gray-500">Status: {task.status}</p>
        </div>
    )
}

export default ViewTask
