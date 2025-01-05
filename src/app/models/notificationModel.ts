export class NotificationModel {
    _id: string; // מזהה ייחודי להתראה
    taskId: string; // מזהה המשימה המשויכת
    notificationType: "TaskAssigned" | "TaskDueSoon" | "TaskOverdue"|"ProjectAssigned"; // סוג ההתראה
    notificationText: string; // טקסט ההתראה
    recipientUserId: string; // מזהה המשתמש אליו מיועדת ההתראה
    notificationDate: Date; // תאריך ושעה של יצירת ההתראה
    isRead: boolean; // האם ההתראה נקראה
    status: "Active" | "Dismissed"; // סטטוס ההתראה
  
    constructor(
      taskId: string,
      notificationType: "TaskAssigned" | "TaskDueSoon" | "TaskOverdue"|"ProjectAssigned",
      notificationText: string,
      recipientUserId: string,
      notificationDate: Date ,
      isRead: boolean ,
      status: "Active" | "Dismissed" ,
      _id: string
    ) {
      this._id = _id;
      this.taskId = taskId;
      this.notificationType = notificationType;
      this.notificationText = notificationText;
      this.recipientUserId = recipientUserId;
      this.notificationDate = notificationDate;
      this.isRead = isRead;
      this.status = status;
    }
  }
  