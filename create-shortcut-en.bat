@echo off
chcp 936 > nul
echo Creating desktop shortcut...

set SCRIPT_PATH=%~dp0miniprogram-uploader.bat
set SHORTCUT_NAME=WeChat Miniprogram Uploader.lnk
set DESKTOP_PATH=%USERPROFILE%\Desktop

REM Create VBScript to make shortcut
echo Set oWS = WScript.CreateObject("WScript.Shell") > CreateShortcut.vbs
echo sLinkFile = "%DESKTOP_PATH%\%SHORTCUT_NAME%" >> CreateShortcut.vbs
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> CreateShortcut.vbs
echo oLink.TargetPath = "%SCRIPT_PATH%" >> CreateShortcut.vbs
echo oLink.WorkingDirectory = "%~dp0" >> CreateShortcut.vbs
echo oLink.Description = "WeChat Miniprogram Uploader" >> CreateShortcut.vbs
echo oLink.IconLocation = "cmd.exe,0" >> CreateShortcut.vbs
echo oLink.Save >> CreateShortcut.vbs

cscript //nologo CreateShortcut.vbs
del CreateShortcut.vbs

echo Desktop shortcut created successfully!
pause 