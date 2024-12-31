import connect from "@/app/lib/db/mongoDB";
import AlertNotification from "@/app/lib/models/alertNotificationSchema";

export async function PATCH(req:Request) {
  try {
    await connect();
    const { notificationId } = await req.json(); // מקבל את מזהה ההתראה

    if (!notificationId) {
      return new Response("Notification ID is required", { status: 400 });
    }

    const updatedNotification = await AlertNotification.findByIdAndUpdate(
      notificationId,
      { isRead: true }, // מעדכן את isRead ל-true
      { new: true }
    );

    if (!updatedNotification) {
      return new Response("Notification not found", { status: 404 });
    }

    return new Response(JSON.stringify(updatedNotification), { status: 200 });
  } catch (error) {
    console.error("Error updating notification:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
