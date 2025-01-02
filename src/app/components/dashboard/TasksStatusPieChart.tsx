"use client";
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Text } from "recharts";
import { useUserStore } from "@/app/stores/userStore";

const TasksStatusPieChart = () => {
  const tasks = useUserStore((state) => state.getTasks());

  // חישוב משימות לפי סטטוס
  const statusCounts = tasks.reduce(
    (acc, task) => {
      if (task.status === "Pending") acc.pending += 1;
      else if (task.status === "In Progress") acc.inProgress += 1;
      else if (task.status === "Completed") acc.completed += 1;
      return acc;
    },
    { pending: 0, inProgress: 0, completed: 0 }
  );

  // סך המשימות
  const totalTasks = tasks.length;

  // חישוב אחוזים
  const data = [
    { name: "ממתין", value: totalTasks ? (statusCounts.pending / totalTasks) * 100 : 0 },
    { name: "בתהליך", value: totalTasks ? (statusCounts.inProgress / totalTasks) * 100 : 0 },
    { name: "הושלם", value: totalTasks ? (statusCounts.completed / totalTasks) * 100 : 0 },
  ];

  // צבעים לפי סטטוס
  const COLORS = ["#FF2929", "#FFD700", "#32CD32"]; // אדום, זהב, ירוק

  return (
    <div className=" w-100% h-full">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="60%"
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
              const RADIAN = Math.PI / 180;
              const radius = 25 + outerRadius;
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);

              return (
                <Text
                  x={x}
                  y={y}
                  fill="black" // צבע שחור לתוויות
                  textAnchor={x > cx ? "start" : "end"}
                  dominantBaseline="central"
                  fontSize="12px"
                  fontWeight="bold"
                >
                  {`${data[index].name}: ${data[index].value.toFixed(1)}%`}
                </Text>
              );
            }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) =>
              ` ${Number(value).toFixed(1)}%`
            }
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TasksStatusPieChart;
