import connect from "@/app/lib/db/mongoDB";
import Template from "@/app/lib/models/templateSchema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        await connect();
        const data = await req.json();
        console.log(data);       
        const newTemplate = new Template(data);
        const savedTemplate = await newTemplate.save();

        return NextResponse.json(savedTemplate, { status: 200 });

    } catch (error) {
        console.error("Error creating template:", error);
        return NextResponse.json(
            { message: "Failed to create template ", error: error },
            { status: 500 }
        );
    }
}