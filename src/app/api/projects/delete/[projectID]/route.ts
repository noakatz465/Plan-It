import connect from "@/app/lib/db/mongoDB";
import Project from "@/app/lib/models/projectSchema";
import Task from "@/app/lib/models/taskSchema";
import User from "@/app/lib/models/userSchema";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    try {
        await connect();

        const projectId = req.url.split('/').pop();
        const deletedProject = await Project.findByIdAndDelete(projectId);
        if (!deletedProject) {
            return NextResponse.json(
                { message: "Project not found" },
                { status: 404 }
            );
        }
        const LinkedTasks = deletedProject.LinkedTasks;
        const members = deletedProject.members;

        if (LinkedTasks && LinkedTasks.length > 0) {
            await Task.deleteMany({ _id: { $in: LinkedTasks } });
            for (const task of LinkedTasks) {
                if (members)
                    await User.updateMany(
                        { _id: { $in: members } },
                        { $pull: { tasks: task } }
                    );
                await User.updateOne(
                    { _id: deletedProject.managerID },
                    { $pull: { tasks: task } }
                );
            }
        }

        return NextResponse.json(
            { message: "Project deleted successfully and users updated", project: deletedProject },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error },
            { status: 500 }
        );
    }
}