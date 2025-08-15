@echo off
echo Setting up environment variables for your Vercel deployment...
echo.

echo Generated SECRET_KEY: 8ff8badc60aaf1b101a85c2a34fee7e588fac97a351bed2beee541a7854e39ba
echo.

echo To complete your deployment setup:
echo.
echo 1. Go to: https://vercel.com/arun03ks-projects/core-connect/settings/environment-variables
echo.
echo 2. Add these environment variables:
echo.
echo    Variable: SECRET_KEY
echo    Value: 8ff8badc60aaf1b101a85c2a34fee7e588fac97a351bed2beee541a7854e39ba
echo    Environment: Production
echo.
echo    Variable: FLASK_ENV  
echo    Value: production
echo    Environment: Production
echo.
echo    Variable: API_VERSION
echo    Value: v1
echo    Environment: Production
echo.
echo 3. After adding variables, redeploy with: vercel --prod
echo.
echo Opening Vercel dashboard...
start https://vercel.com/arun03ks-projects/core-connect/settings/environment-variables
echo.
pause
