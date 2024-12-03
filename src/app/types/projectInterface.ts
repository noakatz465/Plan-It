import mongoose, { Document } from 'mongoose';

export interface IProject extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    manager: mongoose.Types.ObjectId;
    LinkedTasks?: mongoose.Types.ObjectId[];
    members?: mongoose.Types.ObjectId[];
    lastModified: Date;
}