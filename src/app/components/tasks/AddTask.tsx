'use client';
import React, { useEffect, useState } from 'react';
import Select, { MultiValue } from 'react-select';
import { addTask } from '@/app/services/taskService';
import { useUserStore } from '@/app/stores/userStore';
import { TaskModel } from '@/app/models/taskModel';
import Image from "next/image";
import CreatableSelect from 'react-select/creatable';
import { getUserByEmail, shareTask } from '@/app/services/userService';
import { useNotificationsStore } from "@/app/stores/notificationsStore";
import { UserModel } from '@/app/models/userModel';
import { ProjectModel } from '@/app/models/projectModel';
import { useMessageStore } from '@/app/stores/messageStore';

interface TaskDetails {
  dueDate?: Date;
  projectId?: string;
  assignedUsers?: string[];
  onClose: () => void; // Prop לסגירת המודל
}
interface PriorityOption {
  value: string;
  label: string;
}

const AddTask: React.FC<TaskDetails> = (props) => {
  const initialTask = new TaskModel('', 'Pending', '', undefined);
  const [task, setTask] = useState<TaskModel>(initialTask);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const userFromStore = useUserStore((state) => state.user);
  const addTaskToStore = useUserStore((state) => state.addTaskToStore);
  const projects = useUserStore((state) => state.projects);
  const { createNotificationsPerUsers } = useNotificationsStore();
  const setMessage = useMessageStore((state) => state.setMessage);

  useEffect(() => {
    if (props.dueDate) {
      setTask((prev) => ({ ...prev, dueDate: props.dueDate }));
    }
  }, [props.dueDate]);

  useEffect(() => {
    if (props.projectId) {
      setTask((prev) => ({ ...prev, projectId: props.projectId }));
    }
  }, [props.projectId]);

  useEffect(() => {
    if (props.assignedUsers) {
      setTask((prev) => ({
        ...prev,
        assignedUsers: Array.from(
          new Set([...(prev.assignedUsers || []), ...(props.assignedUsers || [])])
        ),
      }));
    }
  }, [props.assignedUsers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask((prev) => ({ ...prev, dueDate: new Date(e.target.value) }));
  };

  const handleUserSelect = (
    selectedOptions: MultiValue<{ value: string; label: React.ReactNode }>,
  ) => {
    const newUsers = selectedOptions.map((option) => ({
      value: option.value,
      label: option.label,
    }));

    setTask((prev) => ({
      ...prev,
      assignedUsers: newUsers.map((user) => user.value),
    }));
  };

  const handlePrioritySelect = (selectedOption: PriorityOption | null) => {
    if (selectedOption) {
      setTask((prev) => ({
        ...prev,
        priority: selectedOption.value as TaskModel["priority"],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const updatedTask = { ...task, creator: userFromStore?._id || '' };
      // יצירת רשימת IDs לפי אימיילים
      const userIds = await Promise.all(
        task.assignedUsers.map(async (email) => {
          try {
            const user = await getUserByEmail(email);
            return user?.toString(); // המרת ה-ID למחרוזת
          } catch {
            throw new Error(`Failed to find user with email ${email}`);
          }
        })
      );

      updatedTask.assignedUsers = userIds.filter((id) => id !== undefined);
      if (props.projectId) {
        updatedTask.projectId = props.projectId;
      }
      if (props.assignedUsers)
        updatedTask.assignedUsers = props.assignedUsers;

      // שלב הוספת המשימה
      const newTaskResponse = await addTask(updatedTask);
      setMessage("המשימה נוספה בהצלחה!", "success"); // הודעת הצלחה

      if (updatedTask.assignedUsers && updatedTask.assignedUsers.length > 0) {
        // קוד לביצוע במקרה שיש משתמשים משוייכים
        // ביצוע שיתוף משימה עבור כל המשתמשים
        const shareResults = await Promise.all(
          updatedTask.assignedUsers.map(async (userId) => {
            try {
              await shareTask({
                taskId: newTaskResponse._id,
                targetUserId: userId,
                sharedByUserId: userFromStore?._id || '',
              });
              return true;
            } catch (error) {
              console.error(`Failed to share task with user ${userId}:`, error);
              setMessage("אירעה שגיאה בהוספת המשימה. נסו שוב מאוחר יותר.", "error");

              return false;
            }
          })
        );

        // בדיקה אם כל השיתופים הצליחו
        const allSharesSucceeded = shareResults.every((result) => result);
        if (allSharesSucceeded && userFromStore?.notificationsEnabled) {
          // קריאה לפונקציה לשליחת התראות אם כל השיתופים הצליחו
          try {
            await createNotificationsPerUsers(
              "TaskAssigned",
              newTaskResponse,
              updatedTask.assignedUsers
            );
          } catch (error) {
            console.error('Failed to send notifications:', error);
          }
        } else {
          console.warn('Not all shares succeeded. Notifications will not be sent.');
        }
      }

      addTaskToStore({ ...updatedTask, _id: userFromStore?._id });
      setSuccessMessage(`Task "${updatedTask.title}" added successfully!`);
      setTask(initialTask);


    } catch (error) {
      setError('Failed to add task. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
      if (props.onClose) {
        props.onClose();
      }
    }
  };

  const projectOptions = projects?.map((project: ProjectModel) => ({
    value: project._id,
    label: project.name,
  }));

  const frequencyOptions = [
    { value: "Once", label: "חד פעמי" },
    { value: "Daily", label: "יומי" },
    { value: "Weekly", label: "שבועי" },
    { value: "Monthly", label: "חודשי" },
    { value: "Yearly", label: "שנתי" },
  ];

  const userOptions = userFromStore?.sharedWith?.map((user: UserModel) => ({
    value: user.email,
    label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {user?.profileImage ? (
          <Image
            src={user.profileImage}
            alt={`${user.firstName} ${user.lastName}`}
            width={32}
            height={32}
            style={{
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Image
            src="/default-profile.png"
            alt="Anonymous Profile"
            width={32}
            height={32}
            style={{
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
        {props.dueDate? '':<div>
          <label htmlFor="dueDate" className="block ">תאריך </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={task.dueDate?.toISOString().split('T')[0] || ''}
            onChange={handleDateChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>}
        <div>
          <label htmlFor="frequency" className="block ">תדירות</label>
          <Select
            id="frequency"
            options={frequencyOptions}
            onChange={(selectedOption) =>
              setTask((prev) => ({
                ...prev,
                frequency: (selectedOption?.value || "Once") as TaskModel["frequency"],
              }))
            }
            value={frequencyOptions.find((option) => option.value === task.frequency)}
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
        {props.assignedUsers ? '' : <div>
          <label htmlFor="assignedUsers" className="block font-medium">משתמשים מוצמדים</label>
          <CreatableSelect
            id="assignedUsers"
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
        </div>}
        {props.projectId ? ' ' : <div>
          <label htmlFor="projectId" className="block ">פרויקט מקושר</label>
          <Select
            id="projectId"
            options={projectOptions} // שימוש באפשרויות שנוצרו
            onChange={(selectedOption) => setTask((prev) => ({ ...prev, projectId: selectedOption?.value }))}
            value={projectOptions.find((option: { value: string | undefined; }) => option.value === task.projectId)} // ערך נבחר
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
        }

        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loading}>
            {loading ? 'מוסיף...' : 'הוספת משימה '}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;
