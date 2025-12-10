// Test file to check path resolution
const path = require('path');
console.log('__dirname:', __dirname);
console.log('Process cwd:', process.cwd());
console.log('Relative path to models:', path.relative(__dirname, path.join(process.cwd(), 'models')));