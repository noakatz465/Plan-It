import connect from "@/app/lib/db/mongoDB";
import { NextResponse } from "next/server";
import Task from '@/app/lib/models/taskSchema';
import User from '@/app/lib/models/userSchema';
import Project from '@/app/lib/models/projectSchema';

export async function POST(req: Request) {
    try {
        await connect();
        const data = await req.json();
        // סינון כפילויות ב-assignedUsers
        if (data.assignedUsers) {
            data.assignedUsers = Array.from(new Set(data.assignedUsers));
        }
        const newTask = new Task({
            ...data,
            lastModified: new Date(),
        });

        const savedTask = await newTask.save();

        //עדכון המשתמש שיצר את המשימה- הוספת המשימה למערך המשימות שלו
        const updatedUser = await User.findByIdAndUpdate(
            data.creator,
            { $push: { tasks: savedTask._id } },
            { new: true }
        );
        if (!updatedUser) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        //במידה והמשימה מוצמדת למשתמשים- הוספת המשימה החדשה למערך המשימות שלהם
        if (data.assignedUsers && data.assignedUsers.length > 0) {
            await User.updateMany(
                { _id: { $in: data.assignedUsers } },
                { $addToSet: { tasks: savedTask._id } }
            );
        }

        //אם המשימה שייכת לפרויקט- הוספת המשימה לפרויקט המתאים
        if (data.projectId) {
            await Project.findByIdAndUpdate(
                data.projectId,
                { $addToSet: { LinkedTasks: savedTask._id } },
                { new: true }
            );
        }

        return NextResponse.json(savedTask, { status: 200 });

    } catch (error) {
        console.error("Error creating task and updating user:", error);
        return NextResponse.json(
            { message: "Failed to create task and update user", error: error },
            { status: 500 }
        );
    }
}