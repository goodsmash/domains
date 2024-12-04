# GitHub Pages DNS Configuration Script

$GitHubPages = @{
    'A_Records' = @(
        "185.199.108.153",
        "185.199.109.153",
        "185.199.110.153",
        "185.199.111.153"
    )
    'CNAME' = "goodsmash.github.io"
}

function Show-DNSInstructions {
    param(
        [string]$DomainName
    )
    
    Write-Host "=== GitHub Pages DNS Configuration for $DomainName ===" -ForegroundColor Cyan
    
    Write-Host "`nStep 1: A Records" -ForegroundColor Yellow
    Write-Host "Add these A records to point your domain to GitHub Pages:"
    foreach ($ip in $GitHubPages.A_Records) {
        Write-Host "  Type: A"
        Write-Host "  Host: @"
        Write-Host "  Points to: $ip"
        Write-Host "  TTL: 3600"
        Write-Host ""
    }

    Write-Host "Step 2: CNAME Record" -ForegroundColor Yellow
    Write-Host "Add this CNAME record for www subdomain:"
    Write-Host "  Type: CNAME"
    Write-Host "  Host: www"
    Write-Host "  Points to: $($GitHubPages.CNAME)"
    Write-Host "  TTL: 3600"

    Write-Host "`nStep 3: Verification" -ForegroundColor Yellow
    Write-Host "1. Wait for DNS propagation (can take up to 24 hours)"
    Write-Host "2. Visit https://$DomainName to verify"
    Write-Host "3. Also check https://www.$DomainName"
}

# List of your domains
$Domains = @(
    "goodsmash.com",
    "web3.is",
    "adjusts.net"
)

# Show instructions for each domain
foreach ($domain in $Domains) {
    Show-DNSInstructions -DomainName $domain
    Write-Host "`nPress Enter to continue to next domain..." -ForegroundColor Green
    Read-Host
    Clear-Host
}
