
'use client'
import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<html lang="he" dir="rtl">
<body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
