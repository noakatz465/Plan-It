import mongoose from 'mongoose';

export interface IProject {
    _id?: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    managerID: mongoose.Types.ObjectId;
    linkedTasks?: mongoose.Types.ObjectId[];
    members?: mongoose.Types.ObjectId[];
    lastModified: Date;
}