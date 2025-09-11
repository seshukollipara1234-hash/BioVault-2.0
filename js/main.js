/* ============================================
   UNDERGROUND PEPTIDE SHOP - MAIN JAVASCRIPT
   
   This file contains all JavaScript functionality:
   1. Password protection
   2. Product search/filtering
   3. Request new item functionality
   4. Navigation to product pages
   5. Product request handling
   
   Each function is heavily commented for easy understanding
   ============================================ */

/* ============================================
   CONFIGURATION SECTION
   Change these values to customize behavior
   ============================================ */

// IMPORTANT: Change this password to secure your site
const CORRECT_PASSWORD = "P3pt!X9r"; // CHANGE THIS to your desired password

// Contact email for product requests (can be encrypted email or contact method)
const CONTACT_METHOD = "the person who u got the password from"; // CHANGE THIS to your contact

// Product page URL pattern - change if using different folder structure
const PRODUCT_PAGE_PATTERN = "{product}.html"; // {product} will be replaced with product ID

/* ============================================
   PASSWORD PROTECTION FUNCTIONS
   ============================================ */

/**
 * Checks if the entered password is correct
 * If correct: hides password screen and shows main content
 * If wrong: shows alert and clears password field
 */
function checkPassword() {
    // Get the password that user typed
    const enteredPassword = document.getElementById('password-input').value;
    
    // Check if password matches our configured password
    if (enteredPassword === CORRECT_PASSWORD) {
        // Password is correct - hide password screen
        document.getElementById('password-screen').style.display = 'none';
        
        // Show main content with fade-in animation
        document.getElementById('main-content').style.display = 'block';
        
        // Optional: Store in session that user is authenticated
        sessionStorage.setItem('authenticated', 'true');
        
        // Log success (remove in production)
        console.log('Access granted');
    } else {
        // Password is wrong - show alert
        alert('ACCESS DENIED: Incorrect password');
        
        // Clear the password field for retry
        document.getElementById('password-input').value = '';
        
        // Optional: Log failed attempt (for security monitoring)
        console.log('Failed login attempt');
    }
}

/**
 * Allow pressing Enter key to submit password
 * Improves user experience
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get password input element
    const passwordInput = document.getElementById('password-input');
    
    // Only add listener if we're on a page with password protection
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(event) {
            // Check if Enter key was pressed (key code 13 or 'Enter')
            if (event.key === 'Enter') {
                checkPassword();
            }
        });
    }
    
    // Check if user was already authenticated in this session
    if (sessionStorage.getItem('authenticated') === 'true') {
        // Skip password screen if already authenticated
        const passwordScreen = document.getElementById('password-screen');
        const mainContent = document.getElementById('main-content');
        
        if (passwordScreen && mainContent) {
            passwordScreen.style.display = 'none';
            mainContent.style.display = 'block';
        }
    }
});

/* ============================================
   SEARCH AND FILTER FUNCTIONS
   ============================================ */

/**
 * Filters products based on search input
 * Searches through product names and data attributes
 * Shows/hides products based on match
 */
function filterProducts() {
    // Get the search input value and convert to lowercase for case-insensitive search
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    
    // Get all product cards from the grid
    const productCards = document.querySelectorAll('.product-card');
    
    // Counter for visible products
    let visibleCount = 0;
    
    // Loop through each product card
    productCards.forEach(function(card) {
        // Get the product name from data attribute (includes keywords)
        const productName = card.getAttribute('data-name').toLowerCase();
        
        // Check if search term is found in product name
        if (productName.includes(searchTerm)) {
            // Show the product card
            card.classList.remove('hidden');
            card.style.display = 'block';
            visibleCount++;
        } else {
            // Hide the product card
            card.classList.add('hidden');
            card.style.display = 'none';
        }
    });
    
    // Show "no results" message if no products match
    const noResultsElement = document.getElementById('no-results');
    if (noResultsElement) {
        if (visibleCount === 0 && searchTerm !== '') {
            noResultsElement.style.display = 'block';
        } else {
            noResultsElement.style.display = 'none';
        }
    }
    
    // Log search for analytics (optional)
    console.log(`Search for "${searchTerm}" returned ${visibleCount} results`);
}

/* ============================================
   REQUEST NEW ITEM FUNCTION
   ============================================ */

/**
 * Opens a prompt for users to request new products
 * Collects product name and optional details
 * Shows instructions for contacting
 */
function requestNewItem() {
    // Create a multi-line prompt for better UX
    const requestPrompt = `REQUEST NEW PEPTIDE\n\nEnter the peptide name and any specific requirements:\n(e.g., "Semaglutide 5mg vials" or "BPC-157 + TB-500 blend")`;
    
    // Show prompt and get user input
    const requestedItem = prompt(requestPrompt);
    
    // Check if user entered something (didn't cancel)
    if (requestedItem && requestedItem.trim() !== '') {
        // Generate a request ID for tracking
        const requestId = 'REQ-' + Date.now();
        
        // Create the message to show user
        const confirmMessage = `
REQUEST SUBMITTED
-----------------
Product: ${requestedItem}
Request ID: ${requestId}

To complete your request:
1. Save your Request ID
2. Contact an admin via Telegram: https://t.me/BioVaultX
3. Wait for availability confirmation after contacting an admin

Typical response time: 24-48 hours
        `;
        
        // Show confirmation to user
        alert(confirmMessage);
        
        // Log the request (in production, this could send to a server)
        console.log('New product request:', {
            id: requestId,
            product: requestedItem,
            timestamp: new Date().toISOString()
        });
        
        // Optional: Store request in localStorage for user reference
        const requests = JSON.parse(localStorage.getItem('productRequests') || '[]');
        requests.push({
            id: requestId,
            product: requestedItem,
            date: new Date().toISOString()
        });
        localStorage.setItem('productRequests', JSON.stringify(requests));
    }
}

/* ============================================
   NAVIGATION TO PRODUCT PAGES
   ============================================ */

/**
 * Navigates to individual product page
 * @param {string} productId - The unique ID of the product (e.g., 'hgh-191aa')
 */
function goToProduct(productId) {
    // Generate the product page URL based on pattern
    const productUrl = PRODUCT_PAGE_PATTERN.replace('{product}', productId);
    
    // Log navigation for analytics
    console.log(`Navigating to product: ${productId}`);
    
    // Navigate to the product page
    window.location.href = productUrl;
    
    // Alternative: Open in new tab (uncomment if preferred)
    // window.open(productUrl, '_blank');
}

/* ============================================
   PRODUCT PAGE REQUEST FUNCTION
   ============================================ */

/**
 * Handles product request from individual product pages
 * @param {string} productName - The name of the product being requested
 */
function requestProduct(productName) {
    // Generate order ID
    const orderId = 'ORD-' + Date.now();
    
    // Create detailed request message
    const requestMessage = `
PRODUCT REQUEST INITIATED
-------------------------
Product: ${productName}


NEXT STEPS:
1. Telegram: https://t.me/BioVaultX
2. Provide Order ID and desired quantity
3. Receive payment instructions
4. Product ships after payment confirmation

IMPORTANT:
- Minimum order quantities may apply
- Shipping time: 7-14 business days
- Most of the time there will be product on hand providing instant delivery
- All sales are final
- Research purposes only


    `;
    
    // Show confirmation dialog
    if (confirm(requestMessage)) {
        // User confirmed - show success message
        alert(`Request confirmed!\n\nOrder ID: ${orderId}\n\nContact us in the groupchat to complete your order.`);
        
        // Log the request
        console.log('Product request confirmed:', {
            orderId: orderId,
            product: productName,
            timestamp: new Date().toISOString()
        });
        
        // Store in localStorage for user reference
        const orders = JSON.parse(localStorage.getItem('productOrders') || '[]');
        orders.push({
            id: orderId,
            product: productName,
            date: new Date().toISOString(),
            status: 'pending'
        });
        localStorage.setItem('productOrders', JSON.stringify(orders));
    }
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/**
 * Shows user's request history (optional feature)
 * Can be called from console for debugging
 */
function showRequestHistory() {
    const requests = JSON.parse(localStorage.getItem('productRequests') || '[]');
    const orders = JSON.parse(localStorage.getItem('productOrders') || '[]');
    
    console.log('=== REQUEST HISTORY ===');
    console.log('Product Requests:', requests);
    console.log('Product Orders:', orders);
    
    return {
        requests: requests,
        orders: orders
    };
}

/**
 * Clears all stored data (for testing/reset)
 * Can be called from console
 */
function clearAllData() {
    if (confirm('This will clear all stored requests and orders. Continue?')) {
        localStorage.removeItem('productRequests');
        localStorage.removeItem('productOrders');
        sessionStorage.removeItem('authenticated');
        console.log('All data cleared');
        location.reload();
    }
}

/* ============================================
   CONSOLE EASTER EGGS AND DEBUGGING
   ============================================ */

// Add cool console messages
console.log('%c UNDERGROUND PEPTIDE NETWORK ', 'background: #000; color: #e10000ff; font-size: 20px; padding: 10px;');
console.log('%c Access Level: RESTRICTED ', 'background: #e00000ff; color: #000; font-size: 14px; padding: 5px;');
console.log('Type showRequestHistory() to view your requests');
console.log('Type clearAllData() to reset the application');

// Detect if developer tools are open (optional security feature)
let devtools = {open: false, orientation: null};
const threshold = 160;
const emitEvent = (state, orientation) => {
    if (state) {
        console.log('%c WARNING: Developer tools detected ', 'background: red; color: white; font-size: 16px; padding: 5px;');
    }
};

setInterval(() => {
    if (window.outerHeight - window.innerHeight > threshold || 
        window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
            emitEvent(true, null);
            devtools.open = true;
        }
    } else {
        if (devtools.open) {
            emitEvent(false, null);
            devtools.open = false;
        }
    }
}, 500);

/* ============================================
   INITIALIZE ON PAGE LOAD
   ============================================ */

/**
 * Initialize any features that need to run on page load
 */
window.addEventListener('load', function() {
    // Add smooth scrolling to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation to buttons when clicked
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            // Skip for certain buttons
            if (this.classList.contains('no-loading')) return;
            
            // Add brief loading effect
            this.style.opacity = '0.7';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 200);
        });
    });
    
    // Log page load for analytics
    console.log('Page loaded:', window.location.pathname);
});