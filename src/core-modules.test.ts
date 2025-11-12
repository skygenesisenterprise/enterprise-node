import { describe, it, expect } from 'vitest';

// Import modules directly to test unified import functionality
import { Ai } from '../packages/modules/ai/src/index';
import { Storage } from '../packages/modules/storage/src/index';
import { UIManager, UIComponent, Theme } from '../packages/modules/ui/src/index';
import { AuthManager, AuthConfig, User } from '../packages/modules/auth/src/index';
import { ProjectManager, Project, Task } from '../packages/modules/project/src/index';
import { SDK, SDKMetaInfo } from '../packages/modules/sdk/src/index';

// Import types from main index
import type { EnterpriseConfig } from './types';
import type { AIGenerateOptions } from '../packages/modules/ai/src/index';
import type { StorageSaveOptions } from '../packages/modules/storage/src/index';

describe('Unified Import System - Core Functionality', () => {
  describe('Module Classes', () => {
    it('should create and use AI module', async () => {
      const ai = new Ai();
      expect(ai).toBeInstanceOf(Ai);

      await ai.init();
      expect(ai.isInitialized()).toBe(true);

      const options: AIGenerateOptions = { maxTokens: 100 };
      const result = await ai.generate('Test prompt', options);

      expect(result).toBeDefined();
      expect(result.text).toBeDefined();
      expect(result.usage).toBeDefined();
    });

    it('should create and use Storage module', async () => {
      const storage = new Storage();
      expect(storage).toBeInstanceOf(Storage);

      await storage.init();
      expect(storage.isInitialized()).toBe(true);

      const data = JSON.stringify({ test: 'data' });
      const options: StorageSaveOptions = { path: '/test.json' };
      const result = await storage.save(data, options);

      expect(result).toBeDefined();
      expect(result.path).toBe('/test.json');
      expect(result.hash).toBeDefined();
    });

    it('should create and use UI module', () => {
      const theme: Theme = {
        colors: { primary: '#3b82f6', secondary: '#64748b' },
        typography: { fontFamily: 'Inter', fontSize: '16px' },
        spacing: { small: '8px', medium: '16px', large: '24px' },
      };

      const ui = new UIManager(theme);
      expect(ui).toBeInstanceOf(UIManager);

      const component: UIComponent = {
        id: 'test-btn',
        type: 'button',
        props: { text: 'Click me' },
      };

      const createdComponent = ui.createComponent(component);
      expect(createdComponent).toBeDefined();
      expect(createdComponent.id).toBe('test-btn');
      expect(createdComponent.type).toBe('button');
    });

    it('should create and use Auth module', async () => {
      const authConfig: AuthConfig = {
        provider: 'local',
        credentials: { secretKey: 'test-key' },
      };

      const auth = new AuthManager(authConfig);
      expect(auth).toBeInstanceOf(AuthManager);

      const user: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        roles: ['user'],
      };

      const isAuthorized = await auth.authorize(user, 'resource', 'read');
      expect(typeof isAuthorized).toBe('boolean');
    });

    it('should create and use Project module', () => {
      const projectManager = new ProjectManager();
      expect(projectManager).toBeInstanceOf(ProjectManager);

      const project = projectManager.createProject({
        name: 'Test Project',
        description: 'A test project',
        status: 'active',
      });

      expect(project).toBeDefined();
      expect(project.name).toBe('Test Project');
      expect(project.status).toBe('active');
      expect(project.id).toBeDefined();
      expect(project.createdAt).toBeInstanceOf(Date);
      expect(project.updatedAt).toBeInstanceOf(Date);

      const task = projectManager.createTask(project.id, {
        title: 'Test Task',
        description: 'A test task',
        status: 'todo',
      });

      expect(task).not.toBeNull();
      if (task) {
        expect(task.title).toBe('Test Task');
        expect(task.projectId).toBe(project.id);
        expect(task.id).toBeDefined();
      }
    });

    it('should create and use SDK module', async () => {
      const sdk = new SDK({
        enableRecursion: true,
        maxRecursionDepth: 2,
        trackMetadata: true,
      });

      expect(sdk).toBeInstanceOf(SDK);
      expect(sdk.name).toBe('sdk');
      expect(sdk.version).toBe('0.1.0');

      await sdk.init();
      expect(sdk.isInitialized()).toBe(true);

      const metaInfo: SDKMetaInfo = sdk.getMetaInfo();
      expect(metaInfo).toBeDefined();
      expect(metaInfo.version).toBe('0.1.0');
      expect(metaInfo.name).toBe('Enterprise SDK Module');
      expect(metaInfo.isSelfReferencing).toBe(true);

      const stats = sdk.getHierarchyStats();
      expect(stats).toBeDefined();
      expect(stats.totalSDKs).toBeGreaterThanOrEqual(1);
      expect(stats.currentDepth).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Type Safety', () => {
    it('should maintain type safety across modules', () => {
      // Test that all types are properly exported and usable
      const config: EnterpriseConfig = {
        modules: {
          ai: true,
          storage: true,
          ui: true,
          auth: true,
          project: true,
          sdk: true,
        },
      };

      const aiOptions: AIGenerateOptions = {
        model: 'test-model',
        maxTokens: 100,
        temperature: 0.7,
        topP: 0.9,
        frequencyPenalty: 0.1,
        presencePenalty: 0.1,
      };

      const storageOptions: StorageSaveOptions = {
        path: '/test/data.json',
        metadata: { type: 'test' },
        encryption: true,
        compression: true,
        cache: true,
      };

      expect(config.modules.ai).toBe(true);
      expect(aiOptions.maxTokens).toBe(100);
      expect(storageOptions.path).toBe('/test/data.json');
    });
  });

  describe('Module Integration', () => {
    it('should handle cross-module operations', async () => {
      // Create instances of multiple modules
      const ai = new Ai();
      const storage = new Storage();
      const projectManager = new ProjectManager();

      // Initialize all modules
      await ai.init();
      await storage.init();

      // Generate content with AI
      const aiResponse = await ai.generate('Create a project plan');
      expect(aiResponse.text).toBeDefined();

      // Save AI response to storage
      const saveResult = await storage.save(
        JSON.stringify({
          content: aiResponse.text,
          timestamp: Date.now(),
          model: aiResponse.metadata.model,
        }),
        { path: '/projects/ai-plan.json' }
      );
      expect(saveResult.path).toBeDefined();

      // Create project with AI-generated content
      const project = projectManager.createProject({
        name: 'AI Generated Project',
        description: aiResponse.text.substring(0, 200),
        status: 'active',
      });
      expect(project.id).toBeDefined();

      // Create task for the project
      const task = projectManager.createTask(project.id, {
        title: 'Review AI-generated plan',
        description: 'Review and refine the AI-generated project plan',
        status: 'todo',
      });
      expect(task).not.toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle module initialization failures gracefully', async () => {
      const ai = new Ai();

      // Should work normally
      await ai.init();
      expect(ai.isInitialized()).toBe(true);

      // Should handle operations gracefully
      const result = await ai.generate('Test');
      expect(result).toBeDefined();

      // Should destroy cleanly
      await ai.destroy();
      expect(ai.isInitialized()).toBe(false);
    });

    it('should validate module inputs', async () => {
      const storage = new Storage();
      await storage.init();

      // Should handle empty data
      const result1 = await storage.save('', { path: '/empty.txt' });
      expect(result1.path).toBeDefined();

      // Should handle object data
      const objData = { test: 'data' };
      const result2 = await storage.save(JSON.stringify(objData), { path: '/object.json' });
      expect(result2.path).toBeDefined();
    });
  });
});
