'use client'
import React, { useState } from 'react';
import { useUserStore } from '../stores/userStore';
import Image from "next/image";
import { updateUser } from '../services/userService';

function Setting() {
  const user = useUserStore((state) => state.user);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(user?.notificationsEnabled === true);

  const handleNotificationsToggle = async () => {
    setNotificationsEnabled(prev => !prev);
    if (user?._id)
      await updateUser(user._id, { ...user, notificationsEnabled: !notificationsEnabled })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-purple-700 mb-4 text-center">אנשי קשר שלי</h2>
        <p className="text-gray-700 text-center mb-6">את אנשי הקשר שלך אתה יכול לשתף ללא בקשת הרשאה</p>

        {user?.sharedWith.length === 0 ? (
          <p className="text-center text-gray-500">אין אנשי קשר</p>
        ) : (
          <div className="space-y-4">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {user?.sharedWith.map((user) => (
                <li key={user._id} className="flex items-center bg-purple-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center gap-4">
                    {user?.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt={`${user.firstName} ${user.lastName}`}
                        width={50}
                        height={50}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <Image
                        src="/default-profile.png"
                        alt="Anonymous Profile"
                        width={50}
                        height={50}
                        className="rounded-full object-cover"
                      />
                    )}
                    <span className="text-lg font-medium text-purple-600">{`${user.firstName} ${user.lastName}`}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">הגדרות התראות</h3>
          <div className="flex justify-center">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={handleNotificationsToggle}
                className="h-6 w-6 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-lg text-gray-700">קבלת התראות</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting;
