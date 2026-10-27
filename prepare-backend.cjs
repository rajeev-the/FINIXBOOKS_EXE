const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "backend");
const destDir = path.join(__dirname, "dist-backend");
const distExeDir = path.join(__dirname, "dist-exe");

console.log("Preparing backend from", srcDir, "to", destDir);

function safeRemoveDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, {
      recursive: true,
      force: true,
      maxRetries: 10,
      retryDelay: 500,
    });
  }
}

try {
  if (fs.existsSync(destDir)) {
    console.log("Cleaning old dist-backend folder...");
    safeRemoveDir(destDir);
  }

  fs.cpSync(srcDir, destDir, { recursive: true });
  console.log("Backend successfully copied to dist-backend!");

  // Crucial: Remove .gitignore so electron-builder includes node_modules & .env
  const gitignorePath = path.join(destDir, ".gitignore");
  if (fs.existsSync(gitignorePath)) {
    fs.unlinkSync(gitignorePath);
    console.log("Removed .gitignore from dist-backend so electron-builder packages node_modules & .env");
  }

  // Ensure runtime/node.exe exists and is populated
  const runtimeDir = path.join(__dirname, "runtime");
  const nodeDest = path.join(runtimeDir, "node.exe");
  if (!fs.existsSync(runtimeDir)) {
    fs.mkdirSync(runtimeDir, { recursive: true });
  }
  if (!fs.existsSync(nodeDest) || fs.statSync(nodeDest).size === 0) {
    console.log(`Copying Node.js runtime executable from ${process.execPath} to ${nodeDest}`);
    fs.copyFileSync(process.execPath, nodeDest);
  }

  if (fs.existsSync(distExeDir)) {
    console.log("Cleaning old dist-exe folder...");
    safeRemoveDir(distExeDir);
  }
} catch (err) {
  console.error("Failed to prepare backend:", err);
  process.exit(1);
}
