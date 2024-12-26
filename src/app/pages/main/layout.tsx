'use client';

import React, { useState } from "react";
import TopNavBar from "@/app/components/TopNavBar";
import SideNavBar from "@/app/components/SideNavBar";
import UserLoader from "@/app/components/UserLoader";
import LoadingSpinner from "@/app/components/LoadingSpinner";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true); // סטייט לטעינה

    return (
        <div className="flex flex-col h-screen">
            {/* קומפוננטת UserLoader לניהול טעינת המשתמש */}
            <UserLoader onLoadingChange={setIsLoading} />

            {isLoading ? (
                // מסך טעינה
                <div className="flex justify-center items-center min-h-screen bg-purple-100">
                    <LoadingSpinner /> {/* Spinner לטעינה */}
                </div>
            ) : (
                // תוכן עמוד לאחר הטעינה
                <>
                    {/* נבבר עליון */}
                    <TopNavBar />

                    <div className="flex flex-1">
                        {/* נבבר צדדי */}
                        <SideNavBar />

                        {/* תוכן ראשי */}
                        <main
                            className="flex-1 bg-purple-100"
                            style={{
                                paddingTop: "64px", // גובה הנבבר העליון
                                paddingRight: "64px", // רוחב הנבבר הצדדי
                            }}
                        >
                            {children}
                        </main>
                    </div>
                </>
            )}
        </div>
    );
}
