"use client";
import Link from "next/link";
import React, { useState } from "react";
import { UserModel } from "../models/userModel";
import { addUser } from "../services/authService";
import { useRouter } from "next/navigation";

function SignIn() {
  
  const router = useRouter();


  const [user, setUser] = useState<UserModel>(
    new UserModel("", "", "", "") // ערכים התחלתיים
  );
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleInputChange = (field: keyof UserModel, value: unknown) => {
    setUser((prevUser) => ({
      ...prevUser,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!user.firstName || !user.lastName || !user.email || !user.password) {
      setError("First Name, Last Name, Email, and Password are required.");
      return;
    }
  
    setError("");
    setSuccessMessage("");
  
    try {
      // העברת כל השדות שנמצאים באובייקט user לשרת
      const message = await addUser({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        gender: user.gender, // העברת מגדר אם קיים
        birthDate: user.birthDate, // העברת תאריך לידה אם קיים
      } as UserModel); // הגדרת הטיפוס כ-UserModel
      
      setSuccessMessage(message); // הצגת הודעת הצלחה
      console.log("User added successfully:", user);
      router.push("/pages/main/dashboard"); // מעבר לדשבורד

    } catch (err) {
      console.error("Error adding user:", err);
      setError("Failed to add user. Please try again.");
    }
  };
  

  return (
    <div className="grid place-items-center h-screen bg-gray-50">
      <div className="shadow-lg p-6 rounded-lg border-t-4 border-green-400 max-w-md w-full bg-white">
        <h1 className="text-xl font-bold mb-4 text-center">Sign In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="First Name"
            className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={user.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={user.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={user.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={user.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
          />
          <select
            className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={user.gender ?? ""}
            onChange={(e) => handleInputChange("gender", e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
          <input
            type="date"
            className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={user.birthDate ? user.birthDate.toISOString().split("T")[0] : ""}
            onChange={(e) =>
              handleInputChange("birthDate", new Date(e.target.value))
            }
          />
          <button
            type="submit"
            className="bg-green-600 text-white font-bold py-2 rounded-md hover:bg-green-700 transition duration-200"
          >
            Sign In
          </button>
          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {successMessage}
            </div>
          )}
          <div className="text-right mt-4">
            <Link className="text-sm text-blue-500 hover:underline" href="/">
              Already have an account? <span className="underline">Login</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
