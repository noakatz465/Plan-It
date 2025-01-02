import mongoose from 'mongoose';

export interface ITemplate {
    _id?: mongoose.Types.ObjectId;
    description: string;
}