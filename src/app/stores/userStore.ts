import { create } from "zustand";
import { fetchUserDetailsByCookie, fetchUserDetailsBySession } from "@/app/services/authService";
import { UserModel } from "@/app/models/userModel";
import { getSession } from "next-auth/react"; // נקסט אאוט

interface UserState {
  user: UserModel | null; // המשתמש
  fetchUser: () => Promise<void>; // שליפת המשתמש
  clearUser: () => void; // ניקוי המשתמש
}

export const useUserStore = create<UserState>((set, get) => {
  const initializeUser = async () => {
    try {
      const session = await getSession();
      let userDetails;

      if (session?.user?._id) {
        console.log("Fetching user details via session...");
        userDetails = await fetchUserDetailsBySession(session.user._id);
      } else {
        console.log("Fetching user details via cookie...");
        userDetails = await fetchUserDetailsByCookie();
      }

      set({ user: userDetails });
      console.log("User fetched successfully:", userDetails);
    } catch (error) {
      console.error("Error fetching user details:", error);
      set({ user: null });
    }
  };

  // החזרת החנות
  return {
    user: null,
    fetchUser: initializeUser,
    clearUser: () => set({ user: null }),
  };
});
