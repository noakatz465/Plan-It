// 'use client'
// import { addTask } from '@/app/services/taskService';
// import { useUserStore } from '@/app/stores/userStore';
// import React, { useEffect, useState } from 'react'

// interface TaskDetails {
//   dueDate?: Date
// }

// function AddTask(props: TaskDetails) {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [dueDate, setDueDate] = useState(new Date);
//   const [assignedUsers, setAssignedUsers] = useState('');
//   const [projectId, setProjectId] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const userFromStore = useUserStore((state) => state.user);
//   const usersFromStore = useUserStore((state) => state.users);
//   const [user, setUser] = useState(userFromStore);
//   const [userList, setUserList] = useState(userFromStore);
//   const addTaskToStore = useUserStore((state) => state.addTaskToStore);


//   useEffect(() => {
//     if (props.dueDate)
//       setDueDate(props.dueDate)
//   }, [props.dueDate])

//   const assignedUsersArray = assignedUsers
//     ? assignedUsers.split(',').map((id) => id.trim())
//     : [];

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccessMessage('');

//     try {
//       console.log();

//       const newTaskResponse = await addTask({ title, description, dueDate, creator: user?._id ?? '', assignedUsers: assignedUsersArray ?? [], projectId: projectId ?? undefined })
//       setSuccessMessage(`Task "${newTaskResponse.title}" added successfully!`);
//       setTitle('');
//       setDescription('');
//       setDueDate(new Date);
//       setAssignedUsers('');
//       setProjectId('');
//       console.log("מוסיפה משימה לחנות");
//       const newTask = newTaskResponse.task ;
//       console.log(newTask);

//       addTaskToStore(newTask); // הוספת המשימה לחנות


//     } catch (error) {
//       setError('Failed to add task. Please try again.');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   }
//   return (
//     <div className="p-5 max-w-md mx-auto bg-white shadow-md rounded">
//       <h2 className="text-xl font-bold mb-4">Add New Task</h2>
//       {error && <p className="text-red-500">{error}</p>}
//       {successMessage && <p className="text-green-500">{successMessage}</p>}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label htmlFor="title" className="block font-medium">Title</label>
//           <input
//             id="title"
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full px-3 py-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="description" className="block font-medium">Description</label>
//           <textarea
//             id="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full px-3 py-2 border rounded"
//           ></textarea>
//         </div>
//         <div>
//           <label htmlFor="dueDate" className="block font-medium">Due Date</label>
//           {props.dueDate ? <label>{props.dueDate ? props.dueDate.toLocaleDateString('he-IL') : ''}</label>
//             : <input
//               id="dueDate"
//               type="date"
//               onChange={(e) => setDueDate(new Date(e.target.value))}
//               className="w-full px-3 py-2 border rounded"
//             />}
//         </div>
//         <div>
//           <label htmlFor="assignedUsers" className="block font-medium">Assigned Users (comma-separated IDs)</label>
//           <input
//             id="assignedUsers"
//             type="text"
//             value={assignedUsers}
//             onChange={(e) => setAssignedUsers(e.target.value)}
//             className="w-full px-3 py-2 border rounded"
//           />
//         </div>
//         <div>
//           <label htmlFor="projectId" className="block font-medium">Project ID</label>
//           <input
//             id="projectId"
//             type="text"
//             value={projectId ?? ""}
//             onChange={(e) => setProjectId(e.target.value)}
//             className="w-full px-3 py-2 border rounded"
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           disabled={loading}
//         >
//           {loading ? 'Adding...' : 'Add Task'}
//         </button>
//       </form>
//     </div>
//   )
// }

// export default AddTask;








'use client';
import { addTask } from '@/app/services/taskService';
import { useUserStore } from '@/app/stores/userStore';
import React, { useEffect, useState } from 'react';
import { TaskModel } from '@/app/models/taskModel';

interface TaskDetails {
  dueDate?: Date;
}

function AddTask(props: TaskDetails) {
  const initialTask = new TaskModel('', 'Pending', '', undefined); // מופע ריק התחלתי של TaskModel
  const [task, setTask] = useState<TaskModel>(initialTask);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const userFromStore = useUserStore((state) => state.user);
  const addTaskToStore = useUserStore((state) => state.addTaskToStore);

  useEffect(() => {
    if (props.dueDate) {
      setTask((prev) => ({ ...prev, dueDate: props.dueDate })); // עדכון התאריך ביוזסטייט אם הועבר בפרופס
    }

  }, [props.dueDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: name === 'assignedUserIds' ? value.split(',').map((id) => id.trim()) : value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask((prev) => ({ ...prev, dueDate: new Date(e.target.value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // עדכון ID של היוצר במשימה
      const updatedTask = { ...task, creator: userFromStore?._id || '' };
    console.log(updatedTask);
    
      // שליחת המשימה לשרת
      const newTaskResponse = await addTask(updatedTask);
    
      // הכנסת המשימה המלאה לחנות (כולל ה-ID של היוצר)
      addTaskToStore({ ...updatedTask, _id: userFromStore?._id });
    
      setSuccessMessage(`Task "${updatedTask.title}" added successfully!`);
      setTask(initialTask); // איפוס המשימה
    } catch (error) {
      setError('Failed to add task. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div className="p-5 max-w-md mx-auto bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Add New Task</h2>
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block font-medium">Title</label>
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
          <label htmlFor="description" className="block font-medium">Description</label>
          <textarea
            id="description"
            name="description"
            value={task.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          ></textarea>
        </div>
        <div>
          <label htmlFor="dueDate" className="block font-medium">Due Date</label>
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
          <label htmlFor="assignedUserIds" className="block font-medium">Assigned Users (comma-separated IDs)</label>
          <input
            id="assignedUserIds"
            name="assignedUserIds"
            type="text"
            value={task.assignedUserIds.join(',')}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="projectId" className="block font-medium">Project ID</label>
          <input
            id="projectId"
            name="projectId"
            type="text"
            value={task.projectId || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
}

export default AddTask;
