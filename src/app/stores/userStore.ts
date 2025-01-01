import { create } from "zustand";
import { fetchUserDetailsByCookie, fetchUserDetailsBySession } from "@/app/services/authService";
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
  addTaskToStore: (task: TaskModel) => void; // הוספת משימה לחנות
  addProjectToStore: (project: ProjectModel) => void; // הוספת פרויקט לחנות
  deleteTaskAndRefreshUser: (taskId: string) => Promise<void>; // מחיקת משימה ורענון המשתמש
  filterTasks: (filters: any[]) => void; // סינון משימות לפי פילטרים
  filteredTasks: TaskModel[]; // משימות מסוננות
  getTasks: () => TaskModel[]; // הוספת הפונקציה לממשק
  currentFilters: any[]; // שמירת הפילטרים הנוכחיים

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
  const filterTasks = (filters: any[]) => {
    set({ currentFilters: filters }); // שמירת הפילטרים
  
    const allTasks = get().tasks; // כל המשימות המקוריות
    let filteredTasks = [...allTasks]; // תחילת רשימה מסוננת
  
    // קיבוץ הפילטרים לפי קטגוריה
    const filterMap: { [key: string]: string[] } = filters.reduce((acc, filter) => {
      const category = filter.value.split(/(?=[A-Z])/)[0]; // חילוץ הקטגוריה מהערך (לדוגמה, "priority" מ-"priorityHigh")
      if (!acc[category]) acc[category] = [];
      acc[category].push(filter.value);
      return acc;
    }, {} as { [key: string]: string[] });
  
    // סינון המשימות לפי הפילטרים בקבוצות
    Object.entries(filterMap).forEach(([category, values]) => {
      switch (category) {
        case "date":
          if (values.includes("dateAsc")) {
            filteredTasks.sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
          }
          if (values.includes("dateDesc")) {
            filteredTasks.sort((a, b) => new Date(b.dueDate!).getTime() - new Date(a.dueDate!).getTime());
          }
          break;
  
        case "priority":
          filteredTasks = filteredTasks.filter((task) =>
            values.some((value) => {
              if (value === "priorityLow") return task.priority === "Low";
              if (value === "priorityMedium") return task.priority === "Medium";
              if (value === "priorityHigh") return task.priority === "High";
            })
          );
          break;
  
        case "status":
          filteredTasks = filteredTasks.filter((task) =>
            values.some((value) => {
              if (value === "statusPending") return task.status === "Pending";
              if (value === "statusInProgress") return task.status === "In Progress";
              if (value === "statusCompleted") return task.status === "Completed";
            })
          );
          break;
  
        default:
          break;
      }
    });
  
    set({ filteredTasks }); // עדכון רשימת המשימות המסוננות
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
