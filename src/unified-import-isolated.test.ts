import { describe, it, expect } from 'vitest';

// Import directly from source files to avoid hooks with React dependencies
import {
  EnterpriseSDK,
  createEnterprise,
  Ai,
  Storage,
  UIManager,
  AuthManager,
  ProjectManager,
  SDK,
} from './index';

// Import types directly
import type {
  EnterpriseConfig,
  AIGenerateOptions,
  StorageSaveOptions,
  UIComponent,
  Theme,
  AuthConfig,
  User,
  Project,
  Task,
  SDKMetaInfo,
} from './index';

describe('Unified Import System', () => {
  describe('Exported Classes', () => {
    it('should export EnterpriseSDK class', () => {
      expect(EnterpriseSDK).toBeDefined();
      expect(typeof EnterpriseSDK).toBe('function');
    });

    it('should export all module classes', () => {
      expect(Ai).toBeDefined();
      expect(Storage).toBeDefined();
      expect(UIManager).toBeDefined();
      expect(AuthManager).toBeDefined();
      expect(ProjectManager).toBeDefined();
      expect(SDK).toBeDefined();
    });

    it('should create instances of exported classes', () => {
      const ai = new Ai();
      expect(ai).toBeInstanceOf(Ai);

      const storage = new Storage();
      expect(storage).toBeInstanceOf(Storage);

      const theme: Theme = {
        colors: { primary: '#000' },
        typography: { fontFamily: 'Arial' },
        spacing: { small: '8px', medium: '16px', large: '24px' },
      };
      const ui = new UIManager(theme);
      expect(ui).toBeInstanceOf(UIManager);

      const authConfig: AuthConfig = { provider: 'local' };
      const auth = new AuthManager(authConfig);
      expect(auth).toBeInstanceOf(AuthManager);

      const project = new ProjectManager();
      expect(project).toBeInstanceOf(ProjectManager);

      const sdk = new SDK();
      expect(sdk).toBeInstanceOf(SDK);
    });
  });

  describe('Factory Function', () => {
    it('should export createEnterprise function', () => {
      expect(createEnterprise).toBeDefined();
      expect(typeof createEnterprise).toBe('function');
    });

    it('should create EnterpriseSDK instance using factory function', async () => {
      const config: EnterpriseConfig = {
        modules: {
          ai: true,
          storage: true,
          ui: true,
          auth: true,
          project: true,
          sdk: true,
        },
        debug: true,
      };

      const enterprise = await createEnterprise(config);
      expect(enterprise).toBeInstanceOf(EnterpriseSDK);
      expect(enterprise.getConfig()).toEqual(config);
    });

    it('should handle factory function with minimal config', async () => {
      const config: EnterpriseConfig = {
        modules: { ai: true },
      };

      const enterprise = await createEnterprise(config);
      expect(enterprise).toBeInstanceOf(EnterpriseSDK);
    });
  });

  describe('TypeScript Types', () => {
    it('should export all required types', () => {
      // These should be available as types
      const config: EnterpriseConfig = { modules: { ai: true } };
      const aiOptions: AIGenerateOptions = { maxTokens: 100 };
      const storageOptions: StorageSaveOptions = { path: '/test' };
      const component: UIComponent = { id: 'test', type: 'button', props: {} };
      const theme: Theme = {
        colors: { primary: '#000' },
        typography: { fontFamily: 'Arial' },
        spacing: { small: '8px', medium: '16px', large: '24px' },
      };
      const authConfig: AuthConfig = { provider: 'local' };
      const user: User = { id: '1', email: 'test@example.com', name: 'Test', roles: [] };
      const project: Project = {
        id: '1',
        name: 'Test',
        description: 'Test project',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const task: Task = {
        id: '1',
        projectId: '1',
        title: 'Test',
        description: 'Test task',
        status: 'todo',
      };
      const metaInfo: SDKMetaInfo = {
        version: '1.0.0',
        name: 'test',
        description: 'Test SDK',
        isSelfReferencing: false,
        recursionDepth: 0,
      };

      expect(config).toBeDefined();
      expect(aiOptions).toBeDefined();
      expect(storageOptions).toBeDefined();
      expect(component).toBeDefined();
      expect(theme).toBeDefined();
      expect(authConfig).toBeDefined();
      expect(user).toBeDefined();
      expect(project).toBeDefined();
      expect(task).toBeDefined();
      expect(metaInfo).toBeDefined();
    });
  });

  describe('Individual Module Usage', () => {
    it('should use AI module independently', async () => {
      const ai = new Ai();
      await ai.init();

      const options: AIGenerateOptions = { maxTokens: 100 };
      const result = await ai.generate('Test prompt', options);

      expect(result).toBeDefined();
      expect(result.text).toBeDefined();
    });

    it('should use Storage module independently', async () => {
      const storage = new Storage();
      await storage.init();

      const data = JSON.stringify({ test: 'data' });
      const options: StorageSaveOptions = { path: '/test.json' };
      const result = await storage.save(data, options);

      expect(result).toBeDefined();
    });

    it('should use UI module independently', () => {
      const theme: Theme = {
        colors: { primary: '#3b82f6', secondary: '#64748b' },
        typography: { fontFamily: 'Inter', fontSize: '16px' },
        spacing: { small: '8px', medium: '16px', large: '24px' },
      };

      const ui = new UIManager(theme);
      const component: UIComponent = {
        id: 'test-btn',
        type: 'button',
        props: { text: 'Click me' },
      };

      const createdComponent = ui.createComponent(component);
      expect(createdComponent).toBeDefined();
      expect(createdComponent.id).toBe('test-btn');
    });

    it('should use Auth module independently', async () => {
      const authConfig: AuthConfig = {
        provider: 'local',
        credentials: { secretKey: 'test-key' },
      };

      const auth = new AuthManager(authConfig);
      const user: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        roles: ['user'],
      };

      const isAuthorized = await auth.authorize(user, 'resource', 'read');
      expect(typeof isAuthorized).toBe('boolean');
    });

    it('should use Project module independently', () => {
      const projectManager = new ProjectManager();
      const project = projectManager.createProject({
        name: 'Test Project',
        description: 'A test project',
        status: 'active',
      });

      expect(project).toBeDefined();
      expect(project.name).toBe('Test Project');
      expect(project.status).toBe('active');

      const task = projectManager.createTask(project.id, {
        title: 'Test Task',
        description: 'A test task',
        status: 'todo',
      });

      expect(task).not.toBeNull();
      if (task) {
        expect(task.title).toBe('Test Task');
      }
    });

    it('should use SDK module independently', async () => {
      const sdk = new SDK({
        enableRecursion: true,
        maxRecursionDepth: 2,
        trackMetadata: true,
      });

      await sdk.init();
      const metaInfo = sdk.getMetaInfo();
      expect(metaInfo).toBeDefined();

      const stats = sdk.getHierarchyStats();
      expect(stats).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid configuration gracefully', async () => {
      const invalidConfig = {} as EnterpriseConfig;

      await expect(createEnterprise(invalidConfig)).rejects.toThrow();
    });

    it('should handle module initialization errors', async () => {
      const config: EnterpriseConfig = {
        modules: { ai: true },
        runtime: { wasmPath: '/invalid/path' },
      };

      const enterprise = new EnterpriseSDK(config);
      // Should not throw during initialization, but handle errors gracefully
      await expect(enterprise.initialize()).resolves.toBeDefined();
    });
  });
});
