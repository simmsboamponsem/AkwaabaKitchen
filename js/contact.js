/**
 * ============================================
 * AKWAABA KITCHEN - CONTACT PAGE JAVASCRIPT
 * Handles contact form submission via EmailJS
 * ============================================
 */

'use strict';

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('📧 Contact page initialized');
    initContactForm();
    initCurrentYear();
});

// ============================================
// CONTACT FORM
// ============================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateContactForm()) {
            return;
        }
        
        // Collect form data
        const formData = {
            name: document.getElementById('contactName')?.value.trim(),
            email: document.getElementById('contactEmail')?.value.trim(),
            subject: document.getElementById('contactSubject')?.value || 'General Inquiry',
            message: document.getElementById('contactMessage')?.value.trim()
        };
        
        // Get button reference
        const submitBtn = document.getElementById('submitContactBtn');
        const originalText = submitBtn?.innerHTML;
        
        // Show loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
        }
        
        try {
            // Send email
            const result = await sendContactEmail(formData);
            
            if (result.success) {
                showToast('success', 'Message Sent!', 'Thank you for contacting us. We\'ll respond shortly.');
                contactForm.reset();
            } else {
                showToast('warning', 'Message Received', 'Your message was noted. We\'ll contact you soon.');
            }
            
        } catch (error) {
            console.error('Contact form error:', error);
            showToast('error', 'Error', 'Failed to send message. Please try WhatsApp or call us.');
        }
        
        // Reset button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}

// ============================================
// FORM VALIDATION
// ============================================
function validateContactForm() {
    let isValid = true;
    
    // Name validation
    const name = document.getElementById('contactName');
    const nameError = document.getElementById('contactNameError');
    if (!name?.value.trim() || name.value.trim().length < 2) {
        if (nameError) nameError.textContent = 'Please enter your name';
        name?.classList.add('error');
        isValid = false;
    } else {
        if (nameError) nameError.textContent = '';
        name?.classList.remove('error');
    }
    
    // Email validation
    const email = document.getElementById('contactEmail');
    const emailError = document.getElementById('contactEmailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email?.value.trim() || !emailRegex.test(email.value.trim())) {
        if (emailError) emailError.textContent = 'Please enter a valid email address';
        email?.classList.add('error');
        isValid = false;
    } else {
        if (emailError) emailError.textContent = '';
        email?.classList.remove('error');
    }
    
    // Message validation
    const message = document.getElementById('contactMessage');
    const messageError = document.getElementById('contactMessageError');
    if (!message?.value.trim() || message.value.trim().length < 10) {
        if (messageError) messageError.textContent = 'Please enter a message (at least 10 characters)';
        message?.classList.add('error');
        isValid = false;
    } else {
        if (messageError) messageError.textContent = '';
        message?.classList.remove('error');
    }
    
    if (!isValid) {
        showToast('error', 'Form Error', 'Please fill all required fields correctly.');
    }
    
    return isValid;
}

// ============================================
// SEND CONTACT EMAIL
// ============================================
async function sendContactEmail(formData) {
    // Check if global function exists
    if (typeof window.sendContactEmail === 'function') {
        return await window.sendContactEmail(formData);
    }
    
    // Fallback - simulate success
    console.log('Contact form data:', formData);
    return { success: true, message: 'Simulated success' };
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(type, title, message) {
    if (typeof window.showToast === 'function') {
        window.showToast(type, title, message);
        return;
    }
    
    // Fallback
    const container = document.getElementById('toastContainer');
    if (!container) {
        alert(`${title}\n${message}`);
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
        <div class="toast-icon"><i class="fas ${icons[type]}"></i></div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// ============================================
// CURRENT YEAR
// ============================================
function initCurrentYear() {
    const el = document.getElementById('currentYear');
    if (el) el.textContent = new Date().getFullYear();
}

console.log('✅ Contact.js loaded');

/**
 * SEND MESSAGE BUTTON - Contact Form Handler
 */
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const subject = document.getElementById('contactSubject')?.value || 'General Inquiry';
        const message = document.getElementById('contactMessage').value.trim();
        
        // Validate
        let isValid = true;
        
        if (!name || name.length < 2) {
            document.getElementById('contactNameError').textContent = 'Please enter your name';
            isValid = false;
        } else {
            document.getElementById('contactNameError').textContent = '';
        }
        
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            document.getElementById('contactEmailError').textContent = 'Please enter a valid email';
            isValid = false;
        } else {
            document.getElementById('contactEmailError').textContent = '';
        }
        
        if (!message || message.length < 10) {
            document.getElementById('contactMessageError').textContent = 'Message must be at least 10 characters';
            isValid = false;
        } else {
            document.getElementById('contactMessageError').textContent = '';
        }
        
        if (!isValid) return;
        
        // Show loading
        const btn = document.getElementById('submitContactBtn');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        try {
            // Send email via EmailJS
            await emailjs.send(
                'service_xvqvz4w',      // ← Your EmailJS Service ID
                'template_kk2n4qd',     // ← Your EmailJS Template ID
                {
                    from_name: name,
                    from_email: email,
                    subject: subject,
                    message: message
                }
            );
            
            // Success
            alert('Message sent successfully! We will respond shortly.');
            form.reset();
            
        } catch (error) {
            console.error('Email error:', error);
            alert('Failed to send message. Please try again.');
        }
        
        // Reset button
        btn.disabled = false;
        btn.innerHTML = originalText;
    });
});
