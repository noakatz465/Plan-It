import axios from 'axios';
import { ProjectModel } from '@/app/models/projectModel';

const API_PROJECTS_URL = '/api/projects';

export const updateProject = async (projectId: string, updatedProject: ProjectModel) => {
    try {
        const response = await axios.put(`${API_PROJECTS_URL}/put/${projectId}`, updatedProject);
        
        return response.data;
    } catch (error) {
        console.error('Error updating project:', error);
        throw new Error('Failed to update project');
    }
};
