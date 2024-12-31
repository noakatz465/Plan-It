"use client";

import React from "react";

interface LoadingSpinnerProps {
  size?: number; // גודל הספינר
  color?: string; // צבע הספינר
  message?: string; // הודעה שתוצג ליד הספינר (אופציונלי)
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  color = "#3D3BF3", // צבע ברירת מחדל: כחול
  message,
}) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div
        style={{
          width: size,
          height: size,
          border: `${size / 8}px solid ${color}`,
          borderTop: `${size / 8}px solid transparent`,
        }}
        className="rounded-full animate-spin"
      ></div>
      {message && (
        <p className="text-gray-700 text-lg mt-4">
          {message}
        </p>
        
      )}
      
    </div>
  );
};

export default LoadingSpinner;
