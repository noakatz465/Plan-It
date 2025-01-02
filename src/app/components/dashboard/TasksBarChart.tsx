"use client";
import { useUserStore } from "@/app/stores/userStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TasksBarChart = () => {
  const tasks = useUserStore((state) => state.getTasks());

  // חישוב כמות המשימות לפי סטטוס
  const statusData = [
    {
      status: "משימות ממתינות",
      count: tasks.filter((task) => task.status === "Pending").length,
    },
    {
      status: "משימות בתהליך",
      count: tasks.filter((task) => task.status === "In Progress").length,
    },
    {
      status: "משימות הושלמו",
      count: tasks.filter((task) => task.status === "Completed").length,
    },
  ];

  return (
    <div className="p-4 max-w-sm mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-center text-[#3D3BF3] mb-4">
        כמות משימות לפי סטטוס
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={statusData}
          margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="status"
            tick={{ fontSize: 12 }}
            label={{
              value: "סטטוס",
              position: "insideBottom",
              offset: -5,
              style: { fontSize: 12 },
            }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            label={{
              value: "כמות משימות",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 12 },
            }}
          />
          <Tooltip
            formatter={(value, name) => [`${value}`, `${name}`]}
            wrapperStyle={{
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Legend
            formatter={(value) =>
              value === "count" ? "כמות משימות" : value
            }
            wrapperStyle={{
              paddingTop: 10,
              fontSize: 12,
            }}
          />
          <Bar
            dataKey="count"
            name="כמות משימות"
            fill="#FF2929"
            radius={[10, 10, 0, 0]} // עיצוב עמודות עגולות בחלק העליון
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TasksBarChart;
