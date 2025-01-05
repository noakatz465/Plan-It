"use client";
import React, { useState } from "react";
import Select, { SingleValue } from "react-select";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserModel } from "../../models/userModel";
import { addUser } from "../../services/authService";
import { z } from "zod";
interface GenderOption {
  value: string;
  label: string;
}
const userSchema = z.object({
  firstName: z.string().min(2, "שם פרטי נדרש"),
  lastName: z.string().min(2, "שם משפחה נדרש"),
  email: z.string().email("יש להזין כתובת אימייל תקינה"),
  password: z.string().min(6, "הסיסמה חייבת להכיל לפחות 6 תווים"),
  gender: z.string().optional(),
  birthDate: z.date().optional(),
});

function SignIn() {
  const router = useRouter();
  const [user, setUser] = useState<UserModel>(
    new UserModel("", "", "", "")
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({}); // שגיאות לכל שדה
  const [successMessage, setSuccessMessage] = useState<string>("");

  const genderOptions: GenderOption[] = [
    { value: "M", label: "זכר" },
    { value: "F", label: "נקבה" },
  ];

  const handleInputChange = (field: keyof UserModel, value: string | Date) => {
    setUser((prevUser) => ({
      ...prevUser,
      [field]: value,
    }));
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "", // איפוס השגיאה לשדה בעת שינוי ערך
    }));
  };

  const handleGenderChange = (selectedOption: SingleValue<GenderOption>) => {
    handleInputChange("gender", selectedOption?.value || "");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // בדיקת תקינות עם Zod
      userSchema.parse({
        ...user,
        birthDate: user.birthDate ? new Date(user.birthDate) : undefined,
      });

      // הגדרת תמונת פרופיל ברירת מחדל
      const defaultProfileImage =
        user.gender === "F"
          ? "https://res.cloudinary.com/ddbitajje/image/upload/v1735038509/t7ivdaq3nznunpxv2soc.png"
          : "https://res.cloudinary.com/ddbitajje/image/upload/v1735039205/b75v3xbqrwu8jkubtrxv.png";

      setSuccessMessage("");

      const message = await addUser({
        ...user,
        profileImage: defaultProfileImage,
      });

      setSuccessMessage(message);
      router.push("/pages/main/dashboard");
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) errors[e.path[0].toString()] = e.message;
        });
        setFieldErrors(errors);
      }
    }
  };

  return (
    <div
      className="grid place-items-center h-screen bg-gray-50"
      style={{ backgroundColor: "#3D3BF3" }}
    >
      <div className="shadow-lg p-6 rounded-lg max-w-md w-full bg-white">
        <h1 className="text-xl  mb-4 text-center">Sign In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="שם פרטי"
            className={`border rounded-md py-2 px-4 focus:outline-none ${fieldErrors.firstName
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:ring-green-400"
              }`}
            value={user.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
          />
          {fieldErrors.firstName && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>
          )}

          <input
            type="text"
            placeholder="שם משפחה"
            className={`border rounded-md py-2 px-4 focus:outline-none ${fieldErrors.lastName
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:ring-green-400"
              }`}
            value={user.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
          />
          {fieldErrors.lastName && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>
          )}

          <input
            type="email"
            placeholder="אימייל"
            className={`border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#9694FF] ${fieldErrors.email
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:ring-green-400"
              }`}
            value={user.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          {fieldErrors.email && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
          )}

          <input
            type="password"
            placeholder="סיסמא"
            className={`border rounded-md py-2 px-4 focus:outline-none ${fieldErrors.password
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:ring-green-400"
              }`}
            value={user.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
          />
          {fieldErrors.password && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
          )}

          <Select
            options={genderOptions}
            onChange={handleGenderChange}
            placeholder="בחר מגדר"
            className={`${fieldErrors.gender ? "focus:ring-red-400" : "focus:ring-green-400"
              }`}
          />

          <input
            placeholder=" תאריך לידה"
            type="date"
            className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={user.birthDate ? user.birthDate.toISOString().split("T")[0] : ""}
            onChange={(e) =>
              handleInputChange("birthDate", new Date(e.target.value))
            }
          />

          <button
            type="submit"
            className="bg-green-500 text-white  py-2 rounded-md hover:bg-green-600 transition duration-200"
          >
            Sign In          </button>
          {successMessage && (
            <div className="bg-green-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {successMessage}
            </div>
          )}
          <div className="text-right mt-4">
            <Link
              className="text-sm text-blue-500 hover:underline"
              href="/pages/auth/login"
            >
              כבר יש לך חשבון? <span className="underline">Login</span>
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
}

export default SignIn;
