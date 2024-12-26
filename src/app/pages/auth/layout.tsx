'use client'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<div lang="he" dir="rtl" >
<main >
          {children}
      </main>
    </div>
  );
}
