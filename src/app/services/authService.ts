import axios from "axios";
import { UserModel } from "../models/userModel";
// import { NextRouter } from "next/router";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const API_USERS_URL = '/api/users';
const API_LOGIN_URL = '/api/login';

// פונקציית הוספת משתמש
export const addUser = async (user: UserModel): Promise<string> => {
  try {
 
    const response = await axios.post(
      `${API_USERS_URL}/post`,
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        gender: user.gender,
        birthDate: user.birthDate ? user.birthDate.toISOString() : undefined,
        profileImage: user.profileImage , // שליחת תמונת פרופיל או ברירת מחדל
      },
      {
        withCredentials: true, // וידוא שכלול עוגיות בבקשה
      }
    );

    if (response.status === 200 || response.status === 201) {
      return "User added successfully!";
    } else {
      throw new Error(`Failed to add user: ${response.statusText}`);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Failed to add user. Please try again."
      );
    } else {
      console.error("Unknown error:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};

// פונקציית התחברות
export const loginUser = async (
  email: string,
  password: string
): Promise<string> => {
  try {
    const response = await axios.post(
      API_LOGIN_URL,
      { email, password },
      { withCredentials: true } // מאפשר שליחה וקבלה של עוגיות
    );

    if (response.status === 200) {
      return response.data.message; // מחזיר הודעת הצלחה בלבד
    } else {
      throw new Error(`Unexpected response: ${response.statusText}`);
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Login failed.");
    } else {
      console.error("Unknown error:", error);
      throw new Error("An unexpected error occurred.");
    }
  }
};

export const fetchUserDetailsByCookie = async (): Promise<UserModel> => {
  try {
    const response = await axios.get(`${API_USERS_URL}/get/getUser`, {
      withCredentials: true, // מאפשר שליחה וקבלה של עוגיות
    });

    const userDetails = response.data.user;
    // יצירת אובייקט UserModel
    return new UserModel(
      userDetails.firstName,
      userDetails.lastName,
      userDetails.email,
      userDetails.password,
      new Date(userDetails.joinDate),
      userDetails.notificationsEnabled,
      userDetails.projects || [],
      userDetails.tasks || [],
      userDetails.sharedWith || [],
      userDetails._id,
      userDetails.birthDate ? new Date(userDetails.birthDate) : undefined,
      userDetails.gender,
      userDetails.profileImage
    );
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw new Error("Failed to fetch user details. Please try again.");
  }
};


export const fetchUserDetailsBySession = async (userId: string): Promise<UserModel> => {
  try {
    const response = await axios.get(`${API_USERS_URL}/get/getUserByID/${userId}`);
    const userDetails = response.data.user;
    // יצירת אובייקט UserModel
    return new UserModel(
      userDetails.firstName,
      userDetails.lastName,
      userDetails.email,
      userDetails.password,
      new Date(userDetails.joinDate),
      userDetails.notificationsEnabled,
      userDetails.projects || [],
      userDetails.tasks || [],
      userDetails.sharedWith || [],
      userDetails._id,
      userDetails.birthDate ? new Date(userDetails.birthDate) : undefined,
      userDetails.gender,
      userDetails.profileImage
    );
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    throw new Error("Unable to fetch user details.");
  }
};

export const logoutUser = async (router: AppRouterInstance): Promise<void> => {
  try {
    const response = await axios.post("/api/logout", {}, { withCredentials: true });
    if (response.data.redirectUrl) {
      router.push(response.data.redirectUrl); // ניתוב לעמוד התחברות
    }
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error("Failed to logout. Please try again.");
  }
};

