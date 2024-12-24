"use client";
import React, { useState } from "react";
import {  useRouter } from "next/navigation";
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
      setError("Passwords do not match.");
      return;
    }
  
    try {
      const successMessage = await resetPassword(password); // קריאה לשירות
      setMessage(successMessage);
      setTimeout(() => router.push("/"), 2000);
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setError("Failed to reset password.");
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-bold hover:bg-blue-700 transition duration-200"
          >
            Reset Password
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
          onClick={() => router.push("/")}
          className="mt-6 w-full bg-gray-600 text-white py-2 px-4 rounded-md font-bold hover:bg-gray-700 transition duration-200"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;
