import React from "react";
import Link from "next/link";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Welcome to PlanIt</h1>
      <div className="flex space-x-4">
        <Link href="/pages/auth/login">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-200">
            Login
          </button>
        </Link>
        <Link href="/pages/auth/signIn">
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-200">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
