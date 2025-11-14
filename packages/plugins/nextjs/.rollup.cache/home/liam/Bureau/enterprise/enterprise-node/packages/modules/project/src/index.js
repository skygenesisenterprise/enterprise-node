export class ProjectManager {
    constructor() {
        this.projects = new Map();
        this.tasks = new Map();
    }
    createProject(data) {
        const project = {
            id: this.generateId(),
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.projects.set(project.id, project);
        this.tasks.set(project.id, []);
        return project;
    }
    getProject(id) {
        return this.projects.get(id);
    }
    createTask(projectId, data) {
        if (!this.projects.has(projectId))
            return null;
        const task = {
            id: this.generateId(),
            projectId,
            ...data,
        };
        const tasks = this.tasks.get(projectId) || [];
        tasks.push(task);
        this.tasks.set(projectId, tasks);
        return task;
    }
    getProjectTasks(projectId) {
        return this.tasks.get(projectId) || [];
    }
    generateId() {
        return Math.random().toString(36).substring(2, 11);
    }
}
export * from './types';
//# sourceMappingURL=index.js.map