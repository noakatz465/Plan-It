import axios from 'axios';
import { ProjectModel } from '@/app/models/projectModel';

const API_PROJECTS_URL = '/api/projects';

//עדכון פרויקט קיים
export const updateProject = async (projectId: string, updatedProject: ProjectModel) => {
    try {
        const response = await axios.put(`${API_PROJECTS_URL}/put/${projectId}`, updatedProject);       
        return response.data;
    } catch (error) {
        console.error('Error updating project:', error);
        throw new Error('Failed to update project');
    }
};

//הוספת פרויקט
export const createProject = async (projectData: {
    name: string; description?: string; managerID: string; LinkedTasks?: string[]; members: string[]; lastModified?: Date; 
}) => {
    try {
        const response = await axios.post(`${API_PROJECTS_URL}/post`, projectData);
        if (response.status === 200) {
            console.log("Project added successfully:", response.data);
            return response.data.projectId;
        } else {
            console.warn("Unexpected response status:", response.status);
            return null;
        }
    } catch (error) {
        console.error("Error adding project:", error);
    }
}

//מחיקת פרויקט
export const deleteProject = async (projectId: string) => {
    try {
        const response = await axios.delete(`${API_PROJECTS_URL}/delete/${projectId}`);

        if (response.status === 200) {
            console.log("Project deleted successfully:", response.data);
            return response.data;
        } else {
            console.warn("Unexpected response status:", response.status);
            return null;
        }
    } catch (error) {
        console.error("Error deleting project:", error);
        throw error;
    }
}
