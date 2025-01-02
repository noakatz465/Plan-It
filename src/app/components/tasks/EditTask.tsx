"use client";
import React, { useState } from "react";
import Select from "react-select";
import { TaskModel } from "@/app/models/taskModel";
import { updateTask } from "@/app/services/taskService";
import { useUserStore } from "@/app/stores/userStore";

interface EditTaskProps {
  task: TaskModel;
  onSave: (updatedTask: TaskModel) => void;
  onCancel: () => void;
}

const EditTask: React.FC<EditTaskProps> = ({ task, onSave, onCancel }) => {
  const [editedTask, setEditedTask] = useState<TaskModel>({ ...task });
  const [loading, setLoading] = useState(false);
  const updateTaskInStore = useUserStore((state) => state.updateTaskInStore); // שימוש בפונקציה מהחנות

  const frequencyOptions = [
    { value: "Once", label: "חד פעמי" },
    { value: "Daily", label: "יומי" },
    { value: "Weekly", label: "שבועי" },
    { value: "Monthly", label: "חודשי" },
    { value: "Yearly", label: "שנתי" },
  ];

  const priorityOptions = [
    { value: "High", label: "גבוהה" },
    { value: "Medium", label: "בינונית" },
    { value: "Low", label: "נמוכה" },
  ];

  const statusOptions = [
    { value: "Pending", label: "חדש" },
    { value: "In Progress", label: "בביצוע" },
    { value: "Completed", label: "הושלם" },
  ];

  const getProgressColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500";
      case "In Progress":
        return "bg-yellow-500";
      case "Pending":
        return "bg-[#FF2929]";
      default:
        return "bg-gray-400";
    }
  };

  const handleEditChange = (field: keyof TaskModel, value: unknown) => {
    setEditedTask((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditSubmit = async () => {
    setLoading(true);
    try {
      if (task._id) {
        await updateTaskInStore(task._id, editedTask); // קריאה לפונקציה מהחנות
        onSave(editedTask); // קריאה לפונקציית onSave כדי לסגור את חלון העריכה או לעדכן את הקומפוננטה
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded ">
      <h2 className="text-xl font-bold mb-4">ערוך משימה</h2>
      {loading && <p>Loading...</p>}
      {!loading && (
        <form className="flex flex-col gap-4">
          <div>
            <label htmlFor="title" className="block font-medium">
              כותרת
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={editedTask.title}
              onChange={(e) => handleEditChange("title", e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-medium">
              תאור
            </label>
            <textarea
              id="description"
              name="description"
              value={editedTask.description || ""}
              onChange={(e) => handleEditChange("description", e.target.value)}
              className="w-full px-3 py-2 border rounded"
            ></textarea>
          </div>
          
          <div>
            <label htmlFor="status" className="block font-medium">
              סטטוס
            </label>
            <div className="relative w-48 h-3 bg-gray-300 rounded-full mt-2 mb-2">
              <div
                className={`absolute h-full rounded-full ${getProgressColor(
                  editedTask.status || "Pending"
                )}`}
                style={{
                  width: `${
                    editedTask.status === "Completed"
                      ? 100
                      : editedTask.status === "In Progress"
                      ? 50
                      : 20
                  }%`,
                }}
              ></div>
            </div>
            <Select
              id="status"
              options={statusOptions}
              onChange={(selectedOption) =>
                handleEditChange("status", selectedOption?.value)
              }
              value={statusOptions.find(
                (option) => option.value === editedTask.status
              )}
              placeholder="בחר סטטוס"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#ccc",
                  borderRadius: "8px",
                  padding: "5px",
                }),
              }}
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="block font-medium">
              תאריך יעד
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={
                editedTask.dueDate
                  ? new Date(editedTask.dueDate).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => handleEditChange("dueDate", e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="frequency" className="block font-medium">
              תדירות
            </label>
            <Select
              id="frequency"
              options={frequencyOptions}
              onChange={(selectedOption) =>
                handleEditChange("frequency", selectedOption?.value || "Once")
              }
              value={frequencyOptions.find(
                (option) => option.value === editedTask.frequency
              )}
              placeholder="בחר תדירות"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#ccc",
                  borderRadius: "8px",
                  padding: "5px",
                }),
              }}
            />
          </div>

          <div>
            <label htmlFor="priority" className="block font-medium">
              עדיפות
            </label>
            <Select
              id="priority"
              options={priorityOptions}
              onChange={(selectedOption) =>
                handleEditChange("priority", selectedOption?.value)
              }
              value={priorityOptions.find(
                (option) => option.value === editedTask.priority
              )}
              placeholder="בחר עדיפות"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#ccc",
                  borderRadius: "8px",
                  padding: "5px",
                }),
              }}
            />
          </div>


          <div className="flex gap-4">
            <button
              onClick={handleEditSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
              disabled={loading}
            >
              שמור
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300"
            >
              ביטול
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditTask;
