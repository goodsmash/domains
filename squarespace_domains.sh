#!/bin/bash

# Squarespace Domain Configuration Script

# Declare associative array for domains
declare -A SQUARESPACE_DOMAINS=(
    ["cannabiz"]="cannabiz.tech www.cannabiz.tech"
    ["web3is"]="web3.is www.web3.is"
    ["adjusts"]="adjusts.net www.adjusts.net"
    ["goodsmash"]="goodsmash.com www.goodsmash.com"
    ["ryanjmcginley"]="ryanjmcginley.com www.ryanjmcginley.com"
    ["web3iswild"]="web3iswild.com www.web3iswild.com"
)

# GitHub Pages IP Addresses
GITHUB_IPS=(
    "185.199.108.153"
    "185.199.109.153"
    "185.199.110.153"
    "185.199.111.153"
)

# Function to create DNS configuration guide
create_dns_guide() {
    local domains=("$@")
    local guide="# Squarespace Domain DNS Configuration Guide

## DNS Records for: ${domains[*]}

### A Records
Add these A records to your domain's DNS settings:"

    for ip in "${GITHUB_IPS[@]}"; do
        guide+="

- Type: A
- Host: @
- Points to: $ip
- TTL: 3600"
    done

    guide+="

### CNAME Records
- Type: CNAME
- Host: www
- Points to: goodsmash.github.io
- TTL: 3600

## Verification Steps
1. Add these records to your domain registrar's DNS settings
2. Wait 24-48 hours for propagation
3. Verify DNS configuration using online tools

*Automated DNS Configuration Guide*"

    echo "$guide"
}

# Function to configure domain
configure_squarespace_domain() {
    local project_name=$1
    local domains=$2
    local project_path="$HOME/OneDrive/Desktop/domains/$project_name"

    # Create project directory
    mkdir -p "$project_path"
    cd "$project_path"

    # Create CNAME file
    echo "$domains" > CNAME

    # Create DNS Guide
    create_dns_guide $domains > SQUARESPACE_DNS_GUIDE.md

    # Create README
    cat > README.md << EOL
# $project_name Squarespace Domain Configuration

## 🌐 Supported Domains
$domains

## 🚀 Deployment Configuration
Detailed DNS configuration available in SQUARESPACE_DNS_GUIDE.md

*Automated Squarespace Domain Setup*
EOL

    echo "Configured Squarespace domains for $project_name: $domains"
    echo "DNS Guide and README created in $project_path"
}

# Main execution
main() {
    for project in "${!SQUARESPACE_DOMAINS[@]}"; do
        configure_squarespace_domain "$project" "${SQUARESPACE_DOMAINS[$project]}"
    done

    echo "Squarespace domain configuration complete!"
    echo "Please review the generated DNS guides in each project folder."
}

# Run the main function
main
