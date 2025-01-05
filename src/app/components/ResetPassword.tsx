"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "../services/passwordService";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password || password !== confirmPassword) {
      setError("הסיסמאות אינן תואמות.");
      return;
    }

    try {
      const successMessage = await resetPassword(password); // קריאה לשירות
      setMessage(successMessage);
      setTimeout(() => router.push("/"), 2000);
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setError("איפוס הסיסמה נכשל.");
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-[#FF2929]"
      style={{ backgroundColor: "#3D3BF3" }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl  mb-4 text-center text-gray-800">
          איפוס סיסמה
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              סיסמה חדשה
            </label>
            <input
              type="password"
              placeholder="הזן סיסמה חדשה"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              אימות סיסמה
            </label>
            <input
              type="password"
              placeholder="אמת את הסיסמה החדשה"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md  hover:bg-blue-700 transition duration-200"
          >
            לאפס סיסמה
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-green-600 font-medium">
            {message}
          </p>
        )}
        {error && (
          <p className="mt-4 text-center text-red-600 font-medium">{error}</p>
        )}
        <button
          onClick={() => router.push("/pages/auth/login")}
          className="mt-6 w-full bg-gray-600 text-white py-2 px-4 rounded-md  hover:bg-gray-700 transition duration-200"
        >
          חזרה ל-Login
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;
