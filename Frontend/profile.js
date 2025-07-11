import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDf4d2Cl1b96hKr63INlvGeazK6hGr_F5o",
    authDomain: "safarshare-439f3.firebaseapp.com",
    projectId: "safarshare-439f3",
    storageBucket: "safarshare-439f3.firebasestorage.app",
    messagingSenderId: "864611748637",
    appId: "1:864611748637:web:a3a33f5942128821372ff4",
    measurementId: "G-GMNS4XGL4C"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

// DOM Elements
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');
const profileForm = document.getElementById('profile-form');
const fullNameInput = document.getElementById('full-name');
const phoneInput = document.getElementById('phone');
const genderSelect = document.getElementById('gender');
const emailNotifications = document.getElementById('email-notifications');
const smsNotifications = document.getElementById('sms-notifications');
const locationSharing = document.getElementById('location-sharing');
const emergencyContact = document.getElementById('emergency-contact');
const avatarInput = document.getElementById('avatar-input');
const changeAvatarBtn = document.querySelector('.change-avatar-btn');

// Check authentication state
onAuthStateChanged(auth, function(user) {
    console.log('Auth state changed:', user);
    if (user) {
        // User is signed in
        loadUserProfile(user);
    } else {
        // User is not signed in, redirect to login
        console.log('No user found, redirecting to login');
        window.location.href = 'login.html';
    }
});

// Load user profile data
function loadUserProfile(user) {
    console.log('Loading profile for user:', user);
    // Set basic info
    userAvatar.src = user.photoURL || 'https://via.placeholder.com/150';
    userName.textContent = user.displayName || 'User';
    userEmail.textContent = user.email;

    // Load additional profile data from Firestore (to be implemented)
    // For now, we'll use localStorage
    const profileData = JSON.parse(localStorage.getItem('userProfile')) || {};
    
    fullNameInput.value = profileData.fullName || user.displayName || '';
    phoneInput.value = profileData.phone || '';
    genderSelect.value = profileData.gender || '';
    emailNotifications.checked = profileData.emailNotifications !== false;
    smsNotifications.checked = profileData.smsNotifications || false;
    locationSharing.checked = profileData.locationSharing !== false;
    emergencyContact.value = profileData.emergencyContact || '';
}

// Save profile data
profileForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const profileData = {
        fullName: fullNameInput.value,
        phone: phoneInput.value,
        gender: genderSelect.value,
        emailNotifications: emailNotifications.checked,
        smsNotifications: smsNotifications.checked,
        locationSharing: locationSharing.checked,
        emergencyContact: emergencyContact.value
    };

    // Save to localStorage (temporary solution)
    localStorage.setItem('userProfile', JSON.stringify(profileData));

    // Show success message
    alert('Profile updated successfully!');
});

// Handle avatar change
// Open file picker when camera button is clicked
changeAvatarBtn.addEventListener('click', function() {
    avatarInput.click();
});

// Handle file selection and upload
avatarInput.addEventListener('change', async function() {
    const file = avatarInput.files[0];
    if (!file) return;
    const user = auth.currentUser;
    if (!user) {
        alert('No user is signed in.');
        return;
    }
    const storageRef = ref(storage, `profile_pictures/${user.uid}`);
    try {
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        // Update user profile photoURL
        await updateProfile(user, { photoURL: url });
        userAvatar.src = url;
        alert('Profile picture updated!');
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('Failed to upload profile picture.');
    }
});

// Handle logout
document.addEventListener('DOMContentLoaded', function() {
    window.logout = function() {
        signOut(auth).then(() => {
        window.location.href = 'login.html';
    }).catch((error) => {
        console.error('Logout error:', error);
        alert('Error logging out. Please try again.');
    });
}
});

// Save settings changes
function saveSettings() {
    const settings = {
        emailNotifications: emailNotifications.checked,
        smsNotifications: smsNotifications.checked,
        locationSharing: locationSharing.checked,
        emergencyContact: emergencyContact.value
    };

    // Save to localStorage (temporary solution)
    const profileData = JSON.parse(localStorage.getItem('userProfile')) || {};
    localStorage.setItem('userProfile', JSON.stringify({...profileData, ...settings}));
}

// Add event listeners for settings changes
emailNotifications.addEventListener('change', saveSettings);
smsNotifications.addEventListener('change', saveSettings);
locationSharing.addEventListener('change', saveSettings);
emergencyContact.addEventListener('change', saveSettings); 