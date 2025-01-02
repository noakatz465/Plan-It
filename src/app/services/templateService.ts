import axios from "axios";

const API_TEMPLATE_URL = '/api/templates';

export const getAllTemplates = async () => {
    try {
        const response = await axios.get(`${API_TEMPLATE_URL}/get`);
        if (response.status === 200) {
            const data = response.data;
            return data;
        }
    } catch (error) {
        console.error("Failed to fetch templates:", error);
    }
}
