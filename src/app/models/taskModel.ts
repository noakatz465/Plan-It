export class Task {
    taskId?: string; // מזהה ייחודי למשימה
    title: string; // כותרת המשימה
    description?: string; // תיאור מפורט
    dueDate?: Date; // תאריך יעד
    frequency: "Once" | "Daily" | "Weekly" | "Monthly" | "Yearly"; // תדירות
    status: "Pending" | "In Progress" | "Completed"; // סטטוס
    priority: "Low" | "Medium" | "High"; // עדיפות
    creatorId: string; // מזהה יוצר המשימה
    assignedUserIds: string[]; // מזהי המשתמשים המשויכים
    reminderDateTime?: Date; // תאריך ושעה לתזכורת
    templateId?: string; // מזהה תבנית
    lastModified: Date; // תאריך עדכון אחרון
    projectId?: string; // מזהה פרויקט משויך
  
    constructor(
      title: string,
      status: "Pending" | "In Progress" | "Completed" = "Pending",
      creatorId: string,
      lastModified: Date = new Date(),
      frequency: "Once" | "Daily" | "Weekly" | "Monthly" | "Yearly" = "Once",
      priority: "Low" | "Medium" | "High" = "Medium",
      description?: string,
      dueDate?: Date,
      assignedUserIds: string[] = [],
      reminderDateTime?: Date,
      templateId?: string,
      projectId?: string,
      taskId?: string
    ) {
      this.taskId = taskId;
      this.title = title;
      this.description = description || "";
      this.dueDate = dueDate;
      this.frequency = frequency;
      this.status = status;
      this.priority = priority;
      this.creatorId = creatorId;
      this.assignedUserIds = assignedUserIds;
      this.reminderDateTime = reminderDateTime;
      this.templateId = templateId;
      this.lastModified = lastModified;
      this.projectId = projectId;
    }
  


  }
  