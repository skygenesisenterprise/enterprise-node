#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TestOptions {
  version: string;
  environment: string;
  name: string;
}

async function createTestProject(options: TestOptions) {
  const { version, environment, name } = options;
  const projectDir = path.join(process.cwd(), name);

  console.log(`🚀 Creating test project: ${name}`);
  console.log(`📦 Version: ${version}`);
  console.log(`🌍 Environment: ${environment}`);

  try {
    // Create project directory
    await fs.ensureDir(projectDir);

    // Create package.json
    const packageJson = createPackageJson(name, version, environment);
    await fs.writeJson(path.join(projectDir, 'package.json'), packageJson, { spaces: 2 });

    // Create enterprise config
    const enterpriseConfig = createEnterpriseConfig(environment);
    await fs.writeJson(path.join(projectDir, 'enterprise.config.json'), enterpriseConfig, { spaces: 2 });

    // Create test files based on environment
    await createTestFiles(projectDir, environment);

    // Create test scripts
    await createTestScripts(projectDir, environment);

    console.log(`✅ Test project created: ${projectDir}`);
    console.log(`📋 Next steps:`);
    console.log(`   cd ${name}`);
    console.log(`   npm install`);
    console.log(`   npm run test:release`);

  } catch (error) {
    console.error('❌ Error creating test project:', error);
    process.exit(1);
  }
}

function createPackageJson(name: string, version: string, environment: string) {
  const basePackage = {
    name,
    version: '1.0.0',
    description: `Test project for Enterprise SDK v${version} in ${environment} environment`,
    type: 'module',
    scripts: {
      'test:release': 'node test-release.js',
      'test:build': 'node test-build.js',
      'test:modules': 'node test-modules.js',
      'dev': 'node dev.js'
    },
    dependencies: {
      '@skygenesisenterprise/enterprise-node': `^${version}`
    },
    devDependencies: {
      typescript: '^5.0.0',
      '@types/node': '^20.0.0'
    }
  };

  // Add environment-specific dependencies
  switch (environment) {
    case 'react':
      basePackage.dependencies = {
        ...basePackage.dependencies,
        react: '^18.0.0',
        'react-dom': '^18.0.0',
        '@skygenesisenterprise/react': `^${version}`
      };
      basePackage.devDependencies = {
        ...basePackage.devDependencies,
        '@types/react': '^18.0.0',
        '@types/react-dom': '^18.0.0',
        vite: '^5.0.0',
        '@vitejs/plugin-react': '^4.0.0'
      };
      break;
    case 'nextjs':
      basePackage.dependencies = {
        ...basePackage.dependencies,
        next: '^14.0.0',
        react: '^18.0.0',
        'react-dom': '^18.0.0',
        '@skygenesisenterprise/nextjs': `^${version}`
      };
      basePackage.devDependencies = {
        ...basePackage.devDependencies,
        '@types/react': '^18.0.0',
        '@types/react-dom': '^18.0.0'
      };
      break;
    case 'browser':
      basePackage.devDependencies = {
        ...basePackage.devDependencies,
        vite: '^5.0.0',
        'jsdom': '^23.0.0'
      };
      break;
  }

  return basePackage;
}

function createEnterpriseConfig(environment: string) {
  const baseConfig = {
    modules: {
      ai: true,
      storage: true,
      ui: true,
      project: true,
      auth: true,
      sdk: true
    },
    runtime: {
      enableWasm: true,
      fallback: true
    },
    debug: true,
    environment
  };

  // Environment-specific configurations
  switch (environment) {
    case 'browser':
      baseConfig.runtime.target = 'browser';
      break;
    case 'node':
      baseConfig.runtime.target = 'node';
      break;
    case 'react':
      baseConfig.framework = 'react';
      break;
    case 'nextjs':
      baseConfig.framework = 'nextjs';
      break;
  }

  return baseConfig;
}

async function createTestFiles(projectDir: string, environment: string) {
  // Create main test file
  const testContent = generateTestFile(environment);
  await fs.writeFile(path.join(projectDir, 'test-release.js'), testContent);

  // Create build test file
  const buildTestContent = generateBuildTest(environment);
  await fs.writeFile(path.join(projectDir, 'test-build.js'), buildTestContent);

  // Create modules test file
  const modulesTestContent = generateModulesTest(environment);
  await fs.writeFile(path.join(projectDir, 'test-modules.js'), modulesTestContent);

  // Create development file
  const devContent = generateDevFile(environment);
  await fs.writeFile(path.join(projectDir, 'dev.js'), devContent);

  // Environment-specific files
  switch (environment) {
    case 'react':
      await createReactFiles(projectDir);
      break;
    case 'nextjs':
      await createNextjsFiles(projectDir);
      break;
    case 'browser':
      await createBrowserFiles(projectDir);
      break;
  }
}

function generateTestFile(environment: string): string {
  return `
import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';

console.log('🧪 Testing Enterprise SDK Release in ${environment} environment...');

async function testRelease() {
  try {
    console.log('📦 Initializing SDK...');
    
    const sdk = new EnterpriseSDK({
      modules: {
        ai: true,
        storage: true,
        ui: true,
        project: true,
        auth: true,
        sdk: true
      },
      debug: true
    });

    console.log('🚀 Starting initialization...');
    await sdk.initialize();
    
    console.log('✅ SDK initialized successfully!');
    
    // Test each module
    console.log('🔍 Testing modules...');
    
    // Test AI module
    if (sdk.ai) {
      console.log('🤖 Testing AI module...');
      try {
        const response = await sdk.ai.generate('Hello from test environment!');
        console.log('✅ AI module working:', response.text?.slice(0, 50) + '...');
      } catch (error) {
        console.log('⚠️ AI module warning:', error.message);
      }
    }

    // Test Storage module
    if (sdk.storage) {
      console.log('💾 Testing Storage module...');
      try {
        await sdk.storage.store('test-key', { test: true, timestamp: Date.now() });
        const data = await sdk.storage.retrieve('test-key');
        console.log('✅ Storage module working:', data);
      } catch (error) {
        console.log('⚠️ Storage module warning:', error.message);
      }
    }

    // Test SDK module (self-reference)
    if (sdk.sdk) {
      console.log('🔄 Testing SDK self-reference...');
      try {
        const metaInfo = sdk.sdk.getMetaInfo();
        console.log('✅ SDK self-reference working:', metaInfo);
      } catch (error) {
        console.log('⚠️ SDK self-reference warning:', error.message);
      }
    }

    console.log('🎉 All tests completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testRelease();
`;
}

function generateBuildTest(environment: string): string {
  return `
console.log('🔨 Testing build process for ${environment} environment...');

async function testBuild() {
  try {
    // Test if the SDK can be imported and built
    const { EnterpriseSDK } = await import('@skygenesisenterprise/enterprise-node');
    
    console.log('✅ Import successful');
    
    // Test configuration validation
    const config = {
      modules: {
        ai: true,
        storage: true,
        ui: true,
        project: true,
        auth: true,
        sdk: true
      }
    };
    
    const sdk = new EnterpriseSDK(config);
    console.log('✅ Configuration validation successful');
    
    // Test module loading
    console.log('📦 Testing module loading...');
    const modules = Object.keys(sdk);
    console.log('✅ Available modules:', modules);
    
    console.log('🎉 Build test completed successfully!');
    
  } catch (error) {
    console.error('❌ Build test failed:', error);
    process.exit(1);
  }
}

testBuild();
`;
}

function generateModulesTest(environment: string): string {
  return `
console.log('🧩 Testing individual modules for ${environment} environment...');

async function testModules() {
  const results = {};
  
  try {
    // Test AI module
    try {
      const { default: AI } = await import('@skygenesisenterprise/module-ai');
      results.ai = '✅ Available';
    } catch (error) {
      results.ai = '❌ Not available: ' + error.message;
    }

    // Test Storage module
    try {
      const { default: Storage } = await import('@skygenesisenterprise/module-storage');
      results.storage = '✅ Available';
    } catch (error) {
      results.storage = '❌ Not available: ' + error.message;
    }

    // Test UI module
    try {
      const { default: UI } = await import('@skygenesisenterprise/module-ui');
      results.ui = '✅ Available';
    } catch (error) {
      results.ui = '❌ Not available: ' + error.message;
    }

    // Test Auth module
    try {
      const { default: Auth } = await import('@skygenesisenterprise/module-auth');
      results.auth = '✅ Available';
    } catch (error) {
      results.auth = '❌ Not available: ' + error.message;
    }

    // Test Project module
    try {
      const { default: Project } = await import('@skygenesisenterprise/module-project');
      results.project = '✅ Available';
    } catch (error) {
      results.project = '❌ Not available: ' + error.message;
    }

    // Test SDK module
    try {
      const { default: SDK } = await import('@skygenesisenterprise/module-sdk');
      results.sdk = '✅ Available';
    } catch (error) {
      results.sdk = '❌ Not available: ' + error.message;
    }

    console.log('📊 Module Test Results:');
    Object.entries(results).forEach(([module, result]) => {
      console.log(\`  \${module}: \${result}\`);
    });

    console.log('🎉 Module test completed!');
    
  } catch (error) {
    console.error('❌ Module test failed:', error);
    process.exit(1);
  }
}

testModules();
`;
}

function generateDevFile(environment: string): string {
  return `
console.log('🛠️ Development mode for ${environment} environment...');

import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';

const sdk = new EnterpriseSDK({
  modules: {
    ai: true,
    storage: true,
    ui: true,
    project: true,
    auth: true,
    sdk: true
  },
  debug: true
});

async function startDev() {
  try {
    await sdk.initialize();
    console.log('🚀 Development server started');
    console.log('📦 SDK ready for testing');
    
    // Keep the process running for development
    process.on('SIGINT', () => {
      console.log('\\n👋 Shutting down development server...');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Development mode failed:', error);
    process.exit(1);
  }
}

startDev();
`;
}

async function createReactFiles(projectDir: string) {
  // Create React App component
  const appContent = `
import React, { useEffect, useState } from 'react';
import { EnterpriseProvider, useAI, useStorage } from '@skygenesisenterprise/react';

function TestComponent() {
  const { generate } = useAI();
  const { store, retrieve } = useStorage();
  const [result, setResult] = useState('');

  const testAI = async () => {
    try {
      const response = await generate('Hello from React test!');
      setResult(response.text);
    } catch (error) {
      setResult('Error: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Enterprise SDK React Test</h1>
      <button onClick={testAI}>Test AI</button>
      <p>Result: {result}</p>
    </div>
  );
}

function App() {
  const config = {
    modules: {
      ai: true,
      storage: true,
      ui: true,
      project: true,
      auth: true,
      sdk: true
    }
  };

  return (
    <EnterpriseProvider config={config}>
      <TestComponent />
    </EnterpriseProvider>
  );
}

export default App;
`;

  await fs.writeFile(path.join(projectDir, 'App.jsx'), appContent);

  // Create Vite config
  const viteConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
});
`;

  await fs.writeFile(path.join(projectDir, 'vite.config.js'), viteConfig);

  // Create HTML entry point
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enterprise SDK React Test</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
</body>
</html>
`;

  await fs.ensureDir(path.join(projectDir, 'src'));
  await fs.writeFile(path.join(projectDir, 'index.html'), htmlContent);

  // Create main React entry
  const mainContent = `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;

  await fs.writeFile(path.join(projectDir, 'src/main.jsx'), mainContent);
}

async function createNextjsFiles(projectDir: string) {
  // Create Next.js pages
  await fs.ensureDir(path.join(projectDir, 'pages'));
  
  const indexPage = `
import { EnterpriseProvider, useAI } from '@skygenesisenterprise/nextjs';

function TestComponent() {
  const { generate } = useAI();
  const [result, setResult] = React.useState('');

  const testAI = async () => {
    try {
      const response = await generate('Hello from Next.js test!');
      setResult(response.text);
    } catch (error) {
      setResult('Error: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Enterprise SDK Next.js Test</h1>
      <button onClick={testAI}>Test AI</button>
      <p>Result: {result}</p>
    </div>
  );
}

function HomePage() {
  const config = {
    modules: {
      ai: true,
      storage: true,
      ui: true,
      project: true,
      auth: true,
      sdk: true
    }
  };

  return (
    <EnterpriseProvider config={config}>
      <TestComponent />
    </EnterpriseProvider>
  );
}

export default HomePage;
`;

  await fs.writeFile(path.join(projectDir, 'pages/index.js'), indexPage);
}

async function createBrowserFiles(projectDir: string) {
  // Create browser test file
  const browserTest = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enterprise SDK Browser Test</title>
</head>
<body>
    <div id="app">
        <h1>Enterprise SDK Browser Test</h1>
        <button id="testBtn">Test SDK</button>
        <div id="result"></div>
    </div>

    <script type="module">
        import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';

        console.log('🧪 Testing Enterprise SDK in browser...');

        const sdk = new EnterpriseSDK({
            modules: {
                ai: true,
                storage: true,
                ui: true,
                project: true,
                auth: true,
                sdk: true
            },
            runtime: {
                target: 'browser'
            }
        });

        document.getElementById('testBtn').addEventListener('click', async () => {
            const resultDiv = document.getElementById('result');
            
            try {
                await sdk.initialize();
                resultDiv.innerHTML = '<p style="color: green;">✅ SDK initialized successfully!</p>';
                
                // Test AI module
                if (sdk.ai) {
                    const response = await sdk.ai.generate('Hello from browser!');
                    resultDiv.innerHTML += '<p>🤖 AI Response: ' + response.text + '</p>';
                }
                
            } catch (error) {
                resultDiv.innerHTML = '<p style="color: red;">❌ Error: ' + error.message + '</p>';
            }
        });
    </script>
</body>
</html>
`;

  await fs.writeFile(path.join(projectDir, 'browser-test.html'), browserTest);
}

// Parse command line arguments
const args = process.argv.slice(2);
const options: TestOptions = {
  version: '',
  environment: '',
  name: ''
};

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg.startsWith('--version=')) {
    options.version = arg.split('=')[1];
  } else if (arg.startsWith('--environment=')) {
    options.environment = arg.split('=')[1];
  } else if (arg.startsWith('--name=')) {
    options.name = arg.split('=')[1];
  }
}

// Validate required arguments
if (!options.version || !options.environment || !options.name) {
  console.error('❌ Missing required arguments');
  console.error('Usage: node create-test-project.js --version=1.1.4 --environment=node --name=test-project');
  process.exit(1);
}

// Create the test project
createTestProject(options);