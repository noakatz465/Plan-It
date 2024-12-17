import React from "react";
import TopNavBar from "@/app/components/TopNavBar";
import SideNavBar from "@/app/components/SideNavBar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen">
            {/* נבבר עליון */}
            <TopNavBar />

            <div className="flex flex-1">
                {/* נבבר צדדי */}
                <SideNavBar />

                {/* תוכן ראשי */}
                <main className="flex-1 bg-purple-100 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
