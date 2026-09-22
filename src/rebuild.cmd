@echo off
REM Regenerates every HTML page in this folder from src\data\*.js
REM   rebuild.cmd          -> links that work by double-click from disk
REM   rebuild.cmd pretty   -> directory URLs, for a real web server
pushd "%~dp0.."
node "src\build.mjs" "." %1
popd
