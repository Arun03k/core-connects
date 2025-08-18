# 🔐 PowerShell Script to Generate Secure Keys

Write-Host "🔑 Generating secure keys..." -ForegroundColor Green
Write-Host ""

Write-Host "SECRET_KEY:" -ForegroundColor Yellow
$bytes1 = New-Object byte[] 32
[System.Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes1)
$secretKey = [System.BitConverter]::ToString($bytes1) -replace '-'
Write-Host $secretKey.ToLower() -ForegroundColor Cyan

Write-Host ""
Write-Host "JWT_SECRET_KEY:" -ForegroundColor Yellow
$bytes2 = New-Object byte[] 32
[System.Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes2)
$jwtKey = [System.BitConverter]::ToString($bytes2) -replace '-'
Write-Host $jwtKey.ToLower() -ForegroundColor Cyan

Write-Host ""
Write-Host "✅ Copy these values to replace the ones in vercel-env-copy-paste.txt" -ForegroundColor Green
Write-Host "📝 Make sure each key is different and 64 characters long" -ForegroundColor Blue
