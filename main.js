import { domains } from './domains.js';

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
    domainCount.textContent = `${filteredDomains.length} domains found`;

    filteredDomains.forEach(domain => {
        const card = document.createElement('div');
        card.className = 'col-md-4 col-lg-3';
        
        card.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">
                        <a href="https://www.afternic.com/domain/${domain.name}" target="_blank">
                            ${domain.name}
                        </a>
                    </h5>
                    <span class="badge badge-${domain.category.toLowerCase()} mb-2">
                        ${domain.category}
                    </span>
                    <div class="domain-price mb-1">
                        ${formatPrice(domain.buyNowPrice)}
                    </div>
                    <div class="domain-min-offer">
                        Min. Offer: ${formatPrice(domain.minOffer)}
                    </div>
                </div>
                <div class="card-footer bg-transparent border-top-0">
                    <a href="https://www.afternic.com/domain/${domain.name}" 
                       class="btn btn-primary btn-sm w-100" 
                       target="_blank">
                        Make Offer
                    </a>
                </div>
            </div>
        `;
        
        domainGrid.appendChild(card);
    });
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
