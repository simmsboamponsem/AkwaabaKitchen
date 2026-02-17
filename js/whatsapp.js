/**
 * ============================================
 * AKWAABA KITCHEN - WHATSAPP INTEGRATION
 * Handles WhatsApp ordering and chat functionality
 * ============================================
 */

'use strict';

// ============================================
// WHATSAPP CONFIGURATION
// ============================================
const WHATSAPP_CONFIG = {
    // Ghana phone number (replace with your actual number)
    // Format: Country code + Number without leading zero
    phoneNumber: '233544871758',
    
    // Default message for general inquiries
    defaultMessage: 'Hello! I would like to inquire about your menu.',
    
    // Business name for messages
    businessName: 'Akwaaba Kitchen'
};

// ============================================
// INITIALIZE WHATSAPP BUTTONS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initWhatsAppButtons();
    initFloatingWhatsApp();
});

// ============================================
// WHATSAPP BUTTON HANDLERS
// ============================================
function initWhatsAppButtons() {
    // Hero section WhatsApp button
    const heroWhatsAppBtn = document.getElementById('heroWhatsAppBtn');
    if (heroWhatsAppBtn) {
        heroWhatsAppBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openWhatsAppChat('Hello! I would like to place an order for some delicious Ghanaian food. 🍲');
        });
    }
    
    // CTA section WhatsApp button
    const ctaWhatsAppBtn = document.getElementById('ctaWhatsAppBtn');
    if (ctaWhatsAppBtn) {
        ctaWhatsAppBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openWhatsAppChat('Hello! I saw your website and would like to order some food.');
        });
    }
    
    // Any other WhatsApp links with class
    document.querySelectorAll('.whatsapp-link, [data-whatsapp]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const customMessage = this.dataset.message || WHATSAPP_CONFIG.defaultMessage;
            openWhatsAppChat(customMessage);
        });
    });
}

// ============================================
// FLOATING WHATSAPP BUTTON
// ============================================
function initFloatingWhatsApp() {
    const floatBtn = document.getElementById('whatsappFloat');
    if (!floatBtn) return;
    
    floatBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openWhatsAppChat('Hello! I need help with my order or have a question.');
    });
}

// ============================================
// OPEN WHATSAPP CHAT
// ============================================
function openWhatsAppChat(message = WHATSAPP_CONFIG.defaultMessage) {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodedMessage}`;
    
    // Open in new tab
    window.open(whatsappUrl, '_blank');
}

// ============================================
// SEND ORDER VIA WHATSAPP
// ============================================
function sendWhatsAppOrder(formData) {
    if (!formData) {
        console.error('No form data provided');
        window.showToast('error', 'Error', 'Could not process your order. Please try again.');
        return;
    }
    
    // Build order message
    const message = buildOrderMessage(formData);
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Build WhatsApp URL
    const whatsappUrl = `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodedMessage}`;
    
    // Show loading toast
    window.showToast('info', 'Opening WhatsApp...', 'You will be redirected to WhatsApp to complete your order.');
    
    // Small delay before redirect for better UX
    setTimeout(() => {
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Show success message
        window.showToast('success', 'Order Sent to WhatsApp', 'Please complete your order in WhatsApp.');
    }, 500);
}

// ============================================
// BUILD ORDER MESSAGE
// ============================================
function buildOrderMessage(formData) {
    const divider = '─'.repeat(25);
    
    let message = `🍲 *NEW ORDER - ${WHATSAPP_CONFIG.businessName}*\n`;
    message += `${divider}\n\n`;
    
    // Order ID
    message += `📋 *Order ID:* ${formData.orderId}\n\n`;
    
    // Customer Information
    message += `👤 *CUSTOMER DETAILS*\n`;
    message += `${divider}\n`;
    message += `• Name: ${formData.fullName}\n`;
    message += `• Phone: ${formData.phoneNumber}\n`;
    message += `• Email: ${formData.email}\n\n`;
    
    // Delivery Information
    message += `📍 *DELIVERY LOCATION*\n`;
    message += `${divider}\n`;
    message += `• Area: ${formData.deliveryLocation}\n`;
    message += `• Address: ${formData.deliveryAddress}\n\n`;
    
    // Order Details
    message += `🍽️ *ORDER DETAILS*\n`;
    message += `${divider}\n`;
    message += `• Food: ${formData.foodName}\n`;
    message += `• Quantity: ${formData.quantity}\n`;
    message += `• Unit Price: GHS ${formData.unitPrice}\n`;
    message += `• Subtotal: GHS ${formData.subtotal}\n`;
    message += `• Delivery Fee: GHS ${formData.deliveryFee}\n\n`;
    
    // Special Instructions
    if (formData.orderNotes && formData.orderNotes.trim()) {
        message += `📝 *SPECIAL INSTRUCTIONS*\n`;
        message += `${divider}\n`;
        message += `${formData.orderNotes}\n\n`;
    }
    
    // Total
    message += `💰 *TOTAL: GHS ${formData.total}*\n\n`;
    
    // Footer
    message += `${divider}\n`;
    message += `⏰ Order Time: ${new Date().toLocaleString('en-GH', { 
        timeZone: 'Africa/Accra',
        dateStyle: 'medium',
        timeStyle: 'short'
    })}\n\n`;
    
    message += `Please confirm my order. Thank you! 🙏`;
    
    return message;
}

// ============================================
// SHARE ON WHATSAPP
// ============================================
function shareOnWhatsApp(title, url) {
    const message = `Check out ${title}: ${url}`;
    openWhatsAppChat(message);
}

// ============================================
// FORMAT PHONE FOR WHATSAPP
// ============================================
function formatPhoneForWhatsApp(phone) {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    
    // Handle Ghana numbers
    if (cleaned.startsWith('0')) {
        // Convert 0XX to 233XX
        cleaned = '233' + cleaned.substring(1);
    } else if (!cleaned.startsWith('233')) {
        // Add Ghana country code if missing
        cleaned = '233' + cleaned;
    }
    
    return cleaned;
}

// ============================================
// VALIDATE WHATSAPP NUMBER
// ============================================
function isValidWhatsAppNumber(phone) {
    const formatted = formatPhoneForWhatsApp(phone);
    // Ghana numbers should be 12 digits (233 + 9 digits)
    return formatted.length === 12 && formatted.startsWith('233');
}

// ============================================
// QUICK ORDER VIA WHATSAPP
// ============================================
function quickWhatsAppOrder(itemName, price) {
    const message = `Hello! I would like to order:\n\n🍽️ ${itemName}\n💰 Price: GHS ${price}\n\nPlease let me know if it's available and the delivery options.`;
    openWhatsAppChat(message);
}

// ============================================
// CUSTOMER SUPPORT WHATSAPP
// ============================================
function openWhatsAppSupport(issue = 'general') {
    let message = '';
    
    switch(issue) {
        case 'order':
            message = 'Hello! I need help with my order. My order ID is: ';
            break;
        case 'delivery':
            message = 'Hello! I have a question about delivery to my area.';
            break;
        case 'menu':
            message = 'Hello! I would like to know more about your menu items.';
            break;
        case 'complaint':
            message = 'Hello! I would like to report an issue with my recent order.';
            break;
        case 'catering':
            message = 'Hello! I am interested in your catering services for an event.';
            break;
        default:
            message = 'Hello! I have a question about Akwaaba Kitchen.';
    }
    
    openWhatsAppChat(message);
}

// ============================================
// MAKE FUNCTIONS GLOBALLY ACCESSIBLE
// ============================================
window.openWhatsAppChat = openWhatsAppChat;
window.sendWhatsAppOrder = sendWhatsAppOrder;
window.shareOnWhatsApp = shareOnWhatsApp;
window.quickWhatsAppOrder = quickWhatsAppOrder;
window.openWhatsAppSupport = openWhatsAppSupport;
window.WHATSAPP_CONFIG = WHATSAPP_CONFIG;

// ============================================
// CONSOLE INFO
// ============================================
console.log('%c📱 WhatsApp Integration Loaded', 'color: #25D366; font-weight: bold;');
console.log(`%cBusiness Number: +${WHATSAPP_CONFIG.phoneNumber}`, 'color: #6c757d;');