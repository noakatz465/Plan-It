"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyCode() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email"); // חילוץ האימייל מה-URL

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      setError("Missing email address. Please try again.");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post("/api/verifyCode", { email, code });

      if (response.status === 200) {
        setMessage("Code verified successfully!");
        // מעבר לדף איפוס סיסמה עם העברת המייל
        router.push(`/pages/resetPassword?email=${encodeURIComponent(email)}`);
      } else {
        setError("Invalid or expired verification code.");
      }
    } catch (err) {
      console.error("Error verifying code:", err);
      setError("Invalid or expired verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid place-items-center h-screen bg-gray-50">
      <div className="shadow-lg p-6 rounded-lg border-t-4 border-green-400 max-w-md w-full bg-white">
        <h1 className="text-xl font-bold mb-4 text-center">Verify Code</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter verification code"
            className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-2 rounded-md hover:bg-green-700 transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </button>
        </form>
        {message && <p className="text-center mt-4 text-green-500">{message}</p>}
        {error && <p className="text-center mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
}

export default VerifyCode;
