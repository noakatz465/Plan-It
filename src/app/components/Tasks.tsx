"use client";
import React, { useState } from "react";
import TaskNavBar from "@/app/components/TaskNavBar"; // נבבר המשימות
import TaskListView from "@/app/components/TaskListView"; // קומפוננטת תצוגת רשימה
import TaskCalendarView from "@/app/components/TaskCalendarView"; // קומפוננטת לוח שנה
import TaskKanbanView from "@/app/components/TaskKanbanView"; // קומפוננטת קנבן

function Tasks() {
  const [view, setView] = useState<"list" | "calendar" | "kanban">("list"); // מצב התצוגה הנוכחית

  // פונקציה לשינוי התצוגה
  const handleViewChange = (newView: "list" | "calendar" | "kanban") => {
    setView(newView);
  };

  return (
    <div className="h-screen bg-gray-50">
      {/* נבבר המשימות */}
      <TaskNavBar onChangeView={handleViewChange} />

      {/* הצגת הקומפוננטה לפי התצוגה הנוכחית */}
      <div className="p-4">
        {view === "list" && <TaskListView />}
        {view === "calendar" && <TaskCalendarView />}
        {view === "kanban" && <TaskKanbanView />}
      </div>
    </div>
  );
}

export default Tasks;
