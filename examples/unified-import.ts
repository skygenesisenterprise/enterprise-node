// Example usage of the improved Enterprise SDK with unified import
// This demonstrates how to use the SDK with a single import statement

import {
  EnterpriseSDK,
  createEnterprise,
  Ai,
  Storage,
  UIManager,
  AuthManager,
  ProjectManager,
  SDK,
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
} from '@skygenesisenterprise/enterprise-node';

// Example 1: Using the factory function (recommended)
async function exampleWithFactory() {
  console.log('🚀 Example 1: Using createEnterprise factory function');

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
    branding: {
      companyName: 'My Application',
      primaryColor: '#3b82f6',
      theme: 'dark',
    },
  };

  try {
    const enterprise = await createEnterprise(config);

    // Use AI module
    const aiOptions: AIGenerateOptions = {
      model: 'gpt-3.5-turbo',
      maxTokens: 100,
      temperature: 0.7,
    };

    const aiResponse = await enterprise.ai.generate('Hello, Enterprise SDK!', aiOptions);
    console.log('AI Response:', aiResponse.text);

    // Use Storage module
    const storageOptions: StorageSaveOptions = {
      path: '/example/data.json',
      metadata: { type: 'example', version: '1.0' },
      cache: true,
    };

    const saveResult = await enterprise.storage.save(
      JSON.stringify({ message: 'Hello from Enterprise SDK!' }),
      storageOptions
    );
    console.log('Storage Save Result:', saveResult);

    // Use SDK self-reference
    const sdkInfo = enterprise.sdk.getMetaInfo();
    console.log('SDK Info:', sdkInfo);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 2: Using individual module classes directly
async function exampleWithDirectClasses() {
  console.log('\n🔧 Example 2: Using individual module classes');

  try {
    // Create AI module instance
    const ai = new Ai();
    await ai.init();

    const result = await ai.generate('Generate a creative story');
    console.log('AI Story:', result.text.substring(0, 100) + '...');

    // Create Storage module instance
    const storage = new Storage();
    await storage.init();

    const fileData = 'Example file content';
    const savedFile = await storage.save(fileData, {
      path: '/examples/story.txt',
    });
    console.log('Saved file:', savedFile);

    // Create UI Manager
    const theme: Theme = {
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
      },
      typography: {
        fontFamily: 'Inter, sans-serif',
        fontSize: '16px',
      },
      spacing: {
        small: '8px',
        medium: '16px',
        large: '24px',
      },
    };

    const ui = new UIManager(theme);

    const component: UIComponent = {
      id: 'button-1',
      type: 'button',
      props: {
        text: 'Click me',
        variant: 'primary',
      },
    };

    const buttonComponent = ui.createComponent(component);
    console.log('UI Component:', buttonComponent);

    // Create Auth Manager
    const authConfig: AuthConfig = {
      provider: 'local',
      credentials: {
        secretKey: 'your-secret-key',
      },
    };

    const auth = new AuthManager(authConfig);

    const user: User = {
      id: '123',
      email: 'user@example.com',
      name: 'John Doe',
      roles: ['user'],
    };

    const isAuthorized = await auth.authorize(user, 'dashboard', 'read');
    console.log('User authorized:', isAuthorized);

    // Create Project Manager
    const projectManager = new ProjectManager();

    const projectData = {
      name: 'My Enterprise Project',
      description: 'A project using Enterprise SDK',
      status: 'active' as const,
    };

    const project: Project = projectManager.createProject(projectData);
    console.log('Created project:', project);

    const taskData = {
      title: 'Setup SDK',
      description: 'Initialize and configure the Enterprise SDK',
      status: 'todo' as const,
    };

    const task: Task | null = projectManager.createTask(project.id, taskData);
    console.log('Created task:', task);

    // Create SDK instance for self-reference
    const sdk = new SDK({
      enableRecursion: true,
      maxRecursionDepth: 2,
      trackMetadata: true,
    });

    await sdk.init();

    const metaInfo: SDKMetaInfo = sdk.getMetaInfo();
    console.log('SDK Meta Info:', metaInfo);

    const hierarchyStats = sdk.getHierarchyStats();
    console.log('SDK Hierarchy Stats:', hierarchyStats);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 3: TypeScript usage with proper typing
async function exampleWithTypeScript() {
  console.log('\n📝 Example 3: TypeScript with proper typing');

  // Type-safe configuration
  const config: EnterpriseConfig = {
    modules: {
      ai: true,
      storage: true,
    },
    runtime: {
      enableWasm: true,
      wasmPath: '/wasm/',
    },
    framework: 'react',
    debug: process.env.NODE_ENV === 'development',
  };

  // Type-safe SDK usage
  const enterprise: EnterpriseSDK = new EnterpriseSDK(config);
  await enterprise.initialize();

  // Type-safe AI options
  const aiOptions: AIGenerateOptions = {
    model: 'gpt-4',
    maxTokens: 2000,
    temperature: 0.8,
    topP: 0.9,
    frequencyPenalty: 0.1,
    presencePenalty: 0.1,
  };

  const response = await enterprise.ai.generate('Write TypeScript code examples', aiOptions);
  console.log('Generated code length:', response.text.length);

  // Type-safe storage operations
  const data = {
    timestamp: new Date().toISOString(),
    message: 'TypeScript example data',
    metadata: { version: '1.0.0', type: 'example' },
  };

  const saveOptions: StorageSaveOptions = {
    path: '/typescript/example.json',
    metadata: {
      contentType: 'application/json',
      encoding: 'utf-8',
    },
    encryption: true,
    compression: true,
    cache: true,
  };

  const result = await enterprise.storage.save(data, saveOptions);
  console.log('Saved with encryption:', result.path);

  // Get typed configuration
  const currentConfig: EnterpriseConfig = enterprise.getConfig();
  console.log(
    'Current modules enabled:',
    Object.keys(currentConfig.modules).filter(
      (key) => currentConfig.modules[key as keyof typeof currentConfig.modules]
    )
  );
}

// Example 4: React integration (conceptual)
function exampleReactIntegration() {
  console.log('\n⚛️ Example 4: React Integration Pattern');

  // This shows how you would use the SDK in a React component
  const reactComponentCode = `
import React, { useEffect, useState } from 'react';
import { createEnterprise, EnterpriseConfig } from '@skygenesisenterprise/enterprise-node';

function MyComponent() {
  const [enterprise, setEnterprise] = useState(null);
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initSDK = async () => {
      const config: EnterpriseConfig = {
        modules: { ai: true, storage: true },
        debug: true
      };
      
      const sdk = await createEnterprise(config);
      setEnterprise(sdk);
    };

    initSDK();
  }, []);

  const handleGenerate = async () => {
    if (!enterprise) return;
    
    setLoading(true);
    try {
      const response = await enterprise.ai.generate('Hello from React!');
      setAiResponse(response.text);
    } catch (error) {
      console.error('AI Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Text'}
      </button>
      {aiResponse && <p>{aiResponse}</p>}
    </div>
  );
}
  `;

  console.log('React Component Example:');
  console.log(reactComponentCode);
}

// Example 5: Error handling and best practices
async function exampleErrorHandling() {
  console.log('\n🛡️ Example 5: Error Handling and Best Practices');

  try {
    const enterprise = await createEnterprise({
      modules: { ai: true, storage: true },
      debug: true,
    });

    // Safe AI usage with error handling
    try {
      const response = await enterprise.ai.generate('Test prompt');
      console.log('AI Response:', response.text);
    } catch (aiError) {
      console.error('AI Module Error:', aiError);
      // Fallback behavior
      console.log('Using fallback response');
    }

    // Safe storage usage with validation
    try {
      const data = { test: 'data' };
      const result = await enterprise.storage.save(data, {
        path: '/test/data.json',
        metadata: { validated: true },
      });

      // Verify save was successful
      if (result.path && result.hash) {
        console.log('File saved successfully:', result.path);
      }
    } catch (storageError) {
      console.error('Storage Error:', storageError);
      // Handle storage error (retry, use alternative, etc.)
    }

    // Cleanup
    await enterprise.destroy();
    console.log('SDK cleaned up successfully');
  } catch (error) {
    console.error('SDK Initialization Error:', error);
  }
}

// Run all examples
async function runAllExamples() {
  console.log('🎯 Enterprise SDK Unified Import Examples\n');

  await exampleWithFactory();
  await exampleWithDirectClasses();
  await exampleWithTypeScript();
  exampleReactIntegration();
  await exampleErrorHandling();

  console.log('\n✅ All examples completed!');
}

// Export examples for individual testing
export {
  exampleWithFactory,
  exampleWithDirectClasses,
  exampleWithTypeScript,
  exampleReactIntegration,
  exampleErrorHandling,
  runAllExamples,
};

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}
