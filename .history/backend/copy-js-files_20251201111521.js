const fs = require('fs');
const path = require('path');

console.log('📦 Copying JavaScript files to dist...');

// Copy containerApiService.js
const srcFile = path.join(__dirname, 'src', 'services', 'containerApiService.js');
const destDir = path.join(__dirname, 'dist', 'services');
const destFile = path.join(destDir, 'containerApiService.js');

// Ensure dist/services directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy file
fs.copyFileSync(srcFile, destFile);
console.log('✅ Copied containerApiService.js to dist/services/');

console.log('✨ Done!');
