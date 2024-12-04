#!/bin/bash

# Domain Configuration Automation Script

# Array of domain configurations
declare -A DOMAIN_CONFIGS=(
    ["domainer"]="domainer.net www.domainer.net"
    ["domainpro"]="domainpro.io www.domainpro.io"
    ["web3domains"]="web3domains.com www.web3domains.com"
    ["adjusts"]="adjusts.net www.adjusts.net"
    ["cannabiz"]="cannabiz.tech www.cannabiz.tech"
    ["web3wild"]="web3.wild www.web3.wild"
)

# GitHub Pages IP Addresses
GITHUB_IPS=(
    "185.199.108.153"
    "185.199.109.153"
    "185.199.110.153"
    "185.199.111.153"
)

# Function to configure domain for a project
configure_domain() {
    local project_name=$1
    local domains=$2
    local project_path="$HOME/OneDrive/Desktop/domains/$project_name"

    # Create project directory if not exists
    mkdir -p "$project_path"
    cd "$project_path"

    # Initialize git repository if not exists
    if [ ! -d ".git" ]; then
        git init
        git remote add origin "https://github.com/goodsmash/$project_name.git"
    fi

    # Create CNAME file
    echo "$domains" > CNAME

    # Create README with domain info
    cat > README.md << EOL
# $project_name Domain Configuration

## 🌐 Supported Domains
$domains

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
EOL

    # Add, commit, and push changes
    git add .
    git commit -m "Automated domain configuration for $project_name"
    git push -u origin master

    echo "Configured domains for $project_name: $domains"
}

# Main execution
main() {
    # Iterate through domain configurations
    for project domain_list in "${!DOMAIN_CONFIGS[@]}"; do
        configure_domain "$project" "${DOMAIN_CONFIGS[$project]}"
    done

    echo "Domain configuration complete for all projects!"
}

# Run the main function
main
