import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  birthDate?: Date;
  email: string;
  gender?: string;
  password: string;
  joinDate: Date;
  notificationsEnabled: boolean;
  projects?: mongoose.Types.ObjectId[];
  tasks?: mongoose.Types.ObjectId[];
  sharedWith?: mongoose.Types.ObjectId[];
}