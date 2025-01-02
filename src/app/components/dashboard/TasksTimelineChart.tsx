"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useUserStore } from "@/app/stores/userStore";

const TasksTimelineChart = () => {
  const tasks = useUserStore((state) => state.getTasks());

  // עיבוד נתונים: מיון משימות לפי תאריך יעד
  const sortedTasks = tasks
    .filter((task) => task.dueDate) // סינון משימות ללא תאריך יעד
    .sort(
      (a, b) =>
        new Date(a.dueDate ?? 0).getTime() - new Date(b.dueDate ?? 0).getTime()
    );

  // יצירת מערך נתונים לגרף
  const taskData = sortedTasks.map((task) => ({
    name: task.title,
    date: task.dueDate ? new Date(task.dueDate).getTime() : null, // המרת תאריך ל-timestamp
    statusValue:
      task.status === "Pending"
        ? 1
        : task.status === "In Progress"
        ? 2
        : task.status === "Completed"
        ? 3
        : 0,
    statusLabel: task.status,
  }));

  // תאריך היום הנוכחי
  const todayTimestamp = new Date().getTime();

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-[#3D3BF3] mb-4">
        שינוי סטטוס המשימות לפי תאריך יעד
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={taskData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            type="number" // הגדרת הציר כציר מספרי
            domain={["dataMin", "dataMax"]} // התאמה לטווח התאריכים בנתונים
            scale="time" // שימוש בסקאלת זמן
            tickFormatter={(timestamp) =>
              new Date(timestamp).toLocaleDateString("he-IL")
            } // הצגת התאריך בפורמט קריא
            label={{
              value: "תאריך יעד",
              position: "insideBottomRight",
              offset: -10,
            }}
          />
          <YAxis
            label={{ value: "סטטוס", angle: -90, position: "insideLeft" }}
            tickFormatter={(value) =>
              value === 1
                ? "Pending"
                : value === 2
                ? "In Progress"
                : value === 3
                ? "Completed"
                : ""
            }
            domain={[0, 3]} // הגבלת ערכים
            ticks={[1, 2, 3]} // סטטוסים
          />
          <Tooltip
            formatter={(value, name, props) =>
              name === "statusValue"
                ? `${props.payload.name} - ${props.payload.statusLabel}`
                : value
            }
          />
          <Line
            type="monotone"
            dataKey="statusValue"
            stroke="#8884d8"
            strokeWidth={2}
            activeDot={{ r: 6 }} // עיגולים גדולים בנקודות הפעילות
          />
          {/* קו אנכי לציון תאריך היום */}
          <ReferenceLine
            x={todayTimestamp}
            stroke="red"
            strokeDasharray="3 3"
            label={{
              value: "היום",
              position: "top",
              fill: "red",
              fontSize: 12,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TasksTimelineChart;
