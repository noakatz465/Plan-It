export class TaskModel {
  _id?: string; // מזהה ייחודי למשימה
  title: string; // כותרת המשימה
  description?: string; // תיאור מפורט
  dueDate?: Date; // תאריך יעד
  frequency: "Once" | "Daily" | "Weekly" | "Monthly" | "Yearly"; // תדירות
  status: "Pending" | "In Progress" | "Completed"; // סטטוס
  priority: "Low" | "Medium" | "High"; // עדיפות
  creator: string; // מזהה יוצר המשימה
  assignedUsers: string[]; // מזהי המשתמשים המשויכים
  reminderDateTime?: Date; // תאריך ושעה לתזכורת
  templateId?: string; // מזהה תבנית
  lastModified: Date; // תאריך עדכון אחרון
  projectId?: string; // מזהה פרויקט משויך

  constructor(
    title: string,
    status: "Pending" | "In Progress" | "Completed" = "Pending",
    creator: string,
    lastModified: Date = new Date(),
    frequency: "Once" | "Daily" | "Weekly" | "Monthly" | "Yearly" = "Once",
    priority: "Low" | "Medium" | "High" = "Medium",
    description?: string,
    dueDate?: Date,
    assignedUsers: string[] = [],
    reminderDateTime?: Date,
    templateId?: string,
    projectId?: string,
    _id?: string
  ) {
    this._id = _id;
    this.title = title;
    this.description = description || "";
    this.dueDate = dueDate;
    this.frequency = frequency;
    this.status = status;
    this.priority = priority;
    this.creator = creator;
    this.assignedUsers = assignedUsers || [];
    this.reminderDateTime = reminderDateTime;
    this.templateId = templateId;
    this.lastModified = lastModified;
    this.projectId = projectId;
  }



}
