import TaskNavBar from "@/app/components/tasks/TaskNavBar";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen">
            {/* נבבר  */}

            <TaskNavBar />


                {/* תוכן ראשי */}
                <main className="flex-1 bg-purple-100 ">
                    {children}
                </main>
            
        </div>
    );
}
