// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDf4d2Cl1b96hKr63INlvGeazK6hGr_F5o",
  authDomain: "safarshare-439f3.firebaseapp.com",
  projectId: "safarshare-439f3",
  storageBucket: "safarshare-439f3.firebasestorage.app",
  messagingSenderId: "864611748637",
  appId: "1:864611748637:web:13771c05f624dad4372ff4",
  measurementId: "G-ZLR2VM24F0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

// Check authentication state for all pages using auth.js
onAuthStateChanged(auth, (user) => {
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');
    const logoutBtn = document.querySelector('.logout-btn'); // Assuming you have a logout button
    
    if (user) {
        // User is signed in
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block'; // Show logout button
        // Redirect to profile if on login/signup page after successful login
        if (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html')) {
            window.location.href = 'profile.html';
        }
    } else {
        // User is signed out
        if (loginBtn) loginBtn.style.display = 'block';
        if (signupBtn) signupBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none'; // Hide logout button
        // DO NOT redirect to login.html from login.html or signup.html
        // Only redirect to login.html if on a protected page (e.g., profile.html)
        if (window.location.pathname.includes('profile.html')) {
            window.location.href = 'login.html';
        }
    }
});

// Authenticate with Google (modular syntax, renamed from loginWithGoogle)
window.authenticateWithGoogle = function() { // Expose globally for HTML onclick
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then(result => {
            const user = result.user;
            console.log('Google Authentication successful:', user);
            // Redirection handled by onAuthStateChanged
        })
        .catch(error => {
            console.error('Google Authentication error:', error);
            alert("Google Authentication Failed: " + error.message);
        });
};

// Handle email/password login form submission (modular syntax)
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;

        signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                const user = userCredential.user;
                console.log('Email/Password Login successful:', user);
                // Redirection handled by onAuthStateChanged
            })
            .catch(error => {
                console.error('Email/Password Login error:', error);
                alert("Login Failed: " + error.message);
            });
    });
}

// Signup form handler (modular syntax)
if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('signup-full-name').value;
        const email = document.getElementById('signup-email').value;
        const phone = document.getElementById('signup-phone').value; // Keep for data collection
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const gender = document.getElementById('signup-gender').value; // Keep for data collection
        const termsAccepted = document.getElementById('terms').checked;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        if (!termsAccepted) {
            alert("You must agree to the Terms & Conditions and Privacy Policy.");
            return;
        }

        // Create user with email and password
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                const user = userCredential.user;
                console.log('Email/Password Sign up successful:', user);
                
                // Update user profile with full name (and potentially phone/gender if storing in Firebase/Firestore)
                // For now, we are just setting display name
                return updateProfile(user, {
                    displayName: fullName
                });
            })
            .then(() => {
                // Redirection handled by onAuthStateChanged
            })
            .catch(error => {
                console.error('Email/Password Sign up error:', error);
                alert("Sign up Failed: " + error.message);
            });
    });
}

// Phone Number Login elements (already present, ensuring they work for signup page too)
const phoneNumberInput = document.getElementById('phone-number-input'); // For login.html
const signupPhoneInput = document.getElementById('signup-phone'); // For signup.html
const sendOtpBtn = document.getElementById('send-otp-btn');
const otpSection = document.getElementById('otp-section');
const otpInput = document.getElementById('otp-input');
const verifyOtpBtn = document.getElementById('verify-otp-btn');
const recaptchaContainer = document.getElementById('recaptcha-container');

let confirmationResult; // To store the confirmation result

// Initialize reCAPTCHA Verifier
if (recaptchaContainer) {
    window.recaptchaVerifier = new RecaptchaVerifier(recaptchaContainer, {
        'size': 'invisible',
        'callback': (response) => {
            console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
            alert('reCAPTCHA expired. Please try again.');
        }
    }, auth);

    recaptchaVerifier.render().then(function(widgetId) {
        console.log('reCAPTCHA rendered with ID:', widgetId);
    });
}

// Send OTP button click handler
if (sendOtpBtn) {
    sendOtpBtn.addEventListener('click', function() {
        const countryCode = '+91';
        const phoneNumber = countryCode + phoneNumberInput.value;
        if (!phoneNumberInput.value) {
            alert('Please enter your phone number.');
            return;
        }

        signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
            .then((result) => {
                confirmationResult = result;
                alert('OTP sent to ' + phoneNumber);
                if (otpSection) otpSection.style.display = 'block';
                if (verifyOtpBtn) verifyOtpBtn.style.display = 'block';
                if (sendOtpBtn) sendOtpBtn.style.display = 'none';
                if (phoneNumberInput) phoneNumberInput.disabled = true;
            })
            .catch((error) => {
                console.error('Error sending OTP:', error);
                alert('Error sending OTP: ' + error.message);
            });
    });
}

// Verify OTP button click handler
if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener('click', function() {
        const code = otpInput.value;
        if (!code) {
            alert('Please enter the OTP.');
            return;
        }

        confirmationResult.confirm(code)
            .then((result) => {
                const user = result.user;
                console.log('Phone authentication successful:', user);
                alert('Successfully logged in with phone number!');
                window.location.href = 'profile.html';
            })
            .catch((error) => {
                console.error('Error verifying OTP:', error);
                alert('Error verifying OTP: ' + error.message);
            });
    });
}

// Form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value) {
            isValid = false;
            showError(input, 'This field is required');
        } else {
            clearError(input);
        }
    });

    return isValid;
}

// Error handling
function showError(element, message) {
    element.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    element.parentNode.appendChild(errorDiv);
}

function clearError(element) {
    element.classList.remove('error');
    const errorDiv = element.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Remove +91 if pasted into phone fields
const signupPhone = document.getElementById('signup-phone');
if (signupPhone) {
  signupPhone.addEventListener('input', function() {
    this.value = this.value.replace(/^\+91/, '');
  });
}
const loginPhone = document.getElementById('phone-number-input');
if (loginPhone) {
  loginPhone.addEventListener('input', function() {
    this.value = this.value.replace(/^\+91/, '');
  });
}

// Password reset handler for forgot-password.html
document.addEventListener('DOMContentLoaded', function() {
  const forgotPasswordForm = document.getElementById('forgot-password-form');
  if (forgotPasswordForm) {
      forgotPasswordForm.addEventListener('submit', function(e) {
          e.preventDefault();
          const email = document.getElementById('reset-email').value;
          const resetMessage = document.getElementById('reset-message');
          if (!email) {
              resetMessage.textContent = 'Please enter your email address.';
              resetMessage.style.color = 'red';
              return;
          }
          sendPasswordResetEmail(auth, email)
              .then(() => {
                  resetMessage.textContent = 'Password reset email sent! Please check your inbox.';
                  resetMessage.style.color = 'green';
              })
              .catch((error) => {
                  resetMessage.textContent = 'Error: ' + error.message;
                  resetMessage.style.color = 'red';
              });
      });
  }
}); 