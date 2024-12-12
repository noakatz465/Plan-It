import axios from "axios";

const API_TASKS_URL = '/api/tasks';

//GET משימה לפי ID
export const getTaskByID = async (taskId: string) => {
    try {
        const response = await axios.get(`${API_TASKS_URL}/get/getTaskByID/${taskId}`);
        return response.data.task;
    } catch (error) {
        console.error('Failed to fetch task:', error);
    }
}
//הוספת משימה למשתמש
export const addTask = async (taskData: {
    title: string; description?: string; dueDate?: Date; creator: string; assignedUsers?: string[]; projectId?: string;
}) => {
    try {
        const response = await axios.post(`${API_TASKS_URL}/post`, taskData);
        if (response.status === 200) {
            console.log("Task added successfully:", response.data);
            return response.data;
        } else {
            console.warn("Unexpected response status:", response.status);
            return null;
        }
    } catch (error) {
        console.error("Error adding task:", error);
    }

}
