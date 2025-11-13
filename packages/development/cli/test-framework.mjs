import { FrameworkDetector } from './dist/framework-detector.js';

const detector = new FrameworkDetector();

// Test framework detection in current directory
detector
  .detectFramework()
  .then((framework) => {
    if (framework) {
      console.log(`✅ Framework detected: ${framework.name} v${framework.version || 'unknown'}`);
      console.log(`📁 Config files: ${framework.configFiles.join(', ')}`);
      console.log(`📦 Package keys: ${framework.packageJsonKeys.join(', ')}`);
    } else {
      console.log('❌ No framework detected');
    }
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
  });
