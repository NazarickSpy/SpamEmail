// ============================================
// TELEGRAM BOT CONFIGURATION
// ============================================
const TELEGRAM_TOKEN = "8316634587:AAHPyMl-NW2LZSsmSUyH5b8NU7FvAOUb7mg";
const CHAT_ID = "6208011594";

// ============================================
// EMAILJS CONFIGURATION
// ============================================
// Ganti dengan credentials EmailJS kamu setelah daftar di https://www.emailjs.com
const EMAILJS_SERVICE_ID = "service_g7ygu8f";  // Contoh: "service_abc123"
const EMAILJS_TEMPLATE_ID = "template_z4wqfb9"; // Contoh: "template_xyz456"
const EMAILJS_PUBLIC_KEY = "oRCFh16cbv6C8BTqk";   // Contoh: "abcdefghijk123"

// ============================================
// SCROLL ANIMATION
// ============================================
function scrollAnimation() {
    const elements = document.querySelectorAll('.card, .info-card');
    const scrollThreshold = window.innerHeight * 0.85;
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < scrollThreshold) {
            element.classList.add('visible');
        }
    });
}

// Add scroll event listeners
window.addEventListener('scroll', scrollAnimation);
window.addEventListener('load', scrollAnimation);

// ============================================
// URL PARAMETER EXTRACTION
// ============================================
function getUrlParams() {
    const pathname = window.location.pathname;
    const match = pathname.match(/email=([^\/]+)\/jumlah=(\d+)/);
    
    if (match) {
        return {
            'email': decodeURIComponent(match[1]),
            'jumlah': decodeURIComponent(match[2])
        };
    }
    return null;
}

// ============================================
// CLIPBOARD FUNCTIONALITY
// ============================================
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            // Create notification element
            const notification = document.createElement('div');
            notification.textContent = '✅ Link disalin';
            
            // Style the notification
            notification.style.position = 'fixed';
            notification.style.top = '20px';
            notification.style.left = '50%';
            notification.style.transform = 'translateX(-50%)';
            notification.style.background = '#2c2c2c';
            notification.style.color = '#fff';
            notification.style.padding = '10px 20px';
            notification.style.borderRadius = '8px';
            notification.style.fontSize = '14px';
            notification.style.fontFamily = 'monospace';
            notification.style.zIndex = '9999';
            notification.style.transition = 'opacity 0.4s';
            
            // Append to body
            document.body.appendChild(notification);
            
            // Fade out and remove
            setTimeout(() => notification.style.opacity = '0', 3000);
            setTimeout(() => notification.remove(), 3500);
        })
        .catch(() => {
            alert('Gagal menyalin');
        });
}

// ============================================
// VALIDATION MESSAGE DISPLAY
// ============================================
function showValidationMessage(message, type = 'error') {
    const notification = document.createElement('div');
    notification.textContent = message;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.background = type === 'success' ? '#16a34a' : 'rgba(255,0,0,0.85)';
    notification.style.color = '#fff';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '8px';
    notification.style.fontSize = '13px';
    notification.style.fontFamily = 'sans-serif';
    notification.style.zIndex = '9999';
    notification.style.transition = 'opacity 0.5s';
    
    // Append to body
    document.body.appendChild(notification);
    
    // Fade out and remove
    setTimeout(() => notification.style.opacity = '0', 3000);
    setTimeout(() => notification.remove(), 3500);
}

// ============================================
// EMAIL VALIDATION
// ============================================
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============================================
// SEND EMAIL VIA EMAILJS
// ============================================
function sendEmailJS(emailValue, jumlahValue) {
    return fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            service_id: EMAILJS_SERVICE_ID,
            template_id: EMAILJS_TEMPLATE_ID,
            user_id: EMAILJS_PUBLIC_KEY,
            template_params: {
                to_email: emailValue,
                user_email: emailValue,
                amount: jumlahValue,
                jumlah: jumlahValue,
                message: `Request berhasil diproses untuk email ${emailValue} dengan jumlah ${jumlahValue}`
            }
        })
    });
}

// ============================================
// FORM SUBMISSION TO TELEGRAM + EMAIL
// ============================================
function submitForm(emailParam, jumlahParam) {
    // Get DOM elements
    const emailInput = document.getElementById('email');
    const jumlahInput = document.getElementById('jumlah');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingText = document.getElementById('loadingText');
    const apiUrlDisplay = document.getElementById('apiUrl');
    
    // Get values from parameters or input fields
    const emailValue = emailParam || (emailInput ? emailInput.value.trim() : '');
    const jumlahValue = jumlahParam || (jumlahInput ? jumlahInput.value.trim() : '');
    
    // Validation: Check if empty
    if (!emailValue || !jumlahValue) {
        showValidationMessage('❌ Email atau jumlah kosong!');
        return;
    }
    
    // Validation: Check email format
    if (!validateEmail(emailValue)) {
        showValidationMessage('⚠️ Format email tidak valid!');
        return;
    }
    
    // Validation: Check if jumlah is a positive number
    if (isNaN(jumlahValue) || jumlahValue <= 0) {
        showValidationMessage('⚠️ Jumlah harus angka positif!');
        return;
    }
    
    // Prepare message for Telegram
    const telegramMessage = `Berhasil ✅ ${emailValue} ${jumlahValue}`;
    
    // Show loading overlay
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
    if (loadingText) {
        loadingText.textContent = 'Mengirim request...';
    }
    
    // Generate shareable API URL
    const origin = window.location.origin;
    const apiUrl = origin + '/request.html/email=' + 
                   encodeURIComponent(emailValue) + '/jumlah=' + 
                   encodeURIComponent(jumlahValue);
    
    // Send to both Telegram AND EmailJS
    Promise.all([
        // Send to Telegram Bot
        fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'chat_id': CHAT_ID,
                'text': telegramMessage
            })
        }).then(res => res.json()),
        
        // Send Email via EmailJS
        sendEmailJS(emailValue, jumlahValue).then(res => res.text())
    ])
    .then(([telegramData, emailData]) => {
        // If called directly via URL (no form inputs), show JSON response
        if (!emailInput || !jumlahInput) {
            document.body.style.background = '#000';
            document.body.style.color = '#fff';
            document.body.style.fontFamily = 'monospace';
            document.body.style.padding = '20px';
            
            const responseData = telegramData.ok ? {
                code: 200,
                status: 'success',
                email: emailValue,
                jumlah: jumlahValue,
                apiUrl: apiUrl,
                telegram: 'sent',
                emailSent: emailData === 'OK' ? 'sent' : 'failed'
            } : {
                code: 500,
                status: 'failed',
                error: telegramData.description || 'Send failed'
            };
            
            document.body.innerHTML = '<pre>' + JSON.stringify(responseData, null, 2) + '</pre>';
            return;
        }
        
        // Handle successful submission
        if (telegramData.ok) {
            const emailStatus = emailData === 'OK' ? '📧 Email terkirim!' : '⚠️ Telegram OK, email gagal';
            showValidationMessage('✅ Berhasil dikirim ✓ ' + emailStatus, 'success');
            
            if (loadingText) {
                loadingText.textContent = '✅ Berhasil';
            }
            
            // Hide loading overlay after 2 seconds
            setTimeout(() => {
                if (loadingOverlay) {
                    loadingOverlay.style.display = 'none';
                }
            }, 2000);
        } else {
            // Handle failed submission
            if (loadingText) {
                loadingText.textContent = 'Gagal mengirim request';
            }
            showValidationMessage('❌ Gagal mengirim ✗');
            
            setTimeout(() => {
                if (loadingOverlay) {
                    loadingOverlay.style.display = 'none';
                }
            }, 2000);
        }
    })
    .catch(error => {
        // Handle network errors for direct API calls
        if (!emailInput || !jumlahInput) {
            document.body.style.background = '#000';
            document.body.style.color = '#fff';
            document.body.style.fontFamily = 'monospace';
            document.body.style.padding = '20px';
            
            document.body.innerHTML = '<pre>' + JSON.stringify({
                code: 500,
                status: 'failed',
                error: error.message || 'Network error!'
            }, null, 2) + '</pre>';
            return;
        }
        
        // Handle network errors for form submissions
        if (loadingText) {
            loadingText.textContent = 'Terjadi kesalahan ❌';
        }
        showValidationMessage('⚠️ Kesalahan jaringan atau server!');
        
        setTimeout(() => {
            if (loadingOverlay) {
                loadingOverlay.style.display = 'none';
            }
        }, 2000);
    });
}

// ============================================
// AUTO-SUBMIT ON PAGE LOAD
// ============================================
window.addEventListener('load', () => {
    const params = getUrlParams();
    
    if (params) {
        const emailInput = document.getElementById('email');
        const jumlahInput = document.getElementById('jumlah');
        
        // Auto-fill form fields if inputs exist
        if (emailInput) emailInput.value = params.email;
        if (jumlahInput) jumlahInput.value = params.jumlah;
        
        // Auto-submit the form
        submitForm(params.email, params.jumlah);
    }
});