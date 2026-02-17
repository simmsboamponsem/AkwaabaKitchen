/**
 * ============================================
 * AKWAABA KITCHEN - PAYSTACK INTEGRATION
 * Interactive Demo with Realistic Payment Flows
 * ============================================
 */

'use strict';

// ============================================
// PAYSTACK CONFIGURATION
// ============================================
const PAYSTACK_CONFIG = {
    // Replace with your actual Paystack PUBLIC key for production
    publicKey: 'pk_live_5115d18b8b9804c904f64de367f4ddfe4e133d17',
    secretKey: 'sk_live_8046f47fb5b0bbc78ed6a0f37dee778d3b8841b9',
    
    // Demo mode - set to false when using real Paystack key
    demoMode: false,
    
    // Currency
    currency: 'GHS',
    
    // Available channels
    channels: ['card', 'mobile_money', 'bank'],
    
    // Company info
    companyName: 'Akwaaba Kitchen',
};

// ============================================
// GHANA MOBILE NETWORKS
// ============================================
const MOBILE_NETWORKS = [
    { code: 'mtn', name: 'MTN Mobile Money', prefix: ['024', '054', '055', '059'] },
    { code: 'vodafone', name: 'Vodafone Cash', prefix: ['020', '050'] },
    { code: 'airteltigo', name: 'AirtelTigo Money', prefix: ['027', '057', '026', '056'] }
];

// ============================================
// GHANA BANKS
// ============================================
const GHANA_BANKS = [
    { code: 'gcb', name: 'GCB Bank' },
    { code: 'ecobank', name: 'Ecobank Ghana' },
    { code: 'stanbic', name: 'Stanbic Bank' },
    { code: 'absa', name: 'Absa Bank Ghana' },
    { code: 'uba', name: 'United Bank for Africa' },
    { code: 'zenith', name: 'Zenith Bank' },
    { code: 'fidelity', name: 'Fidelity Bank' },
    { code: 'calbank', name: 'CalBank' },
    { code: 'access', name: 'Access Bank' },
    { code: 'fnb', name: 'First National Bank' }
];

// ============================================
// TEST CREDENTIALS
// ============================================
const TEST_CREDENTIALS = {
    card: {
        number: '4084084084084081',
        expiry: '12/28',
        cvv: '408',
        pin: '0000',
        otp: '123456'
    },
    mobileMoney: {
        otp: '123456',
        pin: '0000'
    },
    bank: {
        otp: '123456'
    }
};

// ============================================
// CURRENT PAYMENT STATE
// ============================================
let paymentState = {
    formData: null,
    method: 'card',
    step: 1,
    reference: '',
    amount: 0
};

// ============================================
// INITIALIZE PAYSTACK PAYMENT
// ============================================
function initPaystackPayment(formData) {
    console.log('💳 Initializing Paystack payment...', formData);
    
    if (!formData || !formData.email || !formData.total) {
        showToast('error', 'Error', 'Invalid order data. Please try again.');
        return;
    }
    
    // Store payment data
    paymentState.formData = formData;
    paymentState.amount = formData.total;
    paymentState.reference = generateReference();
    paymentState.step = 1;
    paymentState.method = 'card';
    
    // Check if using demo mode
    if (PAYSTACK_CONFIG.demoMode || !isPaystackConfigured()) {
        showInteractivePaymentModal(formData);
    } else {
        processRealPaystackPayment(formData);
    }
}

// ============================================
// CHECK IF PAYSTACK IS CONFIGURED
// ============================================
function isPaystackConfigured() {
    const key = PAYSTACK_CONFIG.publicKey;
    return key && !key.includes('xxxxxxxx') && key.length > 40;
}

// ============================================
// GENERATE REFERENCE
// ============================================
function generateReference() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `AK_${timestamp}_${random}`;
}

// ============================================
// SHOW INTERACTIVE PAYMENT MODAL
// ============================================
function showInteractivePaymentModal(formData) {
    // Remove existing modal if any
    const existingModal = document.getElementById('paystackDemoModal');
    if (existingModal) existingModal.remove();
    
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'paystackDemoModal';
    modal.className = 'paystack-modal';
    modal.innerHTML = getModalHTML(formData);
    
    // Add styles
    addPaystackStyles();
    
    // Add to body
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Initialize modal functionality
    setTimeout(() => {
        modal.classList.add('active');
        initModalEvents();
    }, 10);
}

// ============================================
// GET MODAL HTML
// ============================================
function getModalHTML(formData) {
    return `
        <div class="ps-modal-overlay" id="psOverlay"></div>
        <div class="ps-modal-container">
            <!-- Header -->
            <div class="ps-header">
                <div class="ps-header-left">
                    <div class="ps-logo">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>
                    <div class="ps-header-info">
                        <span class="ps-merchant">Akwaaba Kitchen</span>
                        <span class="ps-email">${formData.email}</span>
                    </div>
                </div>
                <button class="ps-close-btn" id="psCloseBtn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <!-- Amount Display -->
            <div class="ps-amount-section">
                <span class="ps-amount-label">Pay</span>
                <div class="ps-amount">
                    <span class="ps-currency">GHS</span>
                    <span class="ps-value">${formData.total.toFixed(2)}</span>
                </div>
            </div>
            
            <!-- Demo Notice -->
            <div class="ps-demo-notice">
                <i class="fas fa-info-circle"></i>
                <span>Demo Mode - No real charges</span>
            </div>
            
            <!-- Payment Methods -->
            <div class="ps-methods" id="psMethods">
                <button class="ps-method-btn active" data-method="card">
                    <i class="fas fa-credit-card"></i>
                    <span>Card</span>
                </button>
                <button class="ps-method-btn" data-method="mobile_money">
                    <i class="fas fa-mobile-alt"></i>
                    <span>Mobile Money</span>
                </button>
                <button class="ps-method-btn" data-method="bank">
                    <i class="fas fa-university"></i>
                    <span>Bank</span>
                </button>
            </div>
            
            <!-- Payment Forms Container -->
            <div class="ps-form-container" id="psFormContainer">
                ${getCardFormHTML()}
            </div>
            
            <!-- Footer -->
            <div class="ps-footer">
                <div class="ps-secured">
                    <i class="fas fa-lock"></i>
                    <span>Secured by <strong>Paystack</strong></span>
                </div>
                <div class="ps-test-info">
                    <button class="ps-test-btn" id="psTestBtn">
                        <i class="fas fa-question-circle"></i> Test Credentials
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Test Credentials Modal -->
        <div class="ps-test-modal" id="psTestModal">
            <div class="ps-test-content">
                <h4><i class="fas fa-key"></i> Test Credentials</h4>
                <div class="ps-test-section">
                    <h5>💳 Card Payment</h5>
                    <p>Card: <code>4084 0840 8408 4081</code></p>
                    <p>Expiry: <code>12/28</code></p>
                    <p>CVV: <code>408</code></p>
                    <p>PIN: <code>0000</code></p>
                    <p>OTP: <code>123456</code></p>
                </div>
                <div class="ps-test-section">
                    <h5>📱 Mobile Money</h5>
                    <p>Use any valid Ghana number</p>
                    <p>OTP: <code>123456</code></p>
                </div>
                <div class="ps-test-section">
                    <h5>🏦 Bank Transfer</h5>
                    <p>OTP: <code>123456</code></p>
                </div>
                <button class="ps-test-close" id="psTestClose">Got it!</button>
            </div>
        </div>
    `;
}

// ============================================
// CARD FORM HTML
// ============================================
function getCardFormHTML() {
    return `
        <form class="ps-form" id="psCardForm">
            <div class="ps-form-step" data-step="1">
                <h4 class="ps-step-title">Enter Card Details</h4>
                
                <div class="ps-input-group">
                    <label>Card Number</label>
                    <div class="ps-input-wrapper">
                        <i class="fas fa-credit-card"></i>
                        <input type="text" id="cardNumber" placeholder="0000 0000 0000 0000" 
                            maxlength="19" autocomplete="cc-number" required>
                        <div class="ps-card-type" id="cardType"></div>
                    </div>
                    <span class="ps-error" id="cardNumberError"></span>
                </div>
                
                <div class="ps-input-row">
                    <div class="ps-input-group">
                        <label>Expiry Date</label>
                        <div class="ps-input-wrapper">
                            <i class="fas fa-calendar"></i>
                            <input type="text" id="cardExpiry" placeholder="MM/YY" 
                                maxlength="5" autocomplete="cc-exp" required>
                        </div>
                        <span class="ps-error" id="cardExpiryError"></span>
                    </div>
                    <div class="ps-input-group">
                        <label>CVV</label>
                        <div class="ps-input-wrapper">
                            <i class="fas fa-lock"></i>
                            <input type="password" id="cardCvv" placeholder="•••" 
                                maxlength="4" autocomplete="cc-csc" required>
                        </div>
                        <span class="ps-error" id="cardCvvError"></span>
                    </div>
                </div>
                
                <button type="submit" class="ps-pay-btn" id="cardSubmitBtn">
                    <span>Continue</span>
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
            
            <div class="ps-form-step hidden" data-step="2">
                <h4 class="ps-step-title">Enter Card PIN</h4>
                <p class="ps-step-desc">Please enter your 4-digit card PIN to authorize this payment</p>
                
                <div class="ps-pin-container">
                    <input type="password" class="ps-pin-input" maxlength="1" data-index="0">
                    <input type="password" class="ps-pin-input" maxlength="1" data-index="1">
                    <input type="password" class="ps-pin-input" maxlength="1" data-index="2">
                    <input type="password" class="ps-pin-input" maxlength="1" data-index="3">
                </div>
                <input type="hidden" id="cardPin">
                <span class="ps-error ps-center" id="cardPinError"></span>
                
                <button type="button" class="ps-pay-btn" id="pinSubmitBtn">
                    <span>Authorize Payment</span>
                    <i class="fas fa-lock"></i>
                </button>
                
                <button type="button" class="ps-back-btn" id="pinBackBtn">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
            </div>
            
            <div class="ps-form-step hidden" data-step="3">
                <h4 class="ps-step-title">Enter OTP</h4>
                <p class="ps-step-desc">A one-time password has been sent to your phone ending in ****${getLastFourDigits()}</p>
                
                <div class="ps-otp-container">
                    <input type="text" class="ps-otp-input" maxlength="1" data-index="0">
                    <input type="text" class="ps-otp-input" maxlength="1" data-index="1">
                    <input type="text" class="ps-otp-input" maxlength="1" data-index="2">
                    <input type="text" class="ps-otp-input" maxlength="1" data-index="3">
                    <input type="text" class="ps-otp-input" maxlength="1" data-index="4">
                    <input type="text" class="ps-otp-input" maxlength="1" data-index="5">
                </div>
                <input type="hidden" id="cardOtp">
                <span class="ps-error ps-center" id="cardOtpError"></span>
                
                <button type="button" class="ps-pay-btn" id="otpSubmitBtn">
                    <span>Complete Payment</span>
                    <i class="fas fa-check"></i>
                </button>
                
                <div class="ps-resend">
                    Didn't receive OTP? <button type="button" id="resendOtp">Resend</button>
                </div>
            </div>
        </form>
        
        <!-- Processing State -->
        <div class="ps-processing hidden" id="psProcessing">
            <div class="ps-spinner"></div>
            <p id="processingText">Processing payment...</p>
        </div>
        
        <!-- Success State -->
        <div class="ps-success hidden" id="psSuccess">
            <div class="ps-success-icon">
                <i class="fas fa-check"></i>
            </div>
            <h4>Payment Successful!</h4>
            <p>Reference: <strong id="successRef"></strong></p>
            <button class="ps-done-btn" id="psDoneBtn">Done</button>
        </div>
        
        <!-- Error State -->
        <div class="ps-error-state hidden" id="psError">
            <div class="ps-error-icon">
                <i class="fas fa-times"></i>
            </div>
            <h4>Payment Failed</h4>
            <p id="errorMessage">Transaction could not be completed</p>
            <button class="ps-retry-btn" id="psRetryBtn">Try Again</button>
        </div>
    `;
}

// ============================================
// MOBILE MONEY FORM HTML
// ============================================
function getMobileMoneyFormHTML() {
    return `
        <form class="ps-form" id="psMomoForm">
            <div class="ps-form-step" data-step="1">
                <h4 class="ps-step-title">Mobile Money Payment</h4>
                
                <div class="ps-input-group">
                    <label>Select Network</label>
                    <div class="ps-network-options">
                        ${MOBILE_NETWORKS.map((net, i) => `
                            <label class="ps-network-option ${i === 0 ? 'selected' : ''}">
                                <input type="radio" name="network" value="${net.code}" ${i === 0 ? 'checked' : ''}>
                                <div class="ps-network-icon ${net.code}">
                                    ${getNetworkIcon(net.code)}
                                </div>
                                <span>${net.name}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
                
                <div class="ps-input-group">
                    <label>Mobile Number</label>
                    <div class="ps-input-wrapper">
                        <span class="ps-prefix">+233</span>
                        <input type="tel" id="momoNumber" placeholder="24 XXX XXXX" 
                            maxlength="10" required>
                    </div>
                    <span class="ps-hint">Enter your registered mobile money number</span>
                    <span class="ps-error" id="momoNumberError"></span>
                </div>
                
                <div class="ps-momo-info">
                    <i class="fas fa-info-circle"></i>
                    <p>You will receive a prompt on your phone to authorize this payment of <strong>GHS ${paymentState.amount.toFixed(2)}</strong></p>
                </div>
                
                <button type="submit" class="ps-pay-btn" id="momoSubmitBtn">
                    <span>Send Payment Request</span>
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
            
            <div class="ps-form-step hidden" data-step="2">
                <h4 class="ps-step-title">Authorize Payment</h4>
                
                <div class="ps-momo-prompt">
                    <div class="ps-phone-animation">
                        <i class="fas fa-mobile-alt"></i>
                        <div class="ps-pulse"></div>
                    </div>
                    <p>A payment prompt has been sent to</p>
                    <strong id="momoDisplayNumber">+233 XX XXX XXXX</strong>
                </div>
                
                <div class="ps-momo-steps">
                    <div class="ps-momo-step">
                        <span class="step-num">1</span>
                        <span>Check your phone for the prompt</span>
                    </div>
                    <div class="ps-momo-step">
                        <span class="step-num">2</span>
                        <span>Enter your Mobile Money PIN</span>
                    </div>
                    <div class="ps-momo-step">
                        <span class="step-num">3</span>
                        <span>Confirm the payment</span>
                    </div>
                </div>
                
                <p class="ps-or-divider"><span>OR enter OTP manually</span></p>
                
                <div class="ps-otp-container">
                    <input type="text" class="ps-otp-input" maxlength="1" data-index="0">
                    <input type="text" class="ps-otp-input" maxlength="1" data-index="1">
                    <input type="text" class="ps-otp-input" maxlength="1" data-index="2">
                    <input type="text" class="ps-otp-input" maxlength="1" data-index="3">
                    <input type="text" class="ps-otp-input" maxlength="1" data-index="4">
                    <input type="text" class="ps-otp-input" maxlength="1" data-index="5">
                </div>
                <input type="hidden" id="momoOtp">
                <span class="ps-error ps-center" id="momoOtpError"></span>
                
                <button type="button" class="ps-pay-btn" id="momoOtpSubmitBtn">
                    <span>Verify & Complete</span>
                    <i class="fas fa-check"></i>
                </button>
                
                <button type="button" class="ps-back-btn" id="momoBackBtn">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
            </div>
        </form>
        
        <!-- Processing State -->
        <div class="ps-processing hidden" id="psProcessing">
            <div class="ps-spinner"></div>
            <p id="processingText">Processing payment...</p>
        </div>
        
        <!-- Success State -->
        <div class="ps-success hidden" id="psSuccess">
            <div class="ps-success-icon">
                <i class="fas fa-check"></i>
            </div>
            <h4>Payment Successful!</h4>
            <p>Reference: <strong id="successRef"></strong></p>
            <button class="ps-done-btn" id="psDoneBtn">Done</button>
        </div>
        
        <!-- Error State -->
        <div class="ps-error-state hidden" id="psError">
            <div class="ps-error-icon">
                <i class="fas fa-times"></i>
            </div>
            <h4>Payment Failed</h4>
            <p id="errorMessage">Transaction could not be completed</p>
            <button class="ps-retry-btn" id="psRetryBtn">Try Again</button>
        </div>
    `;
}

// ============================================
// BANK TRANSFER FORM HTML
// ============================================
function getBankFormHTML() {
    return `
        <form class="ps-form" id="psBankForm">
            <div class="ps-form-step" data-step="1">
                <h4 class="ps-step-title">Bank Transfer</h4>
                
                <div class="ps-input-group">
                    <label>Select Your Bank</label>
                    <div class="ps-select-wrapper">
                        <i class="fas fa-university"></i>
                        <select id="bankSelect" required>
                            <option value="">Choose a bank...</option>
                            ${GHANA_BANKS.map(bank => `
                                <option value="${bank.code}">${bank.name}</option>
                            `).join('')}
                        </select>
                        <i class="fas fa-chevron-down ps-select-arrow"></i>
                    </div>
                    <span class="ps-error" id="bankSelectError"></span>
                </div>
                
                <div class="ps-input-group">
                    <label>Account Number</label>
                    <div class="ps-input-wrapper">
                        <i class="fas fa-hashtag"></i>
                        <input type="text" id="accountNumber" placeholder="Enter account number" 
                            maxlength="16" required>
                    </div>
                    <span class="ps-error" id="accountNumberError"></span>
                </div>
                
                <div class="ps-input-group">
                    <label>Date of Birth</label>
                    <div class="ps-input-wrapper">
                        <i class="fas fa-calendar-alt"></i>
                        <input type="date" id="accountDob" required>
                    </div>
                    <span class="ps-hint">For account verification</span>
                    <span class="ps-error" id="accountDobError"></span>
                </div>
                
                <button type="submit" class="ps-pay-btn" id="bankSubmitBtn">
                    <span>Continue to Bank</span>
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
            
            <div class="ps-form-step hidden" data-step="2">
                <h4 class="ps-step-title">Bank Authorization</h4>
                
                <div class="ps-bank-redirect">
                    <div class="ps-bank-logo" id="selectedBankLogo">
                        <i class="fas fa-university"></i>
                    </div>
                    <p>You are being redirected to <strong id="selectedBankName">your bank</strong> to authorize this payment.</p>
                </div>
                
                <div class="ps-bank-simulation">
                    <div class="ps-bank-header">
                        <span id="bankSimName">Bank</span> - Secure Payment
                    </div>
                    <div class="ps-bank-body">
                        <p>Authorize payment of <strong>GHS ${paymentState.amount.toFixed(2)}</strong> to Akwaaba Kitchen?</p>
                        
                        <div class="ps-input-group">
                            <label>Enter OTP sent to your phone</label>
                            <div class="ps-otp-container small">
                                <input type="text" class="ps-otp-input" maxlength="1" data-index="0">
                                <input type="text" class="ps-otp-input" maxlength="1" data-index="1">
                                <input type="text" class="ps-otp-input" maxlength="1" data-index="2">
                                <input type="text" class="ps-otp-input" maxlength="1" data-index="3">
                                <input type="text" class="ps-otp-input" maxlength="1" data-index="4">
                                <input type="text" class="ps-otp-input" maxlength="1" data-index="5">
                            </div>
                            <input type="hidden" id="bankOtp">
                            <span class="ps-error ps-center" id="bankOtpError"></span>
                        </div>
                        
                        <button type="button" class="ps-pay-btn" id="bankOtpSubmitBtn">
                            <span>Authorize Payment</span>
                            <i class="fas fa-check-circle"></i>
                        </button>
                    </div>
                </div>
                
                <button type="button" class="ps-back-btn" id="bankBackBtn">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
            </div>
        </form>
        
        <!-- Processing State -->
        <div class="ps-processing hidden" id="psProcessing">
            <div class="ps-spinner"></div>
            <p id="processingText">Processing payment...</p>
        </div>
        
        <!-- Success State -->
        <div class="ps-success hidden" id="psSuccess">
            <div class="ps-success-icon">
                <i class="fas fa-check"></i>
            </div>
            <h4>Payment Successful!</h4>
            <p>Reference: <strong id="successRef"></strong></p>
            <button class="ps-done-btn" id="psDoneBtn">Done</button>
        </div>
        
        <!-- Error State -->
        <div class="ps-error-state hidden" id="psError">
            <div class="ps-error-icon">
                <i class="fas fa-times"></i>
            </div>
            <h4>Payment Failed</h4>
            <p id="errorMessage">Transaction could not be completed</p>
            <button class="ps-retry-btn" id="psRetryBtn">Try Again</button>
        </div>
    `;
}

// ============================================
// HELPER: GET NETWORK ICON
// ============================================
function getNetworkIcon(code) {
    const icons = {
        mtn: '<span style="color: #ffcc00; font-weight: bold;">MTN</span>',
        vodafone: '<span style="color: #e60000; font-weight: bold;">V</span>',
        airteltigo: '<span style="color: #0066cc; font-weight: bold;">AT</span>'
    };
    return icons[code] || '<i class="fas fa-mobile-alt"></i>';
}

// ============================================
// HELPER: GET LAST FOUR DIGITS
// ============================================
function getLastFourDigits() {
    const phone = paymentState.formData?.phoneNumber || '0000';
    return phone.slice(-4);
}

// ============================================
// INITIALIZE MODAL EVENTS
// ============================================
function initModalEvents() {
    // Close button
    document.getElementById('psCloseBtn')?.addEventListener('click', closePaymentModal);
    document.getElementById('psOverlay')?.addEventListener('click', closePaymentModal);
    
    // Payment method tabs
    document.querySelectorAll('.ps-method-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchPaymentMethod(this.dataset.method);
        });
    });
    
    // Test credentials button
    document.getElementById('psTestBtn')?.addEventListener('click', () => {
        document.getElementById('psTestModal').classList.add('active');
    });
    document.getElementById('psTestClose')?.addEventListener('click', () => {
        document.getElementById('psTestModal').classList.remove('active');
    });
    
    // Initialize form based on current method
    initCardFormEvents();
}

// ============================================
// SWITCH PAYMENT METHOD
// ============================================
function switchPaymentMethod(method) {
    paymentState.method = method;
    paymentState.step = 1;
    
    // Update tabs
    document.querySelectorAll('.ps-method-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.method === method);
    });
    
    // Update form
    const container = document.getElementById('psFormContainer');
    
    switch(method) {
        case 'mobile_money':
            container.innerHTML = getMobileMoneyFormHTML();
            initMobileMoneyFormEvents();
            break;
        case 'bank':
            container.innerHTML = getBankFormHTML();
            initBankFormEvents();
            break;
        default:
            container.innerHTML = getCardFormHTML();
            initCardFormEvents();
    }
}

// ============================================
// CARD FORM EVENTS
// ============================================
function initCardFormEvents() {
    const form = document.getElementById('psCardForm');
    if (!form) return;
    
    // Card number formatting
    const cardInput = document.getElementById('cardNumber');
    cardInput?.addEventListener('input', function(e) {
        let value = this.value.replace(/\s/g, '').replace(/\D/g, '');
        let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
        this.value = formatted;
        
        // Detect card type
        updateCardType(value);
    });
    
    // Expiry formatting
    const expiryInput = document.getElementById('cardExpiry');
    expiryInput?.addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        this.value = value;
    });
    
    // CVV - numbers only
    document.getElementById('cardCvv')?.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
    });
    
    // Form submission (Step 1)
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateCardDetails()) {
            goToCardStep(2);
        }
    });
    
    // PIN inputs
    initPinInputs();
    
    // PIN submit
    document.getElementById('pinSubmitBtn')?.addEventListener('click', function() {
        const pin = document.getElementById('cardPin').value;
        if (pin.length === 4) {
            if (pin === TEST_CREDENTIALS.card.pin) {
                goToCardStep(3);
            } else {
                document.getElementById('cardPinError').textContent = 'Incorrect PIN. Try: 0000';
            }
        } else {
            document.getElementById('cardPinError').textContent = 'Please enter 4-digit PIN';
        }
    });
    
    // PIN back button
    document.getElementById('pinBackBtn')?.addEventListener('click', () => goToCardStep(1));
    
    // OTP inputs
    initOtpInputs('psCardForm');
    
    // OTP submit
    document.getElementById('otpSubmitBtn')?.addEventListener('click', function() {
        const otp = document.getElementById('cardOtp').value;
        if (otp.length === 6) {
            if (otp === TEST_CREDENTIALS.card.otp) {
                processPaymentSuccess();
            } else {
                document.getElementById('cardOtpError').textContent = 'Incorrect OTP. Try: 123456';
            }
        } else {
            document.getElementById('cardOtpError').textContent = 'Please enter 6-digit OTP';
        }
    });
    
    // Resend OTP
    document.getElementById('resendOtp')?.addEventListener('click', function() {
        showToast('success', 'OTP Sent', 'New OTP has been sent to your phone');
    });
    
    // Done button
    document.getElementById('psDoneBtn')?.addEventListener('click', completePayment);
    
    // Retry button
    document.getElementById('psRetryBtn')?.addEventListener('click', () => switchPaymentMethod('card'));
}

// ============================================
// MOBILE MONEY FORM EVENTS
// ============================================
function initMobileMoneyFormEvents() {
    const form = document.getElementById('psMomoForm');
    if (!form) return;
    
    // Network selection
    document.querySelectorAll('.ps-network-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.ps-network-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            this.querySelector('input').checked = true;
        });
    });
    
    // Phone number formatting
    const phoneInput = document.getElementById('momoNumber');
    phoneInput?.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
    });
    
    // Form submit
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateMobileMoneyDetails()) {
            const phone = document.getElementById('momoNumber').value;
            document.getElementById('momoDisplayNumber').textContent = '+233 ' + phone;
            goToMomoStep(2);
        }
    });
    
    // OTP inputs
    initOtpInputs('psMomoForm');
    
    // OTP submit
    document.getElementById('momoOtpSubmitBtn')?.addEventListener('click', function() {
        const otp = document.getElementById('momoOtp').value;
        if (otp.length === 6) {
            if (otp === TEST_CREDENTIALS.mobileMoney.otp) {
                processPaymentSuccess();
            } else {
                document.getElementById('momoOtpError').textContent = 'Incorrect OTP. Try: 123456';
            }
        } else {
            document.getElementById('momoOtpError').textContent = 'Please enter 6-digit OTP';
        }
    });
    
    // Back button
    document.getElementById('momoBackBtn')?.addEventListener('click', () => goToMomoStep(1));
    
    // Done button
    document.getElementById('psDoneBtn')?.addEventListener('click', completePayment);
    
    // Retry button
    document.getElementById('psRetryBtn')?.addEventListener('click', () => switchPaymentMethod('mobile_money'));
}

// ============================================
// BANK FORM EVENTS
// ============================================
function initBankFormEvents() {
    const form = document.getElementById('psBankForm');
    if (!form) return;
    
    // Account number formatting
    document.getElementById('accountNumber')?.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
    });
    
    // Form submit
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateBankDetails()) {
            const bankCode = document.getElementById('bankSelect').value;
            const bank = GHANA_BANKS.find(b => b.code === bankCode);
            document.getElementById('selectedBankName').textContent = bank?.name || 'Bank';
            document.getElementById('bankSimName').textContent = bank?.name || 'Bank';
            goToBankStep(2);
        }
    });
    
    // OTP inputs
    initOtpInputs('psBankForm');
    
    // OTP submit
    document.getElementById('bankOtpSubmitBtn')?.addEventListener('click', function() {
        const otp = document.getElementById('bankOtp').value;
        if (otp.length === 6) {
            if (otp === TEST_CREDENTIALS.bank.otp) {
                processPaymentSuccess();
            } else {
                document.getElementById('bankOtpError').textContent = 'Incorrect OTP. Try: 123456';
            }
        } else {
            document.getElementById('bankOtpError').textContent = 'Please enter 6-digit OTP';
        }
    });
    
    // Back button
    document.getElementById('bankBackBtn')?.addEventListener('click', () => goToBankStep(1));
    
    // Done button
    document.getElementById('psDoneBtn')?.addEventListener('click', completePayment);
    
    // Retry button
    document.getElementById('psRetryBtn')?.addEventListener('click', () => switchPaymentMethod('bank'));
}

// ============================================
// PIN INPUT HANDLER
// ============================================
function initPinInputs() {
    const pinInputs = document.querySelectorAll('.ps-pin-input');
    
    pinInputs.forEach((input, index) => {
        input.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '');
            
            if (this.value && index < pinInputs.length - 1) {
                pinInputs[index + 1].focus();
            }
            
            // Combine all PIN values
            const pin = Array.from(pinInputs).map(i => i.value).join('');
            document.getElementById('cardPin').value = pin;
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !this.value && index > 0) {
                pinInputs[index - 1].focus();
            }
        });
    });
}

// ============================================
// OTP INPUT HANDLER
// ============================================
function initOtpInputs(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const otpInputs = form.querySelectorAll('.ps-otp-input');
    const otpHiddenField = form.querySelector('input[id$="Otp"]');
    
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '');
            
            if (this.value && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
            
            // Combine all OTP values
            const otp = Array.from(otpInputs).map(i => i.value).join('');
            if (otpHiddenField) otpHiddenField.value = otp;
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !this.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
        
        // Allow paste
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            const digits = paste.replace(/\D/g, '').split('');
            
            digits.forEach((digit, i) => {
                if (otpInputs[index + i]) {
                    otpInputs[index + i].value = digit;
                }
            });
            
            const otp = Array.from(otpInputs).map(i => i.value).join('');
            if (otpHiddenField) otpHiddenField.value = otp;
            
            const lastFilledIndex = Math.min(index + digits.length, otpInputs.length) - 1;
            otpInputs[lastFilledIndex]?.focus();
        });
    });
}

// ============================================
// UPDATE CARD TYPE ICON
// ============================================
function updateCardType(number) {
    const cardTypeEl = document.getElementById('cardType');
    if (!cardTypeEl) return;
    
    let type = '';
    let icon = '';
    
    if (number.startsWith('4')) {
        type = 'visa';
        icon = '<i class="fab fa-cc-visa" style="color: #1a1f71;"></i>';
    } else if (number.startsWith('5') || number.startsWith('2')) {
        type = 'mastercard';
        icon = '<i class="fab fa-cc-mastercard" style="color: #eb001b;"></i>';
    } else if (number.startsWith('3')) {
        type = 'amex';
        icon = '<i class="fab fa-cc-amex" style="color: #006fcf;"></i>';
    }
    
    cardTypeEl.innerHTML = icon;
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================
function validateCardDetails() {
    let isValid = true;
    
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiry = document.getElementById('cardExpiry').value;
    const cvv = document.getElementById('cardCvv').value;
    
    // Card number
    if (cardNumber.length < 16) {
        document.getElementById('cardNumberError').textContent = 'Enter a valid 16-digit card number';
        isValid = false;
    } else {
        document.getElementById('cardNumberError').textContent = '';
    }
    
    // Expiry
    if (!expiry.match(/^\d{2}\/\d{2}$/)) {
        document.getElementById('cardExpiryError').textContent = 'Enter valid expiry (MM/YY)';
        isValid = false;
    } else {
        document.getElementById('cardExpiryError').textContent = '';
    }
    
    // CVV
    if (cvv.length < 3) {
        document.getElementById('cardCvvError').textContent = 'Enter valid CVV';
        isValid = false;
    } else {
        document.getElementById('cardCvvError').textContent = '';
    }
    
    return isValid;
}

function validateMobileMoneyDetails() {
    const phone = document.getElementById('momoNumber').value;
    
    if (phone.length < 9) {
        document.getElementById('momoNumberError').textContent = 'Enter a valid mobile number';
        return false;
    }
    
    document.getElementById('momoNumberError').textContent = '';
    return true;
}

function validateBankDetails() {
    let isValid = true;
    
    const bank = document.getElementById('bankSelect').value;
    const account = document.getElementById('accountNumber').value;
    const dob = document.getElementById('accountDob').value;
    
    if (!bank) {
        document.getElementById('bankSelectError').textContent = 'Please select a bank';
        isValid = false;
    } else {
        document.getElementById('bankSelectError').textContent = '';
    }
    
    if (account.length < 8) {
        document.getElementById('accountNumberError').textContent = 'Enter valid account number';
        isValid = false;
    } else {
        document.getElementById('accountNumberError').textContent = '';
    }
    
    if (!dob) {
        document.getElementById('accountDobError').textContent = 'Enter your date of birth';
        isValid = false;
    } else {
        document.getElementById('accountDobError').textContent = '';
    }
    
    return isValid;
}

// ============================================
// STEP NAVIGATION
// ============================================
function goToCardStep(step) {
    paymentState.step = step;
    document.querySelectorAll('#psCardForm .ps-form-step').forEach(s => s.classList.add('hidden'));
    document.querySelector(`#psCardForm .ps-form-step[data-step="${step}"]`)?.classList.remove('hidden');
    
    // Focus first input
    if (step === 2) {
        document.querySelector('.ps-pin-input')?.focus();
    } else if (step === 3) {
        document.querySelector('#psCardForm .ps-otp-input')?.focus();
    }
}

function goToMomoStep(step) {
    paymentState.step = step;
    document.querySelectorAll('#psMomoForm .ps-form-step').forEach(s => s.classList.add('hidden'));
    document.querySelector(`#psMomoForm .ps-form-step[data-step="${step}"]`)?.classList.remove('hidden');
    
    if (step === 2) {
        document.querySelector('#psMomoForm .ps-otp-input')?.focus();
    }
}

function goToBankStep(step) {
    paymentState.step = step;
    document.querySelectorAll('#psBankForm .ps-form-step').forEach(s => s.classList.add('hidden'));
    document.querySelector(`#psBankForm .ps-form-step[data-step="${step}"]`)?.classList.remove('hidden');
    
    if (step === 2) {
        document.querySelector('#psBankForm .ps-otp-input')?.focus();
    }
}

// ============================================
// PROCESS PAYMENT SUCCESS
// ============================================
function processPaymentSuccess() {
    // Hide form, show processing
    document.querySelectorAll('.ps-form').forEach(f => f.classList.add('hidden'));
    const processing = document.getElementById('psProcessing');
    processing?.classList.remove('hidden');
    
    // Simulate processing
    setTimeout(() => {
        processing?.classList.add('hidden');
        
        const success = document.getElementById('psSuccess');
        document.getElementById('successRef').textContent = paymentState.reference;
        success?.classList.remove('hidden');
    }, 2000);
}

// ============================================
// COMPLETE PAYMENT
// ============================================
function completePayment() {
    const response = {
        reference: paymentState.reference,
        status: 'success',
        transaction: 'TXN_' + Date.now()
    };
    
    closePaymentModal();
    
    // Call success handler
    if (typeof window.onPaystackSuccess === 'function') {
        window.onPaystackSuccess(response, paymentState.formData);
    } else {
        showToast('success', 'Payment Successful', `Reference: ${response.reference}`);
    }
}

// ============================================
// CLOSE PAYMENT MODAL
// ============================================
function closePaymentModal() {
    const modal = document.getElementById('paystackDemoModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// ============================================
// REAL PAYSTACK PAYMENT (PRODUCTION)
// ============================================
function processRealPaystackPayment(formData) {
    if (typeof PaystackPop === 'undefined') {
        showToast('error', 'Error', 'Payment system unavailable');
        return;
    }
    
    const handler = PaystackPop.setup({
        key: PAYSTACK_CONFIG.publicKey,
        email: formData.email,
        amount: Math.round(formData.total * 100),
        currency: PAYSTACK_CONFIG.currency,
        ref: generateReference(),
        channels: PAYSTACK_CONFIG.channels,
        metadata: {
            order_id: formData.orderId,
            customer_name: formData.fullName
        },
        onSuccess: (response) => {
            if (typeof window.onPaystackSuccess === 'function') {
                window.onPaystackSuccess(response, formData);
            }
        },
        onClose: () => {
            showToast('warning', 'Cancelled', 'Payment was cancelled');
        }
    });
    
    handler.openIframe();
}

// ============================================
// ADD PAYSTACK STYLES
// ============================================
function addPaystackStyles() {
    if (document.getElementById('paystackStyles')) return;
    
    const style = document.createElement('style');
    style.id = 'paystackStyles';
    style.textContent = `
        /* Modal Base */
        .paystack-modal {
            position: fixed;
            inset: 0;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        .paystack-modal.active {
            opacity: 1;
            visibility: visible;
        }
        .ps-modal-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
        }
        .ps-modal-container {
            position: relative;
            background: #fff;
            border-radius: 12px;
            width: 100%;
            max-width: 420px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            transform: scale(0.95);
            transition: transform 0.3s ease;
        }
        .paystack-modal.active .ps-modal-container {
            transform: scale(1);
        }
        
        /* Header */
        .ps-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            border-bottom: 1px solid #eee;
        }
        .ps-header-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .ps-logo {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #00C3F7, #0099cc);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .ps-merchant {
            display: block;
            font-weight: 600;
            color: #333;
        }
        .ps-email {
            display: block;
            font-size: 12px;
            color: #666;
        }
        .ps-close-btn {
            width: 36px;
            height: 36px;
            border: none;
            background: #f5f5f5;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
            transition: all 0.2s;
        }
        .ps-close-btn:hover {
            background: #eee;
            color: #333;
        }
        
        /* Amount Section */
        .ps-amount-section {
            text-align: center;
            padding: 20px;
            background: #f9f9f9;
        }
        .ps-amount-label {
            display: block;
            font-size: 14px;
            color: #666;
            margin-bottom: 5px;
        }
        .ps-amount {
            display: flex;
            align-items: baseline;
            justify-content: center;
            gap: 5px;
        }
        .ps-currency {
            font-size: 18px;
            color: #666;
        }
        .ps-value {
            font-size: 36px;
            font-weight: 700;
            color: #333;
        }
        
        /* Demo Notice */
        .ps-demo-notice {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 10px;
            background: #fff3cd;
            color: #856404;
            font-size: 12px;
        }
        
        /* Payment Methods */
        .ps-methods {
            display: flex;
            padding: 15px 20px;
            gap: 10px;
            border-bottom: 1px solid #eee;
        }
        .ps-method-btn {
            flex: 1;
            padding: 12px 8px;
            border: 2px solid #eee;
            background: #fff;
            border-radius: 10px;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
            transition: all 0.2s;
        }
        .ps-method-btn i {
            font-size: 20px;
            color: #666;
        }
        .ps-method-btn span {
            font-size: 11px;
            color: #666;
        }
        .ps-method-btn:hover {
            border-color: #00C3F7;
        }
        .ps-method-btn.active {
            border-color: #00C3F7;
            background: #f0faff;
        }
        .ps-method-btn.active i,
        .ps-method-btn.active span {
            color: #00C3F7;
        }
        
        /* Form Container */
        .ps-form-container {
            padding: 20px;
        }
        .ps-form-step {
            animation: fadeIn 0.3s ease;
        }
        .ps-form-step.hidden {
            display: none;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .ps-step-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #333;
        }
        .ps-step-desc {
            font-size: 13px;
            color: #666;
            margin-bottom: 20px;
        }
        
        /* Input Groups */
        .ps-input-group {
            margin-bottom: 15px;
        }
        .ps-input-group label {
            display: block;
            font-size: 13px;
            font-weight: 500;
            color: #333;
            margin-bottom: 6px;
        }
        .ps-input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
        }
        .ps-input-wrapper > i {
            position: absolute;
            left: 12px;
            color: #999;
            font-size: 14px;
        }
        .ps-input-wrapper input,
        .ps-select-wrapper select {
            width: 100%;
            padding: 12px 12px 12px 38px;
            border: 1.5px solid #ddd;
            border-radius: 8px;
            font-size: 15px;
            transition: all 0.2s;
        }
        .ps-input-wrapper input:focus,
        .ps-select-wrapper select:focus {
            border-color: #00C3F7;
            outline: none;
            box-shadow: 0 0 0 3px rgba(0,195,247,0.1);
        }
        .ps-input-row {
            display: flex;
            gap: 15px;
        }
        .ps-input-row .ps-input-group {
            flex: 1;
        }
        .ps-prefix {
            position: absolute;
            left: 12px;
            color: #666;
            font-size: 14px;
            font-weight: 500;
        }
        .ps-input-wrapper .ps-prefix + input {
            padding-left: 55px;
        }
        .ps-card-type {
            position: absolute;
            right: 12px;
            font-size: 24px;
        }
        .ps-hint {
            display: block;
            font-size: 11px;
            color: #888;
            margin-top: 4px;
        }
        .ps-error {
            display: block;
            font-size: 12px;
            color: #dc3545;
            margin-top: 4px;
            min-height: 16px;
        }
        .ps-error.ps-center {
            text-align: center;
        }
        
        /* Select Wrapper */
        .ps-select-wrapper {
            position: relative;
        }
        .ps-select-wrapper > i {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #999;
            z-index: 1;
        }
        .ps-select-wrapper select {
            appearance: none;
            cursor: pointer;
            background: #fff;
        }
        .ps-select-arrow {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #999;
            pointer-events: none;
        }
        
        /* Network Options */
        .ps-network-options {
            display: flex;
            gap: 10px;
        }
        .ps-network-option {
            flex: 1;
            padding: 12px 8px;
            border: 2px solid #eee;
            border-radius: 10px;
            cursor: pointer;
            text-align: center;
            transition: all 0.2s;
        }
        .ps-network-option:hover {
            border-color: #ccc;
        }
        .ps-network-option.selected {
            border-color: #00C3F7;
            background: #f0faff;
        }
        .ps-network-option input {
            display: none;
        }
        .ps-network-icon {
            width: 40px;
            height: 40px;
            margin: 0 auto 8px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
        }
        .ps-network-icon.mtn { background: #ffcc00; color: #000; }
        .ps-network-icon.vodafone { background: #e60000; color: #fff; }
        .ps-network-icon.airteltigo { background: #0066cc; color: #fff; }
        .ps-network-option span {
            font-size: 11px;
            color: #666;
        }
        
        /* MoMo Info */
        .ps-momo-info {
            display: flex;
            gap: 10px;
            padding: 12px;
            background: #e8f5e9;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .ps-momo-info i {
            color: #2e7d32;
            margin-top: 2px;
        }
        .ps-momo-info p {
            font-size: 13px;
            color: #2e7d32;
            margin: 0;
        }
        
        /* MoMo Prompt */
        .ps-momo-prompt {
            text-align: center;
            padding: 20px;
            background: #f9f9f9;
            border-radius: 12px;
            margin-bottom: 20px;
        }
        .ps-phone-animation {
            position: relative;
            width: 60px;
            height: 60px;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .ps-phone-animation i {
            font-size: 30px;
            color: #00C3F7;
            z-index: 1;
        }
        .ps-pulse {
            position: absolute;
            inset: 0;
            border: 2px solid #00C3F7;
            border-radius: 50%;
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.5); opacity: 0; }
        }
        .ps-momo-prompt p {
            font-size: 14px;
            color: #666;
            margin: 0 0 5px;
        }
        .ps-momo-prompt strong {
            font-size: 16px;
            color: #333;
        }
        
        /* MoMo Steps */
        .ps-momo-steps {
            margin-bottom: 20px;
        }
        .ps-momo-step {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        .ps-momo-step:last-child {
            border-bottom: none;
        }
        .step-num {
            width: 24px;
            height: 24px;
            background: #00C3F7;
            color: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 600;
        }
        .ps-momo-step span {
            font-size: 13px;
            color: #666;
        }
        
        /* OR Divider */
        .ps-or-divider {
            text-align: center;
            margin: 20px 0;
            position: relative;
        }
        .ps-or-divider::before {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            top: 50%;
            height: 1px;
            background: #ddd;
        }
        .ps-or-divider span {
            position: relative;
            background: #fff;
            padding: 0 15px;
            color: #888;
            font-size: 12px;
        }
        
        /* PIN & OTP Containers */
        .ps-pin-container,
        .ps-otp-container {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin: 20px 0;
        }
        .ps-otp-container.small {
            gap: 8px;
            margin: 15px 0;
        }
        .ps-pin-input,
        .ps-otp-input {
            width: 45px;
            height: 50px;
            border: 2px solid #ddd;
            border-radius: 10px;
            text-align: center;
            font-size: 20px;
            font-weight: 600;
            transition: all 0.2s;
        }
        .ps-otp-container.small .ps-otp-input {
            width: 38px;
            height: 42px;
            font-size: 16px;
        }
        .ps-pin-input:focus,
        .ps-otp-input:focus {
            border-color: #00C3F7;
            outline: none;
            box-shadow: 0 0 0 3px rgba(0,195,247,0.1);
        }
        
        /* Bank Simulation */
        .ps-bank-redirect {
            text-align: center;
            padding: 20px;
            margin-bottom: 20px;
        }
        .ps-bank-logo {
            width: 60px;
            height: 60px;
            background: #f5f5f5;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15px;
        }
        .ps-bank-logo i {
            font-size: 24px;
            color: #666;
        }
        .ps-bank-redirect p {
            font-size: 14px;
            color: #666;
            margin: 0;
        }
        .ps-bank-simulation {
            border: 1px solid #ddd;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 20px;
        }
        .ps-bank-header {
            background: #1a1a2e;
            color: #fff;
            padding: 12px 15px;
            font-size: 14px;
            font-weight: 500;
        }
        .ps-bank-body {
            padding: 20px;
        }
        .ps-bank-body > p {
            text-align: center;
            margin-bottom: 20px;
            color: #333;
        }
        
        /* Buttons */
        .ps-pay-btn {
            width: 100%;
            padding: 14px 20px;
            background: linear-gradient(135deg, #00C3F7 0%, #0099cc 100%);
            color: #fff;
            border: none;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: all 0.2s;
        }
        .ps-pay-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,195,247,0.4);
        }
        .ps-pay-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        .ps-back-btn {
            width: 100%;
            padding: 12px;
            background: none;
            border: none;
            color: #666;
            font-size: 14px;
            cursor: pointer;
            margin-top: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .ps-back-btn:hover {
            color: #333;
        }
        
        /* Resend */
        .ps-resend {
            text-align: center;
            font-size: 13px;
            color: #666;
            margin-top: 15px;
        }
        .ps-resend button {
            background: none;
            border: none;
            color: #00C3F7;
            cursor: pointer;
            font-weight: 500;
        }
        .ps-resend button:hover {
            text-decoration: underline;
        }
        
        /* Processing */
        .ps-processing {
            text-align: center;
            padding: 40px 20px;
        }
        .ps-processing.hidden {
            display: none;
        }
        .ps-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid #eee;
            border-top-color: #00C3F7;
            border-radius: 50%;
            margin: 0 auto 20px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .ps-processing p {
            color: #666;
            font-size: 14px;
        }
        
        /* Success */
        .ps-success {
            text-align: center;
            padding: 40px 20px;
        }
        .ps-success.hidden {
            display: none;
        }
        .ps-success-icon {
            width: 70px;
            height: 70px;
            background: #28a745;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            animation: scaleIn 0.3s ease;
        }
        @keyframes scaleIn {
            from { transform: scale(0); }
            to { transform: scale(1); }
        }
        .ps-success-icon i {
            font-size: 30px;
            color: #fff;
        }
        .ps-success h4 {
            color: #28a745;
            margin-bottom: 10px;
        }
        .ps-success p {
            color: #666;
            font-size: 14px;
            margin-bottom: 20px;
        }
        .ps-done-btn {
            padding: 12px 40px;
            background: #28a745;
            color: #fff;
            border: none;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        .ps-done-btn:hover {
            background: #218838;
        }
        
        /* Error State */
        .ps-error-state {
            text-align: center;
            padding: 40px 20px;
        }
        .ps-error-state.hidden {
            display: none;
        }
        .ps-error-icon {
            width: 70px;
            height: 70px;
            background: #dc3545;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
        }
        .ps-error-icon i {
            font-size: 30px;
            color: #fff;
        }
        .ps-error-state h4 {
            color: #dc3545;
            margin-bottom: 10px;
        }
        .ps-error-state p {
            color: #666;
            font-size: 14px;
            margin-bottom: 20px;
        }
        .ps-retry-btn {
            padding: 12px 40px;
            background: #dc3545;
            color: #fff;
            border: none;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        .ps-retry-btn:hover {
            background: #c82333;
        }
        
        /* Footer */
        .ps-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            border-top: 1px solid #eee;
            background: #f9f9f9;
        }
        .ps-secured {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            color: #666;
        }
        .ps-secured i {
            color: #28a745;
        }
        .ps-test-btn {
            background: none;
            border: none;
            color: #00C3F7;
            font-size: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .ps-test-btn:hover {
            text-decoration: underline;
        }
        
        /* Test Modal */
        .ps-test-modal {
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s;
            z-index: 10;
        }
        .ps-test-modal.active {
            opacity: 1;
            visibility: visible;
        }
        .ps-test-content {
            background: #fff;
            border-radius: 12px;
            padding: 20px;
            max-width: 300px;
            width: 90%;
        }
        .ps-test-content h4 {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 15px;
            color: #333;
        }
        .ps-test-section {
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eee;
        }
        .ps-test-section:last-of-type {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }
        .ps-test-section h5 {
            font-size: 14px;
            margin-bottom: 8px;
            color: #333;
        }
        .ps-test-section p {
            font-size: 13px;
            color: #666;
            margin: 4px 0;
        }
        .ps-test-section code {
            background: #f5f5f5;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
            color: #d63384;
        }
        .ps-test-close {
            width: 100%;
            padding: 10px;
            background: #00C3F7;
            color: #fff;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 15px;
            font-weight: 500;
        }
        
        /* Responsive */
        @media (max-width: 480px) {
            .ps-modal-container {
                max-height: 95vh;
            }
            .ps-network-options {
                flex-direction: column;
            }
            .ps-network-option {
                flex-direction: row;
                justify-content: flex-start;
                gap: 12px;
            }
            .ps-network-icon {
                margin: 0;
            }
            .ps-pin-input,
            .ps-otp-input {
                width: 40px;
                height: 45px;
                font-size: 18px;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// ============================================
// TOAST HELPER
// ============================================
function showToast(type, title, message) {
    if (typeof window.showToast === 'function') {
        window.showToast(type, title, message);
    } else {
        console.log(`[${type}] ${title}: ${message}`);
    }
}

// ============================================
// EXPORTS
// ============================================
window.initPaystackPayment = initPaystackPayment;
window.PAYSTACK_CONFIG = PAYSTACK_CONFIG;

console.log('💳 Paystack Interactive Demo loaded');
console.log('🧪 Demo Mode:', PAYSTACK_CONFIG.demoMode);