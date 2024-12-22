import connect from '@/app/lib/db/mongoDB';
import User from '@/app/lib/models/userSchema'
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // התחברות ל-MongoDB
    await connect();

    // שליפת כל המשתמשים מהדאטהבייס
    const users = await User.find();

    // החזרת התוצאה בפורמט JSON
    return NextResponse.json({
      message: 'Users fetched successfully',
      users: users.map(user => ({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        birthDate: user.birthDate,
        gender: user.gender,
        joinDate: user.joinDate,
        notificationsEnabled: user.notificationsEnabled,
        projects: user.projects,
        tasks: user.tasks,
        sharedWith: user.sharedWith,
        profileImage: user.profileImage,
      })),
    });
  }catch (error) {
    return NextResponse.json({
      message: 'Error fetching users',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
  
}
