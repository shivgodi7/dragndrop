// src/types.ts
export interface Task {
  id: string;
  title: string;
  dueData: string;
  subTasks: SubTask[];
}

export interface SubTask {
  id: string;
  title: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}
