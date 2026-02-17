/**
 * ============================================
 * AKWAABA KITCHEN - ORDER PAGE JAVASCRIPT
 * All orders are sent to WhatsApp: 233544871758
 * ============================================
 */

'use strict';

// ============================================
// RESTAURANT WHATSAPP CONFIGURATION
// ============================================
const RESTAURANT_WHATSAPP = '233544871758'; // Restaurant WhatsApp Number

// ============================================
// ORDER STATE
// ============================================
const orderState = {
    foodChoice: '',
    foodName: '',
    unitPrice: 0,
    quantity: 1,
    deliveryLocation: '',
    deliveryFee: 10,
    subtotal: 0,
    total: 0
};

// ============================================
// MENU ITEMS DATA
// ============================================
const MENU_ITEMS = {
    'jollof': { name: 'Jollof Rice & Chicken', price: 45, emoji: '🍚' },
    'banku': { name: 'Banku & Tilapia', price: 65, emoji: '🐟' },
    'fufu': { name: 'Fufu & Light Soup', price: 50, emoji: '🍲' },
    'waakye': { name: 'Waakye Special', price: 35, emoji: '🍛' },
    'gabeans': { name: 'GaBeans Special', price: 35, emoji: '🍛' },
    'fried-rice': { name: 'Fried Rice & Chicken', price: 50, emoji: '🍚' },
    'kelewele': { name: 'Kelewele', price: 20, emoji: '🍌' },
    'goat-soup': { name: 'Goat Soup (Aponkye)', price: 60, emoji: '🥘' },
    'plain-rice': { name: 'Plain Rice & Stew', price: 30, emoji: '🍚' }
};

// ============================================
// DELIVERY FEES BY LOCATION
// ============================================
const DELIVERY_FEES = {
    'Accra Central': 10,
    'Osu': 10,
    'East Legon': 10,
    'Madina': 10,
    'Spintex': 10,
    'Dansoman': 10,
    'Lapaz': 10,
    'Achimota': 10,
    'Airport City': 10,
    'Cantonments': 10,
    'Tema Community 1': 15,
    'Tema Community 25': 15,
    'Tema New Town': 15,
    'Kumasi': 30
};

// ============================================
// INITIALIZATION - RUNS WHEN PAGE LOADS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🍲 Order page initialized');
    console.log('📱 Orders will be sent to WhatsApp:', RESTAURANT_WHATSAPP);
    
    initQuantitySelector();
    initFoodSelector();
    initLocationSelector();
    initPaymentOptions();
    initOrderForm();
    initModalHandlers();
    initCurrentYear();
    handleURLParams();
});

// ============================================
// QUANTITY SELECTOR (+/- BUTTONS)
// ============================================
function initQuantitySelector() {
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');
    const qtyInput = document.getElementById('quantity');
    
    if (!qtyMinus || !qtyPlus || !qtyInput) {
        console.warn('Quantity selector elements not found');
        return;
    }
    
    // Decrease quantity button
    qtyMinus.addEventListener('click', function(e) {
        e.preventDefault();
        let value = parseInt(qtyInput.value) || 1;
        if (value > 1) {
            qtyInput.value = value - 1;
            orderState.quantity = value - 1;
            updateOrderSummary();
        }
    });
    
    // Increase quantity button
    qtyPlus.addEventListener('click', function(e) {
        e.preventDefault();
        let value = parseInt(qtyInput.value) || 1;
        if (value < 20) {
            qtyInput.value = value + 1;
            orderState.quantity = value + 1;
            updateOrderSummary();
        }
    });
    
    // Manual input change
    qtyInput.addEventListener('change', function() {
        let value = parseInt(this.value) || 1;
        value = Math.max(1, Math.min(20, value));
        this.value = value;
        orderState.quantity = value;
        updateOrderSummary();
    });
}

// ============================================
// FOOD SELECTOR (DROPDOWN)
// ============================================
function initFoodSelector() {
    const foodSelect = document.getElementById('foodChoice');
    
    if (!foodSelect) {
        console.warn('Food selector not found');
        return;
    }
    
    foodSelect.addEventListener('change', function() {
        const selectedValue = this.value;
        
        if (selectedValue && MENU_ITEMS[selectedValue]) {
            const item = MENU_ITEMS[selectedValue];
            orderState.foodChoice = selectedValue;
            orderState.foodName = item.name;
            orderState.unitPrice = item.price;
            
            // Remove error styling
            this.classList.remove('error');
            const errorEl = document.getElementById('foodChoiceError');
            if (errorEl) errorEl.textContent = '';
        } else {
            orderState.foodChoice = '';
            orderState.foodName = '';
            orderState.unitPrice = 0;
        }
        
        updateOrderSummary();
    });
}

// ============================================
// LOCATION SELECTOR (DROPDOWN)
// ============================================
function initLocationSelector() {
    const locationSelect = document.getElementById('deliveryLocation');
    
    if (!locationSelect) {
        console.warn('Location selector not found');
        return;
    }
    
    locationSelect.addEventListener('change', function() {
        const selectedValue = this.value;
        
        if (selectedValue) {
            // Extract location name (remove price info if present)
            const locationName = selectedValue.split(' (')[0];
            orderState.deliveryLocation = selectedValue;
            orderState.deliveryFee = DELIVERY_FEES[locationName] || 10;
            
            // Remove error styling
            this.classList.remove('error');
            const errorEl = document.getElementById('deliveryLocationError');
            if (errorEl) errorEl.textContent = '';
        } else {
            orderState.deliveryLocation = '';
            orderState.deliveryFee = 10;
        }
        
        updateOrderSummary();
    });
}

// ============================================
// UPDATE ORDER SUMMARY (SIDEBAR)
// ============================================
function updateOrderSummary() {
    const summaryEmpty = document.getElementById('summaryEmpty');
    const summaryDetails = document.getElementById('summaryDetails');
    const summaryFood = document.getElementById('summaryFood');
    const summaryQty = document.getElementById('summaryQty');
    const summaryUnitPrice = document.getElementById('summaryUnitPrice');
    const summarySubtotal = document.getElementById('summarySubtotal');
    const summaryDelivery = document.getElementById('summaryDelivery');
    const summaryTotal = document.getElementById('summaryTotal');
    
    // Calculate totals
    orderState.subtotal = orderState.unitPrice * orderState.quantity;
    orderState.total = orderState.subtotal + orderState.deliveryFee;
    
    if (orderState.unitPrice > 0) {
        // Show order details, hide empty state
        if (summaryEmpty) summaryEmpty.style.display = 'none';
        if (summaryDetails) summaryDetails.style.display = 'block';
        
        // Update display values
        if (summaryFood) summaryFood.textContent = orderState.foodName;
        if (summaryQty) summaryQty.textContent = orderState.quantity;
        if (summaryUnitPrice) summaryUnitPrice.textContent = `GHS ${orderState.unitPrice}`;
        if (summarySubtotal) summarySubtotal.textContent = `GHS ${orderState.subtotal}`;
        if (summaryDelivery) summaryDelivery.textContent = `GHS ${orderState.deliveryFee}`;
        if (summaryTotal) summaryTotal.textContent = `GHS ${orderState.total}`;
        
        // Update item emoji
        const itemIcon = document.querySelector('.item-icon');
        if (itemIcon && MENU_ITEMS[orderState.foodChoice]) {
            itemIcon.textContent = MENU_ITEMS[orderState.foodChoice].emoji;
        }
    } else {
        // Show empty state, hide details
        if (summaryEmpty) summaryEmpty.style.display = 'block';
        if (summaryDetails) summaryDetails.style.display = 'none';
    }
    
    // Update submit button text
    updateSubmitButtonText();
}

// ============================================
// PAYMENT OPTIONS (RADIO BUTTONS)
// ============================================
function initPaymentOptions() {
    const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');
    
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            updateSubmitButtonText();
        });
    });
}

// ============================================
// UPDATE SUBMIT BUTTON TEXT
// ============================================
function updateSubmitButtonText() {
    const submitBtnText = document.getElementById('submitBtnText');
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
    
    if (!submitBtnText) return;
    
    let buttonText = 'Place Order';
    
    if (orderState.total > 0) {
        switch(paymentMethod) {
            case 'paystack':
                buttonText = `Pay GHS ${orderState.total} with Paystack`;
                break;
            case 'whatsapp':
                buttonText = `Order via WhatsApp - GHS ${orderState.total}`;
                break;
            default:
                buttonText = `Place Order - GHS ${orderState.total}`;
        }
    } else {
        switch(paymentMethod) {
            case 'paystack':
                buttonText = 'Pay with Paystack';
                break;
            case 'whatsapp':
                buttonText = 'Order via WhatsApp';
                break;
            default:
                buttonText = 'Place Order - Pay on Delivery';
        }
    }
    
    submitBtnText.textContent = buttonText;
}

// ============================================
// ORDER FORM SUBMISSION
// ============================================
function initOrderForm() {
    const orderForm = document.getElementById('orderForm');
    
    if (!orderForm) {
        console.warn('Order form not found');
        return;
    }
    
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('📝 Form submitted');
        
        // Validate form first
        if (!validateOrderForm()) {
            console.log('❌ Validation failed');
            return false;
        }
        
        // Collect form data
        const formData = collectFormData();
        console.log('📦 Form data collected:', formData);
        
        // Get selected payment method
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'delivery';
        formData.paymentMethod = paymentMethod;
        
        // Process based on payment method
        switch(paymentMethod) {
            case 'paystack':
                processPaystackPayment(formData);
                break;
            case 'whatsapp':
                processWhatsAppOrder(formData);
                break;
            default:
                processCashOnDelivery(formData);
        }
        
        return false;
    });
}

// ============================================
// FORM VALIDATION
// ============================================
function validateOrderForm() {
    let isValid = true;
    const errors = [];
    
    // Full Name Validation
    const fullName = document.getElementById('fullName');
    const fullNameError = document.getElementById('fullNameError');
    if (!fullName || !fullName.value.trim() || fullName.value.trim().length < 2) {
        if (fullNameError) fullNameError.textContent = 'Please enter your full name (at least 2 characters)';
        if (fullName) fullName.classList.add('error');
        errors.push('fullName');
        isValid = false;
    } else {
        if (fullNameError) fullNameError.textContent = '';
        if (fullName) fullName.classList.remove('error');
    }
    
    // Phone Number Validation (Ghana format)
    const phoneNumber = document.getElementById('phoneNumber');
    const phoneNumberError = document.getElementById('phoneNumberError');
    const phoneRegex = /^(\+233|233|0)[0-9]{9}$/;
    const cleanPhone = phoneNumber?.value.replace(/[\s\-]/g, '') || '';
    
    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
        if (phoneNumberError) phoneNumberError.textContent = 'Enter a valid Ghana phone number (e.g., 0241234567)';
        if (phoneNumber) phoneNumber.classList.add('error');
        errors.push('phoneNumber');
        isValid = false;
    } else {
        if (phoneNumberError) phoneNumberError.textContent = '';
        if (phoneNumber) phoneNumber.classList.remove('error');
    }
    
    // Email Validation
    const email = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || !email.value.trim() || !emailRegex.test(email.value.trim())) {
        if (emailError) emailError.textContent = 'Please enter a valid email address';
        if (email) email.classList.add('error');
        errors.push('email');
        isValid = false;
    } else {
        if (emailError) emailError.textContent = '';
        if (email) email.classList.remove('error');
    }
    
    // Delivery Location Validation
    const deliveryLocation = document.getElementById('deliveryLocation');
    const deliveryLocationError = document.getElementById('deliveryLocationError');
    if (!deliveryLocation || !deliveryLocation.value) {
        if (deliveryLocationError) deliveryLocationError.textContent = 'Please select a delivery area';
        if (deliveryLocation) deliveryLocation.classList.add('error');
        errors.push('deliveryLocation');
        isValid = false;
    } else {
        if (deliveryLocationError) deliveryLocationError.textContent = '';
        if (deliveryLocation) deliveryLocation.classList.remove('error');
    }
    
    // Delivery Address Validation
    const deliveryAddress = document.getElementById('deliveryAddress');
    const deliveryAddressError = document.getElementById('deliveryAddressError');
    if (!deliveryAddress || !deliveryAddress.value.trim() || deliveryAddress.value.trim().length < 5) {
        if (deliveryAddressError) deliveryAddressError.textContent = 'Please enter your detailed address';
        if (deliveryAddress) deliveryAddress.classList.add('error');
        errors.push('deliveryAddress');
        isValid = false;
    } else {
        if (deliveryAddressError) deliveryAddressError.textContent = '';
        if (deliveryAddress) deliveryAddress.classList.remove('error');
    }
    
    // Food Choice Validation
    const foodChoice = document.getElementById('foodChoice');
    const foodChoiceError = document.getElementById('foodChoiceError');
    if (!foodChoice || !foodChoice.value) {
        if (foodChoiceError) foodChoiceError.textContent = 'Please select a meal';
        if (foodChoice) foodChoice.classList.add('error');
        errors.push('foodChoice');
        isValid = false;
    } else {
        if (foodChoiceError) foodChoiceError.textContent = '';
        if (foodChoice) foodChoice.classList.remove('error');
    }
    
    // Show error toast and scroll to first error
    if (!isValid && errors.length > 0) {
        const firstErrorField = document.getElementById(errors[0]);
        if (firstErrorField) {
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstErrorField.focus();
        }
        showToast('error', 'Please Check Your Form', 'Some required fields need to be filled correctly.');
    }
    
    return isValid;
}

// ============================================
// COLLECT FORM DATA
// ============================================
function collectFormData() {
    const orderId = generateOrderId();
    const orderTime = new Date().toLocaleString('en-GH', { 
        timeZone: 'Africa/Accra',
        dateStyle: 'medium',
        timeStyle: 'short'
    });
    
    return {
        orderId: orderId,
        orderTime: orderTime,
        fullName: document.getElementById('fullName')?.value.trim() || '',
        phoneNumber: document.getElementById('phoneNumber')?.value.trim() || '',
        email: document.getElementById('email')?.value.trim() || '',
        deliveryLocation: document.getElementById('deliveryLocation')?.value || '',
        deliveryAddress: document.getElementById('deliveryAddress')?.value.trim() || '',
        foodChoice: orderState.foodChoice,
        foodName: orderState.foodName,
        quantity: orderState.quantity,
        orderNotes: document.getElementById('orderNotes')?.value.trim() || '',
        unitPrice: orderState.unitPrice,
        subtotal: orderState.subtotal,
        deliveryFee: orderState.deliveryFee,
        total: orderState.total,
        paymentMethod: 'Pay on Delivery',
        paymentReference: '',
        paymentStatus: 'pending'
    };
}

// ============================================
// GENERATE UNIQUE ORDER ID
// ============================================
function generateOrderId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `AK-${timestamp}-${random}`;
}

// ============================================
// PROCESS: PAY ON DELIVERY
// ============================================
function processCashOnDelivery(formData) {
    const submitBtn = document.getElementById('submitOrderBtn');
    const originalContent = submitBtn?.innerHTML;
    
    // Show loading state
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Processing Order...';
    }
    
    // Set payment method
    formData.paymentMethod = 'Pay on Delivery';
    formData.paymentStatus = 'pending';
    
    // Simulate processing
    setTimeout(() => {
        // Reset button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
        }
        
        // Show success modal
        showOrderConfirmation(formData);
        
        // ✅ SEND ORDER TO WHATSAPP
        sendOrderToWhatsApp(formData);
        
        // Reset form
        resetOrderForm();
        
    }, 1500);
}

// ============================================
// PROCESS: PAYSTACK PAYMENT
// ============================================
function processPaystackPayment(formData) {
    formData.paymentMethod = 'Paystack (Online Payment)';
    
    // Check if Paystack function exists
    if (typeof window.initPaystackPayment === 'function') {
        // Store formData globally so paystack.js can access it
        window.currentOrderData = formData;
        window.initPaystackPayment(formData);
    } else {
        showToast('error', 'Payment Error', 'Online payment is not available. Please try Pay on Delivery.');
        console.error('Paystack not loaded');
    }
}

// ============================================
// PROCESS: WHATSAPP ORDER
// ============================================
function processWhatsAppOrder(formData) {
    const submitBtn = document.getElementById('submitOrderBtn');
    const originalContent = submitBtn?.innerHTML;
    
    // Show loading
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Opening WhatsApp...';
    }
    
    // Set payment method
    formData.paymentMethod = 'WhatsApp Order';
    formData.paymentStatus = 'pending';
    
    setTimeout(() => {
        // Reset button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
        }
        
        // Show confirmation
        showOrderConfirmation(formData);
        
        // ✅ SEND ORDER TO WHATSAPP
        sendOrderToWhatsApp(formData);
        
        // Reset form
        resetOrderForm();
        
    }, 1000);
}

// ============================================
// ✅ SEND ORDER TO WHATSAPP (MAIN FUNCTION)
// This sends ALL orders to the restaurant WhatsApp
// ============================================
function sendOrderToWhatsApp(formData) {
    console.log('📱 Sending order to WhatsApp:', RESTAURANT_WHATSAPP);
    
    // Build the message
    const message = buildWhatsAppOrderMessage(formData);
    
    // Encode for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Build WhatsApp URL
    const whatsappUrl = `https://wa.me/${RESTAURANT_WHATSAPP}?text=${encodedMessage}`;
    
    // Show notification
    showToast('success', 'Opening WhatsApp', 'Complete your order by sending the message.');
    
    // Open WhatsApp after a short delay
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
    }, 1000);
}

// ============================================
// BUILD WHATSAPP ORDER MESSAGE
// ============================================
function buildWhatsAppOrderMessage(formData) {
    const line = '─'.repeat(28);
    
    // Determine payment status display
    let paymentDisplay = '';
    if (formData.paymentMethod === 'Paystack (Online Payment)' && formData.paymentStatus === 'paid') {
        paymentDisplay = `• Method: ${formData.paymentMethod}\n• Reference: ${formData.paymentReference}\n• Status: ✅ PAID`;
    } else if (formData.paymentMethod === 'Pay on Delivery') {
        paymentDisplay = `• Method: Cash/MoMo on Delivery\n• Status: ⏳ To be paid on delivery`;
    } else {
        paymentDisplay = `• Method: ${formData.paymentMethod}\n• Status: ⏳ Pending`;
    }
    
    // Build message
    let message = '';
    message += `🍲 *NEW ORDER - AKWAABA KITCHEN*\n`;
    message += `${line}\n\n`;
    
    // Order Info
    message += `📋 *ORDER INFORMATION*\n`;
    message += `${line}\n`;
    message += `• Order ID: ${formData.orderId}\n`;
    message += `• Date/Time: ${formData.orderTime}\n\n`;
    
    // Payment Info
    message += `💳 *PAYMENT*\n`;
    message += `${line}\n`;
    message += `${paymentDisplay}\n\n`;
    
    // Customer Info
    message += `👤 *CUSTOMER DETAILS*\n`;
    message += `${line}\n`;
    message += `• Name: ${formData.fullName}\n`;
    message += `• Phone: ${formData.phoneNumber}\n`;
    message += `• Email: ${formData.email}\n\n`;
    
    // Delivery Info
    message += `📍 *DELIVERY ADDRESS*\n`;
    message += `${line}\n`;
    message += `• Area: ${formData.deliveryLocation}\n`;
    message += `• Address: ${formData.deliveryAddress}\n\n`;
    
    // Order Details
    message += `🍽️ *ORDER DETAILS*\n`;
    message += `${line}\n`;
    message += `• Item: ${formData.foodName}\n`;
    message += `• Quantity: ${formData.quantity}\n`;
    message += `• Unit Price: GHS ${formData.unitPrice}\n`;
    message += `• Subtotal: GHS ${formData.subtotal}\n`;
    message += `• Delivery: GHS ${formData.deliveryFee}\n`;
    message += `${line}\n`;
    message += `💰 *TOTAL: GHS ${formData.total}*\n\n`;
    
    // Special Instructions
    if (formData.orderNotes && formData.orderNotes.trim() !== '') {
        message += `📝 *SPECIAL INSTRUCTIONS*\n`;
        message += `${line}\n`;
        message += `${formData.orderNotes}\n\n`;
    }
    
    // Footer
    message += `${line}\n`;
    message += `Please confirm this order. Thank you! 🙏\n`;
    
    return message;
}

// ============================================
// SHOW ORDER CONFIRMATION MODAL
// ============================================
function showOrderConfirmation(formData) {
    const modal = document.getElementById('orderSuccessModal');
    const detailsContainer = document.getElementById('orderDetailsModal');
    
    if (detailsContainer) {
        // Build confirmation details HTML
        let paymentStatusHtml = '';
        if (formData.paymentStatus === 'paid') {
            paymentStatusHtml = `<span style="color: #28a745;"><i class="fas fa-check-circle"></i> Paid</span>`;
        } else {
            paymentStatusHtml = `<span style="color: #ffc107;"><i class="fas fa-clock"></i> Pay on Delivery</span>`;
        }
        
        detailsContainer.innerHTML = `
            <div class="order-confirmation-details">
                <div class="detail-row">
                    <span class="detail-label">Order ID:</span>
                    <span class="detail-value highlight">${formData.orderId}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Item:</span>
                    <span class="detail-value">${formData.foodName} × ${formData.quantity}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Total Amount:</span>
                    <span class="detail-value highlight">GHS ${formData.total}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Payment:</span>
                    <span class="detail-value">${paymentStatusHtml}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Delivery Area:</span>
                    <span class="detail-value">${formData.deliveryLocation}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Address:</span>
                    <span class="detail-value">${formData.deliveryAddress}</span>
                </div>
            </div>
        `;
    }
    
    // Show modal
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Show toast
    showToast('success', 'Order Placed!', `Order #${formData.orderId} confirmed.`);
}

// ============================================
// RESET ORDER FORM
// ============================================
function resetOrderForm() {
    const form = document.getElementById('orderForm');
    if (form) {
        form.reset();
    }
    
    // Reset order state
    orderState.foodChoice = '';
    orderState.foodName = '';
    orderState.unitPrice = 0;
    orderState.quantity = 1;
    orderState.deliveryLocation = '';
    orderState.deliveryFee = 10;
    orderState.subtotal = 0;
    orderState.total = 0;
    
    // Reset quantity display
    const qtyInput = document.getElementById('quantity');
    if (qtyInput) qtyInput.value = 1;
    
    // Update summary to show empty state
    updateOrderSummary();
}

// ============================================
// MODAL HANDLERS
// ============================================
function initModalHandlers() {
    const modal = document.getElementById('orderSuccessModal');
    const overlay = document.getElementById('modalOverlay');
    const closeX = document.getElementById('modalCloseX');
    const orderMoreBtn = document.getElementById('orderMoreBtn');
    
    // Close on overlay click
    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }
    
    // Close on X button
    if (closeX) {
        closeX.addEventListener('click', closeModal);
    }
    
    // Order more button
    if (orderMoreBtn) {
        orderMoreBtn.addEventListener('click', function() {
            closeModal();
            // Scroll to form
            const form = document.getElementById('orderForm');
            if (form) {
                form.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closeModal();
        }
    });
}

// ============================================
// CLOSE MODAL
// ============================================
function closeModal() {
    const modal = document.getElementById('orderSuccessModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ============================================
// HANDLE URL PARAMETERS
// Pre-select food item if passed in URL
// ============================================
function handleURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const itemParam = urlParams.get('item');
    
    if (itemParam && MENU_ITEMS[itemParam]) {
        const foodSelect = document.getElementById('foodChoice');
        if (foodSelect) {
            foodSelect.value = itemParam;
            foodSelect.dispatchEvent(new Event('change'));
            showToast('info', 'Item Selected', `${MENU_ITEMS[itemParam].name} added to your order.`);
        }
    }
}

// ============================================
// SET CURRENT YEAR IN FOOTER
// ============================================
function initCurrentYear() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(type, title, message) {
    // Use global showToast if available
    if (typeof window.showToast === 'function' && window.showToast !== showToast) {
        window.showToast(type, title, message);
        return;
    }
    
    // Fallback toast implementation
    const container = document.getElementById('toastContainer');
    if (!container) {
        console.log(`[${type.toUpperCase()}] ${title}: ${message}`);
        return;
    }
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${icons[type] || icons.info}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// ============================================
// PAYSTACK SUCCESS CALLBACK
// Called from paystack.js when payment succeeds
// ============================================
function onPaystackSuccess(response, formData) {
    console.log('💳 Paystack payment successful:', response);
    
    // Update form data with payment info
    formData.paymentReference = response.reference;
    formData.paymentStatus = 'paid';
    formData.paymentMethod = 'Paystack (Online Payment)';
    
    // Show confirmation modal
    showOrderConfirmation(formData);
    
    // ✅ SEND ORDER TO WHATSAPP
    sendOrderToWhatsApp(formData);
    
    // Reset form
    resetOrderForm();
}

// ============================================
// MAKE FUNCTIONS GLOBALLY ACCESSIBLE
// ============================================
window.sendOrderToWhatsApp = sendOrderToWhatsApp;
window.buildWhatsAppOrderMessage = buildWhatsAppOrderMessage;
window.showOrderConfirmation = showOrderConfirmation;
window.onPaystackSuccess = onPaystackSuccess;
window.orderState = orderState;
window.RESTAURANT_WHATSAPP = RESTAURANT_WHATSAPP;

// ============================================
// CONSOLE LOG
// ============================================
console.log('✅ order.js loaded successfully');
console.log('📱 Restaurant WhatsApp:', RESTAURANT_WHATSAPP);