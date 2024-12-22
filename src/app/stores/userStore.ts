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
    console.log("Starting user initialization...");

    if (get().user) {
      console.log("User already exists in store:", get().user);
      return; // אם המשתמש כבר קיים, לא להמשיך
    }

    try {
      const session = await getSession();
      console.log("Session retrieved:", session);

      let userDetails;
      if (session?.user?._id) {
        console.log("Fetching user details via session...");
        userDetails = await fetchUserDetailsBySession(session.user._id);
      } else {
        console.log("Fetching user details via cookie...");
        userDetails = await fetchUserDetailsByCookie();
      }

      console.log("User details fetched successfully:", userDetails);

      set({ user: userDetails });
      set({ tasks: userDetails?.tasks || [] }); // עדכון גם של המשתמש וגם של המשימות
      console.log("User and tasks updated in store:", userDetails, userDetails?.tasks);
    } catch (error) {
      console.error("Error fetching user details:", error);
      set({ user: null, tasks: [] }); // במקרה של שגיאה, לאפס את החנות
    }
  };

  return {
    user: null,
    tasks: [], // אתחול המשימות כברירת מחדל
    fetchUser: initializeUser,
    getTasks: () => {
      const tasks = get().user?.tasks || [];
      console.log("Tasks retrieved from store:", tasks);
      return tasks;
    },
    clearUser: () => {
      console.log("Clearing user and tasks from store...");
      set({ user: null, tasks: [] });
    },
  };
});
