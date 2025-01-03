import connect from '@/app/lib/db/mongoDB';
import Template from '@/app/lib/models/templateSchema';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await connect();

        const templates = await Template.find();

        return NextResponse.json(
            templates.map((template) => ({
                _id: template._id.toString(),
                name: template.name,
                description: template.description,
            })),
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({
            message: 'Error fetching templates',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }

}
