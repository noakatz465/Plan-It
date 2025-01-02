import axios from "axios";

/**
 * שולח קוד אימות למייל של המשתמש.
 * @param email - כתובת המייל של המשתמש
 * @returns הודעה על הצלחה או שגיאה
 */
export const sendVerificationCode = async (email: string): Promise<string> => {
  try {
    const response = await axios.post("/api/sendVerificationCode", { email });
    return response.data.message || "Verification code sent successfully!";
  } catch (error) {
    console.error("Error sending verification code:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to send verification code.");
    }
    throw new Error("An unexpected error occurred.");
  }
};


export const verifyCode = async (email: string, code: string): Promise<string> => {
    try {
      const response = await axios.post("/api/verifyCode", { email, code });
  
      if (response.status === 200) {
        return response.data.message || "Code verified successfully!";
      } else {
        throw new Error("Invalid or expired verification code.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Axios error:", err.response?.data || err.message);
        throw new Error(err.response?.data?.message || "Failed to verify code.");
      } else {
        console.error("Unknown error:", err);
        throw new Error("Failed to verify code.");
      }
    }
  };

  
  export const resetPassword = async (password: string): Promise<string> => {
    try {
      const response = await axios.post("/api/resetPassword", { password });
      return response.data.message || "Password updated successfully!";
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // טיפול בשגיאות שמגיעות מ-axios
        throw new Error(error.response?.data?.message || "Failed to reset password.");
      }
      // טיפול בשגיאות כלליות
      throw new Error("An unexpected error occurred. Please try again.");
    }
  };
  
  
  