import mongoose, { Document } from 'mongoose';

export interface ITask extends Document {
    title: string;
    description?: string;
    dueDate?: Date;
    frequency?: string;
    status: string;
    priority?: string;
    creator: mongoose.Types.ObjectId;
    assignedUsers?: mongoose.Types.ObjectId[];
    reminderDateTime?: Date;
    templateId?: mongoose.Types.ObjectId;
    lastModified: Date;
    projectId?: mongoose.Types.ObjectId;
}