import connect from "@/app/lib/db/mongoDB";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        await connect();
        const data = await req.json();
        console.log(data);


    }
}