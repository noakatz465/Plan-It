"use client";

import React, { useState } from "react";
import { useUserStore } from "../../stores/userStore";
import TaskListItem from "./TaskListItem"; // ייבוא הקומפוננטה שמציגה משימה בודדת
import { TaskModel } from "../../models/taskModel";

const TaskListView: React.FC = () => {
  const tasksFromStore = useUserStore((state) => state.tasks);
  const [tasks, setTasks] = useState<TaskModel[]>(tasksFromStore);

  if (!tasks || tasks.length === 0) {
    return <p className="text-center text-gray-500">No tasks available.</p>;
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">משימות</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <TaskListItem task={task} /> 
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskListView;
