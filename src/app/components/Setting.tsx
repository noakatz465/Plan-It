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
      await updateUser(user._id, { ...user, notificationsEnabled: notificationsEnabled })
  };

  return (
    <div>
      <h2>אנשי קשר שלי</h2>
      <span>את אנשי הקשר שלך אתה יכול לשתף ללא בקשת הרשאה</span>
      {user?.sharedWith.length === 0 ? (
        <p>אין אנשי קשר</p>
      ) : (
        <div>
          <ul>
            {user?.sharedWith.map((user) => (
              <li key={user._id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {user?.profileImage ? (
                    <Image
                      src={user.profileImage}
                      alt={`${user.firstName} ${user.lastName}`}
                      width={32}
                      height={32}
                      style={{
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <Image
                      src="/default-profile.png"
                      alt="Anonymous Profile"
                      width={32}
                      height={32}
                      style={{
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                  )}
                  <span>{`${user.firstName} ${user.lastName}`}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">הגדרות התראות</h3>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={handleNotificationsToggle}
            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-gray-700">קבלת התראות</span>
        </label>
      </div>
    </div>
  );
}

export default Setting;
