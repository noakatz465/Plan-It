import connect from "@/app/lib/db/mongoDB";
import Project from "@/app/lib/models/projectSchema";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        await connect();

        const  projectId  = req.url.split('/').pop();
        const project = await Project.findById(projectId);

        return NextResponse.json({
            message: "Project fetched successfully",
            project,
          });
    } catch (error) {
        console.error("Error fetching project:", error);
        return NextResponse.json(
          { message: "Failed to fetch project", error: error },
          { status: 500 }
        );
      }
}