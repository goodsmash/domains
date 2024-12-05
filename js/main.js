import domains from './domains.js';

// Initialize Fuse.js for fuzzy search
const fuse = new Fuse(domains, {
    keys: ['name', 'category'],
    threshold: 0.4
});

let filteredDomains = [...domains];

// DOM Elements
const domainGrid = document.getElementById('domainGrid');
const searchInput = document.getElementById('domainSearchInput');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const sortFilter = document.getElementById('sortFilter');
const featuredOnly = document.getElementById('featuredOnly');
const domainCount = document.getElementById('domainCount');

// Event Listeners
searchInput.addEventListener('input', updateDomains);
categoryFilter.addEventListener('change', updateDomains);
priceFilter.addEventListener('change', updateDomains);
sortFilter.addEventListener('change', updateDomains);
featuredOnly.addEventListener('change', updateDomains);

function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

function getPriceRange(range) {
    switch(range) {
        case '0-1000': return [0, 1000];
        case '1000-10000': return [1000, 10000];
        case '10000-50000': return [10000, 50000];
        case '50000+': return [50000, Infinity];
        default: return [0, Infinity];
    }
}

function updateDomains() {
    // Search
    let results = searchInput.value
        ? fuse.search(searchInput.value).map(result => result.item)
        : [...domains];

    // Category Filter
    if (categoryFilter.value) {
        results = results.filter(domain => domain.category === categoryFilter.value);
    }

    // Price Filter
    if (priceFilter.value) {
        const [min, max] = getPriceRange(priceFilter.value);
        results = results.filter(domain => domain.buyNowPrice >= min && domain.buyNowPrice <= max);
    }

    // Featured Filter
    if (featuredOnly.checked) {
        results = results.filter(domain => domain.featured);
    }

    // Sort
    switch(sortFilter.value) {
        case 'name':
            results.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-asc':
            results.sort((a, b) => a.buyNowPrice - b.buyNowPrice);
            break;
        case 'price-desc':
            results.sort((a, b) => b.buyNowPrice - a.buyNowPrice);
            break;
    }

    filteredDomains = results;
    renderDomains();
}

function renderDomains() {
    domainGrid.innerHTML = '';
    
    filteredDomains.forEach(domain => {
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4 mb-4';
        
        const whoisLink = `https://who.is/whois/${domain.name}`;
        const afternicLink = `https://www.afternic.com/domain/${domain.name}`;
        
        // Create domain status badge
        const statusBadge = domain.domainPrivacy 
            ? '<span class="badge bg-success me-2">Domain Privacy</span>' 
            : '';
        
        const expiryBadge = domain.expiryDate 
            ? `<span class="badge bg-info me-2">Expires: ${domain.expiryDate}</span>` 
            : '';
        
        // Handle null or 0 buyNow prices
        const buyNowPrice = domain.buyNow 
            ? formatPrice(domain.buyNow) 
            : 'Not Priced';
        
        card.innerHTML = `
            <div class="card h-100 ${domain.featured ? 'featured' : ''}">
                <div class="card-body">
                    <h5 class="card-title">${domain.name}</h5>
                    <p class="card-text">
                        <span class="badge bg-primary">${domain.category}</span>
                        ${statusBadge}
                        ${expiryBadge}
                    </p>
                    <div class="domain-price">
                        <div>Buy Now: ${buyNowPrice}</div>
                    </div>
                    <div class="mt-3">
                        <a href="${whoisLink}" target="_blank" class="btn btn-sm btn-outline-info me-2">
                            <i class="bi bi-info-circle"></i> WHOIS
                        </a>
                        <a href="${afternicLink}" target="_blank" class="btn btn-sm btn-outline-success">
                            <i class="bi bi-cart"></i> Buy on Afternic
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        domainGrid.appendChild(card);
    });
    
    // Update domain count
    domainCount.textContent = `${filteredDomains.length} domain${filteredDomains.length !== 1 ? 's' : ''} found`;
}

// Clear all filters
window.clearFilters = function() {
    searchInput.value = '';
    categoryFilter.value = '';
    priceFilter.value = '';
    sortFilter.value = 'name';
    featuredOnly.checked = false;
    updateDomains();
}

// Initial render
updateDomains();
