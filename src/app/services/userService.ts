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
                data._id, data.birthDate ? new Date(data.birthDate) : undefined, data.gender || null, data.profileImage || null);
            return fetchedUser;
        }
    } catch (error) {
        console.error("Failed to fetch user:", error);
    }
}

//GET משתמש לפי EMAIL
export const getUserByEmail = async (email: string) => {
    try {
        const response = await axios.get(`${API_USERS_URL}/get/getUserByEmail/${email}`);
        if (response.status === 200) {
            const data = response.data.user;
            const fetchedUser = new UserModel(data.firstName, data.lastName, data.email, data.password, new Date(data.joinDate),
                data.notificationsEnabled, data.projects || [], data.tasks || [], data.sharedWith || [],
                data._id, data.birthDate ? new Date(data.birthDate) : undefined, data.gender || null, data.profileImage || null);
            return fetchedUser._id;
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

export const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "default_preset"); // שימי לב שצריך להגדיר preset בפאנל של Cloudinary

    try {
        const response = await axios.post(
            "https://api.cloudinary.com/v1_1/ddbitajje/image/upload",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        console.log(response.data);
        return response.data.secure_url; // מחזיר את כתובת ה-URL המאובטחת
    } catch (error) {
        console.error("Error uploading image:", error);
        return null;
    }
};

//שיתוף משימה
export const shareTask = async (data: {taskId: string;
    targetUserId: string;
    sharedByUserId: string;}) => {
    try {
      const response = await axios.post(`${API_USERS_URL}/post/shareTask`, data);
      return response.data;
    } catch (error) {
      console.error("Error sharing task:", error);
      throw new Error(
         "Failed to share the task"
      );
    }
  };

  //שיתוף פרויקט
  export const shareProject = async (data: {projectId: string;
    targetUserId: string;
    sharedByUserId: string;}) => {
    try {
      const response = await axios.post(`${API_USERS_URL}/post/shareProject`, data);
      return response.data;
    } catch (error) {
      console.error("Error sharing project:", error);
      throw new Error(
         "Failed to share the project"
      );
    }
  };
