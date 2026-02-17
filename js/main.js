/**
 * ============================================
 * AKWAABA KITCHEN - MAIN JAVASCRIPT
 * Core functionality for the restaurant website
 * ============================================
 */

'use strict';

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    // Ghana WhatsApp Number (Replace with actual number)
    whatsappNumber: '233240000000',
    
    // Restaurant Info
    restaurantName: 'Akwaaba Kitchen',
    currency: 'GHS',
    
    // Delivery Fee
    deliveryFee: 10,
    kumasiDeliveryFee: 30,
    
    // Animation Delays
    toastDuration: 5000,
    
    // Menu Items with Prices
    menuItems: {
        'jollof': { name: 'Jollof Rice & Chicken', price: 45 },
        'banku': { name: 'Banku & Tilapia', price: 65 },
        'fufu': { name: 'Fufu & Light Soup', price: 50 },
        'waakye': { name: 'Waakye Special', price: 35 },
        'gabeans': { name: 'Gabeans Special', price: 35 },
        'fried-rice': { name: 'Fried Rice & Chicken', price: 50 },
        'kelewele': { name: 'Kelewele', price: 20 },
        'goat-soup': { name: 'Goat Soup (Aponkye)', price: 60 },
        'plain-rice': { name: 'Plain Rice & Stew', price: 30 }
    }
};

// Make CONFIG globally accessible
window.APP_CONFIG = CONFIG;

// ============================================
// DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initMenuFilter();
    initCurrentYear();
    initAnimations();
    initContactForm();
    initChatWidget();
});

// ============================================
// NAVBAR FUNCTIONALITY
// ============================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateNavbar() {
        const scrollY = window.scrollY;
        
        // Add scrolled class when scrolled down
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
    
    // Initial check
    updateNavbar();
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (href === '#' || href === '') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// MENU FILTER
// ============================================
function initMenuFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');
    
    if (filterBtns.length === 0 || menuCards.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            // Filter menu cards
            menuCards.forEach(card => {
                const category = card.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    card.style.display = '';
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ============================================
// CURRENT YEAR
// ============================================
function initCurrentYear() {
    const yearElements = document.querySelectorAll('#currentYear');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(el => {
        el.textContent = currentYear;
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    document.querySelectorAll('.menu-card, .feature-card, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add animated class styles
    const style = document.createElement('style');
    style.textContent = `
        .animated {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(type, title, message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check',
        error: 'fa-times',
        warning: 'fa-exclamation',
        info: 'fa-info'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${icons[type] || icons.info}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    });
    
    // Auto remove
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }
    }, CONFIG.toastDuration);
}

// Make showToast globally accessible
window.showToast = showToast;

// ============================================
// FORM VALIDATION HELPERS
// ============================================
const ValidationHelpers = {
    // Validate Ghana phone number
    isValidGhanaPhone(phone) {
        // Remove spaces and special characters
        const cleaned = phone.replace(/[\s\-\(\)]/g, '');
        
        // Ghana phone patterns:
        // +233XXXXXXXXX (12 digits with +)
        // 233XXXXXXXXX (12 digits)
        // 0XXXXXXXXX (10 digits)
        
        const patterns = [
            /^\+233[0-9]{9}$/,      // +233XXXXXXXXX
            /^233[0-9]{9}$/,        // 233XXXXXXXXX
            /^0[0-9]{9}$/           // 0XXXXXXXXX
        ];
        
        return patterns.some(pattern => pattern.test(cleaned));
    },
    
    // Validate email
    isValidEmail(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    },
    
    // Format phone for WhatsApp
    formatPhoneForWhatsApp(phone) {
        let cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
        
        // Convert to international format
        if (cleaned.startsWith('0')) {
            cleaned = '233' + cleaned.substring(1);
        } else if (!cleaned.startsWith('233')) {
            cleaned = '233' + cleaned;
        }
        
        return cleaned;
    },
    
    // Sanitize input
    sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
};

// Make ValidationHelpers globally accessible
window.ValidationHelpers = ValidationHelpers;

// ============================================
// CONTACT FORM
// ============================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('contactName')?.value.trim(),
            email: document.getElementById('contactEmail')?.value.trim(),
            subject: document.getElementById('contactSubject')?.value,
            message: document.getElementById('contactMessage')?.value.trim()
        };
        
        // Validate
        let isValid = true;
        
        // Name validation
        const nameError = document.getElementById('contactNameError');
        if (!formData.name || formData.name.length < 2) {
            if (nameError) nameError.textContent = 'Please enter your name';
            document.getElementById('contactName')?.classList.add('error');
            isValid = false;
        } else {
            if (nameError) nameError.textContent = '';
            document.getElementById('contactName')?.classList.remove('error');
        }
        
        // Email validation
        const emailError = document.getElementById('contactEmailError');
        if (!ValidationHelpers.isValidEmail(formData.email)) {
            if (emailError) emailError.textContent = 'Please enter a valid email address';
            document.getElementById('contactEmail')?.classList.add('error');
            isValid = false;
        } else {
            if (emailError) emailError.textContent = '';
            document.getElementById('contactEmail')?.classList.remove('error');
        }
        
        // Message validation
        const messageError = document.getElementById('contactMessageError');
        if (!formData.message || formData.message.length < 10) {
            if (messageError) messageError.textContent = 'Please enter a message (at least 10 characters)';
            document.getElementById('contactMessage')?.classList.add('error');
            isValid = false;
        } else {
            if (messageError) messageError.textContent = '';
            document.getElementById('contactMessage')?.classList.remove('error');
        }
        
        if (!isValid) return;
        
        // Simulate form submission
        const submitBtn = document.getElementById('submitContactBtn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
        
        // Simulate API call
        setTimeout(() => {
            showToast('success', 'Message Sent!', 'Thank you for contacting us. We\'ll get back to you soon!');
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 1500);
    });
}

// ============================================
// CHAT WIDGET
// ============================================
function initChatWidget() {
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const quickReplies = document.querySelectorAll('.quick-reply-btn');
    
    if (!chatForm || !chatInput || !chatMessages) return;
    
    // Chat responses
    const chatResponses = {
        'popular': {
            message: 'Our most popular dishes are:\n\n🍛 Jollof Rice & Chicken (GHS 45)\n🐟 Banku & Tilapia (GHS 65)\n🍲 Fufu & Light Soup (GHS 50)\n🍚 Waakye Special (GHS 35)\n\nWould you like to place an order?',
            followUp: true
        },
        'delivery': {
            message: 'We deliver to these areas in Ghana:\n\n📍 Accra Central\n📍 Osu, East Legon, Madina\n📍 Tema, Spintex\n📍 Dansoman, Lapaz\n📍 Airport City, Cantonments\n📍 Kumasi (special delivery fee applies)\n\nDelivery fee starts at GHS 10.',
            followUp: false
        },
        'payment': {
            message: 'We accept the following payment methods:\n\n💵 Cash on Delivery\n📱 Mobile Money (MTN, Vodafone, AirtelTigo)\n💳 Visa/Mastercard via Paystack\n\nAll payments are secure and convenient!',
            followUp: false
        },
        'hours': {
            message: 'Our business hours are:\n\n📅 Monday - Friday: 7:00 AM - 10:00 PM\n📅 Saturday - Sunday: 8:00 AM - 11:00 PM\n\nWe\'re always ready to serve you delicious Ghanaian food! 🍲',
            followUp: false
        },
        'default': {
            message: 'Thank you for your message! Our team will respond shortly. For faster assistance, you can:\n\n📞 Call us: +233 24 000 0000\n💬 WhatsApp: +233 24 000 0000\n\nOr use the quick reply buttons below!',
            followUp: true
        }
    };
    
    // Send message function
    function sendMessage(message) {
        if (!message.trim()) return;
        
        // Hide quick replies after first message
        const quickRepliesContainer = document.getElementById('quickReplies');
        if (quickRepliesContainer) {
            quickRepliesContainer.style.display = 'none';
        }
        
        // Add user message
        addMessage(message, 'sent');
        
        // Clear input
        chatInput.value = '';
        
        // Determine response
        let responseKey = 'default';
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('popular') || lowerMessage.includes('dish') || lowerMessage.includes('menu')) {
            responseKey = 'popular';
        } else if (lowerMessage.includes('deliver') || lowerMessage.includes('area') || lowerMessage.includes('location')) {
            responseKey = 'delivery';
        } else if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('money')) {
            responseKey = 'payment';
        } else if (lowerMessage.includes('hour') || lowerMessage.includes('time') || lowerMessage.includes('open')) {
            responseKey = 'hours';
        }
        
        // Simulate typing delay
        setTimeout(() => {
            addMessage(chatResponses[responseKey].message, 'received');
            
            // Show quick replies again if needed
            if (chatResponses[responseKey].followUp && quickRepliesContainer) {
                setTimeout(() => {
                    quickRepliesContainer.style.display = 'flex';
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 500);
            }
        }, 1000);
    }
    
    // Add message to chat
    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;
        
        const time = new Date().toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${type === 'sent' ? '👤' : '🍲'}</div>
            <div class="message-content">
                <p>${text.replace(/\n/g, '<br>')}</p>
                <span class="message-time">${time}</span>
            </div>
        `;
        
        // Insert before quick replies or at end
        const quickRepliesContainer = document.getElementById('quickReplies');
        if (quickRepliesContainer) {
            chatMessages.insertBefore(messageDiv, quickRepliesContainer);
        } else {
            chatMessages.appendChild(messageDiv);
        }
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Form submit
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        sendMessage(chatInput.value);
    });
    
    // Quick reply buttons
    quickReplies.forEach(btn => {
        btn.addEventListener('click', function() {
            const message = this.dataset.message;
            sendMessage(message);
        });
    });
}

// ============================================
// MODAL FUNCTIONALITY
// ============================================
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Close on overlay click
    const overlay = modal.querySelector('.modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', () => hideModal(modalId));
    }
    
    // Close on escape key
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            hideModal(modalId);
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Make modal functions globally accessible
window.showModal = showModal;
window.hideModal = hideModal;

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Format currency
function formatCurrency(amount) {
    return `GHS ${parseFloat(amount).toFixed(2)}`;
}

// Generate order ID
function generateOrderId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `AK-${timestamp}-${random}`;
}

// Make utilities globally accessible
window.formatCurrency = formatCurrency;
window.generateOrderId = generateOrderId;

// ============================================
// CONSOLE WELCOME MESSAGE
// ============================================
console.log('%c🍲 Akwaaba Kitchen', 'font-size: 24px; font-weight: bold; color: #CE1126;');
console.log('%cAuthentic Ghanaian Cuisine', 'font-size: 14px; color: #006B3F;');
console.log('%cBuilt with ❤️ in Ghana', 'font-size: 12px; color: #FCD116;');