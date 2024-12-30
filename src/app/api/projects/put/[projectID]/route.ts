import connect from "@/app/lib/db/mongoDB";
import Project from "@/app/lib/models/projectSchema";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        await connect();
        const data = await req.json();
        const  projectId  = req.url.split('/').pop();

        const project = await Project.findById(projectId);
        if (!project) {
            return NextResponse.json(
                { message: "Project not found" },
                { status: 404 }
            );
        }
        if (data.title) project.name = data.name;
        if (data.description) project.description = data.description;
        if (data.lastModified) project.lastModified = data.lastModified;

        await project.save();
        return NextResponse.json({
            message: "Project updated successfully",
            project,
        });
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json(
            { message: "Failed to update project", error: error },
            { status: 500 }
        );
    }
}