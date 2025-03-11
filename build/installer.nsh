!include "MUI2.nsh"

Section "Install Dependencies"
  SetOutPath "$INSTDIR"

  # Run the installer silently
  ExecWait '"$INSTDIR\vc_redist.x64.exe" /quiet /norestart'
SectionEnd
