import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("Cookies:", req.headers.get("cookie")); // לראות את כל העוגיות
  console.log("Extracted Token:", token);
  
  console.log("Requested URL:", url.pathname);
  console.log("Token exists:", !!token);
  console.log("Cookies in request:", req.headers.get("cookie"));

  // נתיבים שאינם רלוונטיים למשתמש מחובר
  const restrictedPathsForLoggedInUsers = ["/", "/pages/signIn"];
  // נתיבים שאינם רלוונטיים למשתמשים שאינם מחוברים
  const restrictedPathsForGuests = ["/pages/dashboard"];

  // אם המשתמש מחובר ומנסה לגשת לעמוד כניסה או עמודים שאסורים עליו
  // if (token && restrictedPathsForLoggedInUsers.some((path) => url.pathname.startsWith(path))) {
  //   console.log("Redirecting logged-in user to dashboard...");
  //   return NextResponse.redirect(new URL("/pages/dashboard", req.url));
  // }

  // אם המשתמש אינו מחובר ומנסה לגשת לעמוד לוח הבקרה
  // if (!token && restrictedPathsForGuests.some((path) => url.pathname.startsWith(path))) {
  //   console.log("Redirecting guest to login...");
  //   return NextResponse.redirect(new URL("/", req.url));
  // }

  console.log("Proceeding to the requested page...");
  return NextResponse.next();
}

// הגדרת matcher להפעלת המידלוור על נתיבים ספציפיים
export const config = {
  matcher: ["/", "/pages/signIn", "/pages/dashboard"], // נתיבים בהם המידלוור יפעל
};
