import axios from "axios";
import { UserModel } from "../models/userModel";

const API_URL = '/api/users';

// פונקציית הוספת משתמש
export const addUser = async (user: UserModel): Promise<string> => {
    try {
      const response = await axios.post(`${API_URL}/post`, {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
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
  
