@echo off
echo ========================================
echo Todo List App - Startup Script
echo ========================================
echo.
echo Please make sure MongoDB is running before proceeding.
echo.
echo To start MongoDB:
echo 1. Open Command Prompt as Administrator
echo 2. Run: net start MongoDB
echo    OR
echo 1. Start MongoDB service from Services panel
echo.
echo After MongoDB is running, press any key to start the Todo List app...
pause
echo.
echo Starting the Todo List application...
echo Frontend will be available at: http://localhost:3000
echo Backend API will be available at: http://localhost:5000
echo.
npm run dev