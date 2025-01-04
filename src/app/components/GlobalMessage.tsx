"use client";
import { useEffect } from "react";
import { useMessageStore } from "../stores/messageStore";

const GlobalMessage = () => {
  const { message, type, clearMessage } = useMessageStore();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clearMessage(); // מחיקת ההודעה לאחר 3 שניות
      }, 3000);

      return () => clearTimeout(timer); // ניקוי הטיימר כאשר ההודעה משתנה או נעלמת
    }
  }, [message, clearMessage]);

  if (!message) return null;

  return (
    <>
      <div
        className={`fixed top-4 left-1/2 -translate-x-1/2 w-[300px] px-4 py-3 text-white font-semibold shadow-lg rounded-lg z-[9999] pointer-events-none ${
          type === "success" ? "bg-green-500" : "bg-red-500"
        } animate-custom`}
      >
        {message}
      </div>

      <style jsx global>{`
        @keyframes slideIn {
          0% {
            left: 100%;
            opacity: 0;
          }
          100% {
            left: 50%;
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        .animate-custom {
          animation: slideIn 0.6s ease-out, fadeOut 1.5s ease-in-out 2s forwards;
        }
      `}</style>
    </>
  );
};

export default GlobalMessage;
