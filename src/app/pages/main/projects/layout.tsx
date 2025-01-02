import ProjectNavBar from "@/app/components/projects/ProjectNavBar";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen">
            {/* נבבר  */}

            <ProjectNavBar />


                {/* תוכן ראשי */}
                <main className="flex-1 bg-[#EBEAFF] ">
                    {children}
                </main>
            
        </div>
    );
}
