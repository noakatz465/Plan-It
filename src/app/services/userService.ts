import axios from "axios";
import { UserModel } from "../models/userModel";

const API_USERS_URL = '/api/users';

//GET משתמש לפי ID
export const getUserByID = async (userId: string) => {
    try {
        const response = await axios.get(`${API_USERS_URL}/get/getUserByID/${userId}`);
        if (response.status === 200) {
            const data = response.data.user;
            const fetchedUser = new UserModel(data.firstName, data.lastName, data.email, data.password, new Date(data.joinDate),
                data.notificationsEnabled, data.projects || [], data.tasks || [], data.sharedWith || [],
                data._id, data.birthDate ? new Date(data.birthDate) : undefined, data.gender || null);
            return fetchedUser;
        }
    } catch (error) {
        console.error("Failed to fetch user:", error);
    }
}

export const removeTaskForUsers = async (userIds: string[], taskId: string) => {
    try {
        const response = await axios.post(`${API_USERS_URL}/post/removeTask`, {
            usertIdArr: userIds,
            taskId: taskId,
        });
        if (response.status === 200) {
            console.log("Task and user relationship updated successfully:", response.data);
            return response.data;
        } else {
            console.warn("Unexpected response status:", response.status);
            return null;
        }
    } catch (error) {
        console.error("Error updating task and user relationship:", error);
    }
}