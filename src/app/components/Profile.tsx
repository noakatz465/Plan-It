"use client";
import React, { useState, useEffect } from "react";
import { UserModel } from "@/app/models/userModel";
import { useUserStore } from "../stores/userStore";
import Image from "next/image";
import { updateUser, uploadToCloudinary } from "../services/userService";

function Profile() {
  const user = useUserStore((state) => state.user);
  const [formData, setFormData] = useState<UserModel | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      console.log("User data:", user);
      setFormData({ ...user });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!formData) return;

    const { name, value } = e.target;

    // אם השדה ריק, קובע את הערך כ- null במקום undefined
    const adjustedValue = value === '' ? null : value;

    setFormData({ ...formData, [name]: adjustedValue });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    const userId = formData._id ? formData._id : '';
    try {
      const updatedUser = await updateUser(userId, formData);
      if (updatedUser) {
        useUserStore.setState({ user: updatedUser });
        console.log("User updated successfully:", updatedUser);
      } else {
        console.error("Failed to update user details");
      }
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };


  if (!formData) {
    return <div>Loading...</div>;
  }

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    const uploadedUrl = await uploadToCloudinary(file);
    if (uploadedUrl) {
      setFormData({ ...formData, profileImage: uploadedUrl });
    }
    setIsUploading(false);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl  mb-4">הגדרות משתמש</h1>
      <form onSubmit={handleSubmit}>
        {/* שם פרטי */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">שם פרטי</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        {/* שם משפחה */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">שם משפחה</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        {/* כתובת אימייל */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">אימייל</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        {/* תאריך לידה */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">תאריך לידה</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate ? formData.birthDate.toISOString().split("T")[0] : ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        {/* מין */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">מין</label>
          <div className="flex items-center">
            <label className="mr-4 flex items-center">
              <input
                type="radio"
                name="gender"
                value="M"
                checked={formData.gender === "M"}
                onChange={handleInputChange}
                className="mr-2"
              />
              זכר
            </label>
            <label className="mr-4 flex items-center">
              <input
                type="radio"
                name="gender"
                value="F"
                checked={formData.gender === "F"}
                onChange={handleInputChange}
                className="mr-2"
              />
              נקבה
            </label>
          </div>
        </div>


        {/* תמונת פרופיל */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">תמונת פרופיל</label>

          {/* {formData.profileImage ? */}
          <div className="mt-4">
            <Image
              src={formData.profileImage}
              alt="Uploaded Profile Image"
              width={128}
              height={128}
              className="rounded-full"
              style={{
                objectFit: "cover", // מבטיח שהתמונה תתמקד במרכז ותמלא את הריבוע
                width: "128px", // שמירת הרוחב
                height: "128px", // שמירת הגובה
                borderRadius: "50%", // הפיכת התמונה לעגולה
              }}
            />

          </div> : <input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleImageUpload(file);
                const uploadedUrl = await uploadToCloudinary(file);
                console.log("noa");

                if (uploadedUrl) {
                  console.log("noa1");
                  console.log("uploadedUrl" + uploadedUrl);
                  setFormData({ ...formData, profileImage: uploadedUrl });
                }
              }
            }}
            className="w-full px-4 py-2 border rounded"
          />
          {/* } */}

        </div>


        {/* כפתור שמירה */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          disabled={isUploading}
        >
          שמור שינויים
        </button>
      </form>
    </div>
  );
}

export default Profile;
