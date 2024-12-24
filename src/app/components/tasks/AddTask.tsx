



// 'use client';
// import { addTask } from '@/app/services/taskService';
// import { useUserStore } from '@/app/stores/userStore';
// import React, { useEffect, useState } from 'react';
// import { TaskModel } from '@/app/models/taskModel';

// interface TaskDetails {
//   dueDate?: Date;
// }

// function AddTask(props: TaskDetails) {
//   const initialTask = new TaskModel('', 'Pending', '', undefined); // מופע ריק התחלתי של TaskModel
//   const [task, setTask] = useState<TaskModel>(initialTask);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const userFromStore = useUserStore((state) => state.user);
//   const addTaskToStore = useUserStore((state) => state.addTaskToStore);

//   useEffect(() => {
//     if (props.dueDate) {
//       setTask((prev) => ({ ...prev, dueDate: props.dueDate })); // עדכון התאריך ביוזסטייט אם הועבר בפרופס
//     }
//   }, [props.dueDate]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setTask((prev) => ({
//       ...prev,
//       [name]: name === 'assignedUserIds' ? value.split(',').map((id) => id.trim()) : value,
//     }));
//   };

//   const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setTask((prev) => ({ ...prev, dueDate: new Date(e.target.value) }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccessMessage('');

//     try {
//       // עדכון ID של היוצר במשימה
//       const updatedTask = { ...task, creator: userFromStore?._id || '' };
//       console.log(updatedTask);

//       // שליחת המשימה לשרת
//       const newTaskResponse = await addTask(updatedTask);

//       // הכנסת המשימה המלאה לחנות (כולל ה-ID של היוצר)
//       addTaskToStore({ ...updatedTask, _id: userFromStore?._id });

//       setSuccessMessage(`Task "${updatedTask.title}" added successfully!`);
//       setTask(initialTask); // איפוס המשימה
//     } catch (error) {
//       setError('Failed to add task. Please try again.');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-5 max-w-md mx-auto bg-white shadow-md rounded">
//       <h2 className="text-xl font-bold mb-4">Add New Task</h2>
//       {error && <p className="text-red-500">{error}</p>}
//       {successMessage && <p className="text-green-500">{successMessage}</p>}
//       <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
//         <div className="col-span-2">
//           <label htmlFor="title" className="block font-medium">Title</label>
//           <input
//             id="title"
//             name="title"
//             type="text"
//             value={task.title}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="description" className="block font-medium">Description</label>
//           <textarea
//             id="description"
//             name="description"
//             value={task.description}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded"
//           ></textarea>
//         </div>
//         <div>
//           <label htmlFor="dueDate" className="block font-medium">Due Date</label>
//           <input
//             id="dueDate"
//             name="dueDate"
//             type="date"
//             value={task.dueDate?.toISOString().split('T')[0] || ''}
//             onChange={handleDateChange}
//             className="w-full px-3 py-2 border rounded"
//           />
//         </div>
//         <div>
//           <label htmlFor="priority" className="block font-medium">Priority</label>
//           <select
//             id="priority"
//             name="priority"
//             value={task.priority}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded"
//           >
//             <option value="High">גבוהה</option>
//             <option value="Medium">בינונית</option>
//             <option value="Low">נמוכה</option>
//           </select>
//         </div>
//         <div>
//           <label htmlFor="assignedUserIds" className="block font-medium">Assigned Users</label>
//           <input
//             id="assignedUserIds"
//             name="assignedUserIds"
//             type="text"
//             value={task.assignedUserIds.join(',')}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded"
//           />
//         </div>
//         <div>
//           <label htmlFor="projectId" className="block font-medium">Project ID</label>
//           <input
//             id="projectId"
//             name="projectId"
//             type="text"
//             value={task.projectId || ''}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded"
//           />
//         </div>
//         <div className="col-span-2">
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//             disabled={loading}
//           >
//             {loading ? 'Adding...' : 'Add Task'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
  
// }

// export default AddTask;

'use client';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { addTask } from '@/app/services/taskService';
import { useUserStore } from '@/app/stores/userStore';
import { TaskModel } from '@/app/models/taskModel';

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
    setTask((prev) => ({
      ...prev,
      assignedUserIds: selectedOptions.map((option: any) => option.value),
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

  const userOptions = users?.map((user) => ({
    value: user._id,
    label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {user?.profileImage ? (
          <img
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
          <img
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
    <div className="p-5 max-w-md mx-auto bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Add New Task</h2>
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
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
        <div className="col-span-2">
          <label htmlFor="priority" className="block font-medium">עדיפות</label>
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
        <div className="col-span-2">
          <label htmlFor="assignedUserIds" className="block font-medium">Assigned Users</label>
          <Select
            id="assignedUserIds"
            isMulti
            options={userOptions}
            onChange={handleUserSelect}
            placeholder="Select users"
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
        <div className="col-span-2">
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