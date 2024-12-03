import mongoose from 'mongoose';

export interface IProject {
    _id?: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    manager: mongoose.Types.ObjectId;
    LinkedTasks?: mongoose.Types.ObjectId[];
    members?: mongoose.Types.ObjectId[];
    lastModified: Date;
}