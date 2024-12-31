import { INotification } from "@/app/types/notificationInterface";
import mongoose, { Schema } from "mongoose";

// יצירת סכמת ההתראות
const AlertNotificationSchema: Schema = new Schema({
    // מזהה המשימה שאליה משויכת ההתראה
    taskId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Task', 
        required: true 
    }, 
    // סוג ההתראה (לדוגמה: הקצאת משימה, משימה קרובה, משימה באיחור)
    notificationType: { 
        type: String, 
        required: true, 
        enum: ['TaskAssigned', 'TaskDueSoon', 'TaskOverdue'] 
    },
    // טקסט ההתראה
    notificationText: { 
        type: String, 
        required: true 
    }, 
    // מזהה המשתמש שאליו מיועדת ההתראה
    recipientUserId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, 
    // תאריך ושעה של יצירת ההתראה (ברירת מחדל: עכשיו)
    notificationDate: { 
        type: Date, 
        default: Date.now, 
        required: true 
    }, 
    // האם ההתראה נקראה על ידי המשתמש
    isRead: { 
        type: Boolean, 
        default: false 
    }, 
    // סטטוס ההתראה (לדוגמה: פעילה או סגורה)
    status: { 
        type: String, 
        enum: ['Active', 'Dismissed'], 
        default: 'Active' 
    }
}, { 
    // שם אוסף הנתונים במסד הנתונים
    collection: 'AlertNotification' 
});

// יצירת מודל ההתראות בשילוב הממשק
const AlertNotification =
    mongoose.models.AlertNotification ||
    mongoose.model<INotification>("AlertNotification", AlertNotificationSchema);

export default AlertNotification;
