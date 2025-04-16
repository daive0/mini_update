@echo off
setlocal enabledelayedexpansion
chcp 936 > nul
title WeChat Miniprogram Uploader
color 0A

REM Fixed project directory
set PROJECT_DIR=D:\git\expo-taro

REM Change to script directory
cd /d %~dp0

REM Check for argument
if "%~1"=="" (
    cls
    echo.
    echo  ====================================
    echo       WeChat Miniprogram Uploader
    echo  ====================================
    echo.
    echo  Select version to upload:
    echo.
    echo  [1] common       - Common Version
    echo  [2] common_live  - Common Live
    echo  [3] market       - Market Version
    echo  [4] market_live  - Market Live
    echo  [5] club         - Club Version
    echo  [6] club_live    - Club Live
    echo  [7] cbd          - CBD Version
    echo  [8] cbd_live     - CBD Live
    echo  [9] ciff         - CIFF Version
    echo  [10] ciff_live   - CIFF Live
    echo  [11] ybz         - YBZ Version
    echo  [12] ybz_live    - YBZ Live
    echo  [13] scmc        - SCMC Version
    echo  [14] scmc_live   - SCMC Live
    echo  [0] Exit
    echo.
    
    set /p choice="Enter option number: "
    
    if "!choice!"=="1" set target=common
    if "!choice!"=="2" set target=common_live
    if "!choice!"=="3" set target=market
    if "!choice!"=="4" set target=market_live
    if "!choice!"=="5" set target=club
    if "!choice!"=="6" set target=club_live
    if "!choice!"=="7" set target=cbd
    if "!choice!"=="8" set target=cbd_live
    if "!choice!"=="9" set target=ciff
    if "!choice!"=="10" set target=ciff_live
    if "!choice!"=="11" set target=ybz
    if "!choice!"=="12" set target=ybz_live
    if "!choice!"=="13" set target=scmc
    if "!choice!"=="14" set target=scmc_live
    if "!choice!"=="0" goto :EOF
    
    if not defined target (
        echo Invalid option, please run again
        pause
        goto :EOF
    )
) else (
    set target=%~1
)

REM Run upload command
cls
echo.
echo  ====================================
echo       WeChat Miniprogram Uploader
echo  ====================================
echo.
echo  Uploading !target! version...
echo.

set PROJECT_DIR=%PROJECT_DIR%
node bau.js !target!

echo.
echo  Press any key to return to menu...
pause>nul

REM Return to menu if started from menu
if not "%~1"=="" goto :EOF
%0 