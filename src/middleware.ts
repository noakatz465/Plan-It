import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

// מפה לשמירת היסטוריית קריאות לפי IP
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // חלון זמן של דקה אחת
const RATE_LIMIT_MAX_REQUESTS = 30; // מקסימום 20 קריאות לדקה

// פונקציה לבדיקה אם כתובת ה-IP מוגבלת
function isRateLimited(ip: string) {
  const now = Date.now();
  const rateData = rateLimitMap.get(ip) || { count: 0, timestamp: now };

  if (now - rateData.timestamp > RATE_LIMIT_WINDOW) {
    // אם חלון הזמן עבר, לאתחל את הספירה
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (rateData.count >= RATE_LIMIT_MAX_REQUESTS) {
    // אם הגענו למקסימום הקריאות, לחסום
    return true;
  }

  rateLimitMap.set(ip, { count: rateData.count + 1, timestamp: rateData.timestamp });
  return false;
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl; // כתובת הבקשה
  const ip = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1"; // כתובת ה-IP של המשתמש
  const authToken = req.cookies.get("auth_token"); // שליפת ה- auth_token
  const nextAuthToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET }); // בדיקת טוקן של NextAuth

  // נתיבים שמוחרגים מהמגבלות
  const exemptPaths = [
    "/api/auth",
    "/api/login",
    "/api/users/post",
    "/api/sendVerificationCode",
    "/api/verifyCode",
    "/_next/static",
    "/api/resetPassword",
    "/api/batchNotification",
    "/api/notifications",
    "/api/share",
    "/api/templates",
    "/api/auth/callback/google",
  ];

  const rateLimitedPaths = [
    "/api/login",
    "/api/users/post",
    "/api/sendVerificationCode",
    "/api/verifyCode",
  ];
  
  // בדיקת הגבלת קריאות **רק על נתיבים עם הגבלת קריאות**
  if (rateLimitedPaths.some((path) => url.pathname.startsWith(path))) {
    if (isRateLimited(ip)) {
      console.log(`Too many requests from IP: ${ip}. Blocking access.`);
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
    console.log("Rate-limited path accessed. Allowing access.");
  }
  
  // אם המשתמש מחובר ויש לו טוקן והוא מנסה לגשת לנתיב שמתחיל ב- /pages/auth
  if ((authToken || nextAuthToken) && url.pathname.startsWith("/pages/auth")) {
    console.log("User already has a token. Redirecting to dashboard...");
    return NextResponse.redirect(new URL("/pages/main/dashboard", req.url));
  }

  if (url.pathname.startsWith("/api") && !authToken && !nextAuthToken) {
    if (!exemptPaths.some((path) => url.pathname.startsWith(path))) {
      console.log("No valid token found for API request. Blocking access...");
      return NextResponse.json(
        { message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }
    console.log("Exempt API path accessed. Allowing access.");
    return NextResponse.next(); // אפשר גישה לנתיבים המוחרגים
  }

  // בדיקת גישה לנתיב /pages/main/
  if (url.pathname.startsWith("/pages/main/") && !authToken && !nextAuthToken) {
    console.log("No valid token found. Redirecting to login page...");
    return NextResponse.redirect(new URL("/pages/auth/login", req.url));
  }

  console.log("Request allowed. Proceeding...");
  return NextResponse.next();
}

// matcher להפעלת המידלוור
export const config = {
  matcher: ["/api/:path*", "/pages/main/:path*", "/pages/auth/:path*"], // הפעלת המידלוור על הנתיבים הרלוונטיים
};
