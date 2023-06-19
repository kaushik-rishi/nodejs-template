const fs = require('fs');

async function createFolderStructure(generator) {
  const foldersToCreate = ['/config/', '/src/api/handlers/', '/src/api/routes/', '/src/api/middlewares/'];

  const targetDir = generator.targetDir;

  foldersToCreate.forEach(relativeFolderPath => {
    const absoluteFolderPath = targetDir + relativeFolderPath;
    if (!fs.existsSync(absoluteFolderPath)) {
      fs.mkdirSync(absoluteFolderPath, { recursive: true });
    }
  });
}

module.exports = {
  'generate:before': createFolderStructure
};