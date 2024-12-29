"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { loginUser } from "../services/authService"; // נניח שזה המסלול שבו מוגדרת הפונקציה

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are necessary.");
      return;
    }

    setError(""); // איפוס שגיאות אם הכל תקין

    try {
      const message = await loginUser(email, password);
      console.log("Login successful:", message); // הודעת הצלחה
      router.push("/pages/main/dashboard"); // מעבר לדשבורד
    } catch (err: any) {
      console.error("Login failed:", err.message);
      setError(err.message || "An error occurred. Please try again.");
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/pages/main/dashboard" });
  };

  return (
    <div className="grid place-items-center h-screen bg-gray-50"
    style={{ backgroundColor: "#3D3BF3" }}>
      <div className="shadow-lg p-6 rounded-lg  max-w-md w-full bg-white">
        <h1 className="text-xl  my-4 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white  py-2 rounded-md hover:bg-green-600 transition duration-200"
          >
            Login
          </button>
          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="mt-2 w-full bg-[#FF2929] text-white  py-2 rounded-md hover:bg-red-600 transition duration-200"
          >
            Sign in with Google
          </button>
          <div className="text-right">
            <Link
              className="text-sm text-blue-500 hover:underline"
              href="/pages/auth/signIn"
            >
              עדין אין לך חשבון? <span className="underline">Sign In</span>
            </Link>
          </div>
          <div className="text-right mt-2">
            <Link
              className="text-sm text-blue-500 hover:underline"
              href="/pages/auth/forgotPassword"
            >
              שכחת סיסמא?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
