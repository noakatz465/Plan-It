"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { sendVerificationCode } from "../services/passwordService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const successMessage = await sendVerificationCode(email); // קריאה לשירות
      setMessage(successMessage);
      setError("");

      // מעבר לדף אימות קוד
      setTimeout(() => {
        router.push(`/pages/auth/verifyCode?email=${encodeURIComponent(email)}`);
      }, 2000);    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setMessage("");
      setError( "Failed to send verification code.");
    }
  };

  return (
    <div className="grid place-items-center h-screen bg-gray-50"
    style={{ backgroundColor: "#3D3BF3"}}>
      <div className="shadow-lg p-6 rounded-lg  max-w-md w-full bg-white">
        <h1 className="text-xl  mb-4 text-center">Forgot Password</h1>
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
            className="bg-green-500 text-white  py-2 rounded-md hover:bg-green-600 transition duration-200"
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
