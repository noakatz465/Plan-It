
import { create } from "zustand";
import { fetchUserDetailsByCookie, fetchUserDetailsBySession } from "@/app/services/authService";
import { UserModel } from "@/app/models/userModel";
import { ProjectModel } from "@/app/models/projectModel";
import { TaskModel } from "@/app/models/taskModel";
import { getSession } from "next-auth/react";
import { deleteTask, updateTask } from "../services/taskService";
import { fetchAllUsers, removeTaskForUsers } from "../services/userService";
interface FilterOption {
  value: string;
  label: string;
}
interface UserState {
  user: UserModel | null; // משתמש נוכחי
  tasks: TaskModel[]; // רשימת משימות
  projects: ProjectModel[]; // רשימת פרויקטים
  users: UserModel[]; // הוספת מערך המשתמשים
  filteredTasks: TaskModel[]; // משימות מסוננות
  currentFilters: FilterOption[]; // פילטרים
  searchQuery: string; // מונח חיפוש
  fetchUser: () => Promise<void>; // שליפת משתמש
  clearUser: () => void; // איפוס משתמש
  fetchUsers: () => Promise<void>; // פונקציה לשליפת משתמשים
  addTaskToStore: (task: TaskModel) => void; // הוספת משימה
  addProjectToStore: (project: ProjectModel) => void; // הוספת פרויקט
  deleteTaskAndRefreshUser: (taskId: string) => Promise<void>; // מחיקת משימה ורענון משתמש
  removeTaskForUsers: (userIds: string[], taskId: string) => Promise<void>;
  updateTaskInStore: (taskId: string, updatedData: Partial<TaskModel>) => Promise<void>; // עדכון משימה
  updateTaskStatus: (taskId: string, status: "Pending" | "In Progress" | "Completed") => void; // עדכון סטטוס משימה
  filterTasks: (filters: FilterOption[], searchQuery?: string) => void; // סינון משימות
  getTasks: () => TaskModel[]; // שליפת משימות
  getProjects: () => ProjectModel[];//שליפת פרויקטים
  getUsers: () => UserModel[]; // פונקציה לשליפת המשתמשים מהחנות
}

export const useUserStore = create<UserState>((set, get) => ({
  // משתנים בחנות
  user: null,
  tasks: [],
  projects: [],
  filteredTasks: [],
  currentFilters: [],
  searchQuery: "",
  users: [],
  // פונקציות לשליפת משתמש
  fetchUser: async () => {
    if (get().user) {
      console.log("User already exists in store:", get().user);
      return;
    }

    try {
      const session = await getSession();
      console.log("Session retrieved:", session);

      let userDetails;
      if (session?.user?._id) {
        userDetails = await fetchUserDetailsBySession(session.user._id);
      } else {
        userDetails = await fetchUserDetailsByCookie();
      }

      console.log("User details fetched successfully:", userDetails);
      set({
        user: userDetails,
        tasks: userDetails?.tasks || [],
        projects: userDetails?.projects || [],
        filteredTasks: userDetails?.tasks || [],
      });
      await get().fetchUsers();
      console.log("User, tasks, and projects updated in store:", userDetails);
    } catch (error) {
      console.error("Error fetching user details:", error);
      set({ user: null, tasks: [], projects: [], filteredTasks: [] });
    }
  },

  clearUser: () => {
    set({ user: null, tasks: [], projects: [], filteredTasks: [] });
  },

  fetchUsers: async () => {
    try {
      const users = await fetchAllUsers(); // קריאה לפונקציה מהשירות
      if (users) {
        set({ users });
        console.log("Fetched all users:", users);
      }
    } catch (error) {
      console.error("Error fetching all users:", error);
      set({ users: [] });
    }
  },
  // פונקציות עדכון והוספה
  addTaskToStore: (task: TaskModel) => {
    console.log("Adding task to store:", task);
    set((state) => ({
      tasks: [...state.tasks, task],
      user: state.user ? { ...state.user, tasks: [...state.user.tasks, task] } : null,
    }));
    get().filterTasks(get().currentFilters);
    console.log("Updated tasks in store:", get().tasks);
  },

  addProjectToStore: (project: ProjectModel) => {
    console.log("Adding project to store:", project);
    set((state) => ({
      projects: [...state.projects, project],
      user: state.user ? { ...state.user, projects: [...state.user.projects, project] } : null,
    }));
    console.log("Updated projects in store:", get().projects);
  },

  updateTaskInStore: async (taskId: string, updatedData: Partial<TaskModel>) => {
    try {
      const updatedTask = await updateTask(taskId, updatedData);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === taskId ? { ...task, ...updatedData } : task
        ),
        user: state.user
          ? {
            ...state.user,
            tasks: state.user.tasks.map((task) =>
              task._id === taskId ? { ...task, ...updatedData } : task
            ),
          }
          : null,
      }));
      console.log("Task updated successfully in store:", updatedTask);
      get().filterTasks(get().currentFilters);
    } catch (error) {
      console.error("Error updating task in store:", error);
      throw error;
    }
  },

  updateTaskStatus: async (taskId: string, status: "Pending" | "In Progress" | "Completed") => {
    try {
      await updateTask(taskId, { status });
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === taskId ? { ...task, status } : task
        ),
        user: state.user
          ? {
            ...state.user,
            tasks: state.user.tasks.map((task) =>
              task._id === taskId ? { ...task, status } : task
            ),
          }
          : null,
      }));
      console.log(`Task ${taskId} status updated successfully to ${status}`);
      get().filterTasks(get().currentFilters);
    } catch (error) {
      console.error(`Error updating status for task ${taskId}:`, error);
      throw error;
    }
  },

  deleteTaskAndRefreshUser: async (taskId: string) => {
    console.log("Deleting task and refreshing user...");
    try {
      await deleteTask(taskId);
      console.log(`Task ${taskId} deleted successfully from server.`);
      set({ user: null, tasks: [], projects: [] });
      await get().fetchUser();
      console.log("User and tasks refreshed successfully.");
    } catch (error) {
      console.error("Error deleting task or refreshing user:", error);
      throw new Error("Failed to delete task or refresh user.");
    }
  },

  removeTaskForUsers: async (userIds: string[], taskId: string) => {
    try {
      console.log(`Removing task ${taskId} for users:`, userIds);
      const response = await removeTaskForUsers(userIds, taskId);
      console.log("Task removed successfully for users:", response);
      set({ user: null, tasks: [], projects: [] });
      await get().fetchUser();
    } catch (error) {
      console.error("Error removing task for users:", error);
      throw error;
    }
  },
  // פונקציות סינון ושליפה
  filterTasks: (filters: FilterOption[] = [], searchQuery = get().searchQuery) => {
    set({ currentFilters: filters, searchQuery });

    const allTasks = get().tasks;
    let filteredTasks = [...allTasks];

    // יצירת מפת פילטרים
    const filterMap: Record<string, string[]> = filters.reduce((acc, filter) => {
      const category = filter.value.split(/(?=[A-Z])/)[0];
      acc[category] = acc[category] || [];
      acc[category].push(filter.value);
      return acc;
    }, {} as Record<string, string[]>);

    // סינון לפי קטגוריות
    Object.entries(filterMap).forEach(([category, values]) => {
      switch (category) {
        case "priority":
          filteredTasks = filteredTasks.filter((task) =>
            values.some((value) => {
              switch (value) {
                case "priorityLow":
                  return task.priority === "Low";
                case "priorityMedium":
                  return task.priority === "Medium";
                case "priorityHigh":
                  return task.priority === "High";
                default:
                  return false;
              }
            })
          );
          break;

        case "status":
          filteredTasks = filteredTasks.filter((task) =>
            values.some((value) => {
              switch (value) {
                case "statusPending":
                  return task.status === "Pending";
                case "statusInProgress":
                  return task.status === "In Progress";
                case "statusCompleted":
                  return task.status === "Completed";
                default:
                  return false;
              }
            })
          );
          break;

        default:
          break;
      }
    });

    // סינון לפי מחרוזת חיפוש
    if (searchQuery?.trim()) {
      filteredTasks = filteredTasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // עדכון המשימות המסוננות
    set({ filteredTasks });
  },

  getTasks: () => {
    return get().filteredTasks;
  },
  getProjects: () => {
    return get().projects;
  },
  getUsers: () => {
    return get().users
  }, // פונקציה להחזרת מערך המשתמשים

}));