import { ITask } from "@/app/types/taskInterface";
import mongoose, { Schema } from "mongoose";

const TaskSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    frequency: { type: String, default: 'Once' },
    status: { type: String, default: 'Pending', required: true },
    priority: { type: String, default: 'Medium' },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedUsers: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        default: []
    },
    reminderDateTime: { type: Date },
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    lastModified: { type: Date, default: Date.now, required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
}, { collection: 'Tasks' })

const Task = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
export default Task;