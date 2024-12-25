import { NextResponse } from "next/server";

export async function POST() {
  try {
    // מחיקת העוגייה מהלקוח
    const response = NextResponse.json({
      message: "Logout successful",
      redirectUrl: "/pages/auth/login", // כתובת היעד לניתוב
    });
    response.headers.set(
      "Set-Cookie",
      "auth_token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict"
    );
    return response;
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json({ message: "An error occurred. Please try again." }, { status: 500 });
  }
}
