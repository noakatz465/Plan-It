import { ITemplate } from "@/app/types/tamplateInterface";
import mongoose, { Schema } from "mongoose";

const TemplateSchema: Schema = new Schema({
    name: { type: String, required: true  },
    description: { type: String, required: true  },
}, { collection: 'Templates' })

const TaskTemplate = mongoose.models.TaskTemplate || mongoose.model<ITemplate>('TaskTemplate', TemplateSchema);
export default TaskTemplate;