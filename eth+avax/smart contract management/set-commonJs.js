import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname is not available in ES modules, so we need to recreate it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.resolve(__dirname, 'package.json');

function setModuleType() {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  packageJson.type = "commonjs";
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}
setModuleType();
