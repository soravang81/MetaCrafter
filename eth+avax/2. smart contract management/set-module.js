const fs = require('fs');
const path = require('path');

const packageJsonPath = path.resolve(__dirname, 'package.json');

function setModuleType() {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  packageJson.type = "module";
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}
setModuleType();
