document.addEventListener('DOMContentLoaded', function() {
    const domainList = document.getElementById('domain-list');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortOption = document.getElementById('sortOption');
    const priceRangeMin = document.getElementById('priceRangeMin');
    const priceRangeMax = document.getElementById('priceRangeMax');
    const featuredToggle = document.getElementById('featuredToggle');
    const offerModal = new bootstrap.Modal(document.getElementById('offerModal'));
    let currentDomain = null;

    // Analytics helper function
    function trackEvent(eventName, eventParams) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventParams);
        }
    }

    // Initialize price range inputs
    const prices = DOMAIN_DATA.map(domain => domain.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    priceRangeMin.placeholder = formatPrice(minPrice);
    priceRangeMax.placeholder = formatPrice(maxPrice);

    // Populate category filter with counts
    const categoryCount = DOMAIN_DATA.reduce((acc, domain) => {
        acc[domain.category] = (acc[domain.category] || 0) + 1;
        return acc;
    }, {});

    const categories = [...new Set(DOMAIN_DATA.map(domain => domain.category))].sort();
    categoryFilter.innerHTML = '<option value="">All Categories</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} (${categoryCount[category]})`;
        categoryFilter.appendChild(option);
    });

    function formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(price);
    }

    function getAfternicLink(domain) {
        return `https://www.afternic.com/domain/${domain}`;
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Domain name copied to clipboard!');
        });
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast show position-fixed bottom-0 end-0 m-3';
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="toast-body">
                ${message}
                <button type="button" class="btn-close ms-2" data-bs-dismiss="toast"></button>
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    function createDomainCard(domain) {
        const afternicLink = getAfternicLink(domain.name);
        return `
            <div class="col-md-4 col-sm-6 mb-4">
                <div class="card domain-card h-100 ${domain.featured ? 'featured' : ''}">
                    ${domain.featured ? '<div class="featured-badge">Featured</div>' : ''}
                    <div class="card-body">
                        <h5 class="card-title d-flex justify-content-between align-items-center">
                            <a href="${afternicLink}" 
                               target="_blank" 
                               class="domain-link"
                               onclick="trackDomainClick('${domain.name}', 'title')">${domain.name}</a>
                            <button class="btn btn-sm btn-outline-secondary copy-btn"
                                    onclick="copyToClipboard('${domain.name}')"
                                    title="Copy domain name">
                                <i class="bi bi-clipboard"></i>
                            </button>
                        </h5>
                        <p class="card-text">
                            <span class="badge bg-secondary">${domain.category}</span>
                            ${domain.featured ? '<span class="badge bg-primary ms-1">Featured</span>' : ''}
                        </p>
                        <p class="price">${formatPrice(domain.price)}</p>
                        <div class="d-grid gap-2">
                            <a href="${afternicLink}" 
                               target="_blank" 
                               class="btn btn-buy-now"
                               onclick="trackDomainClick('${domain.name}', 'buy')">
                                <i class="bi bi-cart"></i> Buy Now
                            </a>
                            <button class="btn btn-make-offer" 
                                    onclick="handleMakeOffer('${domain.name}')">
                                <i class="bi bi-chat-text"></i> Make an Offer
                            </button>
                            <button class="btn btn-outline-secondary whois-btn"
                                    onclick="checkWhois('${domain.name}')"
                                    title="Check WHOIS">
                                <i class="bi bi-info-circle"></i> WHOIS
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function filterAndSortDomains() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const [sortBy, sortOrder] = sortOption.value.split('-');
        const minPriceVal = priceRangeMin.value ? parseFloat(priceRangeMin.value) : 0;
        const maxPriceVal = priceRangeMax.value ? parseFloat(priceRangeMax.value) : Infinity;
        const showFeaturedOnly = featuredToggle.checked;

        // Track search if there's a term
        if (searchTerm) {
            trackEvent('domain_search', {
                search_term: searchTerm
            });
        }

        // Track category filter changes
        if (selectedCategory) {
            trackEvent('category_filter', {
                category: selectedCategory
            });
        }

        let filteredDomains = DOMAIN_DATA.filter(domain => {
            const matchesSearch = domain.name.toLowerCase().includes(searchTerm);
            const matchesCategory = !selectedCategory || domain.category === selectedCategory;
            const matchesPrice = domain.price >= minPriceVal && domain.price <= maxPriceVal;
            const matchesFeatured = !showFeaturedOnly || domain.featured;
            return matchesSearch && matchesCategory && matchesPrice && matchesFeatured;
        });

        filteredDomains.sort((a, b) => {
            // Always show featured domains first if featured filter is on
            if (showFeaturedOnly && a.featured !== b.featured) {
                return b.featured ? 1 : -1;
            }

            let comparison = 0;
            if (sortBy === 'name') {
                comparison = a.name.localeCompare(b.name);
            } else if (sortBy === 'price') {
                comparison = a.price - b.price;
            }
            return sortOrder === 'desc' ? -comparison : comparison;
        });

        domainList.innerHTML = filteredDomains.map(createDomainCard).join('');

        // Update results count
        const resultsCount = document.getElementById('resultsCount');
        resultsCount.textContent = `${filteredDomains.length} domain${filteredDomains.length === 1 ? '' : 's'} found`;

        // Track number of results
        trackEvent('search_results', {
            count: filteredDomains.length,
            search_term: searchTerm,
            category: selectedCategory,
            price_range: `${minPriceVal}-${maxPriceVal}`,
            featured_only: showFeaturedOnly
        });
    }

    // Event listeners
    searchInput.addEventListener('input', filterAndSortDomains);
    searchButton.addEventListener('click', filterAndSortDomains);
    categoryFilter.addEventListener('change', filterAndSortDomains);
    priceRangeMin.addEventListener('input', filterAndSortDomains);
    priceRangeMax.addEventListener('input', filterAndSortDomains);
    featuredToggle.addEventListener('change', filterAndSortDomains);
    sortOption.addEventListener('change', () => {
        trackEvent('sort_change', {
            sort_option: sortOption.value
        });
        filterAndSortDomains();
    });

    // Handle offer submission
    document.getElementById('submitOffer').addEventListener('click', function() {
        const amount = document.getElementById('offerAmount').value;
        const email = document.getElementById('offerEmail').value;
        const message = document.getElementById('offerMessage').value;

        if (!amount || !email) {
            alert('Please fill in all required fields');
            return;
        }

        // Track offer submission
        trackEvent('offer_submitted', {
            domain: currentDomain.name,
            amount: amount,
            category: currentDomain.category
        });

        // Send email using mailto
        const subject = `Offer for ${currentDomain.name}`;
        const body = `Domain: ${currentDomain.name}%0D%0AOffer Amount: ${formatPrice(amount)}%0D%0AFrom: ${email}%0D%0AMessage: ${message}`;
        window.location.href = `mailto:cannafirm@gmail.com?subject=${subject}&body=${body}`;

        showToast('Thank you for your offer! Redirecting to email client...');
        offerModal.hide();
    });

    // Make these functions available globally
    window.handleMakeOffer = function(domain) {
        currentDomain = DOMAIN_DATA.find(d => d.name === domain);
        
        // Track offer modal open
        trackEvent('offer_modal_opened', {
            domain: domain
        });
        
        offerModal.show();
    };

    window.trackDomainClick = function(domain, clickType) {
        trackEvent('domain_click', {
            domain: domain,
            click_type: clickType
        });
    };

    window.copyToClipboard = copyToClipboard;

    window.checkWhois = function(domain) {
        window.open(`https://whois.domaintools.com/${domain}`, '_blank');
        trackEvent('whois_check', {
            domain: domain
        });
    };

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initial load
    filterAndSortDomains();
});
