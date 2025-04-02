import { Task } from "./task";

export interface List {
  id: string;
  title: string;
  order: number;
  tasks?: Task[];
}
