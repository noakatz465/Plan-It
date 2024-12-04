import { IProject } from "@/app/types/projectInterface";
import mongoose, { Schema } from "mongoose";

const ProjectSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    managerID: { type: mongoose.Schema.Types.ObjectId, required: true },
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
},{ collection: 'Projects' })

const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
export default Project;