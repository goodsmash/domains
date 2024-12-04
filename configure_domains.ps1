# Domain Configuration Automation Script

# Domain configurations
$DomainConfigs = @{
    "domainer" = @("domainer.net", "www.domainer.net")
    "domainpro" = @("domainpro.io", "www.domainpro.io")
    "web3domains" = @("web3domains.com", "www.web3domains.com")
    "adjusts" = @("adjusts.net", "www.adjusts.net")
    "cannabiz" = @("cannabiz.tech", "www.cannabiz.tech")
    "web3wild" = @("web3.wild", "www.web3.wild")
}

# GitHub Pages IP Addresses
$GitHubIPs = @(
    "185.199.108.153",
    "185.199.109.153", 
    "185.199.110.153", 
    "185.199.111.153"
)

# Function to configure domain for a project
function Configure-Domain {
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

    # Initialize git repository if not exists
    if (!(Test-Path ".git")) {
        git init
        git remote add origin "https://github.com/goodsmash/$ProjectName.git"
    }

    # Create CNAME file
    $Domains -join "`n" | Out-File -FilePath "CNAME" -Encoding UTF8

    # Create README with domain info
    $ReadmeContent = @"
# $ProjectName Domain Configuration

## 🌐 Supported Domains
$($Domains -join "`n")

## 🚀 Deployment
Hosted on GitHub Pages with automated domain configuration.

### DNS Configuration
- A Records: 
  - 185.199.108.153
  - 185.199.109.153
  - 185.199.110.153
  - 185.199.111.153
- CNAME: goodsmash.github.io

*Automated Domain Setup*
"@

    $ReadmeContent | Out-File -FilePath "README.md" -Encoding UTF8

    # Add, commit, and push changes
    git add .
    git commit -m "Automated domain configuration for $ProjectName"
    git push -u origin master

    Write-Host "Configured domains for $ProjectName: $($Domains -join ', ')"
}

# Main execution
function Main {
    foreach ($Project in $DomainConfigs.Keys) {
        Configure-Domain -ProjectName $Project -Domains $DomainConfigs[$Project]
    }

    Write-Host "Domain configuration complete for all projects!"
}

# Run the main function
Main
