// --- Mobile Menu Toggle ---
function toggleMobileMenu() {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('mobile-open');
}

// --- Authentication Functions ---
function showLoginModal() {
  document.getElementById('login-modal').style.display = 'flex';
}

function hideLoginModal() {
  document.getElementById('login-modal').style.display = 'none';
}

function showSignupModal() {
  document.getElementById('signup-modal').style.display = 'flex';
}

function hideSignupModal() {
  document.getElementById('signup-modal').style.display = 'none';
}

function switchToSignup() {
  hideLoginModal();
  showSignupModal();
}

function switchToLogin() {
  hideSignupModal();
  showLoginModal();
}

// --- AI Free Modal Logic ---
function showAIModal() {
  document.getElementById('ai-free-modal').style.display = 'flex';
}

function hideAIModal() {
  document.getElementById('ai-free-modal').style.display = 'none';
}

function hasUsedAIFreeTrial() {
  return localStorage.getItem('katokits_free_uses') > 0 || localStorage.getItem('katokits_email_signedup') === 'true';
}

// --- Reviews Toggle Function ---
function toggleReviews() {
  const reviewsContent = document.getElementById('moreReviews');
  const toggleButton = document.querySelector('.reviews-toggle');
  
  if (reviewsContent.style.display === 'none') {
    reviewsContent.style.display = 'block';
    toggleButton.innerHTML = '📖 Show Less Reviews ▲';
  } else {
    reviewsContent.style.display = 'none';
    toggleButton.innerHTML = '📖 Read More Reviews ▼';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // AI Modal Logic
  if (!hasUsedAIFreeTrial()) {
    setTimeout(showAIModal, 1200);
  }
  
  // Close button events
  const closeAIModal = document.getElementById('close-ai-modal');
  const closeLoginModal = document.getElementById('close-login-modal');
  const closeSignupModal = document.getElementById('close-signup-modal');
  
  if (closeAIModal) closeAIModal.onclick = hideAIModal;
  if (closeLoginModal) closeLoginModal.onclick = hideLoginModal;
  if (closeSignupModal) closeSignupModal.onclick = hideSignupModal;
  
  // Form submissions
  const aiFreeForm = document.getElementById('ai-free-form');
  if (aiFreeForm) {
    aiFreeForm.onsubmit = function(e) {
      e.preventDefault();
      localStorage.setItem('katokits_email_signedup', 'true');
      localStorage.setItem('katokits_free_uses', '0');
      hideAIModal();
      alert('You now have 3 free AI uses! Visit the AI Generator page.');
    };
  }
  
  // Freebie form submission
  const freebieForm = document.getElementById('freebie-form');
  if (freebieForm) {
    freebieForm.onsubmit = function(e) {
      e.preventDefault();
      const email = this.email.value;
      localStorage.setItem('katokits_freebie_downloaded', 'true');
      localStorage.setItem('katokits_email', email);
      alert('Thank you! Check your email for the free Colors & Shapes Discovery Kit!');
    };
  }
  
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.onsubmit = function(e) {
      e.preventDefault();
      // TODO: Implement actual login logic
      alert('Login functionality will be implemented with backend integration');
      hideLoginModal();
    };
  }
  
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.onsubmit = function(e) {
      e.preventDefault();
      // TODO: Implement actual signup logic
      alert('Signup functionality will be implemented with backend integration');
      hideSignupModal();
    };
  }
});