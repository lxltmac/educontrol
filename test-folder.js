import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testFolder = path.join(__dirname, 'test-folder');
if (!fs.existsSync(testFolder)) {
  fs.mkdirSync(testFolder);
  console.log('Created test folder');
}

const files = fs.readdirSync(__dirname);
console.log('Files in directory:', files);
