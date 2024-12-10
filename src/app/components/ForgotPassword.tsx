"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // לשימוש בניווט

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // יצירת מופע של router

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/sendVerificationCode", { email });
      setMessage("Verification code sent to your email. Please check your inbox.");
      setError("");

      // מעבר לדף אימות קוד (עם העברת המייל כפרמטר ב-URL)
      router.push(`/pages/verifyCode?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("Error sending verification code:", error);
      setMessage("");
      setError("Failed to send verification code. Please try again.");
    }
  };

  return (
    <div className="grid place-items-center h-screen bg-gray-50">
      <div className="shadow-lg p-6 rounded-lg border-t-4 border-blue-400 max-w-md w-full bg-white">
        <h1 className="text-xl font-bold mb-4 text-center">Forgot Password</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Send Verification Code
          </button>
        </form>
        {message && <p className="text-center mt-4 text-blue-500">{message}</p>}
        {error && <p className="text-center mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
}

export default ForgotPassword;