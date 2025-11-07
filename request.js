// ============================================
// TELEGRAM BOT CONFIGURATION
// ============================================
const TELEGRAM_TOKEN = "8316634587:AAHPyMl-NW2LZSsmSUyH5b8NU7FvAOUb7mg/Attackv1";
const CHAT_ID = "6208011594";

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
// FORM SUBMISSION TO TELEGRAM
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
    
    // Send data to Telegram Bot
    fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'chat_id': CHAT_ID,
            'text': telegramMessage
        })
    })
    .then(response => response.json())
    .then(data => {
        // If called directly via URL (no form inputs), show JSON response
        if (!emailInput || !jumlahInput) {
            document.body.style.background = '#000';
            document.body.style.color = '#fff';
            document.body.style.fontFamily = 'monospace';
            document.body.style.padding = '20px';
            
            const responseData = data.ok ? {
                code: 200,
                status: 'success',
                email: emailValue,
                jumlah: jumlahValue,
                apiUrl: apiUrl
            } : {
                code: 500,
                status: 'failed',
                error: data.description || 'Send failed'
            };
            
            document.body.innerHTML = '<pre>' + JSON.stringify(responseData, null, 2) + '</pre>';
            return;
        }
        
        // Handle successful submission
        if (data.ok) {
            showValidationMessage('✅ Berhasil dikirim ❌', 'success');
            
            if (loadingText) {
                loadingText.textContent = '✅ Berhasil';
            }
            
            // Display the generated API URL with copy button
            if (apiUrlDisplay) {
                apiUrlDisplay.innerHTML = `
                    <div style="background:#2c2c;color:#fff;border-radius:6px;">
                        <span style="color:#0f0">✅ Link disalin</span>
                        <pre style="font-family:monospace;font-size:14px;">
                            ${apiUrl}
                        </pre>
                        <button id="copyApiBtn" 
                            style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                            <span style="color:#2c2c2c;color:#fff;border-radius:4px 10px;
                                padding:4px 10px;cursor:pointer;transition:0.3s all;">
                                📋 Salin
                            </span>
                        </button>
                    </div>
                `;
                
                // Add event listeners to copy button
                const copyBtn = document.getElementById('copyApiBtn');
                copyBtn.addEventListener('click', () => copyToClipboard(apiUrl));
                copyBtn.addEventListener('mouseenter', () => copyBtn.style.background = '#444');
                copyBtn.addEventListener('mouseleave', () => copyBtn.style.background = '#2c2c2c');
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
            showValidationMessage('❌ Gagal mengirim ❌');
            
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
        
        // Auto-fill form fields
        if (emailInput) emailInput.value = params.email;
        if (jumlahInput) jumlahInput.value = params.jumlah;
        
        // Auto-submit the form
        submitForm(params.email, params.jumlah);
    }
});

// ============================================
// HANDLE CLICKS ON .creator ELEMENTS
// ============================================
document.querySelectorAll('.creator').forEach(element => {
    element.addEventListener('click', () => {
        const url = element.getAttribute('data-url');
        if (url) {
            window.open(url, '_blank');
        }
    });
});