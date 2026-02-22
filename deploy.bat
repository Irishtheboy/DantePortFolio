@echo off
echo Building project...
call npm run build

echo.
echo Build complete! 
echo.
echo DEPLOYMENT INSTRUCTIONS:
echo 1. Go to your GitHub repository
echo 2. Delete all existing files (except .git folder if cloned)
echo 3. Upload ALL files from the 'build' folder to your repo root
echo 4. Make sure index.html is in the root, not in a subfolder
echo 5. Go to Settings > Pages > Source: Deploy from branch > main
echo.
echo Your build files are ready in the 'build' folder!
pause