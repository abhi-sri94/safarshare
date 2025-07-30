import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

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
const db = getFirestore(app);

const rideHistoryBody = document.getElementById('ride-history-body');

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    // Query rides where userId == current user
    const ridesRef = collection(db, 'rides');
    const q = query(ridesRef, where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    rideHistoryBody.innerHTML = '';
    if (querySnapshot.empty) {
        rideHistoryBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#888;">No rides found.</td></tr>';
        return;
    }
    querySnapshot.forEach((doc) => {
        const ride = doc.data();
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ride.date || ''}</td>
            <td>${ride.from || ''}</td>
            <td>${ride.to || ''}</td>
            <td>${ride.role || ''}</td>
            <td>${ride.status || ''}</td>
        `;
        rideHistoryBody.appendChild(row);
    });
}); 