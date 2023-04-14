import fs from 'fs';
import path from 'path';

const sourceFile = path.join(__dirname, 'README.md');
const targetDir = path.join(__dirname, 'dist');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir);
}

const targetFile = path.join(targetDir, 'README.md');
fs.copyFileSync(sourceFile, targetFile);

console.log('README.md файл успешно скопирован в папку dist');
