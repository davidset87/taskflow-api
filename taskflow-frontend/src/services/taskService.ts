import axios from "axios";
import type { Task, CreateTaskDto, UpdateTaskDto } from "../types/task";

const API_BASE_URL = "https://taskflow-api-3qsm.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const taskService = {
  getAll: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>("/tasks");
    return response.data;
  },

  getById: async (id: number): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  create: async (dto: CreateTaskDto): Promise<Task> => {
    const response = await api.post<Task>("/tasks", dto);
    return response.data;
  },

  update: async (id: number, dto: UpdateTaskDto): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${id}`, dto);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};