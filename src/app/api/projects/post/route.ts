import connect from "@/app/lib/db/mongoDB";
import Project from "@/app/lib/models/projectSchema";
import User from "@/app/lib/models/userSchema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        await connect();
        const data = await req.json();

        const newProject = new Project({
            ...data,
            lastModified: new Date(),
        })
        const savedProject = await newProject.save();

        //עדכון המשתתפים בפרויקט- הוספת הפרויקט למערך הפרויקטים שלהם
        if (data.members && data.members.length > 0) {
            await User.updateMany(
                { _id: { $in: data.members  } },
                { $push: { projects: savedProject._id } }
            )
        }

        //עדכון מערך הפרויקטים של מנהל הפרויקט
        const result = await User.updateOne({ _id: data.managerID }, { $push: { projects: savedProject._id } });
        if (result.modifiedCount === 0) {
            console.error("Manager not updated. Please check the ID.");
        } else {
            console.log("Manager updated successfully.");
        }

        return NextResponse.json({
            message: "Project created and members updated!",
            projectId: savedProject._id.toString(),
        });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json(
            { message: "Failed to create project", error: error },
            { status: 500 }
        );
    }
}