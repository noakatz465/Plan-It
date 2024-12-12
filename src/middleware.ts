import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

// מפה לשמירת היסטוריית קריאות לפי IP
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // דקה אחת
const RATE_LIMIT_MAX_REQUESTS = 10; // מקסימום 10 קריאות בדקה

// פונקציה לבדיקת הגבלת קריאות
function isRateLimited(ip: string) {
  const now = Date.now();
  const rateData = rateLimitMap.get(ip) || { count: 0, timestamp: now };

  console.log("Rate data before update:", rateData);

  // אם חלון הזמן עבר, מאתחלים את הספירה
  if (now - rateData.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    console.log("Resetting rate limit for IP:", ip);
    return false;
  }

  // אם הגענו למקסימום הקריאות, חוסמים
  if (rateData.count >= RATE_LIMIT_MAX_REQUESTS) {
    console.log("Rate limit exceeded for IP:", ip);
    return true;
  }

  // מעדכנים את הספירה ושומרים במפה
  rateLimitMap.set(ip, { count: rateData.count + 1, timestamp: rateData.timestamp });
  console.log("Rate data after update:", rateLimitMap.get(ip));
  return false;
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl; // כתובת הבקשה
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET }); // טוקן אימות
  const ip = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1"; // כתובת ה-IP של המשתמש

  console.log("Requested URL:", url.pathname);
  console.log("Token exists:", !!token);
  console.log("Client IP:", ip);

  // בדיקת הגבלת קריאות לפי כתובת IP
  if (isRateLimited(ip)) {
    console.log("Too many requests from IP:", ip);
    return NextResponse.json(
      { message: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  console.log("Request allowed. Proceeding...");
  return NextResponse.next();
}

// הגדרת matcher להפעלת המידלוור על כל הנתיבים
export const config = {
  matcher: [
    "/api/:path*", // כל נתיבי ה-API
    "/:path*",     // כל הנתיבים באתר
  ],
};
