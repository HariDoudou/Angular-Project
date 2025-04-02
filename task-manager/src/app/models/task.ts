export interface Task {
  id?: string;
  title: string;
  description?: string;
  listId: string;
  order: number;
  createdAt: number;
  updatedAt?: number;
  dueDate?: number;
  completed?: boolean;
  labels?: string[];
  userId?: string;
}
