import axios from "axios";
import { TemplateModel } from "../models/templateModel";

const API_TEMPLATE_URL = '/api/templates';

export const getAllTemplates = async () => {
    try {
      const response = await axios.get(`${API_TEMPLATE_URL}/get`);
      if (response.status === 200) {
        const data = response.data;
        return Array.isArray(data) ? data.map((item) => new TemplateModel(item.name, item.description, item._id)) : [];
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error);
      return [];
    }
  };
  
