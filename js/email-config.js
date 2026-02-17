/**
 * ============================================
 * AKWAABA KITCHEN - EMAIL CONFIGURATION
 * Central configuration for all email services
 * ============================================
 */

'use strict';

// ============================================
// ⚙️ EMAIL CONFIGURATION - UPDATE THESE!
// ============================================
const EMAIL_CONFIG = {
    // EmailJS Credentials (Get from emailjs.com dashboard)
    serviceId: 'service_xvqvz4w',      // ← Your Service ID
    publicKey: 'Sq2Yn18fNF0AHa43R',      // ← Your Public Key
    
    // Template IDs
    templates: {
        order: 'template_xxxxxxx',     // ← Order notification template
        contact: 'template_kk2n4qd'    // ← Contact form template
    },
    
    // Restaurant Email (where emails are sent)
    restaurantEmail: 'akwaabakitchen101@gmail.com', // ← Your email
    
    // Enable/Disable (set to true after configuration)
    enabled: true  // ← Change to TRUE after adding your keys
};

// ============================================
// INITIALIZE EMAILJS
// ============================================
function initEmailService() {
    if (typeof emailjs === 'undefined') {
        console.warn('📧 EmailJS library not loaded');
        return false;
    }
    
    if (!EMAIL_CONFIG.enabled) {
        console.warn('📧 EmailJS disabled. Update EMAIL_CONFIG and set enabled: true');
        return false;
    }
    
    try {
        emailjs.init(EMAIL_CONFIG.publicKey);
        console.log('✅ EmailJS initialized successfully');
        return true;
    } catch (error) {
        console.error('❌ EmailJS initialization failed:', error);
        return false;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initEmailService);

// ============================================
// SEND ORDER EMAIL
// ============================================
async function sendOrderEmail(orderData) {
    if (!EMAIL_CONFIG.enabled || typeof emailjs === 'undefined') {
        console.warn('Email service not available');
        return { success: false, message: 'Email service not configured' };
    }
    
    const templateParams = {
        to_email: EMAIL_CONFIG.restaurantEmail,
        order_id: orderData.orderId,
        order_time: orderData.orderTime,
        customer_name: orderData.fullName,
        customer_phone: orderData.phoneNumber,
        customer_email: orderData.email,
        delivery_area: orderData.deliveryLocation,
        delivery_address: orderData.deliveryAddress,
        food_item: orderData.foodName,
        quantity: orderData.quantity,
        unit_price: orderData.unitPrice,
        subtotal: orderData.subtotal,
        delivery_fee: orderData.deliveryFee,
        total_amount: orderData.total,
        payment_method: orderData.paymentMethod,
        payment_status: orderData.paymentStatus || 'Pending',
        payment_reference: orderData.paymentReference || 'N/A',
        order_notes: orderData.orderNotes || 'None'
    };
    
    try {
        const response = await emailjs.send(
            EMAIL_CONFIG.serviceId,
            EMAIL_CONFIG.templates.order,
            templateParams
        );
        console.log('✅ Order email sent:', response);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('❌ Order email failed:', error);
        return { success: false, message: error.text || 'Failed to send email' };
    }
}

// ============================================
// SEND CONTACT FORM EMAIL
// ============================================
async function sendContactEmail(contactData) {
    if (!EMAIL_CONFIG.enabled || typeof emailjs === 'undefined') {
        console.warn('Email service not available');
        return { success: false, message: 'Email service not configured' };
    }
    
    const templateParams = {
        to_email: EMAIL_CONFIG.restaurantEmail,
        from_name: contactData.name,
        from_email: contactData.email,
        subject: contactData.subject || 'General Inquiry',
        message: contactData.message
    };
    
    try {
        const response = await emailjs.send(
            EMAIL_CONFIG.serviceId,
            EMAIL_CONFIG.templates.contact,
            templateParams
        );
        console.log('✅ Contact email sent:', response);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('❌ Contact email failed:', error);
        return { success: false, message: error.text || 'Failed to send email' };
    }
}

// ============================================
// MAKE FUNCTIONS GLOBAL
// ============================================
window.EMAIL_CONFIG = EMAIL_CONFIG;
window.sendOrderEmail = sendOrderEmail;
window.sendContactEmail = sendContactEmail;

console.log('📧 Email configuration loaded');
console.log('📧 Service enabled:', EMAIL_CONFIG.enabled);