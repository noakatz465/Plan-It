import mongoose, { Schema } from "mongoose";

const ProjectSchema: Schema = new Schema({
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
},{ collection: 'Projects' })

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
export default Project;