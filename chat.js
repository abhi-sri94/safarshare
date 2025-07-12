import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

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

const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

// For demo: hardcode a recipient user ID (replace with real logic later)
const testRecipientId = "test-user-2";
let currentUserId = null;
let chatId = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserId = user.uid;
        // For demo, chatId is a combination of two user IDs in sorted order
        chatId = [currentUserId, testRecipientId].sort().join('_');
        listenForMessages();
    } else {
        window.location.href = 'login.html';
    }
});

function listenForMessages() {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp'));
    onSnapshot(q, (snapshot) => {
        chatMessages.innerHTML = '';
        snapshot.forEach((doc) => {
            const msg = doc.data();
            const isMine = msg.senderId === currentUserId;
            const msgDiv = document.createElement('div');
            msgDiv.textContent = msg.text;
            msgDiv.style.margin = '8px 0';
            msgDiv.style.textAlign = isMine ? 'right' : 'left';
            msgDiv.style.color = isMine ? '#3498db' : '#333';
            chatMessages.appendChild(msgDiv);
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text || !currentUserId || !chatId) return;
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesRef, {
        senderId: currentUserId,
        receiverId: testRecipientId,
        text,
        timestamp: serverTimestamp()
    });
    chatInput.value = '';
}); 