import { describe, it, expect } from 'vitest';
import { ProjectManager } from './index';

describe('Project Module', () => {
  it('should create a ProjectManager instance', () => {
    const project = new ProjectManager();
    expect(project).toBeInstanceOf(ProjectManager);
  });

  it('should create project', () => {
    const project = new ProjectManager();
    const result = project.createProject({
      name: 'Test Project',
      description: 'Test Description',
      status: 'active',
    });
    expect(result.id).toBeDefined();
    expect(result.name).toBe('Test Project');
    expect(result.status).toBe('active');
  });

  it('should get project by id', () => {
    const project = new ProjectManager();
    const created = project.createProject({
      name: 'Test Project',
      description: 'Test Description',
      status: 'active',
    });
    const retrieved = project.getProject(created.id);
    expect(retrieved).toEqual(created);
  });

  it('should create task', () => {
    const project = new ProjectManager();
    const createdProject = project.createProject({
      name: 'Test Project',
      description: 'Test Description',
      status: 'active',
    });
    const task = project.createTask(createdProject.id, {
      title: 'Test Task',
      description: 'Test Task Description',
      status: 'todo',
    });
    expect(task).toBeDefined();
    expect(task?.projectId).toBe(createdProject.id);
    expect(task?.title).toBe('Test Task');
  });

  it('should get project tasks', () => {
    const project = new ProjectManager();
    const createdProject = project.createProject({
      name: 'Test Project',
      description: 'Test Description',
      status: 'active',
    });
    project.createTask(createdProject.id, {
      title: 'Test Task 1',
      description: 'Test Task Description',
      status: 'todo',
    });
    project.createTask(createdProject.id, {
      title: 'Test Task 2',
      description: 'Test Task Description',
      status: 'todo',
    });
    const tasks = project.getProjectTasks(createdProject.id);
    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks.length).toBe(2);
  });
});
