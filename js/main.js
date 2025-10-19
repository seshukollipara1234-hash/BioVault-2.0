/* ============================================
   GOOGLE SHEETS INTEGRATION - SIMPLIFIED
   Add this to your main JavaScript file
   ============================================ */

// YOUR GOOGLE SHEETS WEB APP URL (see setup instructions below)
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxlO9ZHHEB9t0GtBc7wI4uVHJwEXiuI-vP-5QEzFMOjNIjbYoVwyMZ_mp0VO2TkLdWLwA/exec';

// Your Telegram contact link
const TELEGRAM_LINK = 'https://t.me/BioVaultX';

/**
 * Sends product request to Google Sheets
 */
async function logToGoogleSheets(data) {
    try {
        await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        console.log('Data sent to Google Sheets');
        return true;
    } catch (error) {
        console.error('Failed to log to Google Sheets:', error);
        return false;
    }
}

/**
 * UPDATED: Request new item with contact info collection
 */
function requestNewItem() {
    // Step 1: Get product name
    const productName = prompt('What peptide would you like to request?\n\n(e.g., "Semaglutide 5mg" or "BPC-157 + TB-500 blend")');
    
    if (!productName || productName.trim() === '') {
        return; // User cancelled
    }
    
    // Step 2: Get customer name
    const customerName = prompt('Please enter your name:');
    
    if (!customerName || customerName.trim() === '') {
        alert('Name is required to submit a request.');
        return;
    }
    
    // Step 3: Get contact info
    const contactInfo = prompt('Please enter your contact info:\n(Telegram username, phone number, or email)');
    
    if (!contactInfo || contactInfo.trim() === '') {
        alert('Contact info is required to submit a request.');
        return;
    }
    
    // Generate request ID
    const requestId = 'REQ-' + Date.now();
    const timestamp = new Date().toISOString();
    
    // Prepare data for Google Sheets
    const requestData = {
        type: 'New Item Request',
        requestId: requestId,
        product: productName.trim(),
        customerName: customerName.trim(),
        contactInfo: contactInfo.trim(),
        timestamp: timestamp
    };
    
    // Send to Google Sheets
    logToGoogleSheets(requestData);
    
    // Show confirmation with Telegram link
    alert(`✅ REQUEST SUBMITTED SUCCESSFULLY!\n\n` +
          `Request ID: ${requestId}\n` +
          `Product: ${productName}\n` +
          `Name: ${customerName}\n\n` +
          `NEXT STEP:\n` +
          `Click OK to open Telegram and contact us with your Request ID.`);
    
    // Open Telegram link
    window.open(TELEGRAM_LINK, '_blank');
}

/**
 * UPDATED: Request product from product pages with contact info
 */
function requestProduct(productName) {
    // Step 1: Get customer name
    const customerName = prompt('Please enter your name:');
    
    if (!customerName || customerName.trim() === '') {
        alert('Name is required to submit a request.');
        return;
    }
    
    // Step 2: Get contact info
    const contactInfo = prompt('Please enter your contact info:\n(Telegram username, phone number, or email)');
    
    if (!contactInfo || contactInfo.trim() === '') {
        alert('Contact info is required to submit a request.');
        return;
    }
    
    // Step 3: Get quantity (optional but useful)
    const quantity = prompt(`How many units of ${productName} would you like?\n(Enter number or "TBD" if unsure)`);
    
    if (!quantity || quantity.trim() === '') {
        alert('Quantity is required to submit a request.');
        return;
    }
    
    // Generate order ID
    const orderId = 'ORD-' + Date.now();
    const timestamp = new Date().toISOString();
    
    // Prepare data for Google Sheets
    const orderData = {
        type: 'Product Order',
        requestId: orderId,
        product: productName,
        customerName: customerName.trim(),
        contactInfo: contactInfo.trim(),
        quantity: quantity.trim(),
        timestamp: timestamp
    };
    
    // Send to Google Sheets
    logToGoogleSheets(orderData);
    
    // Show confirmation with Telegram link
    alert(`✅ ORDER SUBMITTED SUCCESSFULLY!\n\n` +
          `Order ID: ${orderId}\n` +
          `Product: ${productName}\n` +
          `Quantity: ${quantity}\n` +
          `Name: ${customerName}\n\n` +
          `NEXT STEP:\n` +
          `Click OK to open Telegram and contact us with your Order ID.`);
    
    // Open Telegram link
    window.open(TELEGRAM_LINK, '_blank');
}

/* ============================================
   SETUP INSTRUCTIONS - UPDATED
   ============================================ */

/*
GOOGLE SHEETS SETUP:

1. Create a new Google Sheet
2. Add these headers in Row 1:
   - A1: Type
   - B1: Request ID
   - C1: Product
   - D1: Customer Name
   - E1: Contact Info
   - F1: Quantity
   - G1: Timestamp

3. Go to Extensions > Apps Script
4. Delete default code and paste this:

----------------------------------------
GOOGLE APPS SCRIPT CODE:
----------------------------------------

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.type || '',
      data.requestId || '',
      data.product || '',
      data.customerName || '',
      data.contactInfo || '',
      data.quantity || '',
      data.timestamp || ''
    ]);
    
    return ContentService.createTextOutput('Success');
  } catch (error) {
    return ContentService.createTextOutput('Error: ' + error.toString());
  }
}

function doGet() {
  return ContentService.createTextOutput('Service is running');
}

----------------------------------------

5. Save the script
6. Deploy > New Deployment > Web app
7. Set:
   - Execute as: Me
   - Who has access: Anyone
8. Deploy and copy the Web App URL
9. Paste URL in GOOGLE_SHEETS_URL variable above
10. Update TELEGRAM_LINK if needed

DONE! Now all requests will log to Google Sheets automatically.
*/