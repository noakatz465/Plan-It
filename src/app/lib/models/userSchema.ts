import { IUser } from '@/app/types/userInterface';
import mongoose, { Schema } from 'mongoose';

const UserSchema: Schema = new Schema({
    name: String,
    birthDate: Date,
    email: String,
    gender: String,
    password: String,
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
})

export default mongoose.model<IUser>('User', UserSchema);
