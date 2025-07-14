// KatoKits Main JavaScript

// --- Mobile Menu Toggle ---
function toggleMobileMenu() {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('mobile-open');
}

// --- Authentication Functions ---
function showLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

function hideLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function showSignupModal() {
  const modal = document.getElementById('signup-modal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

function hideSignupModal() {
  const modal = document.getElementById('signup-modal');
  if (modal) {
    modal.style.display = 'none';
  }
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
  const modal = document.getElementById('ai-free-modal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

function hideAIModal() {
  const modal = document.getElementById('ai-free-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function hasUsedAIFreeTrial() {
  return localStorage.getItem('katokits_free_uses') > 0 || localStorage.getItem('katokits_email_signedup') === 'true';
}

// --- Reviews Toggle Function ---
function toggleReviews() {
  const reviewsContent = document.getElementById('moreReviews');
  const toggleButton = document.querySelector('.reviews-toggle');
  
  if (reviewsContent && toggleButton) {
    if (reviewsContent.style.display === 'none') {
      reviewsContent.style.display = 'block';
      toggleButton.innerHTML = '📖 Show Less Reviews ▲';
    } else {
      reviewsContent.style.display = 'none';
      toggleButton.innerHTML = '📖 Read More Reviews ▼';
    }
  }
}

// --- Scroll to top functionality ---
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- AI Generator functions ---
let aiGenerationCount = 0;
const maxFreeGenerations = 3;

function generateAIPlan() {
  const form = document.querySelector('.ai-gen-form');
  const output = document.getElementById('ai-output');
  
  if (!form || !output) return;
  
  if (aiGenerationCount >= maxFreeGenerations) {
    output.innerHTML = '🔒 <b>Free trial complete!</b><br><br>You\'ve used all 3 free AI lesson plans. <a href="pricing.html" style="color: var(--green); font-weight: bold;">Upgrade to Premium</a> for just $21.99/month to generate unlimited personalized activities!<br><br><small>💡 Includes access to our full activity library and cloud saving!</small>';
    output.style.display = 'block';
    return;
  }
  
  const age = document.getElementById('age').value;
  const theme = document.getElementById('theme').value;
  const skill = document.getElementById('skill').value;
  const duration = document.getElementById('duration').value;
  
  // Simulate AI generation
  output.innerHTML = '<div style="text-align: center; padding: 1rem;"><div style="font-size: 2rem; margin-bottom: 1rem;">🤖</div><p>Generating your custom lesson plan...</p></div>';
  output.style.display = 'block';
  
  setTimeout(() => {
    aiGenerationCount++;
    const remainingCount = maxFreeGenerations - aiGenerationCount;
    
    output.innerHTML = `
      <h3 style="color: var(--green); margin-bottom: 1rem;">${theme} Lesson Plan (${age})</h3>
      <div style="margin-bottom: 1rem;">
        <h4 style="color: var(--green);">Learning Objectives:</h4>
        <ul>
          <li>Develop ${skill.toLowerCase()} skills through hands-on activities</li>
          <li>Encourage creative expression and exploration</li>
          <li>Build fine and gross motor skills</li>
        </ul>
      </div>
      <div style="margin-bottom: 1rem;">
        <h4 style="color: var(--green);">Activities (${duration} minutes):</h4>
        <ul>
          <li>🎨 ${theme} Art and Craft Activity</li>
          <li>🎵 ${theme} Song and Movement</li>
          <li>📚 ${theme} Story and Discussion</li>
          <li>🎯 ${theme} Skill-Building Game</li>
        </ul>
      </div>
      <div style="margin-bottom: 1rem;">
        <h4 style="color: var(--green);">Materials Needed:</h4>
        <p>Construction paper, crayons, safety scissors, glue sticks, printed worksheets (included)</p>
      </div>
      <div style="text-align: center; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #e0e0e0;">
        <p style="font-weight: bold; color: var(--green);">Remaining free generations: ${remainingCount}</p>
        <a href="#" class="btn btn-primary" onclick="downloadLessonPlan()">Download Full Lesson Plan PDF</a>
      </div>
    `;
  }, 2000);
}

function downloadPlan() {
  alert('Demo: In a real implementation, this would download a PDF with the complete lesson plan, worksheets, and materials list.');
}

function downloadLessonPlan() {
  downloadPlan();
}

// --- Contact Form Enhancement ---
function enhancedContactFormHandler(e) {
  const statusDiv = document.getElementById('form-status');
  const submitBtn = e.target.querySelector('button[type="submit"]');
  
  // Show loading state
  if (submitBtn) {
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
  }
  
  if (statusDiv) {
    statusDiv.style.display = 'block';
    statusDiv.style.backgroundColor = '#e3f2fd';
    statusDiv.style.color = '#1976d2';
    statusDiv.textContent = 'Sending your message...';
  }
  
  // Prevent default form submission
  e.preventDefault();
  
  // Get form data
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  // Simple validation
  if (!data.name || !data._replyto || !data.subject || !data.message) {
    if (statusDiv) {
      statusDiv.style.backgroundColor = '#ffebee';
      statusDiv.style.color = '#c62828';
      statusDiv.textContent = 'Please fill in all required fields.';
    }
    if (submitBtn) {
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
    }
    return;
  }
  
  // Simulate form submission (replace with actual backend call)
  setTimeout(() => {
    if (statusDiv) {
      statusDiv.style.backgroundColor = '#e8f5e8';
      statusDiv.style.color = '#2e7d32';
      statusDiv.innerHTML = '✅ Thank you for your message! We\'ll get back to you within 24 hours.<br><br>For quick questions, you can also reach us on <a href="https://www.instagram.com/katokitsdigital/" target="_blank" style="color: #2e7d32; text-decoration: underline;">Instagram @katokitsdigital</a>';
    }
    
    // Reset form
    e.target.reset();
    if (submitBtn) {
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
    }
  }, 1500);
  
  return false;
}

// --- Dashboard functions ---
function logout() {
  // TODO: Implement actual logout logic
  alert('Logout functionality will be implemented with backend integration');
  window.location.href = 'index.html';
}

// --- Library functions ---
function filterLibrary() {
  const ageFilter = document.getElementById('age-filter');
  const subjectFilter = document.getElementById('subject-filter');
  const themeFilter = document.getElementById('theme-filter');
  
  if (!ageFilter || !subjectFilter || !themeFilter) return;
  
  const cards = document.querySelectorAll('.library-card');
  
  cards.forEach(card => {
    const age = card.dataset.age;
    const subject = card.dataset.subject;
    const theme = card.dataset.theme;
    
    const ageMatch = !ageFilter.value || age === ageFilter.value;
    const subjectMatch = !subjectFilter.value || subject === subjectFilter.value;
    const themeMatch = !themeFilter.value || theme === themeFilter.value;
    
    if (ageMatch && subjectMatch && themeMatch) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// --- Initialize page functionality ---
document.addEventListener('DOMContentLoaded', function() {
  console.log('KatoKits website loaded');
  
  // AI Modal Logic for homepage
  if (!hasUsedAIFreeTrial() && document.getElementById('ai-free-modal')) {
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
  
  // Login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.onsubmit = function(e) {
      e.preventDefault();
      alert('Login functionality will be implemented with backend integration');
      hideLoginModal();
    };
  }
  
  // Signup form
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.onsubmit = function(e) {
      e.preventDefault();
      alert('Signup functionality will be implemented with backend integration');
      hideSignupModal();
    };
  }
  
  // Enhanced contact form
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', enhancedContactFormHandler);
  }
  
  // AI Generator form
  const aiForm = document.querySelector('.ai-gen-form');
  if (aiForm) {
    aiForm.addEventListener('submit', function(e) {
      e.preventDefault();
      generateAIPlan();
    });
  }
});