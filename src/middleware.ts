import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

// מפה לשמירת היסטוריית קריאות לפי IP
// const rateLimitMap = new Map();
// const RATE_LIMIT_WINDOW = 60 * 1000; // דקה אחת
// const RATE_LIMIT_MAX_REQUESTS = 10; // מקסימום 10 קריאות בדקה

// // פונקציה לבדיקת הגבלת קריאות
// function isRateLimited(ip: string) {
//   const now = Date.now();
//   const rateData = rateLimitMap.get(ip) || { count: 0, timestamp: now };

//   if (now - rateData.timestamp > RATE_LIMIT_WINDOW) {
//     // אם חלון הזמן עבר, מאתחלים את הספירה
//     rateLimitMap.set(ip, { count: 1, timestamp: now });
//     return false;
//   }

//   if (rateData.count >= RATE_LIMIT_MAX_REQUESTS) {
//     // אם הגענו למקסימום הקריאות, חוסמים
//     return true;
//   }

//   rateLimitMap.set(ip, { count: rateData.count + 1, timestamp: rateData.timestamp });
//   return false;
// }

export async function middleware(req: NextRequest) {
  const url = req.nextUrl; // כתובת הבקשה
  const ip = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1"; // כתובת ה-IP של המשתמש

  console.log("Requested URL:", url.pathname);
  console.log("Client IP:", ip);

  // רשימת נתיבים להחרגה (ללא אימות טוקן)
  const exemptPaths = [
    "/api/auth",
    "/api/login",
    "/api/users/post",
    "/api/sendVerificationCode",
    "/api/verifyCode",
    "/_next/static",
  ];

  // החרגת קריאות לפי הנתיבים
  if (exemptPaths.some((path) => url.pathname.startsWith(path))) {
    console.log("Exempt path accessed. Allowing access.");
    return NextResponse.next();
  }

  // בדיקת הגבלת קריאות לפי כתובת IP
  // if (isRateLimited(ip)) {
  //   console.log("Too many requests from IP:", ip);
  //   return NextResponse.json(
  //     { message: "Too many requests. Please try again later." },
  //     { status: 429 }
  //   );
  // }

  // בדיקת קיום טוקן באמצעות NextAuth
  const authToken = await req.cookies.get("auth_token");
  const nextAuthToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!authToken && !nextAuthToken) {
    console.log("No valid token found. Redirecting to home page...");
  }

  console.log("Request allowed. Proceeding...");
  return NextResponse.next();
}

// הגדרת matcher להפעלת המידלוור
export const config = {
  matcher: ["/api/:path*", "/pages/main/dashboard"], // הפעלה על נתיבי API ודשבורד
};
