import connect from "@/app/lib/db/mongoDB";
import { NextResponse } from "next/server";
import AlertNotification from "@/app/lib/models/alertNotificationSchema";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
    try {
        console.log("Connecting to the database...");
        await connect();
        console.log("Database connected.");

        const { userId } = params;

        if (!userId) {
            console.error("Missing required userId parameter");
            return NextResponse.json(
                { message: "Missing required userId parameter" },
                { status: 400 }
            );
        }

        console.log(`Fetching notifications for userId: ${userId}`);

        // שליפת כל ההתראות לפי userId
        const notifications = await AlertNotification.find({ recipientUserId: userId });

      

        console.log(`Notifications found for userId: ${userId}`, notifications);

        // החזרת ההתראות כתגובה
        return NextResponse.json(notifications, { status: 200 });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { message: "Failed to fetch notifications", error: error },
            { status: 500 }
        );
    }
}
