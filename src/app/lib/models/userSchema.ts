import { IUser } from '@/app/types/userInterface';
import mongoose, { Schema } from 'mongoose';

const UserSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: Date },
    email: { type: String, required: true, unique: true },
    gender: { type: String },
    password: { type: String, required: true },
    joinDate: {
        type: Date,
        default: Date.now,
    },
    notificationsEnabled: {
        type: Boolean,
        default: true,
    },
    projects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
        },
    ],
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
        },
    ],
    sharedWith: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    profileImage: {
        type: String,
    },
    verificationCode: { type: String, required: false }, // עדכון ל-String
    verificationCodeExpiry: { type: Date, required: false }, // תוקף הקוד
},{ collection: 'Users' })

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 
export default User;
