"use client";
import React from "react";
import Link from "next/link";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#EBEAFF] overflow-hidden">
      <h1 className="text-5xl font-extrabold mb-8 text-[#3D3BF3]">
        ברוכים הבאים ל-PlanIt
      </h1>
      <p className="text-xl md:text-2xl font-semibold text-[#9694FF] mb-12 text-center max-w-3xl leading-relaxed animate-fade-in">
        תכננו את המשימות שלכם בקלות וביעילות עם הכלי האולטימטיבי לניהול משימות.
      </p>
      <div className="flex flex-col md:flex-row md:gap-8 gap-4">
        <Link href="/pages/auth/login">
          <button className="bg-[#3D3BF3] text-white text-lg font-semibold px-8 py-4 rounded-full hover:bg-[#3D3BF3] hover:shadow-lg transition-transform duration-300 ease-in-out hover:scale-105">
            Login
          </button>
        </Link>
        <Link href="/pages/auth/signIn">
          <button className="bg-[#FF2929] text-white text-lg font-semibold px-8 py-4 rounded-full hover:bg-[#FF2929] hover:shadow-lg transition-transform duration-300 ease-in-out hover:scale-105">
            Sign Up
          </button>
        </Link>
      </div>
      <footer className="mt-12 text-sm text-[#9694FF]">
        © 2025 PlanIt. כל הזכויות שמורות.
      </footer>

      {/* הוספת סגנון עם keyframes */}
      <style jsx>{`
        .animate-fade-in {
          animation: fade-in 2s ease-in-out;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Home;
