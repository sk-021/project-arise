@echo off
setlocal

REM Start FastAPI backend on port 8010 using the project venv

set "SCRIPT_DIR=%~dp0"

"%SCRIPT_DIR%..\.venv\Scripts\python.exe" -m uvicorn main:app --host 127.0.0.1 --port 8010 --reload --log-level debug

endlocal
