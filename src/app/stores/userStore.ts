import { create } from "zustand";
import { fetchUserDetailsByCookie, fetchUserDetailsBySession } from "@/app/services/authService";
import { UserModel } from "@/app/models/userModel";
import { getSession } from "next-auth/react"; // נקסט אאוט

interface UserState {
  user: UserModel | null; // המשתמש
  fetchUser: () => Promise<void>; // שליפת המשתמש
  clearUser: () => void; // ניקוי המשתמש
  getTasks: () => UserModel["tasks"] | []; // החזרת משימות
  tasks: UserModel["tasks"]; // משימות המשתמש
}

export const useUserStore = create<UserState>((set, get) => {
  const initializeUser = async () => {
    if (get().user) return; // אם המשתמש כבר קיים, לא להמשיך
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
      set({ user: userDetails, tasks: userDetails?.tasks || [] }); // עדכון גם של המשתמש וגם של המשימות
      console.log("User fetched successfully:", userDetails);
    } catch (error) {
        console.error("Error fetching user details:", error);
        set({ user: null });
      console.error("Error fetching user details:", error);
      set({ user: null, tasks: [] });
    }
  };

  return {
    user: null,
    fetchUser: initializeUser,
    clearUser: () => set({ user: null }),
    getTasks: () => get().user?.tasks || [], // החזרת המשימות
    clearUser: () => set({ user: null, tasks: [] }), // ניקוי המשתמש והמשימות
    tasks: [], // אתחול המשימות כברירת מחדל
  };
});