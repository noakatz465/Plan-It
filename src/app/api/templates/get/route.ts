import connect from '@/app/lib/db/mongoDB';
import Template from '@/app/lib/models/templateSchema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connect();

    const templates = await Template.find();

    return NextResponse.json({
      message: 'Template fetched successfully',
      templates: templates.map(template => ({
        _id: template._id,
        description: template.description    
      })),
    });
  }catch (error) {
    return NextResponse.json({
      message: 'Error fetching templates',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
  
}
