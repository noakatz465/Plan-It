"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { useUserStore } from "@/app/stores/userStore";

const TasksStatusBarChart = () => {
  const tasks = useUserStore((state) => state.getTasks());

  // עיבוד נתונים: מיון משימות לפי תאריך יעד
  const taskData = tasks
    .filter((task) => task.dueDate) // סינון משימות ללא תאריך יעד
    .map((task) => ({
      name: task.title,
      date: new Date(task.dueDate ?? 0).toLocaleDateString("he-IL", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }),
      timestamp: new Date(task.dueDate ?? 0).getTime(),
      statusValue:
        task.status === "Pending"
          ? 1
          : task.status === "In Progress"
          ? 2
          : task.status === "Completed"
          ? 3
          : 0,
      statusLabel:
        task.status === "Pending"
          ? "ממתין"
          : task.status === "In Progress"
          ? "בתהליך"
          : task.status === "Completed"
          ? "הושלם"
          : "",
    }));

  // תאריך היום
  const today = new Date();
  const todayFormatted = today.toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  // הוספת תאריך היום לנתוני המשימות אם הוא לא קיים
  const isTodayIncluded = taskData.some((task) => task.date === todayFormatted);
  if (!isTodayIncluded) {
    taskData.push({
      name: "תאריך נוכחי",
      date: todayFormatted,
      timestamp: today.getTime(),
      statusValue: 0, // ללא סטטוס
      statusLabel: "תאריך נוכחי",
    });
  }

  // מיון נתונים מחדש בצורה כרונולוגית
  taskData.sort((a, b) => a.timestamp - b.timestamp);

  // צבעים לפי סטטוס
  const getBarColor = (statusValue: number) => {
    switch (statusValue) {
      case 1:
        return "#FF2929"; // אדום
      case 2:
        return "#FFD700"; // זהב
      case 3:
        return "#32CD32"; // ירוק
      default:
        return "#D3D3D3"; // אפור
    }
  };

  return (
    <div className="p-4 w-full h-full">
      <ResponsiveContainer width="100%" height={270}>
        <BarChart
          data={taskData}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value}
          />
          <YAxis
            tickFormatter={(value) =>
              value === 1
                ? "ממתין"
                : value === 2
                ? "בתהליך"
                : value === 3
                ? "הושלם"
                : ""
            }
            domain={[0, 3]}
            ticks={[1, 2, 3]}
            tick={{ fontSize: 12 }}
            width={80}
          />
          <Tooltip
            formatter={(value, name, props) =>
              `${props.payload.name} - ${props.payload.statusLabel}`
            }
            labelFormatter={(value) => `תאריך: ${value}`}
          />
          <ReferenceLine
            x={todayFormatted} // תאריך היום
            stroke="red"
            strokeWidth={2} // עובי קו
            strokeDasharray="5 5" // קווקוו
            label={{
              value: "תאריך נוכחי",
              position: "insideTop",
              fill: "red",
              fontSize: 14,
              fontWeight: "bold",
            }}
          />
          <Bar
            dataKey="statusValue"
            radius={[10, 10, 0, 0]} // פינות מעוגלות
            barSize={30}
          >
            {taskData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.statusValue)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TasksStatusBarChart;
