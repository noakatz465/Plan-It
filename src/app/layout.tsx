
'use client'
import "./globals.css";
import { SessionProvider } from "next-auth/react";
// import UserLoader from "./components/UserLoader";

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
        {/* <UserLoader /> טעינת המשתמש */}
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
