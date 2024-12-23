import connect from "@/app/lib/db/mongoDB";
import Task from "@/app/lib/models/taskSchema";
import User from "@/app/lib/models/userSchema";
import { sendEmail } from "@/app/lib/utils/sentEmail";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        await connect();
        const data = await req.json();
        const { taskId, targetUserId, sharedByUserId } = data;

        // שליפת המשתמש המשתף והמשתמש היעד
        const sharedByUser = await User.findById(sharedByUserId);
        const targetUser = await User.findById(targetUserId);
        const task = await Task.findById(taskId);

        if (!sharedByUser || !targetUser || !task) {
            return NextResponse.json(
                { message: "User or Task not found" },
                { status: 404 }
            );
        }
        // בדיקה אם המשתמש היעד כבר מופיע במערך sharedWith
        const isAlreadyShared = sharedByUser.sharedWith.includes(targetUserId);
        console.log(isAlreadyShared+" isAlreadyShared");
        
        if (isAlreadyShared) {
            // המשתמש כבר מורשה לשיתוף - מבצעים שיתוף 
            task.assignedUsers.push(targetUserId);
            targetUser.tasks.push(taskId);
            await task.save();
            await targetUser.save();

            return NextResponse.json({
                message: "Task shared successfully with the user.",
            });
        } else {
            // המשתמש לא מורשה - שליחת בקשה לאישור במייל
            await sendEmail({
                to: targetUser.email,
                subject: "Request to share task",
                text: `You have been invited to collaborate on the task: "${task.title}". Click the link below to accept the invitation.`,
                html: `<p>You have been invited to collaborate on the task: "<strong>${task.title}</strong>".</p>
                       <p>Click the link below to accept the invitation:</p>
                       <a href="http://localhost:3000/accept-task/${taskId}/${sharedByUserId}">Accept Invitation</a>`,
            });

            return NextResponse.json({
                message:
                    "The user is not in your shared list. A request email has been sent.",
            });
        }
    } catch (error) {
        console.error("Error sharing task:", error);
        return NextResponse.json(
            { message: "Failed to share task", error: error },
            { status: 500 }
        );
    }
}