import { ITask } from "@/app/types/taskInterface";
import mongoose, { Schema } from "mongoose";

const TaskSchema: Schema = new Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    frequency: { type: String, default: 'Once' },
    status: { type: String, default: 'Pending', required: true },
    priority: { type: String, default: 'Medium' },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    reminderDateTime: { type: Date },
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    lastModified: { type: Date, default: Date.now, required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
})

export default mongoose.model<ITask>('Task', TaskSchema);
