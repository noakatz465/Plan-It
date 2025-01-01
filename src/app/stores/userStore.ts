import { create } from "zustand";
import { fetchUserDetailsByCookie, fetchUserDetailsBySession } from "@/app/services/authService";
import { UserModel } from "@/app/models/userModel";
import { ProjectModel } from "@/app/models/projectModel"; // ייבוא מודל הפרויקט
import { getSession } from "next-auth/react"; // נקסט אאוט

import { TaskModel } from "@/app/models/taskModel"; // ייבוא מודל המשימה
import { deleteTask } from "../services/taskService";

interface UserState {
  user: UserModel | null; 
  fetchUser: () => Promise<void>; 
  clearUser: () => void; 
  tasks: TaskModel[]; 
  projects: ProjectModel[]; 
  addTaskToStore: (task: TaskModel) => void; 
  addProjectToStore: (project: ProjectModel) => void; 
  deleteTaskAndRefreshUser: (taskId: string) => Promise<void>; 
  filterTasks: (filters: any[], searchQuery?: string) => void; 
  filteredTasks: TaskModel[]; 
  getTasks: () => TaskModel[]; 
  currentFilters: any[]; 
  searchQuery: string; 
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
      // עדכון גם של המשימות וגם של הפרויקטים

      set({ 
        user: userDetails, 
        tasks: userDetails?.tasks || [], 
        projects: userDetails?.projects || [], 
        filteredTasks: userDetails?.tasks || [] // עדכון המסוננות עם כל המשימות
      });
      console.log("User, tasks, and projects updated in store:", userDetails);
    } catch (error) {
      console.error("Error fetching user details:", error);
      set({ user: null, tasks: [], projects: [] }); // במקרה של שגיאה, לאפס את החנות
    }
  };

  const addTaskToStore = (task: TaskModel) => {
    console.log("Adding task to store:", task); // הדפסה של המשימה
    set((state) => ({
      tasks: [...state.tasks, task],
      user: state.user ? { ...state.user, tasks: [...state.user.tasks, task] } : null,
    }));
    const filters = get().currentFilters;
    filterTasks(filters);
    
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
  
      set({ user: null, tasks: [], projects: [] });
      await initializeUser(); // שולף מחדש את המשתמש ואת המשימות
      const filters = get().currentFilters;
      filterTasks(filters);
      console.log("User and tasks refreshed successfully.");
    } catch (error) {
      console.error("Error deleting task or refreshing user:", error);
      throw new Error("Failed to delete task or refresh user.");
    }
  };
const filterTasks = (filters: any[], searchQuery = get().searchQuery) => {
  set({ currentFilters: filters, searchQuery }); 

  const allTasks = get().tasks; 
  let filteredTasks = [...allTasks]; 

  // קיבוץ הפילטרים לפי קטגוריה
  const filterMap: { [key: string]: string[] } = filters.reduce((acc, filter) => {
    const category = filter.value.split(/(?=[A-Z])/)[0];
    if (!acc[category]) acc[category] = [];
    acc[category].push(filter.value);
    return acc;
  }, {} as { [key: string]: string[] });

  // סינון לפי קטגוריה
  Object.entries(filterMap).forEach(([category, values]) => {
    switch (category) {
      case "priority":
        filteredTasks = filteredTasks.filter((task) =>
          values.some((value) =>
            value === "priorityLow" ? task.priority === "Low" :
            value === "priorityMedium" ? task.priority === "Medium" :
            value === "priorityHigh" ? task.priority === "High" : false
          )
        );
        break;
      case "status":
        filteredTasks = filteredTasks.filter((task) =>
          values.some((value) =>
            value === "statusPending" ? task.status === "Pending" :
            value === "statusInProgress" ? task.status === "In Progress" :
            value === "statusCompleted" ? task.status === "Completed" : false
          )
        );
        break;
      default:
        break;
    }
  });

  // סינון לפי חיפוש
  if ((searchQuery || "").trim() !== "") {
    filteredTasks = filteredTasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  set({ filteredTasks }); 
};

  
  const getTasks = () => {
    const { filteredTasks } = get();
    return filteredTasks; // תמיד מחזיר את הרשימה המסוננת, גם אם היא ריקה
  };
  

    return {
      user: null,
      tasks: [], // אתחול המשימות כברירת מחדל
      projects: [], // אתחול הפרויקטים כברירת מחדל
      filteredTasks: [], // אתחול רשימת המשימות המסוננות כברירת מחדל
      fetchUser: initializeUser,
      clearUser: () => set({ user: null, tasks: [], projects: [], filteredTasks: [] }),
      addTaskToStore,
      addProjectToStore,
      deleteTaskAndRefreshUser,
      filterTasks, // פונקציה לסינון משימות
      getTasks
      
    };
  
});
