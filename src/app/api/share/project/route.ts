import connect from "@/app/lib/db/mongoDB";
import Project from "@/app/lib/models/projectSchema";
import User from "@/app/lib/models/userSchema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connect();
    const url = new URL(req.url);
    const projectId = url.searchParams.get("projectId");
    const sharedByUserId = url.searchParams.get("sharedByUserId");
    const targetUserId = url.searchParams.get("targetUserId");

    // שליפת המשתמש המשתף, המשתמש היעד והפרויקט
    const sharedByUser = await User.findById(sharedByUserId);
    const targetUser = await User.findById(targetUserId);
    const project = await Project.findById(projectId).populate("LinkedTasks"); // שליפת המשימות המקושרות

    if (!sharedByUser || !targetUser || !project) {
      return NextResponse.json(
        { message: "User, project, or tasks not found" },
        { status: 404 }
      );
    }

    // הוספת המשתמש היעד למערך `sharedWith` של המשתמש המשתף
    if (!sharedByUser.sharedWith.includes(targetUserId)) {
      sharedByUser.sharedWith.push(targetUserId);
      await sharedByUser.save();
    }

    // הוספת כל המשימות המקושרות לפרויקט למערך `tasks` של המשתמש היעד
    const taskIds = Array.from(new Set([...targetUser.tasks, ...project.LinkedTasks.map((task: mongoose.Types.ObjectId) => task._id)])); // Convert Set to array
    targetUser.tasks = taskIds; // עדכון משימות המשתמש המשותף

    await targetUser.save();

    // הוספת משתמש היעד למערך `members` של הפרויקט
    if (!project.members.includes(targetUserId)) {
      project.members.push(targetUserId);
      await project.save();
    }

    return NextResponse.json({
      message:
        "Project and its tasks successfully shared, and user added to shared list.",
    });
  } catch (error) {
    console.error("Error in project sharing approval:", error);
    return NextResponse.json(
      { message: "Failed to approve project sharing", error: error },
      { status: 500 }
    );
  }
}
