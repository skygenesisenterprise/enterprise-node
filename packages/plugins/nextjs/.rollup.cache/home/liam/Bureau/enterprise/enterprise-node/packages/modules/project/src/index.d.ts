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
export declare class ProjectManager {
    private projects;
    private tasks;
    createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project;
    getProject(id: string): Project | undefined;
    createTask(projectId: string, data: Omit<Task, 'id' | 'projectId'>): Task | null;
    getProjectTasks(projectId: string): Task[];
    private generateId;
}
export * from './types';
//# sourceMappingURL=index.d.ts.map