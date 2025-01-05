import mongoose from "mongoose";

export interface INotification {
    _id?: mongoose.Types.ObjectId; // מזהה ייחודי להתראה
    taskId: mongoose.Types.ObjectId; // מזהה המשימה שאליה משויכת ההתראה
    notificationType: "TaskAssigned" | "TaskDueSoon" | "TaskOverdue"|"ProjectAssigned"; // סוג ההתראה
    notificationText: string; // טקסט ההתראה
    recipientUserId: mongoose.Types.ObjectId; // מזהה המשתמש שאליו מיועדת ההתראה
    notificationDate: Date; // תאריך ושעה של יצירת ההתראה
    isRead: boolean; // האם ההתראה נקראה
    status: "Active" | "Dismissed"; // סטטוס ההתראה
}
