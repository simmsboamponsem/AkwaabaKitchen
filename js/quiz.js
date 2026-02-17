/**
 * ============================================
 * AKWAABA KITCHEN - FOOD PERSONALITY QUIZ
 * "Which Ghanaian Dish Are You?"
 * ============================================
 */

'use strict';

// ============================================
// QUIZ DATA
// ============================================
const QUIZ_QUESTIONS = [
    {
        id: 1,
        question: "It's Friday night! What are you most likely doing?",
        options: [
            { text: "Throwing or attending a party 🎉", value: "jollof" },
            { text: "Chilling by the beach or riverside 🌊", value: "banku" },
            { text: "Having a cozy dinner with family 👨‍👩‍👧‍👦", value: "fufu" },
            { text: "Grabbing street food with friends 🌃", value: "waakye" }
        ]
    },
    {
        id: 2,
        question: "How would your friends describe you?",
        options: [
            { text: "Life of the party, always fun! 🌟", value: "jollof" },
            { text: "Calm, cool, and collected 😎", value: "banku" },
            { text: "Warm, comforting, and reliable 🤗", value: "fufu" },
            { text: "Versatile and full of surprises 🎭", value: "waakye" }
        ]
    },
    {
        id: 3,
        question: "Pick your ideal vacation destination:",
        options: [
            { text: "Ibiza or Miami - where the party's at! 🏝️", value: "jollof" },
            { text: "Cape Coast beaches - peaceful vibes 🐚", value: "banku" },
            { text: "Ashanti Region - cultural heritage 🏛️", value: "fufu" },
            { text: "Accra city tour - a bit of everything 🏙️", value: "waakye" }
        ]
    },
    {
        id: 4,
        question: "What's your morning routine like?",
        options: [
            { text: "Wake up energized, ready to conquer! ⚡", value: "jollof" },
            { text: "Slow and steady, no rush 🌅", value: "banku" },
            { text: "Quality time with family first 💕", value: "fufu" },
            { text: "It changes every day! 🔄", value: "waakye" }
        ]
    },
    {
        id: 5,
        question: "Choose your favorite music genre:",
        options: [
            { text: "Afrobeats - dance all night! 💃", value: "jollof" },
            { text: "Highlife - smooth classics 🎷", value: "banku" },
            { text: "Gospel - soulful and uplifting 🙏", value: "fufu" },
            { text: "I listen to everything! 🎵", value: "waakye" }
        ]
    },
    {
        id: 6,
        question: "What's most important to you?",
        options: [
            { text: "Being the best and standing out 🏆", value: "jollof" },
            { text: "Peace of mind and simplicity 🧘", value: "banku" },
            { text: "Family, traditions, and roots 🌳", value: "fufu" },
            { text: "Balance and variety in life ⚖️", value: "waakye" }
        ]
    }
];

const DISH_RESULTS = {
    jollof: {
        name: "Jollof Rice",
        emoji: "🍚",
        tagline: "The Life of the Party!",
        description: "Just like Ghana's famous Jollof Rice, you're the center of attention wherever you go! You're vibrant, flavorful, and everyone wants a piece of you. You bring energy and excitement to every gathering, and let's be honest - you know you're the best!",
        traits: ["Confident", "Energetic", "Popular", "Bold"],
        color: "#CE1126"
    },
    banku: {
        name: "Banku & Tilapia",
        emoji: "🐟",
        tagline: "Cool, Calm & Collected!",
        description: "You're like Banku & Tilapia - a perfect balance of smooth and savory! You have a calm demeanor but pack a punch when needed. People love your laid-back vibe, and you go well with everyone. Beach days are definitely your thing!",
        traits: ["Relaxed", "Balanced", "Adaptable", "Peaceful"],
        color: "#006B3F"
    },
    fufu: {
        name: "Fufu & Light Soup",
        emoji: "🍲",
        tagline: "The Heart of the Home!",
        description: "You embody the warmth and tradition of Fufu & Light Soup! You're comforting, nurturing, and deeply connected to your roots. Family means everything to you, and you have the ability to bring people together. You're soul food personified!",
        traits: ["Nurturing", "Traditional", "Comforting", "Family-oriented"],
        color: "#8B4513"
    },
    waakye: {
        name: "Waakye",
        emoji: "🍛",
        tagline: "The Complete Package!",
        description: "You're Waakye - the dish that has EVERYTHING! You're versatile, interesting, and full of layers. People never get bored with you because there's always something new to discover. Morning, noon, or night - you're always a good idea!",
        traits: ["Versatile", "Complex", "Interesting", "Unpredictable"],
        color: "#4A0E0E"
    }
};

// ============================================
// QUIZ STATE
// ============================================
let currentQuestion = 0;
let answers = [];

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initQuiz();
    initMobileMenu();
    setCurrentYear();
    updateCartCount();
});

// ============================================
// INITIALIZE QUIZ
// ============================================
function initQuiz() {
    const startBtn = document.getElementById('startQuizBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const retakeBtn = document.getElementById('retakeQuizBtn');
    const shareBtn = document.getElementById('shareResultBtn');
    
    if (startBtn) startBtn.addEventListener('click', startQuiz);
    if (prevBtn) prevBtn.addEventListener('click', goToPreviousQuestion);
    if (nextBtn) nextBtn.addEventListener('click', goToNextQuestion);
    if (retakeBtn) retakeBtn.addEventListener('click', restartQuiz);
    if (shareBtn) shareBtn.addEventListener('click', shareResult);
    
    document.getElementById('totalQuestions').textContent = QUIZ_QUESTIONS.length;
}

// ============================================
// START QUIZ
// ============================================
function startQuiz() {
    currentQuestion = 0;
    answers = [];
    
    document.getElementById('quizStart').style.display = 'none';
    document.getElementById('quizQuestions').style.display = 'block';
    document.getElementById('quizResult').style.display = 'none';
    
    showQuestion(0);
}

// ============================================
// SHOW QUESTION
// ============================================
function showQuestion(index) {
    const question = QUIZ_QUESTIONS[index];
    const container = document.getElementById('questionContainer');
    
    container.innerHTML = `
        <div class="question" data-question="${index}">
            <h3 class="question-text">${question.question}</h3>
            <div class="options">
                ${question.options.map((option, i) => `
                    <label class="option ${answers[index] === option.value ? 'selected' : ''}">
                        <input type="radio" name="q${index}" value="${option.value}" 
                            ${answers[index] === option.value ? 'checked' : ''}>
                        <span class="option-text">${option.text}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    `;
    
    // Add event listeners to options
    container.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function() {
            container.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            this.querySelector('input').checked = true;
            
            answers[index] = this.querySelector('input').value;
            document.getElementById('nextBtn').disabled = false;
        });
    });
    
    // Update UI
    document.getElementById('currentQuestion').textContent = index + 1;
    updateProgressBar(index);
    
    document.getElementById('prevBtn').disabled = index === 0;
    document.getElementById('nextBtn').disabled = !answers[index];
    
    // Change next button text on last question
    const nextBtn = document.getElementById('nextBtn');
    if (index === QUIZ_QUESTIONS.length - 1) {
        nextBtn.innerHTML = 'See Results <i class="fas fa-check"></i>';
    } else {
        nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
    }
}

// ============================================
// NAVIGATION
// ============================================
function goToNextQuestion() {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
        currentQuestion++;
        showQuestion(currentQuestion);
    } else {
        showResults();
    }
}

function goToPreviousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion(currentQuestion);
    }
}

// ============================================
// UPDATE PROGRESS BAR
// ============================================
function updateProgressBar(index) {
    const progress = ((index + 1) / QUIZ_QUESTIONS.length) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
}

// ============================================
// CALCULATE RESULT
// ============================================
function calculateResult() {
    const counts = {};
    
    answers.forEach(answer => {
        counts[answer] = (counts[answer] || 0) + 1;
    });
    
    let maxCount = 0;
    let result = 'jollof';
    
    for (const [dish, count] of Object.entries(counts)) {
        if (count > maxCount) {
            maxCount = count;
            result = dish;
        }
    }
    
    return result;
}

// ============================================
// SHOW RESULTS
// ============================================
function showResults() {
    const resultDish = calculateResult();
    const dish = DISH_RESULTS[resultDish];
    
    document.getElementById('quizQuestions').style.display = 'none';
    document.getElementById('quizResult').style.display = 'block';
    
    document.getElementById('dishEmoji').textContent = dish.emoji;
    document.getElementById('dishName').textContent = dish.name;
    document.getElementById('dishTagline').textContent = dish.tagline;
    document.getElementById('resultDescription').textContent = dish.description;
    document.getElementById('orderDishName').textContent = dish.name;
    
    // Set order link
    document.getElementById('orderDishBtn').href = `order.html?item=${resultDish}`;
    
    // Render traits
    document.getElementById('resultTraits').innerHTML = dish.traits.map(trait => 
        `<span class="trait-badge" style="background: ${dish.color}20; color: ${dish.color}; border: 1px solid ${dish.color}">${trait}</span>`
    ).join('');
    
    // Add confetti
    createConfetti();
}

// ============================================
// CONFETTI ANIMATION
// ============================================
function createConfetti() {
    const confettiContainer = document.getElementById('confetti');
    confettiContainer.innerHTML = '';
    
    const colors = ['#CE1126', '#FCD116', '#006B3F', '#ffffff'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            opacity: ${Math.random() * 0.7 + 0.3};
            transform: rotate(${Math.random() * 360}deg);
            animation: confetti-fall ${Math.random() * 2 + 2}s linear forwards;
            animation-delay: ${Math.random() * 0.5}s;
        `;
        confettiContainer.appendChild(confetti);
    }
    
    // Add confetti animation if not exists
    if (!document.getElementById('confettiStyles')) {
        const style = document.createElement('style');
        style.id = 'confettiStyles';
        style.textContent = `
            @keyframes confetti-fall {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(400px) rotate(720deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// ============================================
// RESTART QUIZ
// ============================================
function restartQuiz() {
    currentQuestion = 0;
    answers = [];
    
    document.getElementById('quizResult').style.display = 'none';
    document.getElementById('quizStart').style.display = 'block';
}

// ============================================
// SHARE RESULT
// ============================================
function shareResult() {
    const resultDish = calculateResult();
    const dish = DISH_RESULTS[resultDish];
    
    const shareText = `I took the Akwaaba Kitchen Food Quiz and I'm ${dish.name}! 🍽️ ${dish.tagline} Take the quiz and find out which Ghanaian dish you are!`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Ghanaian Dish Result',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(shareText + ' ' + window.location.href);
        showToast('success', 'Copied!', 'Result copied to clipboard. Share it with your friends!');
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

function setCurrentYear() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function updateCartCount() {
    const savedCart = localStorage.getItem('akwaabaCart');
    if (savedCart) {
        try {
            const cart = JSON.parse(savedCart);
            const count = cart.reduce((sum, item) => sum + item.quantity, 0);
            document.querySelectorAll('#cartCount, #cartFloatCount').forEach(el => {
                el.textContent = count;
                el.style.display = count > 0 ? 'flex' : 'none';
            });
        } catch (e) {}
    }
}

function showToast(type, title, message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon"><i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i></div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => toast.remove(), 3000);
}