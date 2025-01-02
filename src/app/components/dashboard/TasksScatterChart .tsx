import React from "react";
import { useUserStore } from "@/app/stores/userStore";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TasksScatterChart = () => {
  const tasks = useUserStore((state) => state.getTasks());

  // Map priority levels to numeric values for the Y-axis
  const priorityMapping = {
    Low: 1,
    Medium: 2,
    High: 3,
  };

  // Prepare data for the scatter plot
  const scatterData = tasks.map((task) => ({
    title: task.title,
    dueDate: task.dueDate
      ? new Date(task.dueDate).toISOString().split("T")[0]
      : "ללא תאריך יעד",
    priority: priorityMapping[task.priority] || 0,
    status: task.status,
  }));

  // Map status to colors for the dots
  const getStatusColor = (status: any) => {
    switch (status) {
      case "Completed":
        return "#32CD32"; // Green
      case "In Progress":
        return "#FFD700"; // Yellow
      case "Pending":
        return "#FF4500"; // Red
      default:
        return "#808080"; // Gray
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-center text-[#3D3BF3] mb-4">
        משימות לפי עדיפות ותאריך יעד
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="dueDate"
            type="category"
            name="תאריך יעד"
            tick={{ fontSize: 12 }}
            label={{
              value: "תאריך יעד",
              position: "insideBottom",
              offset: -5,
            }}
          />
          <YAxis
            dataKey="priority"
            type="number"
            name="עדיפות"
            tick={{ fontSize: 12 }}
            domain={[0, 3]}
            ticks={[1, 2, 3]}
            tickFormatter={(value) =>
              value === 1
                ? "נמוכה"
                : value === 2
                ? "בינונית"
                : value === 3
                ? "גבוהה"
                : ""
            }
            label={{
              value: "עדיפות",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 12 },
            }}
          />
          <Tooltip />
          <Scatter
            name="משימות"
            data={scatterData}
            shape={(props: { cx: any; cy: any; payload: any; }) => {
              const { cx, cy, payload } = props;
              return <circle cx={cx} cy={cy} r={6} fill={getStatusColor(payload.status)} />;
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TasksScatterChart;
