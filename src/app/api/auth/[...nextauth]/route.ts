import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@/app/lib/models/userSchema"; // מודל המשתמש שלך
import connect from "@/app/lib/db/mongoDB";

// בדיקת משתנים סביבתיים
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Google Client ID or Secret is missing in environment variables");
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // התחברות: הוספת משתמש חדש אם אינו קיים
    async signIn({ user }) {
        await connect();
        try {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              isGoogleUser: true,
            });
            console.log("New user created:", user);
          } else {
            console.log("User already exists:", existingUser);
          }
          return true;
        } catch (error) {
          console.error("Error during sign-in:", error);
      
          if (error instanceof Error) {
            throw new Error(error.message || "Sign-in failed. Please try again.");
          } else {
            throw new Error("Sign-in failed. Please try again.");
          }
        }
      },
      

    // ניהול Session: הוספת ID למידע המשתמש
    async session({ session }) {
      if (session.user) {
        const userFromDB = await User.findOne({ email: session.user.email });
        session.user.id = userFromDB?._id.toString() || "";
      }
      return session;
    },

    // הפניה מותאמת אישית
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : `${baseUrl}/pages/dashboard`;
    },
  },

  // עמודים מותאמים אישית
  pages: {
    signIn: "/auth/signIn", // מסך התחברות מותאם אישית
    error: "/auth/error", // עמוד שגיאה מותאם אישית
    signOut: "/auth/signOut", // עמוד התנתקות מותאם
  },
});

export { handler as GET, handler as POST };
