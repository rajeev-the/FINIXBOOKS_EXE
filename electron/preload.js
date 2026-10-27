const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  launchTally: () => ipcRenderer.invoke("launch-tally"),
});
