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

export class ProjectManager {
  private projects: Map<string, Project> = new Map();
  private tasks: Map<string, Task[]> = new Map();

  createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const project: Project = {
      id: this.generateId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.projects.set(project.id, project);
    this.tasks.set(project.id, []);
    return project;
  }

  getProject(id: string): Project | undefined {
    return this.projects.get(id);
  }

  createTask(projectId: string, data: Omit<Task, 'id' | 'projectId'>): Task | null {
    if (!this.projects.has(projectId)) return null;
    
    const task: Task = {
      id: this.generateId(),
      projectId,
      ...data
    };
    
    const tasks = this.tasks.get(projectId) || [];
    tasks.push(task);
    this.tasks.set(projectId, tasks);
    return task;
  }

  getProjectTasks(projectId: string): Task[] {
    return this.tasks.get(projectId) || [];
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export * from './types';