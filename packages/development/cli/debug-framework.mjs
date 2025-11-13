import { FrameworkDetector } from './dist/framework-detector.js';
import { readFile } from 'fs/promises';

const detector = new FrameworkDetector();

// Debug framework detection
detector
  .detectFramework()
  .then(async (framework) => {
    console.log('Framework detection result:', JSON.stringify(framework, null, 2));

    // Try reading package.json manually
    try {
      const packageJsonContent = await readFile('./package.json', 'utf8');
      const packageJson = JSON.parse(packageJsonContent);
      console.log('Package JSON:', packageJson);
      console.log('Dependencies:', packageJson.dependencies);
      console.log('Has next dependency:', !!packageJson.dependencies?.next);
    } catch (err) {
      console.error('Error reading package.json:', err.message);
    }
  })
  .catch((err) => {
    console.error('Detection error:', err.message);
  });
