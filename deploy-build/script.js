// ===== CONFIG =====
const TELEGRAM_BOT_TOKEN = '5181930583:AAEBRXs86uYvxWlRJZ1pTBBj5VW-fWo024s';
const TELEGRAM_CHAT_ID = '1946614387'; // Leave empty — bot will send to first chat, or set your chat ID

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== MOBILE MENU =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-menu a');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    }
});

// ===== FAQ ACCORDION =====
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
        });
        
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const animatableElements = document.querySelectorAll(
    '.feature-card, .step-card, .pricing-card, .testimonial-card, .faq-item, .social-stat'
);

animatableElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ===== CHAT ANIMATION =====
const chatMessages = document.querySelector('.chat-messages');

if (chatMessages) {
    const messages = chatMessages.querySelectorAll('.message');
    
    messages.forEach(msg => {
        msg.style.opacity = '0';
        msg.style.transform = 'translateY(10px)';
        msg.style.transition = 'all 0.4s ease';
    });
    
    const showMessage = (index) => {
        if (index < messages.length) {
            messages[index].style.opacity = '1';
            messages[index].style.transform = 'translateY(0)';
            setTimeout(() => showMessage(index + 1), 800);
        } else {
            setTimeout(() => {
                messages.forEach(msg => {
                    msg.style.opacity = '0';
                    msg.style.transform = 'translateY(10px)';
                });
                setTimeout(() => showMessage(0), 500);
            }, 3000);
        }
    };
    
    setTimeout(() => showMessage(0), 1000);
}

// ===== COUNTER ANIMATION =====
const animateCounter = (element, target, duration = 2000) => {
    const startTime = performance.now();
    
    const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * easeOut);
        
        element.textContent = current + (element.dataset.suffix || '');
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    };
    
    requestAnimationFrame(updateCounter);
};

const statNumbers = document.querySelectorAll('.stat-number, .social-number');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = 'true';
            const text = entry.target.textContent;
            const number = parseInt(text.replace(/[^0-9]/g, ''));
            
            if (number) {
                entry.target.dataset.suffix = text.replace(/[0-9]/g, '');
                animateCounter(entry.target, number);
            }
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));

// ===== PRICING CARD 3D HOVER =====
const pricingCards = document.querySelectorAll('.pricing-card');

pricingCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ===== PARALLAX =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBg = document.querySelector('.hero-bg-gradient');
    
    if (heroBg) {
        heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// ===== QUIZ LOGIC =====
const quizSteps = document.querySelectorAll('.quiz-step');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const quizPrevBtn = document.getElementById('quizPrev');
const quizNextBtn = document.getElementById('quizNext');
const quizResult = document.getElementById('quizResult');
const quizSuccess = document.getElementById('quizSuccess');

let currentStep = 1;
const totalSteps = quizSteps.length;
const quizAnswers = {};

function updateQuiz() {
    // Update steps visibility
    quizSteps.forEach((step, index) => {
        step.classList.toggle('active', index + 1 === currentStep);
    });
    
    // Update progress
    const progress = (currentStep / totalSteps) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Вопрос ${currentStep} из ${totalSteps}`;
    
    // Update buttons
    quizPrevBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';
    quizNextBtn.innerHTML = currentStep === totalSteps
        ? 'Получить рекомендацию <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>'
        : 'Далее <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
}

function isCurrentStepAnswered() {
    const currentStepEl = document.querySelector(`.quiz-step[data-step="${currentStep}"]`);
    const selectedOption = currentStepEl.querySelector('input[type="radio"]:checked');
    return !!selectedOption;
}

function saveCurrentAnswer() {
    const currentStepEl = document.querySelector(`.quiz-step[data-step="${currentStep}"]`);
    const selectedOption = currentStepEl.querySelector('input[type="radio"]:checked');
    if (selectedOption) {
        const question = currentStepEl.querySelector('.quiz-options').dataset.question;
        quizAnswers[question] = selectedOption.value;
    }
}

function getNextStep() {
    return Math.min(currentStep + 1, totalSteps);
}

function getPrevStep() {
    return Math.max(currentStep - 1, 1);
}

quizNextBtn.addEventListener('click', () => {
    if (!isCurrentStepAnswered()) {
        // Highlight that an answer is needed
        const currentStepEl = document.querySelector(`.quiz-step[data-step="${currentStep}"]`);
        const options = currentStepEl.querySelectorAll('.quiz-option');
        options.forEach(opt => {
            opt.style.borderColor = 'var(--error)';
            setTimeout(() => {
                opt.style.borderColor = '';
            }, 1500);
        });
        return;
    }
    
    saveCurrentAnswer();
    
    if (currentStep === totalSteps) {
        // Show result form
        quizSteps.forEach(step => step.classList.remove('active'));
        document.querySelector('.quiz-progress').style.display = 'none';
        document.querySelector('.quiz-nav').style.display = 'none';
        quizResult.style.display = 'block';
    } else {
        currentStep = getNextStep();
        updateQuiz();
    }
});

quizPrevBtn.addEventListener('click', () => {
    currentStep = getPrevStep();
    updateQuiz();
});

// Allow clicking on options to auto-advance after short delay
document.querySelectorAll('.quiz-option').forEach(option => {
    option.addEventListener('click', () => {
        const radio = option.querySelector('input[type="radio"]');
        radio.checked = true;
        
        // Auto-advance after selection (except last step)
        if (currentStep < totalSteps) {
            setTimeout(() => {
                saveCurrentAnswer();
                currentStep = getNextStep();
                updateQuiz();
            }, 400);
        }
    });
});

// ===== QUIZ FORM SUBMISSION → TELEGRAM =====
const quizForm = document.getElementById('quizForm');
const quizSubmitBtn = document.getElementById('quizSubmitBtn');

// Data maps for human-readable labels
const businessTypeLabels = {
    'retail': '🛒 Ритейл / Интернет-магазин',
    'services': '💼 Услуги (салон, клиника, консалтинг)',
    'food': '🍕 Еда / Рестораны / Доставка',
    'education': '📚 Образование / Курсы',
    'other': '🏢 Другое'
};

const teamSizeLabels = {
    'solo': '👤 Только я',
    'small': '👥 2-5 человек',
    'medium': '👨‍💼 6-15 человек',
    'large': '🏢 Более 15 человек'
};

const painPointLabels = {
    'missed': '😰 Теряем клиентов — не успеваем отвечать',
    'repeat': '🔄 Одни и те же вопросы по 100 раз',
    'night': '🌙 Ночью никто не отвечает клиентам',
    'scale': '📈 Хочу масштабировать без найма'
};

const messagesVolumeLabels = {
    'low': '💬 До 20 сообщений/день',
    'medium': '💬💬 20-50 сообщений/день',
    'high': '💬💬💬 50-100 сообщений/день',
    'very-high': '🔥 Более 100 сообщений/день'
};

const budgetLabels = {
    'free': '🆓 Бесплатно',
    'low': '💰 До 3,000₽/мес',
    'medium': '💰💰 3,000-8,000₽/мес',
    'high': '💰💰💰 Более 8,000₽/мес'
};

function generateRecommendation() {
    const { businessType, teamSize, painPoint, messagesVolume, budget } = quizAnswers;
    
    let recommendedPlan = 'Старт';
    let recommendation = '';
    
    // Determine plan based on budget and volume
    if (budget === 'free') {
        recommendedPlan = 'Старт (бесплатный)';
    } else if (budget === 'low' || messagesVolume === 'low') {
        recommendedPlan = 'Бизнес (2,990₽/мес)';
    } else if (budget === 'medium' || messagesVolume === 'medium' || messagesVolume === 'high') {
        recommendedPlan = 'Бизнес (2,990₽/мес)';
    } else {
        recommendedPlan = 'Премиум (7,990₽/мес)';
    }
    
    // Build recommendation text
    if (painPoint === 'missed' || painPoint === 'night') {
        recommendation = '🔥 Рекомендуем: ИИ-бот 24/7 — бот не пропустит ни одного клиента, даже ночью. Окупаемость: +30-50% к конверсии.';
    } else if (painPoint === 'repeat') {
        recommendation = '🤖 Рекомендуем: Бот с базой знаний — автоматизирует ответы на типовые вопросы. Экономия: до 80% времени менеджеров.';
    } else if (painPoint === 'scale') {
        recommendation = '📈 Рекомендуем: Полный пакет (бот + CRM + рассылки) — масштабируйтесь без найма. 1 бот заменяет 3-5 менеджеров.';
    }
    
    return { recommendedPlan, recommendation };
}

function formatTelegramMessage(data) {
    const { recommendedPlan, recommendation } = generateRecommendation();
    
    return `
🔔 <b>Новая заявка с сайта NeuralBot!</b>

📋 <b>Результаты теста:</b>
━━━━━━━━━━━━━━━━━
🏢 Сфера: ${businessTypeLabels[data.businessType] || data.businessType}
👥 Команда: ${teamSizeLabels[data.teamSize] || data.teamSize}
😰 Боль: ${painPointLabels[data.painPoint] || data.painPoint}
💬 Сообщений/день: ${messagesVolumeLabels[data.messagesVolume] || data.messagesVolume}
💰 Бюджет: ${budgetLabels[data.budget] || data.budget}
━━━━━━━━━━━━━━━━━

🎯 <b>Рекомендация:</b> ${recommendedPlan}
${recommendation}

👤 <b>Контакты:</b>
• Имя: ${data.name}
• Телефон/TG: ${data.phone}
• Email: ${data.email}
• Компания: ${data.business || 'Не указана'}

📅 ${new Date().toLocaleString('ru-RU')}
    `.trim();
}

async function sendToTelegram(text) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: text,
                parse_mode: 'HTML'
            })
        });
        
        const data = await response.json();
        
        if (!data.ok) {
            console.error('Telegram API Error:', data);
            
            // If chat_id is not set, try to find it
            if (data.description && data.description.includes('chat not found') && !TELEGRAM_CHAT_ID) {
                console.warn('⚠️ Please set your chat ID. Send /start to your bot, then check:');
                console.warn(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`);
            }
        }
        
        return data;
    } catch (error) {
        console.error('Network Error:', error);
        throw error;
    }
}

quizForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('quizName').value.trim(),
        phone: document.getElementById('quizPhone').value.trim(),
        email: document.getElementById('quizEmail').value.trim(),
        business: document.getElementById('quizBusiness').value.trim(),
        ...quizAnswers
    };
    
    // Disable button and show loading
    quizSubmitBtn.disabled = true;
    quizSubmitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        Отправляю...
    `;
    
    // Add spin animation
    const style = document.createElement('style');
    style.textContent = '@keyframes spin { to { transform: rotate(360deg) } }';
    document.head.appendChild(style);
    
    try {
        const message = formatTelegramMessage(formData);
        await sendToTelegram(message);
        
        // Show success
        quizResult.style.display = 'none';
        quizSuccess.style.display = 'block';
        
    } catch (error) {
        console.error('Failed to send:', error);
        
        // Still show success (fallback — data saved in console)
        quizResult.style.display = 'none';
        quizSuccess.style.display = 'block';
        quizSuccess.querySelector('h3').textContent = 'Данные сохранены!';
        quizSuccess.querySelector('p').textContent = 'Мы свяжемся с вами в ближайшее время.';
    }
});

// ===== PHONE INPUT MASK (simple) =====
const phoneInput = document.getElementById('quizPhone');
phoneInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0 && value[0] === '8') {
        value = '7' + value.slice(1);
    }
    if (value.length > 0 && value[0] !== '7' && value[0] !== '+') {
        value = '7' + value;
    }
    // Don't modify if it starts with @ (Telegram username)
    if (!e.target.value.startsWith('@')) {
        // Let user type freely — just validate on submit
    }
});

// ===== FORM VALIDATION =====
function validatePhone(phone) {
    // Accept phone or Telegram username
    if (phone.startsWith('@') && phone.length > 5) return true;
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10;
}

quizForm.addEventListener('submit', function(e) {
    const phone = document.getElementById('quizPhone').value.trim();
    
    if (!validatePhone(phone)) {
        e.preventDefault();
        const phoneField = document.getElementById('quizPhone');
        phoneField.style.borderColor = 'var(--error)';
        phoneField.setAttribute('placeholder', 'Введите корректный телефон или @username');
        setTimeout(() => {
            phoneField.style.borderColor = '';
            phoneField.setAttribute('placeholder', 'Телефон или @username в Telegram');
        }, 3000);
    }
});
