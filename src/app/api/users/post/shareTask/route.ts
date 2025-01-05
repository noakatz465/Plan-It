import connect from "@/app/lib/db/mongoDB";
import Task from "@/app/lib/models/taskSchema";
import User from "@/app/lib/models/userSchema";
import { sendEmail } from "@/app/lib/utils/sentEmail";
import axios from "axios";
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
        if (isAlreadyShared) {
            // המשתמש כבר מורשה לשיתוף - מבצעים שיתוף 
            const response = await axios.post(`http://localhost:3000/api/share/task/?taskId=${taskId}&sharedByUserId=${sharedByUserId}&targetUserId=${targetUserId}`);

            if (response.status !== 200) {
                return NextResponse.json(
                    { message: "Failed to notify authorized share" },
                    { status: response.status }
                );
            }

            return NextResponse.json({
                message: "Task shared successfully with the user, and API notified.",
            });
        } else {
            // המשתמש לא מורשה - שליחת בקשה לאישור במייל
            const apiUrl = `http://localhost:3000/api/share/task`;
            const queryString = `?taskId=${taskId}&sharedByUserId=${sharedByUserId}&targetUserId=${targetUserId}`;
            await sendEmail({
                to: targetUser.email,
                subject: "Request to share task",
                text: `${sharedByUser.email} הזמין אותך להשתתף במשימה: "${task.title}". לחץ כאן לקבלת השיתוף.`,
                html: `<p>${sharedByUser.email} הזמין אותך להשתתף במשימה: "<strong>${task.title}</strong>".</p>
                       <p>לחץ כאן לקבלת השיתוף:</p>
                        <a href="${apiUrl}${queryString}">אישור שיתוף</a>`
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