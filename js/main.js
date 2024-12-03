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

    function createDomainListItem(domain) {
        const afternicLink = getAfternicLink(domain.name);
        return `
            <div class="domain-list-item ${domain.featured ? 'featured' : ''}">
                <div class="domain-info">
                    <h5 class="mb-1">
                        <a href="${afternicLink}" 
                           target="_blank" 
                           class="domain-link"
                           onclick="trackDomainClick('${domain.name}', 'title')">${domain.name}</a>
                        ${domain.featured ? '<span class="badge bg-warning ms-2">Featured</span>' : ''}
                    </h5>
                    <p class="mb-1">
                        <span class="badge bg-secondary">${domain.category}</span>
                        <span class="ms-2">${formatPrice(domain.price)}</span>
                    </p>
                </div>
                <div class="domain-actions">
                    <button class="btn btn-sm btn-outline-secondary"
                            onclick="copyToClipboard('${domain.name}')"
                            title="Copy domain name">
                        <i class="bi bi-clipboard"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary"
                            onclick="checkWhois('${domain.name}')"
                            title="Check WHOIS">
                        <i class="bi bi-info-circle"></i>
                    </button>
                    <a href="${afternicLink}" 
                       target="_blank" 
                       class="btn btn-sm btn-success"
                       onclick="trackDomainClick('${domain.name}', 'buy')">
                        <i class="bi bi-cart"></i> Buy
                    </a>
                    <button class="btn btn-sm btn-warning"
                            onclick="handleMakeOffer('${domain.name}')">
                        <i class="bi bi-chat-text"></i> Offer
                    </button>
                </div>
            </div>
        `;
    }

    function getFilteredDomains() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const minPriceVal = priceRangeMin.value ? parseFloat(priceRangeMin.value) : 0;
        const maxPriceVal = priceRangeMax.value ? parseFloat(priceRangeMax.value) : Infinity;
        const showFeaturedOnly = featuredToggle.checked;

        return DOMAIN_DATA.filter(domain => {
            const matchesSearch = domain.name.toLowerCase().includes(searchTerm);
            const matchesCategory = !selectedCategory || domain.category === selectedCategory;
            const matchesPrice = domain.price >= minPriceVal && domain.price <= maxPriceVal;
            const matchesFeatured = !showFeaturedOnly || domain.featured;
            return matchesSearch && matchesCategory && matchesPrice && matchesFeatured;
        });
    }

    function applyAdvancedFilters(domains) {
        const lengthFilter = document.getElementById('lengthFilter').value;
        const characterFilter = document.getElementById('characterFilter').value;
        const dateAddedFilter = document.getElementById('dateAddedFilter').value;
        const tldFilter = document.getElementById('tldFilter').value;

        return domains.filter(domain => {
            // Length Filter
            const domainLength = domain.name.length;
            if (lengthFilter === 'short' && domainLength > 6) return false;
            if (lengthFilter === 'medium' && (domainLength <= 6 || domainLength > 12)) return false;
            if (lengthFilter === 'long' && domainLength <= 12) return false;

            // Character Type Filter
            const hasNumbers = /\d/.test(domain.name);
            const hasSpecialChars = /[^a-zA-Z0-9]/.test(domain.name);
            if (characterFilter === 'letters' && (hasNumbers || hasSpecialChars)) return false;
            if (characterFilter === 'numbers' && !hasNumbers) return false;
            if (characterFilter === 'special' && !hasSpecialChars) return false;

            // Date Added Filter
            const domainDate = new Date(domain.dateAdded || Date.now());
            const today = new Date();
            const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

            if (dateAddedFilter === 'today' && domainDate.toDateString() !== today.toDateString()) return false;
            if (dateAddedFilter === 'week' && domainDate < oneWeekAgo) return false;
            if (dateAddedFilter === 'month' && domainDate < oneMonthAgo) return false;

            // TLD Filter
            if (tldFilter && !domain.name.endsWith(tldFilter)) return false;

            return true;
        });
    }

    function filterAndSortDomains() {
        const filteredDomains = applyAdvancedFilters(getFilteredDomains());
        const [sortBy, sortOrder] = sortOption.value.split('-');

        filteredDomains.sort((a, b) => {
            if (sortBy === 'featured') {
                return b.featured - a.featured;
            }
            
            let comparison = 0;
            if (sortBy === 'name') {
                comparison = a.name.localeCompare(b.name);
            } else if (sortBy === 'price') {
                comparison = a.price - b.price;
            }
            return sortOrder === 'desc' ? -comparison : comparison;
        });

        let isGridView = true;
        const domainHTML = filteredDomains.map(domain => 
            isGridView ? createDomainCard(domain) : createDomainListItem(domain)
        ).join('');

        domainList.innerHTML = domainHTML || `
            <div class="col-12 text-center py-5">
                <div class="no-results">
                    <i class="bi bi-search display-1"></i>
                    <h3 class="mt-3">No domains found</h3>
                    <p class="text-muted">Try adjusting your search criteria</p>
                </div>
            </div>
        `;

        // Update results count
        const resultsCount = document.getElementById('resultsCount');
        resultsCount.textContent = `${filteredDomains.length} domain${filteredDomains.length === 1 ? '' : 's'} found`;

        // Track results
        trackEvent('search_results', {
            count: filteredDomains.length,
            search_term: searchInput.value,
            category: categoryFilter.value,
            price_range: `${priceRangeMin.value}-${priceRangeMax.value}`,
            featured_only: featuredToggle.checked,
            view_type: isGridView ? 'grid' : 'list'
        });
    }

    // Export Functionality
    function exportDomains(format) {
        const filteredDomains = applyAdvancedFilters(getFilteredDomains());
        let exportContent = '';
        let mimeType = '';
        let filename = `domain_list.${format}`;

        switch(format) {
            case 'csv':
                exportContent = [
                    ['Domain', 'Category', 'Price', 'Featured', 'Date Added'].join(','),
                    ...filteredDomains.map(d => [
                        d.name,
                        d.category,
                        formatPrice(d.price),
                        d.featured ? 'Yes' : 'No',
                        new Date(d.dateAdded).toLocaleDateString()
                    ].join(','))
                ].join('\n');
                mimeType = 'text/csv';
                break;
            
            case 'json':
                exportContent = JSON.stringify(filteredDomains, null, 2);
                mimeType = 'application/json';
                break;
            
            case 'xml':
                exportContent = `<?xml version="1.0" encoding="UTF-8"?>
<domains>
    ${filteredDomains.map(d => `
    <domain>
        <name>${d.name}</name>
        <category>${d.category}</category>
        <price>${formatPrice(d.price)}</price>
        <featured>${d.featured ? 'Yes' : 'No'}</featured>
        <dateAdded>${new Date(d.dateAdded).toLocaleDateString()}</dateAdded>
    </domain>`).join('')}
</domains>`;
                mimeType = 'application/xml';
                break;
            
            case 'pdf':
                exportPDF();
                return;
        }

        const blob = new Blob([exportContent], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', filename);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        trackEvent('domains_exported', {
            format: format,
            count: filteredDomains.length
        });
    }

    // PDF Export Functionality
    function exportPDF() {
        const { jsPDF } = window.jspdf;
        const filteredDomains = applyAdvancedFilters(getFilteredDomains());
        
        // Create a new PDF document
        const doc = new jsPDF();
        
        // Add title and metadata
        doc.setFontSize(18);
        doc.text('Premium Domain Portfolio', 14, 22);
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
        
        // Prepare table data
        const tableColumn = ["Domain", "Category", "Price", "Featured", "Date Added"];
        const tableRows = filteredDomains.map(d => [
            d.name,
            d.category,
            formatPrice(d.price),
            d.featured ? 'Yes' : 'No',
            new Date(d.dateAdded).toLocaleDateString()
        ]);

        // Add table
        doc.autoTable({
            startY: 40,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            styles: {
                fontSize: 9,
                cellPadding: 3
            },
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255
            }
        });

        // Add summary statistics
        const stats = {
            totalDomains: filteredDomains.length,
            totalValue: filteredDomains.reduce((sum, d) => sum + d.price, 0),
            avgPrice: filteredDomains.reduce((sum, d) => sum + d.price, 0) / filteredDomains.length,
            featuredCount: filteredDomains.filter(d => d.featured).length
        };

        doc.setFontSize(10);
        doc.text(`Total Domains: ${stats.totalDomains}`, 14, doc.autoTable.previous.finalY + 10);
        doc.text(`Total Portfolio Value: ${formatPrice(stats.totalValue)}`, 14, doc.autoTable.previous.finalY + 20);
        doc.text(`Average Domain Price: ${formatPrice(stats.avgPrice)}`, 14, doc.autoTable.previous.finalY + 30);
        doc.text(`Featured Domains: ${stats.featuredCount}`, 14, doc.autoTable.previous.finalY + 40);

        // Save the PDF
        doc.save('domain_portfolio.pdf');

        trackEvent('domains_exported', {
            format: 'pdf',
            count: filteredDomains.length
        });
    }

    // Share Functionality
    function shareDomains() {
        const filteredDomains = applyAdvancedFilters(getFilteredDomains());
        const shareText = `Check out these ${filteredDomains.length} premium domains!\n\n` +
            filteredDomains.map(d => `${d.name} - ${formatPrice(d.price)}`).join('\n') +
            `\n\nDiscover more at: https://goodsmash.github.io/domainer/`;

        if (navigator.share) {
            navigator.share({
                title: 'Premium Domain Portfolio',
                text: shareText,
                url: 'https://goodsmash.github.io/domainer/'
            }).then(() => {
                trackEvent('domains_shared', {
                    count: filteredDomains.length
                });
            }).catch(console.error);
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(shareText).then(() => {
                showToast('Domains copied to clipboard!', 'success');
                trackEvent('domains_share_fallback', {
                    count: filteredDomains.length
                });
            });
        }
    }

    // Domain Recommendation System
    function generateDomainRecommendations() {
        const currentDomains = getFilteredDomains();
        const recommendations = [];

        // Recommendation strategies
        const strategies = [
            // Similar category recommendation
            () => {
                const categories = [...new Set(DOMAIN_DATA.map(d => d.category))];
                return categories.map(cat => 
                    DOMAIN_DATA.filter(d => 
                        d.category === cat && 
                        !currentDomains.some(cd => cd.name === d.name)
                    ).slice(0, 3)
                ).flat();
            },
            
            // Price range recommendation
            () => {
                const avgPrice = currentDomains.reduce((sum, d) => sum + d.price, 0) / currentDomains.length;
                return DOMAIN_DATA.filter(d => 
                    Math.abs(d.price - avgPrice) <= avgPrice * 0.5 &&
                    !currentDomains.some(cd => cd.name === d.name)
                );
            },
            
            // Keyword-based recommendation
            () => {
                const currentKeywords = currentDomains.flatMap(d => d.keywords || []);
                return DOMAIN_DATA.filter(d => 
                    d.keywords && 
                    d.keywords.some(k => currentKeywords.includes(k)) &&
                    !currentDomains.some(cd => cd.name === d.name)
                );
            }
        ];

        // Apply strategies and collect unique recommendations
        strategies.forEach(strategy => {
            strategy().forEach(rec => {
                if (!recommendations.some(r => r.name === rec.name)) {
                    recommendations.push(rec);
                }
            });
        });

        return recommendations.slice(0, 5); // Limit to 5 recommendations
    }

    // Render Recommendations
    function renderDomainRecommendations() {
        const recommendations = generateDomainRecommendations();
        const recommendationContainer = document.getElementById('domain-recommendations');
        
        if (recommendations.length === 0) {
            recommendationContainer.innerHTML = `
                <div class="alert alert-info">
                    No recommendations available at the moment.
                </div>
            `;
            return;
        }

        recommendationContainer.innerHTML = `
            <div class="row">
                ${recommendations.map(domain => `
                    <div class="col-md-4 mb-3">
                        <div class="card recommendation-card">
                            <div class="card-body">
                                <h5 class="card-title">${domain.name}</h5>
                                <p class="card-text">
                                    <span class="badge bg-primary">${domain.category}</span>
                                    <span class="badge bg-success ms-2">${formatPrice(domain.price)}</span>
                                </p>
                                <p class="card-text text-muted">${domain.description}</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <a href="#" class="btn btn-sm btn-outline-primary" onclick="showDomainDetails('${domain.name}')">
                                        View Details
                                    </a>
                                    <span class="text-muted small">
                                        Added ${formatRelativeTime(domain.dateAdded)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Utility: Format Relative Time
    function formatRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.round((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'today';
        if (diffDays === 1) return 'yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays/7)} weeks ago`;
        return new Date(dateString).toLocaleDateString();
    }

    // Statistics and Visualization
    function generateStatisticsCharts() {
        // Price Distribution Chart
        const priceData = DOMAIN_DATA.map(d => d.price);
        const priceDistribution = {
            labels: ['Low', 'Medium', 'High'],
            series: [
                priceData.filter(p => p < 5000).length,
                priceData.filter(p => p >= 5000 && p < 50000).length,
                priceData.filter(p => p >= 50000).length
            ]
        };

        // Category Distribution Chart
        const categoryData = {};
        DOMAIN_DATA.forEach(d => {
            categoryData[d.category] = (categoryData[d.category] || 0) + 1;
        });

        const categoryDistribution = {
            labels: Object.keys(categoryData),
            series: Object.values(categoryData)
        };

        // Render charts if Chartist.js is available
        if (typeof Chartist !== 'undefined') {
            new Chartist.Pie('#priceDistribution', priceDistribution, {
                donut: true,
                donutWidth: 20,
                startAngle: 270,
                total: DOMAIN_DATA.length
            });

            new Chartist.Pie('#categoryDistribution', categoryDistribution, {
                donut: true,
                donutWidth: 20,
                startAngle: 270,
                total: DOMAIN_DATA.length
            });
        }
    }

    // Event Listeners for Export and Share
    document.getElementById('exportCSV').addEventListener('click', () => exportDomains('csv'));
    document.getElementById('exportJSON').addEventListener('click', () => exportDomains('json'));
    document.getElementById('exportXML').addEventListener('click', () => exportDomains('xml'));
    document.getElementById('exportPDF').addEventListener('click', () => exportPDF());
    document.getElementById('shareButton').addEventListener('click', shareDomains);

    // Advanced Filter Event Listeners
    ['lengthFilter', 'characterFilter', 'dateAddedFilter', 'tldFilter'].forEach(filterId => {
        document.getElementById(filterId).addEventListener('change', filterAndSortDomains);
    });

    // Initialize on load
    generateStatisticsCharts();

    // Initialize statistics
    function updateStatistics() {
        const stats = {
            totalDomains: DOMAIN_DATA.length,
            featuredDomains: DOMAIN_DATA.filter(d => d.featured).length,
            totalCategories: new Set(DOMAIN_DATA.map(d => d.category)).size,
            avgPrice: DOMAIN_DATA.reduce((acc, d) => acc + d.price, 0) / DOMAIN_DATA.length
        };

        document.getElementById('totalDomains').textContent = stats.totalDomains;
        document.getElementById('featuredDomains').textContent = stats.featuredDomains;
        document.getElementById('totalCategories').textContent = stats.totalCategories;
        document.getElementById('avgPrice').textContent = formatPrice(stats.avgPrice);

        trackEvent('statistics_viewed', {
            total_domains: stats.totalDomains,
            featured_domains: stats.featuredDomains,
            total_categories: stats.totalCategories,
            avg_price: stats.avgPrice
        });
    }

    // Clear all filters
    document.getElementById('clearFilters').addEventListener('click', function() {
        searchInput.value = '';
        categoryFilter.value = '';
        sortOption.value = 'name-asc';
        priceRangeMin.value = '';
        priceRangeMax.value = '';
        featuredToggle.checked = false;
        
        filterAndSortDomains();
        trackEvent('filters_cleared');
    });

    // Toggle view between grid and list
    let isGridView = true;
    document.getElementById('toggleView').addEventListener('click', function() {
        isGridView = !isGridView;
        const icon = this.querySelector('i');
        icon.className = isGridView ? 'bi bi-list' : 'bi bi-grid';
        
        filterAndSortDomains();
        trackEvent('view_toggled', {
            view_type: isGridView ? 'grid' : 'list'
        });
    });

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

    // Initialize statistics and view
    updateStatistics();
    filterAndSortDomains();
    renderDomainRecommendations();

    // Enhanced Domain Search with Fuzzy Matching
    function enhancedDomainSearch(query) {
        if (!query) return DOMAIN_DATA;

        // Fuzzy search implementation
        const fuse = new Fuse(DOMAIN_DATA, {
            keys: ['name', 'category', 'keywords', 'description'],
            includeScore: true,
            threshold: 0.4
        });

        const results = fuse.search(query);
        return results.map(result => result.item);
    }

    // Price Trend Prediction (Simple Machine Learning Simulation)
    function predictDomainPriceTrend(domain) {
        const trends = {
            'stable': '➡️ Stable',
            'increasing': '📈 Increasing',
            'decreasing': '📉 Decreasing'
        };

        // Basic trend prediction based on domain characteristics
        const factors = [
            domain.name.length < 10 ? 1 : 0,  // Short domains tend to be more valuable
            domain.keywords && domain.keywords.length > 2 ? 1 : 0,  // More keywords suggest more value
            domain.category === 'Tech' || domain.category === 'Cannabis' ? 1 : 0  // Hot categories
        ];

        const positiveFactors = factors.filter(f => f > 0).length;
        
        if (positiveFactors >= 2) return trends.increasing;
        if (positiveFactors === 1) return trends.stable;
        return trends.decreasing;
    }

    // Advanced Domain Details Modal
    function showDomainDetails(domainName) {
        const domain = DOMAIN_DATA.find(d => d.name === domainName);
        if (!domain) return;

        const priceTrend = predictDomainPriceTrend(domain);

        const modalContent = `
            <div class="modal fade" id="domainDetailsModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">${domain.name}</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <h6>Domain Details</h6>
                                    <table class="table table-borderless">
                                        <tr>
                                            <th>Category</th>
                                            <td>${domain.category}</td>
                                        </tr>
                                        <tr>
                                            <th>Price</th>
                                            <td>${formatPrice(domain.price)}</td>
                                        </tr>
                                        <tr>
                                            <th>Price Trend</th>
                                            <td>${priceTrend}</td>
                                        </tr>
                                        <tr>
                                            <th>Date Added</th>
                                            <td>${formatRelativeTime(domain.dateAdded)}</td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="col-md-6">
                                    <h6>Description</h6>
                                    <p>${domain.description}</p>
                                    <h6>Keywords</h6>
                                    <div class="keywords-container">
                                        ${domain.keywords ? domain.keywords.map(k => 
                                            `<span class="badge bg-secondary me-1">${k}</span>`
                                        ).join('') : 'No keywords'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="copyDomainToClipboard('${domain.name}')">
                                Copy Domain
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Create and show modal
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalContent;
        document.body.appendChild(modalContainer);

        const domainModal = new bootstrap.Modal(document.getElementById('domainDetailsModal'));
        domainModal.show();

        // Clean up modal after closing
        document.getElementById('domainDetailsModal').addEventListener('hidden.bs.modal', () => {
            modalContainer.remove();
        });

        trackEvent('domain_details_viewed', {
            domainName: domain.name,
            category: domain.category
        });
    }

    // Copy Domain to Clipboard
    function copyDomainToClipboard(domainName) {
        navigator.clipboard.writeText(domainName).then(() => {
            showToast(`${domainName} copied to clipboard`, 'success');
            trackEvent('domain_copied', { domainName });
        }).catch(err => {
            showToast('Failed to copy domain', 'danger');
        });
    }

    // Toast Notification System
    function showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        const toastHTML = `
            <div class="toast align-items-center text-white bg-${type} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;

        const toastEl = document.createElement('div');
        toastEl.innerHTML = toastHTML;
        toastContainer.appendChild(toastEl);

        const toast = new bootstrap.Toast(toastEl.firstChild);
        toast.show();

        // Remove toast after it's hidden
        toastEl.firstChild.addEventListener('hidden.bs.toast', () => {
            toastEl.remove();
        });
    }

    // Initialize Fuse.js for search
    const fuseScript = document.createElement('script');
    fuseScript.src = 'https://cdn.jsdelivr.net/npm/fuse.js@6.6.2/dist/fuse.basic.min.js';
    fuseScript.onload = () => {
        // Search input event listener
        const searchInput = document.getElementById('domainSearch');
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            const searchResults = enhancedDomainSearch(query);
            renderDomains(searchResults);
        });
    };
    document.head.appendChild(fuseScript);
});
