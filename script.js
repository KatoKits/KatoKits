// KatoKits JavaScript functionality

// Mobile menu toggle
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

// Login modal functionality
function showLoginModal() {
    // Placeholder for login modal
    alert('Login functionality coming soon! Stay tuned for our full platform launch.');
}

// AI Plan Generator functionality
async function generatePlan() {
    const prompt = document.getElementById('prompt');
    const ageRange = document.getElementById('ageRange');
    const subject = document.getElementById('subject');
    const output = document.getElementById('aiPlanOutput');
    const button = document.querySelector('.generate-btn');
    
    if (!prompt || !output) return;
    
    // Basic validation
    if (!prompt.value.trim()) {
        alert('Please enter a topic or theme for your lesson plan.');
        return;
    }
    
    // Show loading state
    button.textContent = 'Generating...';
    button.disabled = true;
    output.innerHTML = '<div class="loading">🤖 Creating your personalized lesson plan...</div>';
    
    try {
        const requestBody = {
            prompt: `${prompt.value} for ${ageRange?.value || 'preschool age'} children focusing on ${subject?.value || 'general learning'}`
        };
        
        const response = await fetch('/.netlify/functions/generateAIPlan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            throw new Error('Failed to generate lesson plan');
        }
        
        const data = await response.json();
        
        // Display the generated plan
        output.innerHTML = `
            <div class="ai-plan-result">
                <h3>🎯 Your Custom Lesson Plan</h3>
                <div class="plan-content">${data.plan.replace(/\n/g, '<br>')}</div>
                <div class="plan-actions">
                    <button onclick="copyPlan()" class="btn btn-outline">📋 Copy Plan</button>
                    <button onclick="window.print()" class="btn btn-outline">🖨️ Print Plan</button>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Error generating plan:', error);
        output.innerHTML = `
            <div class="error-message">
                ❌ Sorry, we couldn't generate your lesson plan right now. Please try again in a moment.
                <br><small>If the problem persists, please <a href="contact.html">contact us</a>.</small>
            </div>
        `;
    } finally {
        // Reset button state
        button.textContent = 'Generate Lesson Plan';
        button.disabled = false;
    }
}

// Copy plan to clipboard
function copyPlan() {
    const planContent = document.querySelector('.plan-content');
    if (planContent) {
        navigator.clipboard.writeText(planContent.textContent).then(() => {
            alert('Lesson plan copied to clipboard!');
        }).catch(() => {
            alert('Unable to copy to clipboard. Please select and copy the text manually.');
        });
    }
}

// Form validation for contact page
function validateContactForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    
    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        alert('Please fill in all required fields.');
        return false;
    }
    
    if (!isValidEmail(email.value)) {
        alert('Please enter a valid email address.');
        return false;
    }
    
    // Placeholder for form submission
    alert('Thank you for your message! We\'ll get back to you soon.');
    return false; // Prevent actual form submission for now
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const navLinks = document.getElementById('navLinks');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (navLinks && !navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });
});