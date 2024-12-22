'use client'
import { addTask } from '@/app/services/taskService';
import React, { useEffect, useState } from 'react'

interface TaskDetails {
  dueDate?: Date
}

function AddTask(props: TaskDetails) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date);
  const [assignedUsers, setAssignedUsers] = useState('');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const userId= "674ed2c952ef7d7732ebb3e7";

  useEffect(() => {
    if (props.dueDate)
      setDueDate(props.dueDate)    
  }, [props.dueDate])

  const assignedUsersArray = assignedUsers
      ? assignedUsers.split(',').map((id) => id.trim())
      : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const newTask = await addTask({ title, description, dueDate, creator: userId, assignedUsers: assignedUsersArray, projectId })
      setSuccessMessage(`Task "${newTask.title}" added successfully!`);
      setTitle('');
      setDescription('');
      setDueDate(new Date);
      setAssignedUsers('');
      setProjectId('');
    } catch (error) {
      setError('Failed to add task. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
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
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block font-medium">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          ></textarea>
        </div>
        <div>
          <label htmlFor="dueDate" className="block font-medium">Due Date</label>
          {props.dueDate? <label>{props.dueDate ? props.dueDate.toLocaleDateString('he-IL') : ''}</label>
          :<input
            id="dueDate"
            type="date"
            onChange={(e) => setDueDate(new Date(e.target.value))}
            className="w-full px-3 py-2 border rounded"
          /> }
        </div>
        <div>
          <label htmlFor="assignedUsers" className="block font-medium">Assigned Users (comma-separated IDs)</label>
          <input
            id="assignedUsers"
            type="text"
            value={assignedUsers}
            onChange={(e) => setAssignedUsers(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="projectId" className="block font-medium">Project ID</label>
          <input
            id="projectId"
            type="text"
            value={projectId?? ""}
            onChange={(e) => setProjectId(e.target.value)}
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
  )
}

export default AddTask;
