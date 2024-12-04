# Comprehensive Domain Management Script

# Domain Class to represent each domain
class Domain {
    [string]$Name
    [string]$Status
    [datetime]$ExpirationDate
    [string]$Platform
    [bool]$IsForwarding
    [string]$ForwardingDestination

    # Constructor
    Domain([string]$name, [string]$status, [datetime]$expiration, [string]$platform, [bool]$isForwarding, [string]$forwardingDest) {
        $this.Name = $name
        $this.Status = $status
        $this.ExpirationDate = $expiration
        $this.Platform = $platform
        $this.IsForwarding = $isForwarding
        $this.ForwardingDestination = $forwardingDest
    }

    # Method to check if domain is expiring soon
    [bool]IsExpiringSoon() {
        $daysUntilExpiration = ($this.ExpirationDate - (Get-Date)).Days
        return $daysUntilExpiration -le 60
    }

    # Method to generate renewal reminder
    [string]GetRenewalReminder() {
        $daysLeft = ($this.ExpirationDate - (Get-Date)).Days
        return "$($this.Name) expires in $daysLeft days. Current status: $($this.Status)"
    }
}

# Domain Management Functions
function Get-DomainInventory {
    $domains = @(
        [Domain]::new("adjusts.net", "Active", [datetime]::ParseExact("Mar 12, 2025", "MMM d, yyyy", $null), "Squarespace", $false, ""),
        [Domain]::new("adoptive.net", "Active", [datetime]::ParseExact("Dec 14, 2025", "MMM d, yyyy", $null), "Squarespace", $false, ""),
        [Domain]::new("adopts.net", "Active", [datetime]::ParseExact("Feb 25, 2025", "MMM d, yyyy", $null), "Squarespace", $false, ""),
        [Domain]::new("amain.org", "Forwards", [datetime]::ParseExact("Aug 16, 2025", "MMM d, yyyy", $null), "Squarespace", $true, "www.amain.org"),
        [Domain]::new("cannafirm.net", "Active", [datetime]::ParseExact("Dec 26, 2024", "MMM d, yyyy", $null), "Squarespace", $false, ""),
        [Domain]::new("cannabiz.tech", "Active", [datetime]::ParseExact("Mar 12, 2025", "MMM d, yyyy", $null), "Squarespace", $false, ""),
        [Domain]::new("web3.is", "Active", [datetime]::ParseExact("Mar 12, 2025", "MMM d, yyyy", $null), "Squarespace", $false, ""),
        [Domain]::new("goodsmash.com", "Active", [datetime]::ParseExact("Mar 12, 2025", "MMM d, yyyy", $null), "Squarespace", $false, ""),
        [Domain]::new("ryanjmcginley.com", "Active", [datetime]::ParseExact("Mar 12, 2025", "MMM d, yyyy", $null), "Squarespace", $false, ""),
        [Domain]::new("web3iswild.com", "Active", [datetime]::ParseExact("Mar 12, 2025", "MMM d, yyyy", $null), "Squarespace", $false, "")
    )

    return $domains
}

function Get-ExpiringDomains {
    $domains = Get-DomainInventory
    return $domains | Where-Object { $_.IsExpiringSoon() }
}

function Export-DomainReport {
    param(
        [string]$OutputPath = "C:\Users\ryanm\OneDrive\Desktop\domain_report.csv"
    )

    $domains = Get-DomainInventory
    $domains | Export-Csv -Path $OutputPath -NoTypeInformation

    Write-Host "Domain report exported to $OutputPath"
}

function Send-RenewalReminders {
    $expiringDomains = Get-ExpiringDomains

    foreach ($domain in $expiringDomains) {
        $reminder = $domain.GetRenewalReminder()
        Write-Host $reminder -ForegroundColor Yellow

        # TODO: Implement email notification logic
        # Send-MailMessage -From "domains@goodsmash.com" -To "ryanjmcginley@gmail.com" -Subject "Domain Expiration Reminder" -Body $reminder
    }
}

function Analyze-DomainPortfolio {
    $domains = Get-DomainInventory

    $analysis = @{
        TotalDomains = $domains.Count
        ActiveDomains = ($domains | Where-Object { $_.Status -eq "Active" }).Count
        ForwardingDomains = ($domains | Where-Object { $_.IsForwarding }).Count
        ExpiringThisYear = ($domains | Where-Object { $_.ExpirationDate.Year -eq (Get-Date).Year }).Count
    }

    Write-Host "Domain Portfolio Analysis:"
    $analysis.GetEnumerator() | ForEach-Object { 
        Write-Host "$($_.Key): $($_.Value)" 
    }

    return $analysis
}

# Main Menu Function
function Show-DomainManagementMenu {
    while ($true) {
        Clear-Host
        Write-Host "=== Domain Management Dashboard ===" -ForegroundColor Cyan
        Write-Host "1. View Domain Inventory"
        Write-Host "2. Check Expiring Domains"
        Write-Host "3. Export Domain Report"
        Write-Host "4. Analyze Domain Portfolio"
        Write-Host "5. Send Renewal Reminders"
        Write-Host "6. Exit"

        $choice = Read-Host "Select an option (1-6)"

        switch ($choice) {
            '1' { Get-DomainInventory | Format-Table -AutoSize }
            '2' { Get-ExpiringDomains | Format-Table -AutoSize }
            '3' { Export-DomainReport }
            '4' { Analyze-DomainPortfolio }
            '5' { Send-RenewalReminders }
            '6' { break }
            default { Write-Host "Invalid option. Try again." -ForegroundColor Red }
        }

        if ($choice -eq '6') { break }
        
        Read-Host "Press Enter to continue..."
    }
}

# Run the menu
Show-DomainManagementMenu
