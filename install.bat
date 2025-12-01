@echo off
echo Installing Prescure Health Platform...

echo.
echo Installing frontend dependencies...
call npm install

echo.
echo Installing backend dependencies...
cd backend
call npm install

echo.
echo Installation complete!
echo.
echo To start the application:
echo 1. Start MongoDB (make sure it's running on localhost:27017)
echo 2. Run: npm run start:backend (in one terminal)
echo 3. Run: npm run start:frontend (in another terminal)
echo.
pause