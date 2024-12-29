
'use client';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { addTask } from '@/app/services/taskService';
import { useUserStore } from '@/app/stores/userStore';
import { TaskModel } from '@/app/models/taskModel';
import Image from "next/image";
import CreatableSelect from 'react-select/creatable';
import { shareTask } from '@/app/services/userService';



interface TaskDetails {
  dueDate?: Date;
}

const AddTask: React.FC<TaskDetails> = (props) => {
  const initialTask = new TaskModel('', 'Pending', '', undefined);
  const [task, setTask] = useState<TaskModel>(initialTask);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const userFromStore = useUserStore((state) => state.user);
  const addTaskToStore = useUserStore((state) => state.addTaskToStore);
  const users = useUserStore((state) => state.users);
  const projects = useUserStore((state) => state.projects);


  useEffect(() => {
    if (props.dueDate) {
      setTask((prev) => ({ ...prev, dueDate: props.dueDate }));
    }
  }, [props.dueDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask((prev) => ({ ...prev, dueDate: new Date(e.target.value) }));
  };

  const handleUserSelect = (selectedOptions: any) => {
    const newUsers = selectedOptions.map((option: any) => ({
      value: option.value,
      label: option.label,
      isNew: option.__isNew__ || false, // אם האופציה נוצרה באופן חופשי
    }));
    setTask((prev) => ({
      ...prev,
      assignedUserIds: newUsers.map((user: { value: any; }) => user.value),
    }));
  };

  const handlePrioritySelect = (selectedOption: any) => {
    setTask((prev) => ({
      ...prev,
      priority: selectedOption.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const updatedTask = { ...task, creator: userFromStore?._id || '' };      
      const newTaskResponse = await addTask(updatedTask);
      if (updatedTask.assignedUserIds) {
        
        await Promise.all(
          updatedTask.assignedUserIds.map(async (userId) => {
            try {
              await shareTask({
                taskId: newTaskResponse._id,
                targetUserId: userId,
                sharedByUserId: userFromStore?._id || '',
              });
              console.log(`Task successfully shared with user ${userId}`);
            } catch (error) {
              console.error(`Failed to share task with user ${userId}:`, error);
            }
          })
        );
      }

      addTaskToStore({ ...updatedTask, _id: userFromStore?._id });
      setSuccessMessage(`Task "${updatedTask.title}" added successfully!`);
      setTask(initialTask);
    } catch (error) {
      setError('Failed to add task. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const projectOptions = projects?.map((project) => ({
    value: project._id, // מזהה ייחודי של הפרויקט
    label: project.name, // שם הפרויקט שיוצג
  }));

  const frequencyOptions = [
    { value: "Once", label: "חד פעמי" },
    { value: "Daily", label: "יומי" },
    { value: "Weekly", label: "שבועי" },
    { value: "Monthly", label: "חודשי" },
    { value: "Yearly", label: "שנתי" },
  ];

  const userOptions = users?.map((user) => ({
    value: user._id,
    label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {user?.profileImage ? (
          <Image
            src={user.profileImage}
            alt={`${user.firstName} ${user.lastName}`}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Image
            src="/default-profile.png" // תמונת ברירת מחדל
            alt="Anonymous Profile"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        )}
        <span>{`${user.firstName} ${user.lastName}`}</span>
      </div>
    ),
  }));

  const priorityOptions = [
    { value: 'High', label: 'גבוהה' },
    { value: 'Medium', label: 'בינונית' },
    { value: 'Low', label: 'נמוכה' },
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded">
      <h2 className="text-xl  mb-4"> משימה חדשה</h2>
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="title" className="block ">כותרת</label>
          <input
            id="title"
            name="title"
            type="text"
            value={task.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block ">תאור</label>
          <textarea
            id="description"
            name="description"
            value={task.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          ></textarea>
        </div>
        <div>
          <label htmlFor="dueDate" className="block ">תאריך </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={task.dueDate?.toISOString().split('T')[0] || ''}
            onChange={handleDateChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="frequency" className="block ">תדירות</label>
          <Select
            id="frequency"
            options={frequencyOptions} // שימוש באופציות המוגדרות
            onChange={(selectedOption) =>
              setTask((prev) => ({
                ...prev,
                frequency: (selectedOption?.value || "Once") as TaskModel["frequency"],
              }))
            }
            value={frequencyOptions.find((option) => option.value === task.frequency)} // ערך נבחר
            placeholder="בחר תדירות"
            styles={{
              control: (base) => ({
                ...base,
                borderColor: '#ccc',
                borderRadius: '8px',
                padding: '5px',
              }),
            }}
          />

        </div>

        <div>
          <label htmlFor="priority" className="block ">עדיפות</label>
          <Select
            id="priority"
            options={priorityOptions}
            onChange={handlePrioritySelect}
            value={priorityOptions.find((option) => option.value === task.priority)}
            placeholder="Select priority"
            styles={{
              control: (base) => ({
                ...base,
                borderColor: '#ccc',
                borderRadius: '8px',
                padding: '5px',
              }),
            }}
          />
        </div>
        <div>
          <label htmlFor="assignedUserIds" className="block ">משתמשים מוצמדים</label>
          <Select
            id="assignedUserIds"
            isMulti
            options={userOptions}
            onChange={handleUserSelect}
            placeholder="בחר או הוסף משתמשים"
            styles={{
              control: (base) => ({
                ...base,
                borderColor: '#ccc',
                borderRadius: '8px',
                padding: '5px',
              }),
            }}
          />
        </div>
        <div>
          <label htmlFor="projectId" className="block ">פרויקט מקושר</label>
          <Select
            id="projectId"
            options={projectOptions} // שימוש באפשרויות שנוצרו
            onChange={(selectedOption) => setTask((prev) => ({ ...prev, projectId: selectedOption?.value }))}
            value={projectOptions.find((option) => option.value === task.projectId)} // ערך נבחר
            placeholder="בחר פרויקט"
            styles={{
              control: (base) => ({
                ...base,
                borderColor: '#ccc',
                borderRadius: '8px',
                padding: '5px',
              }),
            }}
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>

  );
};

export default AddTask;