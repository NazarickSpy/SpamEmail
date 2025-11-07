// ========================================
// SCRIPT FOR INDEX.HTML
// ========================================

// Function to redirect to request.html
function redirectIndex() {
  window.location.href = 'request.html';
}

// Function to get user's IP address
async function getIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    document.getElementById('ip').textContent = data.ip;
  } catch {
    document.getElementById('ip').textContent = 'Gagal memuat IP ❌';
  }
}

// Function to get battery information
async function getBatteryInfo() {
  if (navigator.getBattery) {
    const battery = await navigator.getBattery();
    
    const updateBatteryInfo = () => {
      // Update battery level (convert to percentage)
      document.getElementById('battery').textContent = Math.round(battery.level * 100) + '%';
      
      // Update charging status
      document.getElementById('charging').textContent = battery.charging ? 'Ya' : 'Tidak';
    };
    
    // Initial update
    updateBatteryInfo();
    
    // Listen for battery level changes
    battery.addEventListener('levelchange', updateBatteryInfo);
    
    // Listen for charging status changes
    battery.addEventListener('chargingchange', updateBatteryInfo);
  } else {
    // Battery API not supported
    document.getElementById('battery').textContent = 'Tidak tersedia';
    document.getElementById('charging').textContent = 'Tidak tersedia';
  }
}

// Function for scroll animation (reveals cards on scroll)
function scrollAnimation() {
  document.querySelectorAll('.card').forEach(card => {
    const cardTop = card.getBoundingClientRect().top;
    
    // If card is in viewport (85% of window height)
    if (cardTop < window.innerHeight * 0.85) {
      card.classList.add('visible');
    }
  });
}

// Event Listeners
// Run scroll animation on page scroll
window.addEventListener('scroll', scrollAnimation);

// Run functions on page load
window.addEventListener('load', () => {
  getIP();
  getBatteryInfo();
  scrollAnimation();
});