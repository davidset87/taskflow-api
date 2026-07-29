export interface Task {
  id: number;
  title: string;
  description: string;
  status: "Todo" | "InProgress" | "Done";
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateTaskDto {
  title: string;
  description: string;
}

export interface UpdateTaskDto {
  title: string;
  description: string;
  status: "Todo" | "InProgress" | "Done";
}