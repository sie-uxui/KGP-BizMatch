// ==========================================
// BIZMATCH JAVASCRIPT - KEY GLOBAL PROJECTS
// Handles filtering, sorting, and modal interactions
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // FILTER & SORT FUNCTIONALITY
    // ==========================================
    
    const listingsGrid = document.getElementById('listingsGrid');
    const industryFilter = document.getElementById('industryFilter');
    const priceFilters = document.querySelectorAll('.price-filter');
    const locationFilters = document.querySelectorAll('.location-filter');
    const sortSelect = document.getElementById('sortSelect');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const resultsCount = document.getElementById('resultsCount');

    // Get all listing cards
    let allListings = Array.from(document.querySelectorAll('.listing-card'));

    // Filter function
    function filterListings() {
        const selectedIndustry = industryFilter.value;
        const selectedPrices = Array.from(priceFilters)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        const selectedLocations = Array.from(locationFilters)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        let visibleCount = 0;

        allListings.forEach(listing => {
            let showListing = true;

            // Filter by industry
            if (selectedIndustry && listing.dataset.industry !== selectedIndustry) {
                showListing = false;
            }

            // Filter by price
            if (selectedPrices.length > 0) {
                const price = parseInt(listing.dataset.price);
                const matchesPrice = selectedPrices.some(range => {
                    switch(range) {
                        case '0-100k': return price < 100000;
                        case '100k-500k': return price >= 100000 && price < 500000;
                        case '500k-1m': return price >= 500000 && price < 1000000;
                        case '1m-5m': return price >= 1000000 && price < 5000000;
                        case '5m+': return price >= 5000000;
                        default: return true;
                    }
                });
                if (!matchesPrice) {
                    showListing = false;
                }
            }

            // Filter by location
            if (selectedLocations.length > 0) {
                if (!selectedLocations.includes(listing.dataset.location)) {
                    showListing = false;
                }
            }

            // Show or hide listing with animation
            if (showListing) {
                listing.style.display = 'flex';
                setTimeout(() => {
                    listing.style.opacity = '1';
                    listing.style.transform = 'translateY(0)';
                }, 10);
                visibleCount++;
            } else {
                listing.style.opacity = '0';
                listing.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    listing.style.display = 'none';
                }, 300);
            }
        });

        // Update results count
        resultsCount.textContent = visibleCount;

        // Show "no results" message if needed
        showNoResults(visibleCount);
    }

    // Sort function
    function sortListings() {
        const sortValue = sortSelect.value;
        
        allListings.sort((a, b) => {
            const priceA = parseInt(a.dataset.price);
            const priceB = parseInt(b.dataset.price);

            switch(sortValue) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'newest':
                    // In a real app, you'd have a date field
                    return 0;
                case 'featured':
                default:
                    // Featured items first
                    const featuredA = a.querySelector('.badge-featured') ? 1 : 0;
                    const featuredB = b.querySelector('.badge-featured') ? 1 : 0;
                    return featuredB - featuredA;
            }
        });

        // Re-append in sorted order
        allListings.forEach(listing => {
            listingsGrid.appendChild(listing);
        });
    }

    // Show "no results" message
    function showNoResults(count) {
        let noResultsDiv = document.getElementById('noResults');
        
        if (count === 0) {
            if (!noResultsDiv) {
                noResultsDiv = document.createElement('div');
                noResultsDiv.id = 'noResults';
                noResultsDiv.className = 'no-results';
                noResultsDiv.innerHTML = `
                    <div style="text-align: center; padding: 60px 20px; grid-column: 1 / -1;">
                        <i class="fas fa-search" style="font-size: 64px; color: #e5e7eb; margin-bottom: 20px;"></i>
                        <h3 style="color: #021738; margin-bottom: 10px;">No businesses found</h3>
                        <p style="color: #6b7280;">Try adjusting your filters to see more results</p>
                    </div>
                `;
                listingsGrid.appendChild(noResultsDiv);
            }
        } else {
            if (noResultsDiv) {
                noResultsDiv.remove();
            }
        }
    }

    // Reset filters
    function resetFilters() {
        industryFilter.value = '';
        priceFilters.forEach(cb => cb.checked = false);
        locationFilters.forEach(cb => cb.checked = false);
        sortSelect.value = 'featured';
        
        allListings.forEach(listing => {
            listing.style.display = 'flex';
            listing.style.opacity = '1';
            listing.style.transform = 'translateY(0)';
        });

        resultsCount.textContent = allListings.length;
        
        sortListings(); // Re-sort to featured
        
        const noResultsDiv = document.getElementById('noResults');
        if (noResultsDiv) {
            noResultsDiv.remove();
        }
    }

    // Event listeners for filters
    industryFilter.addEventListener('change', filterListings);
    priceFilters.forEach(cb => cb.addEventListener('change', filterListings));
    locationFilters.forEach(cb => cb.addEventListener('change', filterListings));
    sortSelect.addEventListener('change', () => {
        sortListings();
        filterListings(); // Re-apply filters after sorting
    });
    resetFiltersBtn.addEventListener('click', resetFilters);

    // ==========================================
    // SMOOTH SCROLL
    // ==========================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ==========================================
    // SCROLL ANIMATIONS
    // ==========================================
    
    // Add initial animation to cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 50);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Set initial state and observe
    allListings.forEach(listing => {
        listing.style.opacity = '0';
        listing.style.transform = 'translateY(30px)';
        listing.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(listing);
    });

});

// ==========================================
// MODAL FUNCTIONS (Global scope)
// ==========================================

function openInterestModal(businessName) {
    const modal = document.getElementById('interestModal');
    const modalBusinessName = document.getElementById('modalBusinessName');
    
    modalBusinessName.textContent = businessName;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeInterestModal() {
    const modal = document.getElementById('interestModal');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

function submitInterest(event) {
    event.preventDefault();
    
    // In a real application, you would send this data to a server
    const formData = new FormData(event.target);
    
    // Show success message
    alert('Thank you for your interest! A Key Global Projects consultant will contact you within 24 hours.');
    
    // Close modal and reset form
    closeInterestModal();
    event.target.reset();
}

// Close modal on ESC key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeInterestModal();
    }
});

// ==========================================
// PRICE FORMATTING
// ==========================================

// Format prices with commas (already done in HTML, but useful for dynamic content)
function formatPrice(price) {
    return '$' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ==========================================
// SEARCH FUNCTIONALITY (Optional Enhancement)
// ==========================================

// You can add a search bar later if needed
function searchListings(searchTerm) {
    const listings = document.querySelectorAll('.listing-card');
    const term = searchTerm.toLowerCase();
    
    listings.forEach(listing => {
        const title = listing.querySelector('.listing-card__header h3').textContent.toLowerCase();
        const description = listing.querySelector('.listing-card__description').textContent.toLowerCase();
        
        if (title.includes(term) || description.includes(term)) {
            listing.style.display = 'flex';
        } else {
            listing.style.display = 'none';
        }
    });
}
