import React from "react";

const TitleBar = () => {
  const handleMinimize = () => {
    if (window.require) {
      const { ipcRenderer } = window.require("electron");
      ipcRenderer.send("window-minimize");
    }
  };

  const handleClose = () => {
    if (window.require) {
      const { ipcRenderer } = window.require("electron");
      ipcRenderer.send("window-close");
    }
  };

  return (
    <div className="w-full h-8 absolute top-0 left-0 z-[9999] flex items-center justify-between px-3 [-webkit-app-region:drag] pointer-events-none select-none">
      {/* Empty draggable header space */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 tracking-tight pl-1 opacity-80">
        {/* Subtle title bar text if needed */}
      </div>

      {/* Non-draggable Window Control Action Buttons */}
      <div className="flex items-center gap-1 [-webkit-app-region:no-drag] h-full pointer-events-auto">
      
     
      </div>
    </div>
  );
};

export default TitleBar;

