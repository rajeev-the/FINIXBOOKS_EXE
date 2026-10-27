!macro customInstall

  DetailPrint "Configuring Tally Bridge Backend Service..."

  ; Stop service if already running (for upgrade/reinstall scenarios)
  nsExec::ExecToLog '"$INSTDIR\resources\nssm.exe" stop TallyBridgeBackend'

  ; Install the Windows service if not already present
  nsExec::ExecToLog '"$INSTDIR\resources\nssm.exe" install TallyBridgeBackend "$INSTDIR\resources\runtime\node.exe"'

  ; Ensure application path and parameters are correctly set
  nsExec::ExecToLog '"$INSTDIR\resources\nssm.exe" set TallyBridgeBackend Application "$INSTDIR\resources\runtime\node.exe"'
  ; Set AppParameters to index.js (relative to AppDirectory to avoid space-splitting in paths like Program Files)
  nsExec::ExecToLog '"$INSTDIR\resources\nssm.exe" set TallyBridgeBackend AppParameters "index.js"'

  ; Set working directory
  nsExec::ExecToLog '"$INSTDIR\resources\nssm.exe" set TallyBridgeBackend AppDirectory "$INSTDIR\resources\backend"'

  ; Set service display name and description
  nsExec::ExecToLog '"$INSTDIR\resources\nssm.exe" set TallyBridgeBackend DisplayName "Tally Bridge Backend"'
  nsExec::ExecToLog '"$INSTDIR\resources\nssm.exe" set TallyBridgeBackend Description "Tally Bridge Background Service"'

  ; Automatic startup
  nsExec::ExecToLog '"$INSTDIR\resources\nssm.exe" set TallyBridgeBackend Start SERVICE_AUTO_START'

  ; Restart delay in ms on crash
  nsExec::ExecToLog '"$INSTDIR\resources\nssm.exe" set TallyBridgeBackend AppRestartDelay 5000'

  ; Backend logs
  nsExec::ExecToLog '"$INSTDIR\resources\nssm.exe" set TallyBridgeBackend AppStdout "$INSTDIR\resources\backend\backend.log"'
  nsExec::ExecToLog '"$INSTDIR\resources\nssm.exe" set TallyBridgeBackend AppStderr "$INSTDIR\resources\backend\backend-error.log"'

  ; Start backend service
  DetailPrint "Starting Tally Bridge Backend Service..."
  nsExec::ExecToLog '"$INSTDIR\resources\nssm.exe" start TallyBridgeBackend'

  DetailPrint "Tally Bridge Backend Service configured and started."

!macroend


!macro customUnInstall

  DetailPrint "Stopping Tally Bridge Backend Service..."
  nsExec::ExecToLog '"$INSTDIR\resources\nssm.exe" stop TallyBridgeBackend'

  DetailPrint "Removing Tally Bridge Backend Service..."
  nsExec::ExecToLog '"$INSTDIR\resources\nssm.exe" remove TallyBridgeBackend confirm'

  DetailPrint "Tally Bridge Backend Service removed."

!macroend