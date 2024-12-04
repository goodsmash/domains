# Squarespace Domain Configuration Script

# Domain Configuration
$SquarespaceDomains = @{
    "cannabiz" = @("cannabiz.tech", "www.cannabiz.tech")
    "web3is" = @("web3.is", "www.web3.is")
    "adjusts" = @("adjusts.net", "www.adjusts.net")
    "goodsmash" = @("goodsmash.com", "www.goodsmash.com")
    "ryanjmcginley" = @("ryanjmcginley.com", "www.ryanjmcginley.com")
    "web3iswild" = @("web3iswild.com", "www.web3iswild.com")
}

# Squarespace Nameserver Configuration
$SquarespaceNameservers = @(
    "ns1.squarespace.com",
    "ns2.squarespace.com",
    "ns3.squarespace.com",
    "ns4.squarespace.com"
)

# DNS Records for verification
$DNSRecords = @{
    'A' = @{
        'Host' = '@'
        'Points_To' = @(
            "198.185.159.144",
            "198.185.159.145",
            "198.49.23.144",
            "198.49.23.145"
        )
        'TTL' = 3600
    }
    'CNAME' = @{
        'Host' = 'www'
        'Points_To' = 'ext-cust.squarespace.com'
        'TTL' = 3600
    }
}

# GitHub Pages IP Addresses
$GitHubIPs = @(
    "185.199.108.153",
    "185.199.109.153", 
    "185.199.110.153", 
    "185.199.111.153"
)

# Function to create DNS configuration guide
function Create-DNSGuide {
    param (
        [string[]]$Domains
    )

    $guide = @"
# Squarespace Domain DNS Configuration Guide

## DNS Records for: $($Domains -join ', ')

### A Records
Add these A records to your domain's DNS settings:
"@

    foreach ($ip in $GitHubIPs) {
        $guide += @"

- Type: A
- Host: @
- Points to: $ip
- TTL: 3600
"@
    }

    $guide += @"

### CNAME Records
- Type: CNAME
- Host: www
- Points to: goodsmash.github.io
- TTL: 3600

## Verification Steps
1. Add these records to your domain registrar's DNS settings
2. Wait 24-48 hours for propagation
3. Verify DNS configuration using online tools

*Automated DNS Configuration Guide*
"@

    return $guide
}

function Write-DNSInstructions {
    param(
        [string]$DomainName
    )
    
    Write-Host "=== DNS Configuration Instructions for $DomainName ===" -ForegroundColor Cyan
    Write-Host "`nStep 1: Set Nameservers" -ForegroundColor Yellow
    Write-Host "Configure your domain registrar to use these nameservers:"
    foreach ($ns in $SquarespaceNameservers) {
        Write-Host "  - $ns"
    }

    Write-Host "`nStep 2: DNS Records (if using custom DNS)" -ForegroundColor Yellow
    Write-Host "A Records:"
    foreach ($ip in $DNSRecords.A.Points_To) {
        Write-Host "  Host: @"
        Write-Host "  Points to: $ip"
        Write-Host "  TTL: 3600"
        Write-Host ""
    }

    Write-Host "CNAME Record:"
    Write-Host "  Host: www"
    Write-Host "  Points to: $($DNSRecords.CNAME.Points_To)"
    Write-Host "  TTL: 3600"

    Write-Host "`nStep 3: Verification" -ForegroundColor Yellow
    Write-Host "1. Log into Squarespace"
    Write-Host "2. Go to Settings > Domains"
    Write-Host "3. Click on $DomainName"
    Write-Host "4. Wait for DNS verification (can take up to 24-72 hours)"
}

# Function to configure domain
function Configure-SquarespaceDomain {
    param (
        [string]$ProjectName,
        [string[]]$Domains
    )

    $ProjectPath = Join-Path $env:USERPROFILE "OneDrive\Desktop\domains\$ProjectName"

    # Create project directory if not exists
    if (!(Test-Path $ProjectPath)) {
        New-Item -ItemType Directory -Path $ProjectPath | Out-Null
    }

    Set-Location $ProjectPath

    # Create CNAME file
    $Domains -join "`n" | Out-File -FilePath "CNAME" -Encoding UTF8

    # Create DNS Guide
    $DNSGuide = Create-DNSGuide -Domains $Domains
    $DNSGuide | Out-File -FilePath "SQUARESPACE_DNS_GUIDE.md" -Encoding UTF8

    # Create README
    $ReadmeContent = @"
# $ProjectName Squarespace Domain Configuration

## 🌐 Supported Domains
$($Domains -join "`n")

## 🚀 Deployment Configuration
Detailed DNS configuration available in SQUARESPACE_DNS_GUIDE.md

*Automated Squarespace Domain Setup*
"@

    $ReadmeContent | Out-File -FilePath "README.md" -Encoding UTF8

    Write-Host "Configured Squarespace domains for $ProjectName: $($Domains -join ', ')"
    Write-Host "DNS Guide and README created in $ProjectPath"
}

# Main execution function
function Main {
    foreach ($Project in $SquarespaceDomains.Keys) {
        Configure-SquarespaceDomain -ProjectName $Project -Domains $SquarespaceDomains[$Project]
    }

    Write-Host "Squarespace domain configuration complete!"
    Write-Host "Please review the generated DNS guides in each project folder."

    $Domains = @(
        "adjusts.net",
        "adoptive.net",
        "adopts.net",
        "amain.org",
        "awaits.net",
        "awakes.net",
        "cannafirm.net",
        "web3.is",
        "goodsmash.com"
    )

    # Generate instructions for each domain
    foreach ($domain in $Domains) {
        Write-DNSInstructions -DomainName $domain
        Write-Host "`n=== Press Enter to continue to next domain ===" -ForegroundColor Green
        Read-Host
        Clear-Host
    }
}

# Run the main function
Main
