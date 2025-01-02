"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyCode } from "../services/passwordService";

function VerifyCode() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null); 

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // קריאת ה-URL רק לאחר טעינת הדף
    const emailFromURL = searchParams.get("email");
    if (emailFromURL) {
      setEmail(emailFromURL);
    }
  }, [searchParams]);

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
      const successMessage = await verifyCode(email, code);
      setMessage(successMessage);
    
      // מעבר לדף איפוס סיסמה
      setTimeout(() => {
        router.push(`/pages/auth/resetPassword`);
      }, 2000);
    } catch (err) {
      console.error("Error verifying code:", err);
      setError( "Invalid verification code.");
    }
     finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="grid place-items-center h-screen bg-gray-50"
    style={{ backgroundColor: "#3D3BF3" }}>
      <div className="shadow-lg p-6 rounded-lg  max-w-md w-full bg-white">
        <h1 className="text-xl  mb-4 text-center">Verify Code</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter verification code"
            className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#9694FF]"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white  py-2 rounded-md hover:bg-green-600 transition duration-200"
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
