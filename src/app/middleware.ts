import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const url = req.nextUrl; 
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
    console.log("Requested URL:", url.pathname);
    console.log("Token exists:", !!token);
  
    const restrictedPathsForLoggedInUsers = ["/", "/pages/signIn"];
    const restrictedPathsForGuests = ["/pages/dashboard"];
  
    if (token && restrictedPathsForLoggedInUsers.some((path) => url.pathname.startsWith(path))) {
      console.log("Redirecting logged-in user to dashboard...");
      return NextResponse.redirect(new URL("/pages/dashboard", req.url));
    }
  
    if (!token && restrictedPathsForGuests.some((path) => url.pathname.startsWith(path))) {
      console.log("Redirecting guest to login...");
      return NextResponse.redirect(new URL("/", req.url));
    }
  
    console.log("Proceeding to the requested page...");
    return NextResponse.next();
  }
  

// הגדרת matcher להפעלת המידלוור על נתיבים ספציפיים
export const config = {
  matcher: ["/", "/pages/signIn", "/pages/dashboard"], // נתיבים בהם המידלוור יפעל
};
