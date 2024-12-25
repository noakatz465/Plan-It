import { create } from "zustand";
import { fetchUserDetailsByCookie, fetchUserDetailsBySession } from "@/app/services/authService";
import { fetchAllUsers } from "@/app/services/userService"; // ייבוא פונקציית שליפת משתמשים
import { UserModel } from "@/app/models/userModel";
import { ProjectModel } from "@/app/models/projectModel"; // ייבוא מודל הפרויקט
import { getSession } from "next-auth/react"; // נקסט אאוט

import { TaskModel } from "@/app/models/taskModel"; // ייבוא מודל המשימה
import { deleteTask } from "../services/taskService";

interface UserState {
  user: UserModel | null; // המשתמש
  fetchUser: () => Promise<void>; // שליפת המשתמש
  clearUser: () => void; // ניקוי המשתמש
  tasks: TaskModel[]; // משימות המשתמש
  projects: ProjectModel[]; // פרויקטים של המשתמש
  users?: UserModel[] | null; // רשימת משתמשים (אופציונלי, עם undefined כברירת מחדל)
  fetchUsers: () => Promise<void>; // שליפת משתמשים
  addTaskToStore: (task: TaskModel) => void; // הוספת משימה לחנות
  addProjectToStore: (project: ProjectModel) => void; // הוספת פרויקט לחנות
  deleteTaskAndRefreshUser: (taskId: string) => Promise<void>; // מחיקת משימה ורענון המשתמש

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
      set({ tasks: userDetails?.tasks || [], projects: userDetails?.projects || [] }); // עדכון גם של המשימות וגם של הפרויקטים
      console.log("User, tasks, and projects updated in store:", userDetails);
    } catch (error) {
      console.error("Error fetching user details:", error);
      set({ user: null, tasks: [], projects: [] }); // במקרה של שגיאה, לאפס את החנות
    }
  };

  const initializeUsers = async () => {
    console.log("Starting users initialization...");

    const users = get().users || []; // מבטיח ש-`users` תמיד יהיה מערך
    if (users.length > 0) {
      console.log("Users already exist in store:", users);
      return; // אם המשתמשים כבר קיימים, לא להמשיך
    }

    try {
      const allUsers = await fetchAllUsers();
      console.log("Users fetched successfully:", allUsers);

      set({ users: allUsers });
    } catch (error) {
      console.error("Error fetching users:", error);
      set({ users: [] }); // במקרה של שגיאה, לאפס את רשימת המשתמשים
    }
  };

  const addTaskToStore = (task: TaskModel) => {
    console.log("Adding task to store:", task); // הדפסה של המשימה
    set((state) => ({
      tasks: [...state.tasks, task],
      user: state.user ? { ...state.user, tasks: [...state.user.tasks, task] } : null,
    }));
    console.log("Updated tasks in store:", get().tasks); // הדפס את המשימות המעודכנות
  };

  const addProjectToStore = (project: ProjectModel) => {
    console.log("Adding project to store:", project);
    set((state) => ({
      projects: [...state.projects, project],
      user: state.user ? { ...state.user, projects: [...state.user.projects, project] } : null,
    }));
    console.log("Updated projects in store:", get().projects);
  };
  const deleteTaskAndRefreshUser = async (taskId: string) => {
    console.log("Deleting task and refreshing user...");
    try {
      await deleteTask(taskId); // מוחק את המשימה מהשרת
      console.log(`Task ${taskId} deleted successfully from server.`);
  
      await initializeUser(); // שולף מחדש את המשתמש ואת המשימות
      console.log("User and tasks refreshed successfully.");
    } catch (error) {
      console.error("Error deleting task or refreshing user:", error);
      throw new Error("Failed to delete task or refresh user.");
    }
  };
  
  return {
    user: null,
    tasks: [], // אתחול המשימות כברירת מחדל
    projects: [], // אתחול הפרויקטים כברירת מחדל
    users: [], // רשימת המשתמשים תמיד תהיה מערך ריק כברירת מחדל
    fetchUser: initializeUser,
    fetchUsers: initializeUsers,
    clearUser: () => {
      console.log("Clearing user, tasks, and projects from store...");
      set({ user: null, tasks: [], projects: [], users: [] });
    },
    addTaskToStore, // פעולה לעדכון משימה
    addProjectToStore, // פעולה לעדכון פרויקט
    deleteTaskAndRefreshUser, // הוספת הפונקציה למחיקת משימה ורענון המשתמש

  };
});
