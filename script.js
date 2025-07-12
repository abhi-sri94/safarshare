// DOM Elements
const rideForm = document.getElementById('ride-form');
const searchBtn = document.querySelector('.search-btn');
const fromCityInput = document.getElementById('from-city');
const toCityInput = document.getElementById('to-city');
const journeyDateInput = document.getElementById('journey-date');
const postFromCityInput = document.getElementById('post-from-city');
const postToCityInput = document.getElementById('post-to-city');

// Initialize Google Places Autocomplete
function initializePlacesAutocomplete() {
    console.log('Initializing Places Autocomplete...');
    
    if (!google || !google.maps || !google.maps.places) {
        console.error('Google Maps API not loaded properly');
        return;
    }

    const options = {
        types: ['(cities)'],
        componentRestrictions: { country: 'in' } // Restrict to India
    };

    try {
        // Initialize for search box "From" city
        const fromAutocomplete = new google.maps.places.Autocomplete(fromCityInput, options);
        console.log('From city autocomplete initialized');
        
        fromAutocomplete.addListener('place_changed', function() {
            const place = fromAutocomplete.getPlace();
            if (place.geometry) {
                console.log('From City Selected:', place.name);
            }
        });

        // Initialize for search box "To" city
        const toAutocomplete = new google.maps.places.Autocomplete(toCityInput, options);
        console.log('To city autocomplete initialized');
        
        toAutocomplete.addListener('place_changed', function() {
            const place = toAutocomplete.getPlace();
            if (place.geometry) {
                console.log('To City Selected:', place.name);
            }
        });

        // Initialize for post ride form "From" city
        const postFromAutocomplete = new google.maps.places.Autocomplete(postFromCityInput, options);
        console.log('Post From city autocomplete initialized');
        
        postFromAutocomplete.addListener('place_changed', function() {
            const place = postFromAutocomplete.getPlace();
            if (place.geometry) {
                console.log('Post From City Selected:', place.name);
            }
        });

        // Initialize for post ride form "To" city
        const postToAutocomplete = new google.maps.places.Autocomplete(postToCityInput, options);
        console.log('Post To city autocomplete initialized');
        
        postToAutocomplete.addListener('place_changed', function() {
            const place = postToAutocomplete.getPlace();
            if (place.geometry) {
                console.log('Post To City Selected:', place.name);
            }
        });
    } catch (error) {
        console.error('Error initializing Places Autocomplete:', error);
    }

    // Prevent form submission on enter key for all city inputs
    [fromCityInput, toCityInput, postFromCityInput, postToCityInput].forEach(input => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });
    });
}

// Initialize Places Autocomplete when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    initializePlacesAutocomplete();
});

// Form submission handler
rideForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(rideForm);
    const rideData = {
        from: formData.get('from'),
        to: formData.get('to'),
        date: formData.get('date'),
        time: formData.get('time'),
        seats: formData.get('seats'),
        fare: formData.get('fare'),
        genderPreference: formData.get('gender-preference'),
        pickupPoint: formData.get('pickup-point')
    };

    // Here you would typically send this data to your backend
    console.log('Ride posted:', rideData);
    alert('Ride posted successfully!');
    rideForm.reset();
});

// Search functionality
searchBtn.addEventListener('click', function() {
    const fromCity = fromCityInput.value;
    const toCity = toCityInput.value;
    const journeyDate = journeyDateInput.value;

    if (!fromCity || !toCity || !journeyDate) {
        alert('Please fill in all search fields');
        return;
    }

    // Here you would typically make an API call to search for rides
    console.log('Searching for rides:', { fromCity, toCity, journeyDate });
    // For now, we'll just show an alert
    alert('Searching for rides...');
});

// Mobile menu toggle (to be implemented)
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Form validation
function validateForm() {
    const inputs = rideForm.querySelectorAll('input, select');
    let isValid = true;

    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    return isValid;
}

// Add input validation listeners
rideForm.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', function() {
        if (this.value) {
            this.classList.remove('error');
        }
    });
});

// Initialize date input with today's date
const today = new Date().toISOString().split('T')[0];
document.querySelector('input[type="date"]').min = today;

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCqGRzGnTUbYVZPmRLk3eGCChvwDLVPZT8",
    authDomain: "safarshare-439f3.firebaseapp.com",
    projectId: "safarshare-439f3",
    storageBucket: "safarshare-439f3.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Login with Google
function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(result => {
            const user = result.user;
            console.log('Login successful:', user);
            // Redirect to profile page after successful login
            window.location.href = 'profile.html';
        })
        .catch(error => {
            console.error('Login error:', error);
            alert("Login Failed: " + error.message);
        });
}

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
}); 