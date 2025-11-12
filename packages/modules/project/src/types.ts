export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  assignee?: string;
  dueDate?: Date;
}

export interface ProjectFilter {
  status?: Project['status'];
  search?: string;
}

export interface TaskFilter {
  status?: Task['status'];
  assignee?: string;
}