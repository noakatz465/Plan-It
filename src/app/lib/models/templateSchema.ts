import { ITemplate } from "@/app/types/tamplateInterface";
import mongoose, { Schema } from "mongoose";

const TemplateSchema: Schema = new Schema({
    description: { type: String, required: true  },
}, { collection: 'Templates' })

const Template = mongoose.models.Template || mongoose.model<ITemplate>('Template', TemplateSchema);
export default Template;