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
          // יצירת משתמש חדש אם לא קיים
          await User.create({
            firstName: user.name?.split(" ")[0] || "First Name", // חלוקה לשם פרטי ומשפחה
            lastName: user.name?.split(" ")[1] || "Last Name",
            email: user.email,
            birthDate: null, // שדה ברירת מחדל
            gender: null,
            password: "google-auth-user", // אין סיסמה עבור משתמשים דרך Google
            joinDate: new Date(),
            notificationsEnabled: true,
            projects: [],
            tasks: [],
            sharedWith: [],
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

    // ניהול Session: הוספת כל השדות של המשתמש
    async session({ session }) {
      if (session.user) {
        const userFromDB = await User.findOne({ email: session.user.email });
        if (userFromDB) {
          session.user = {
            id: userFromDB._id.toString(),
            firstName: userFromDB.firstName,
            lastName: userFromDB.lastName,
            email: userFromDB.email,
            birthDate: userFromDB.birthDate,
            gender: userFromDB.gender,
            notificationsEnabled: userFromDB.notificationsEnabled,
            projects: userFromDB.projects,
            tasks: userFromDB.tasks,
            sharedWith: userFromDB.sharedWith,
            image: session.user.image || null, // אם קיים תמונה מהגוגל
          };
        }
      }
      return session;
    },

    // הפניה מותאמת אישית
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : `${baseUrl}/pages/dashboard`;
    },
  },
});

export { handler as GET, handler as POST };





