const { app, BrowserWindow, utilityProcess, dialog, ipcMain, nativeImage } = require("electron");
const { fork: childFork, spawn, execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const http = require("http");

let backendProcess = null;
let mainWindow = null;

function checkServiceHealth() {
  return new Promise((resolve) => {
    const req = http.get("http://127.0.0.1:3001/health", (res) => {
      resolve(res.statusCode === 200);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(1500, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function startBackend() {
  const isDev = !app.isPackaged;

  if (backendProcess) {
    console.log("Backend process is already running.");
    return;
  }

  // Check if backend service is already running on port 3001
  const isRunning = await checkServiceHealth();
  if (isRunning) {
    console.log("Backend service is already running on port 3001.");
    return;
  }

  const backendEntry = isDev
    ? path.join(__dirname, "..", "backend", "index.js")
    : path.join(process.resourcesPath, "backend", "index.js");

  const logFilePath = path.join(
    app.getPath("userData"),
    isDev ? "backend-dev.log" : "backend.log"
  );
  const logStream = fs.createWriteStream(logFilePath, { flags: "a" });
  logStream.write(`\n--- Backend process starting at ${new Date().toISOString()} ---\n`);
  logStream.write(`[INFO] isDev: ${isDev}\n`);
  logStream.write(`[INFO] Backend entry path: ${backendEntry}\n`);

  if (!fs.existsSync(backendEntry)) {
    const errorMsg = `Backend entry file not found at:\n${backendEntry}`;
    console.error(errorMsg);
    logStream.write(`[ERROR] ${errorMsg}\n`);
    dialog.showErrorBox("Backend Initialization Error", errorMsg);
    return;
  }

  console.log("Starting backend server from:", backendEntry);
  let stderrOutput = "";

  try {
    const runtimeNodeExe = !isDev
      ? path.join(process.resourcesPath, "runtime", "node.exe")
      : null;

    if (runtimeNodeExe && fs.existsSync(runtimeNodeExe)) {
      logStream.write(`[INFO] Spawning using packaged runtime node: ${runtimeNodeExe}\n`);
      backendProcess = spawn(runtimeNodeExe, ["index.js"], {
        cwd: path.dirname(backendEntry),
        env: {
          ...process.env,
          PORT: process.env.PORT || "3001",
          NODE_ENV: "production",
        },
        stdio: ["ignore", "pipe", "pipe"],
      });
    } else if (utilityProcess) {
      logStream.write(`[INFO] Spawning using Electron utilityProcess\n`);
      backendProcess = utilityProcess.fork(backendEntry, [], {
        cwd: path.dirname(backendEntry),
        env: {
          ...process.env,
          PORT: process.env.PORT || "3001",
          NODE_ENV: isDev ? "development" : "production",
        },
        stdio: "pipe",
      });

      if (backendProcess.stdout) {
        backendProcess.stdout.on("data", (data) => {
          const str = data.toString().trim();
          console.log(`[Backend stdout]: ${str}`);
          logStream.write(`[STDOUT] ${str}\n`);
        });
      }

      if (backendProcess.stderr) {
        backendProcess.stderr.on("data", (data) => {
          const str = data.toString().trim();
          console.error(`[Backend stderr]: ${str}`);
          logStream.write(`[STDERR] ${str}\n`);
          stderrOutput += str + "\n";
        });
      }

      backendProcess.on("exit", (code) => {
        console.log(`Backend utilityProcess exited with code ${code}`);
        logStream.write(`[EXIT] Backend utilityProcess exited with code ${code}\n`);
        if (code !== 0 && code !== null) {
          dialog.showErrorBox(
            "Backend Process Error",
            `Backend process exited unexpectedly with code ${code}.\n\nError output:\n${stderrOutput || "Check backend.log for details."}\n\nLog file:\n${logFilePath}`
          );
        }
        backendProcess = null;
      });
    } else {
      logStream.write(`[INFO] Spawning using child_process.fork\n`);
      backendProcess = childFork(backendEntry, [], {
        cwd: path.dirname(backendEntry),
        env: {
          ...process.env,
          PORT: process.env.PORT || "3001",
          NODE_ENV: isDev ? "development" : "production",
          ELECTRON_RUN_AS_NODE: "1",
        },
        silent: true,
      });

      if (backendProcess.stdout) {
        backendProcess.stdout.on("data", (data) => {
          const str = data.toString().trim();
          console.log(`[Backend stdout]: ${str}`);
          logStream.write(`[STDOUT] ${str}\n`);
        });
      }

      if (backendProcess.stderr) {
        backendProcess.stderr.on("data", (data) => {
          const str = data.toString().trim();
          console.error(`[Backend stderr]: ${str}`);
          logStream.write(`[STDERR] ${str}\n`);
          stderrOutput += str + "\n";
        });
      }

      backendProcess.on("exit", (code, signal) => {
        console.log(`Backend process exited with code ${code} and signal ${signal}`);
        logStream.write(`[EXIT] Backend process exited with code ${code} and signal ${signal}\n`);
        if (code !== 0 && code !== null) {
          dialog.showErrorBox(
            "Backend Process Error",
            `Backend process exited unexpectedly with code ${code}.\n\nError output:\n${stderrOutput || "Check backend.log for details."}\n\nLog file:\n${logFilePath}`
          );
        }
        backendProcess = null;
      });
    }
  } catch (err) {
    console.error("Failed to start backend process:", err);
    logStream.write(`[EXCEPT] Failed to start backend: ${err.stack || err}\n`);
    dialog.showErrorBox("Backend Exception", `Failed to launch backend:\n${err.stack || err}`);
  }
}

function stopBackend() {
  if (backendProcess) {
    console.log("Stopping backend server...");
    try {
      backendProcess.kill();
    } catch (err) {
      console.error("Error stopping backend process:", err);
    }
    backendProcess = null;
  }
}

const COMMON_TALLY_PATHS = [
  "C:\\Program Files\\TallyPrime\\tally.exe",
  "C:\\Program Files (x86)\\TallyPrime\\tally.exe",
  "C:\\TallyPrime\\tally.exe",
  "C:\\Tally\\tally.exe",
  "C:\\Tally.ERP9\\tally.exe",
  "D:\\TallyPrime\\tally.exe",
  "D:\\Program Files\\TallyPrime\\tally.exe",
];

const isTallyRunning = () => {
  try {
    const output = execSync('tasklist /FI "IMAGENAME eq tally.exe" /NH', {
      encoding: "utf8",
      windowsHide: true,
      timeout: 1500,
    });
    return output.toLowerCase().includes("tally.exe");
  } catch {
    return false;
  }
};

const activateTallyWindow = () => {
  try {
    const scriptPath = path.join(__dirname, "activateTally.ps1");
    const child = spawn("powershell.exe", [
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-WindowStyle",
      "Hidden",
      "-File",
      scriptPath,
    ], {
      windowsHide: true,
      detached: true,
      stdio: "ignore",
    });
    child.unref();
  } catch (err) {
    console.warn("Could not activate Tally window:", err);
  }
};

ipcMain.handle("launch-tally", async () => {
  try {
    // If Tally is already running, bring it to front and step out of the way!
    if (isTallyRunning()) {
      activateTallyWindow();
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.minimize();
      }
      return {
        success: true,
        alreadyRunning: true,
        message: "Tally Prime is already open. Switched to existing window.",
      };
    }

    let targetPath = null;
    for (const p of COMMON_TALLY_PATHS) {
      if (fs.existsSync(p)) {
        targetPath = p;
        break;
      }
    }

    if (targetPath) {
      const child = spawn("cmd.exe", ["/c", "start", '""', targetPath], {
        detached: true,
        stdio: "ignore",
      });
      child.unref();
      return { success: true, alreadyRunning: false, path: targetPath };
    } else {
      spawn("cmd.exe", ["/c", "start", '""', "tally.exe"], {
        detached: true,
        stdio: "ignore",
      }).unref();
      return { success: true, alreadyRunning: false, path: "tally.exe" };
    }
  } catch (err) {
    console.error("IPC launch-tally error:", err);
    return { success: false, error: err.message };
  }
});

function createWindow() {
  const iconPath = path.join(__dirname, "icon.ico");
  let windowIcon = iconPath;
  if (fs.existsSync(iconPath)) {
    const img = nativeImage.createFromPath(iconPath);
    if (!img.isEmpty()) {
      windowIcon = img;
    }
  }

  mainWindow = new BrowserWindow({
    title: "FinixBooks",
    icon: windowIcon,
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: true,
    },
  });

  if (process.platform === "win32" && windowIcon) {
    try {
      mainWindow.setIcon(windowIcon);
    } catch (err) {
      console.warn("Could not set window icon:", err);
    }
  }

  const isDev = !app.isPackaged;

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    const indexPath = path.join(__dirname, "..", "ui", "dist", "index.html");
    console.log("Loading HTML from:", indexPath);
    mainWindow.loadFile(indexPath);
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  if (process.platform === "win32") {
    app.setAppUserModelId("FinixBooks");
  }
  startBackend();

  // Give backend 1 second to start before opening window
  setTimeout(() => {
    createWindow();
  }, 1000);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  stopBackend();
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  stopBackend();
});

app.on("will-quit", () => {
  stopBackend();
});