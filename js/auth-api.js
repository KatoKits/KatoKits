/**
 * KatoKits Authentication and API Client
 *
 * This module provides a comprehensive API client for the KatoKits application,
 * handling authentication, user management, and API communications with Netlify functions.
 *
 * Features:
 * - User authentication (signup, login, logout)
 * - Session management with localStorage
 * - API call abstraction with error handling
 * - UI state management for auth buttons
 * - AI usage tracking and permissions
 *
 * @author KatoKits Team
 * @version 1.0.0
 */

/**
 * Main API client class for KatoKits application
 * Handles all authentication and API operations
 */
class KatoKitsAPI {
  /**
   * Initialize the API client
   * Loads existing authentication state from localStorage
   */
  constructor() {
    this.baseURL = window.location.origin;
    this.authToken = localStorage.getItem('katokits_auth_token');
    this.user = JSON.parse(localStorage.getItem('katokits_user') || 'null');
    this.profile = JSON.parse(
      localStorage.getItem('katokits_profile') || 'null'
    );
  }

  /**
   * Make authenticated API calls to Netlify functions
   * @param {string} endpoint - The Netlify function endpoint name
   * @param {Object} options - Fetch options (method, body, headers, etc.)
   * @returns {Promise<Object>} API response data
   * @throws {Error} If the API call fails
   */
  async apiCall(endpoint, options = {}) {
    const url = `${this.baseURL}/.netlify/functions/${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    const config = {
      ...options,
      headers,
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API call to ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * Register a new user account
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<Object>} Registration response with user data and session
   * @throws {Error} If signup fails
   */
  async signup(email, password) {
    try {
      const data = await this.apiCall('auth-signup', {
        method: 'POST',
        body: { email, password },
      });

      if (data.session) {
        this.setAuthData(data.user, data.session, data.profile);
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Signup failed');
    }
  }

  async login(email, password) {
    try {
      const data = await this.apiCall('auth-login', {
        method: 'POST',
        body: { email, password },
      });

      this.setAuthData(data.user, data.session, data.profile);
      return data;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  }

  async logout() {
    try {
      if (this.authToken) {
        await this.apiCall('auth-logout', {
          method: 'POST',
        });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local cleanup even if API call fails
    } finally {
      this.clearAuthData();
    }
  }

  // Set authentication data
  setAuthData(user, session, profile = null) {
    this.authToken = session.access_token;
    this.user = user;
    this.profile = profile;

    localStorage.setItem('katokits_auth_token', this.authToken);
    localStorage.setItem('katokits_user', JSON.stringify(user));
    localStorage.setItem('katokits_profile', JSON.stringify(profile));
  }

  // Clear authentication data
  clearAuthData() {
    this.authToken = null;
    this.user = null;
    this.profile = null;

    localStorage.removeItem('katokits_auth_token');
    localStorage.removeItem('katokits_user');
    localStorage.removeItem('katokits_profile');

    // Clear old localStorage keys for backward compatibility
    localStorage.removeItem('katokits_free_uses');
    localStorage.removeItem('katokits_paid');
    localStorage.removeItem('katokits_email_signedup');
    localStorage.removeItem('katokits_email');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!(this.authToken && this.user);
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Get user profile
  getUserProfile() {
    return this.profile;
  }

  // Contact form submission
  async submitContactForm(formData) {
    return await this.apiCall('contact-form', {
      method: 'POST',
      body: formData,
    });
  }

  // Email capture
  async captureEmail(email) {
    return await this.apiCall('email-capture', {
      method: 'POST',
      body: { email },
    });
  }

  // AI usage tracking
  async getAIUsage() {
    return await this.apiCall('ai-usage', {
      method: 'GET',
    });
  }

  async recordAIUsage(email = null) {
    return await this.apiCall('ai-usage', {
      method: 'POST',
      body: email ? { email } : {},
    });
  }

  // Utility methods for UI updates
  updateAuthButtons() {
    const leftAuthButtons = document.querySelector('.auth-buttons.left-auth');
    const rightAuthButtons = document.querySelector('.auth-buttons.right-auth');

    if (this.isAuthenticated()) {
      // Show logout button and user info
      if (leftAuthButtons) {
        leftAuthButtons.innerHTML = `
          <a href="dashboard.html" class="btn btn-outline">Dashboard</a>
        `;
      }
      if (rightAuthButtons) {
        rightAuthButtons.innerHTML = `
          <span class="user-email">${this.user.email}</span>
          <a href="#" onclick="katoAPI.logout().then(() => window.location.reload())" class="btn btn-outline">Logout</a>
        `;
      }
    } else {
      // Show login/signup buttons
      if (leftAuthButtons) {
        leftAuthButtons.innerHTML = `
          <a href="#" onclick="showLoginModal()" class="btn btn-outline">Login</a>
        `;
      }
      if (rightAuthButtons) {
        rightAuthButtons.innerHTML = `
          <a href="#" onclick="showSignupModal()" class="btn btn-primary">Sign Up</a>
        `;
      }
    }
  }

  // Check AI generation permissions
  async canGenerateAI(email = null) {
    try {
      if (this.isAuthenticated()) {
        const usage = await this.getAIUsage();
        return usage.can_generate;
      } else if (email) {
        // For non-authenticated users, we'll check during the actual generation attempt
        return true; // Assume true, will be validated server-side
      }
      return false;
    } catch (error) {
      console.error('Error checking AI generation permissions:', error);
      return false;
    }
  }
}

// Global instance
const katoAPI = new KatoKitsAPI();

// Auto-update auth buttons on page load
document.addEventListener('DOMContentLoaded', () => {
  katoAPI.updateAuthButtons();
});
