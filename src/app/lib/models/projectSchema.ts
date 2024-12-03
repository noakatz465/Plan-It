import { IProject } from "@/app/types/projectInterface";
import mongoose, { Schema } from "mongoose";

const ProjectSchema: Schema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    description: { type: String },
    manager: { type: mongoose.Schema.Types.ObjectId, required: true },
    LinkedTasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
        },
    ],
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    lastModified: {
        type: Date,
        default: Date.now,
        required: true
    },
})

export default mongoose.model<IProject>('User', ProjectSchema);
