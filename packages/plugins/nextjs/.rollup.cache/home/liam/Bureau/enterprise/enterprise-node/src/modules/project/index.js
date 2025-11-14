export class Project {
    constructor(runtime) {
        this.name = 'project';
        this.version = '0.1.0';
        this.currentProject = null;
        this.projects = new Map();
        this.runtime = runtime;
    }
    async init() {
        console.log('Project Module initialized');
        await this.loadProjects();
    }
    async destroy() {
        await this.saveProjects();
        this.currentProject = null;
        this.projects.clear();
        console.log('Project Module destroyed');
    }
    async create(name, options) {
        try {
            const project = {
                id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name,
                description: options?.description,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                metadata: {
                    template: options?.template || 'default',
                    version: '0.1.0'
                },
                settings: options?.settings || {}
            };
            const result = await this.runtime.call('project_create', project);
            this.projects.set(project.id, project);
            return {
                ...project,
                ...result
            };
        }
        catch (error) {
            console.error('Project create failed:', error);
            throw new Error(`Failed to create project: ${name}`);
        }
    }
    async open(projectIdOrName) {
        try {
            let project;
            project = this.projects.get(projectIdOrName);
            if (!project) {
                for (const p of this.projects.values()) {
                    if (p.name === projectIdOrName) {
                        project = p;
                        break;
                    }
                }
            }
            if (!project) {
                throw new Error(`Project not found: ${projectIdOrName}`);
            }
            const result = await this.runtime.call('project_open', project.id);
            this.currentProject = project;
            return {
                project,
                opened: result.opened !== false
            };
        }
        catch (error) {
            console.error('Project open failed:', error);
            throw new Error(`Failed to open project: ${projectIdOrName}`);
        }
    }
    async save(projectId) {
        try {
            const project = projectId ?
                this.projects.get(projectId) :
                this.currentProject;
            if (!project) {
                throw new Error('No project to save');
            }
            project.updatedAt = Date.now();
            const result = await this.runtime.call('project_save', project);
            this.projects.set(project.id, project);
            return {
                saved: result.saved !== false,
                project
            };
        }
        catch (error) {
            console.error('Project save failed:', error);
            throw new Error('Failed to save project');
        }
    }
    async delete(projectId) {
        try {
            const project = this.projects.get(projectId);
            if (!project) {
                throw new Error(`Project not found: ${projectId}`);
            }
            const result = await this.runtime.call('project_delete', projectId);
            this.projects.delete(projectId);
            if (this.currentProject?.id === projectId) {
                this.currentProject = null;
            }
            return { deleted: result.deleted !== false };
        }
        catch (error) {
            console.error('Project delete failed:', error);
            throw new Error(`Failed to delete project: ${projectId}`);
        }
    }
    async list() {
        return {
            projects: Array.from(this.projects.values()).sort((a, b) => b.updatedAt - a.updatedAt)
        };
    }
    getCurrentProject() {
        return this.currentProject;
    }
    async updateSettings(projectId, settings) {
        const project = this.projects.get(projectId);
        if (!project) {
            throw new Error(`Project not found: ${projectId}`);
        }
        project.settings = { ...project.settings, ...settings };
        project.updatedAt = Date.now();
        this.projects.set(projectId, project);
        return {
            updated: true,
            project
        };
    }
    async loadProjects() {
        try {
            const stored = localStorage.getItem('enterprise_projects');
            if (stored) {
                const projectsData = JSON.parse(stored);
                projectsData.forEach((p) => {
                    this.projects.set(p.id, p);
                });
            }
        }
        catch (error) {
            console.warn('Failed to load projects from storage:', error);
        }
    }
    async saveProjects() {
        try {
            const projectsData = Array.from(this.projects.values());
            localStorage.setItem('enterprise_projects', JSON.stringify(projectsData));
        }
        catch (error) {
            console.warn('Failed to save projects to storage:', error);
        }
    }
}
export default Project;
//# sourceMappingURL=index.js.map