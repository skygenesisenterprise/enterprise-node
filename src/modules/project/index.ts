import { ModuleInterface } from '../../types';
import { WasmRuntime } from '../../core/runtime';

export interface ProjectData {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  metadata?: any;
  settings?: any;
}

export class Project implements ModuleInterface {
  name = 'project';
  version = '0.1.0';
  private runtime: WasmRuntime;
  private currentProject: ProjectData | null = null;
  private projects: Map<string, ProjectData> = new Map();

  constructor(runtime: WasmRuntime) {
    this.runtime = runtime;
  }

  async init(): Promise<void> {
    console.log('Project Module initialized');
    await this.loadProjects();
  }

  async destroy(): Promise<void> {
    await this.saveProjects();
    this.currentProject = null;
    this.projects.clear();
    console.log('Project Module destroyed');
  }

  async create(name: string, options?: {
    description?: string;
    template?: string;
    settings?: any;
  }): Promise<ProjectData> {
    try {
      const project: ProjectData = {
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
    } catch (error) {
      console.error('Project create failed:', error);
      throw new Error(`Failed to create project: ${name}`);
    }
  }

  async open(projectIdOrName: string): Promise<{
    project: ProjectData;
    opened: boolean;
  }> {
    try {
      let project: ProjectData | undefined;

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
    } catch (error) {
      console.error('Project open failed:', error);
      throw new Error(`Failed to open project: ${projectIdOrName}`);
    }
  }

  async save(projectId?: string): Promise<{
    saved: boolean;
    project?: ProjectData;
  }> {
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
    } catch (error) {
      console.error('Project save failed:', error);
      throw new Error('Failed to save project');
    }
  }

  async delete(projectId: string): Promise<{
    deleted: boolean;
  }> {
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
    } catch (error) {
      console.error('Project delete failed:', error);
      throw new Error(`Failed to delete project: ${projectId}`);
    }
  }

  async list(): Promise<{
    projects: ProjectData[];
  }> {
    return {
      projects: Array.from(this.projects.values()).sort((a, b) => b.updatedAt - a.updatedAt)
    };
  }

  getCurrentProject(): ProjectData | null {
    return this.currentProject;
  }

  async updateSettings(projectId: string, settings: any): Promise<{
    updated: boolean;
    project?: ProjectData;
  }> {
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

  private async loadProjects(): Promise<void> {
    try {
      const stored = localStorage.getItem('enterprise_projects');
      if (stored) {
        const projectsData = JSON.parse(stored);
        projectsData.forEach((p: ProjectData) => {
          this.projects.set(p.id, p);
        });
      }
    } catch (error) {
      console.warn('Failed to load projects from storage:', error);
    }
  }

  private async saveProjects(): Promise<void> {
    try {
      const projectsData = Array.from(this.projects.values());
      localStorage.setItem('enterprise_projects', JSON.stringify(projectsData));
    } catch (error) {
      console.warn('Failed to save projects to storage:', error);
    }
  }
}

export default Project;