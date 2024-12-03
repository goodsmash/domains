document.addEventListener('DOMContentLoaded', function() {
    const domainList = document.getElementById('domain-list');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortOption = document.getElementById('sortOption');
    const offerModal = new bootstrap.Modal(document.getElementById('offerModal'));
    let currentDomain = null;

    // Populate category filter
    const categories = [...new Set(DOMAIN_DATA.map(domain => domain.category))].sort();
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryFilter.appendChild(option);
    });

    function formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    }

    function createDomainCard(domain) {
        return `
            <div class="col-md-4 col-sm-6 mb-4">
                <div class="card domain-card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${domain.name}</h5>
                        <p class="card-text">
                            <span class="badge bg-secondary">${domain.category}</span>
                        </p>
                        <p class="price">${formatPrice(domain.price)}</p>
                        <p class="min-offer">Minimum offer: ${formatPrice(domain.minOffer)}</p>
                        <div class="d-grid gap-2">
                            <button class="btn btn-buy-now" onclick="handleBuyNow('${domain.name}', ${domain.price})">
                                <i class="bi bi-cart"></i> Buy Now
                            </button>
                            <button class="btn btn-make-offer" onclick="handleMakeOffer('${domain.name}', ${domain.minOffer})">
                                <i class="bi bi-chat-text"></i> Make an Offer
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

        let filteredDomains = DOMAIN_DATA.filter(domain => {
            const matchesSearch = domain.name.toLowerCase().includes(searchTerm);
            const matchesCategory = !selectedCategory || domain.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        filteredDomains.sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'name') {
                comparison = a.name.localeCompare(b.name);
            } else if (sortBy === 'price') {
                comparison = a.price - b.price;
            }
            return sortOrder === 'desc' ? -comparison : comparison;
        });

        domainList.innerHTML = filteredDomains.map(createDomainCard).join('');
    }

    // Event listeners
    searchInput.addEventListener('input', filterAndSortDomains);
    searchButton.addEventListener('click', filterAndSortDomains);
    categoryFilter.addEventListener('change', filterAndSortDomains);
    sortOption.addEventListener('change', filterAndSortDomains);

    // Initial load
    filterAndSortDomains();

    // Make these functions available globally
    window.handleBuyNow = function(domain, price) {
        // Replace with your actual payment processing logic
        window.location.href = `https://example.com/checkout?domain=${domain}&price=${price}`;
    };

    window.handleMakeOffer = function(domain, minOffer) {
        currentDomain = DOMAIN_DATA.find(d => d.name === domain);
        document.getElementById('minOfferText').textContent = `Minimum offer: ${formatPrice(minOffer)}`;
        document.getElementById('offerAmount').min = minOffer;
        offerModal.show();
    };

    // Handle offer submission
    document.getElementById('submitOffer').addEventListener('click', function() {
        const amount = document.getElementById('offerAmount').value;
        const email = document.getElementById('offerEmail').value;
        const message = document.getElementById('offerMessage').value;

        if (!amount || !email) {
            alert('Please fill in all required fields');
            return;
        }

        if (amount < currentDomain.minOffer) {
            alert(`Offer must be at least ${formatPrice(currentDomain.minOffer)}`);
            return;
        }

        // Replace with your actual offer submission logic
        console.log('Offer submitted:', {
            domain: currentDomain.name,
            amount,
            email,
            message
        });

        alert('Thank you for your offer! We will contact you shortly.');
        offerModal.hide();
    });
});
