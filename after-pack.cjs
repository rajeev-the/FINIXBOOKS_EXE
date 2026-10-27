const fs = require("fs");
const path = require("path");

module.exports = async function (context) {
  const resourcesBackendDir = path.join(context.appOutDir, "resources", "backend");
  const srcNodeModules = path.join(context.packager.projectDir, "backend", "node_modules");
  const destNodeModules = path.join(resourcesBackendDir, "node_modules");

  console.log(`[afterPack] Copying backend node_modules from ${srcNodeModules} to ${destNodeModules}`);

  try {
    if (!fs.existsSync(resourcesBackendDir)) {
      fs.mkdirSync(resourcesBackendDir, { recursive: true });
    }

    if (fs.existsSync(destNodeModules)) {
      fs.rmSync(destNodeModules, { recursive: true, force: true });
    }

    if (fs.existsSync(srcNodeModules)) {
      fs.cpSync(srcNodeModules, destNodeModules, { recursive: true });
      console.log("[afterPack] Backend node_modules successfully copied into packaged resources!");
    } else {
      console.error("[afterPack] Warning: backend/node_modules was not found!");
    }
  } catch (err) {
    console.error("[afterPack] Error copying backend node_modules:", err);
    throw err;
  }
};
