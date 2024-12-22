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

//עדכון פרטי משתמש קיים
export const updateUser = async (userId: string, updatedData: Partial<UserModel>) => {
    try {
        const response = await axios.put(`${API_USERS_URL}/put/${userId}`, updatedData, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status === 200) {
            console.log("User updated successfully:", response.data.user);
            const data = response.data.user;
            const updatedUser = new UserModel(data.firstName, data.lastName, data.email, data.password, new Date(data.joinDate),
                data.notificationsEnabled, data.projects || [], data.tasks || [], data.sharedWith || [],
                data._id, data.birthDate ? new Date(data.birthDate) : undefined, data.gender || null, data.profileImage || '');
            return updatedUser;
        } else {
            console.warn("Unexpected response status:", response.status);
            return null;
        }
    } catch (error) {
        console.error("Error updating user:", error);
        return null;
    }
}

export const fetchAllUsers = async (): Promise<UserModel[] | null> => {
    try {
      const response = await axios.get(`${API_USERS_URL}`);
      if (response.status === 200) {
        const usersData = response.data.users;
        const users = usersData.map((data: any) => new UserModel(
          data.firstName,
          data.lastName,
          data.email,
          "",
          new Date(data.joinDate),
          data.notificationsEnabled,
          [], // מערך ריק לפרויקטים
          [], // מערך ריק למשימות
          [],
          data._id,
          data.birthDate ? new Date(data.birthDate) : undefined,
          data.gender || null
        ));
        console.log("Users fetched successfully:", users);
        return users;
      } else {
        console.warn("Unexpected response status:", response.status);
        return null;
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      return null;
    }
  };
  