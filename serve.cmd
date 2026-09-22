@echo off
REM Serves this folder at http://localhost:4321 with real directory URLs.
where node >nul 2>nul && (npx --yes serve -l 4321 "%~dp0") || (py -m http.server 4321 -d "%~dp0")
