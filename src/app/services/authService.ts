import axios from "axios";
import { UserModel } from "../models/userModel";

const API_USERS_URL = '/api/users';
const API_LOGIN_URL = '/api/login';

// פונקציית הוספת משתמש
export const addUser = async (user: UserModel): Promise<string> => {
  try {
    const response = await axios.post(`${API_USERS_URL}/post`, {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      gender: user.gender,
      birthDate: user.birthDate ? user.birthDate.toISOString() : undefined,
    });

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

export const loginUser = async (
    email: string,
    password: string
  ): Promise<{ message: string; user: Partial<UserModel> }> => {
    try {
      const response = await axios.post(API_LOGIN_URL, { email, password });
  
      if (response.status === 200) {
        const { message, user } = response.data;
        return { message, user }; // החזרת הודעת ההצלחה ופרטי המשתמש
      } else {
        throw new Error(`Unexpected response: ${response.statusText}`);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Login failed.");
      } else {
        console.error("Unknown error:", error);
        throw new Error("An unexpected error occurred.");
      }
    }
  };
