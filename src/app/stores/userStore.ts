import { create } from "zustand";
import { fetchUserDetailsByCookie, fetchUserDetailsBySession } from "@/app/services/authService";
import { UserModel } from "@/app/models/userModel";
import { getSession } from "next-auth/react"; // נקסט אאוט

interface UserState {
  user: UserModel | null; // המשתמש
  fetchUser: () => Promise<void>; // שליפת המשתמש
  clearUser: () => void; // ניקוי המשתמש
  getTasks: () => UserModel["tasks"] | []; // החזרת משימות
}

export const useUserStore = create<UserState>((set, get) => {
  const initializeUser = async () => {
    if (get().user) return; // אם המשתמש כבר קיים, לא להמשיך
    try {
        const session = await getSession();
        let userDetails;

        if (session?.user?._id) {
            userDetails = await fetchUserDetailsBySession(session.user._id);
        } else {
            userDetails = await fetchUserDetailsByCookie();
        }

        set({ user: userDetails });
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
    getTasks: () => get().user?.tasks || [], // החזרת המשימות
  };
});