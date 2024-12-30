import TaskNavBar from "@/app/components/tasks/TaskNavBar";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div >
            {/* Navbar */}
            <TaskNavBar />

            {/* Main Content */}
            <main className="flex-1 bg-[#EBEAFF] pt-12">
                {children}
            </main>
        </div>
    );
}
