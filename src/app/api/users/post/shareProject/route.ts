import connect from "@/app/lib/db/mongoDB";
import Project from "@/app/lib/models/projectSchema";
import User from "@/app/lib/models/userSchema";
import { sendEmail } from "@/app/lib/utils/sentEmail";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        await connect();
        const data = await req.json();
        const { projectId, targetUserId, sharedByUserId } = data;

        // שליפת המשתמש המשתף והמשתמש היעד
        const sharedByUser = await User.findById(sharedByUserId);
        const targetUser = await User.findById(targetUserId);
        const project = await Project.findById(projectId);

        if (!sharedByUser || !targetUser || !project) {
            return NextResponse.json(
                { message: "User or project not found" },
                { status: 404 }
            );
        }
        // בדיקה אם המשתמש היעד כבר מופיע במערך sharedWith
        const isAlreadyShared = sharedByUser.sharedWith.includes(targetUserId);
        console.log(isAlreadyShared+" isAlreadyShared");
        
        if (isAlreadyShared) {
            // המשתמש כבר מורשה לשיתוף - מבצעים שיתוף 
            project.assignedUsers.push(targetUserId);
            targetUser.tasks.push(projectId);
            await project.save();
            await targetUser.save();

            return NextResponse.json({
                message: "Project shared successfully with the user.",
            });
        } else {
            // המשתמש לא מורשה - שליחת בקשה לאישור במייל
            await sendEmail({
                to: targetUser.email,
                subject: "Request to share project",
                text: `You have been invited to collaborate on the project: "${project.name}". Click the link below to accept the invitation.`,
                html: `<p>You have been invited to collaborate on the project: "<strong>${project.name}</strong>".</p>
                       <p>Click the link below to accept the invitation:</p>
                       <a href="http://localhost:3000/share/project/${projectId}/${sharedByUserId}">Accept Invitation</a>`,
            });

            return NextResponse.json({
                message:
                    "The user is not in your shared list. A request email has been sent.",
            });
        }
    } catch (error) {
        console.error("Error sharing project:", error);
        return NextResponse.json(
            { message: "Failed to share project", error: error },
            { status: 500 }
        );
    }
}