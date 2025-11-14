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
export declare class Project implements ModuleInterface {
    name: string;
    version: string;
    private runtime;
    private currentProject;
    private projects;
    constructor(runtime: WasmRuntime);
    init(): Promise<void>;
    destroy(): Promise<void>;
    create(name: string, options?: {
        description?: string;
        template?: string;
        settings?: any;
    }): Promise<ProjectData>;
    open(projectIdOrName: string): Promise<{
        project: ProjectData;
        opened: boolean;
    }>;
    save(projectId?: string): Promise<{
        saved: boolean;
        project?: ProjectData;
    }>;
    delete(projectId: string): Promise<{
        deleted: boolean;
    }>;
    list(): Promise<{
        projects: ProjectData[];
    }>;
    getCurrentProject(): ProjectData | null;
    updateSettings(projectId: string, settings: any): Promise<{
        updated: boolean;
        project?: ProjectData;
    }>;
    private loadProjects;
    private saveProjects;
}
export default Project;
//# sourceMappingURL=index.d.ts.map