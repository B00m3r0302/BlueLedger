# BlueLedger Login Test Script
# Educational security testing script for defensive purposes

param(
    [Parameter(Mandatory=$false)]
    [string]$BaseUrl = "http://localhost",
    
    [Parameter(Mandatory=$false)]
    [string]$Username = "pedermo",
    
    [Parameter(Mandatory=$false)]
    [string]$Password = ""
)

# Prompt for password if not provided
if ([string]::IsNullOrEmpty($Password)) {
    $SecurePassword = Read-Host "Enter password for user '$Username'" -AsSecureString
    $Password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecurePassword))
}

# Construct login URL
$LoginUrl = "$BaseUrl/login.php"

# Prepare form data
$FormData = @{
    username = $Username
    password = $Password
}

try {
    Write-Host "Attempting login to BlueLedger..." -ForegroundColor Yellow
    Write-Host "URL: $LoginUrl" -ForegroundColor Gray
    Write-Host "Username: $Username" -ForegroundColor Gray
    
    # Create web session to maintain cookies
    $Session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    
    # Send login request
    $Response = Invoke-WebRequest -Uri $LoginUrl -Method POST -Body $FormData -SessionVariable Session -UseBasicParsing
    
    # Check for successful login (redirect to dashboard or success indicators)
    if ($Response.StatusCode -eq 200) {
        if ($Response.Content -match "dashboard" -or $Response.Headers.Location -match "dashboard") {
            Write-Host "✓ Login successful!" -ForegroundColor Green
            Write-Host "Session cookies saved for further requests." -ForegroundColor Green
            
            # Display session information
            Write-Host "`nSession Details:" -ForegroundColor Cyan
            $Session.Cookies.GetCookies($LoginUrl) | ForEach-Object {
                Write-Host "  Cookie: $($_.Name) = $($_.Value)" -ForegroundColor Gray
            }
            
        } elseif ($Response.Content -match "Invalid username or password") {
            Write-Host "✗ Login failed: Invalid credentials" -ForegroundColor Red
        } else {
            Write-Host "? Login status unclear - check response manually" -ForegroundColor Yellow
            Write-Host "Response content (first 200 chars):" -ForegroundColor Gray
            Write-Host $Response.Content.Substring(0, [Math]::Min(200, $Response.Content.Length)) -ForegroundColor Gray
        }
    } else {
        Write-Host "✗ HTTP Error: $($Response.StatusCode)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "✗ Error occurred during login attempt:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

# Clear password from memory
$Password = $null
[System.GC]::Collect()

Write-Host "`nScript completed." -ForegroundColor Cyan