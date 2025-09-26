import { auth, db } from './firebase.js';
import { collection, addDoc, query, onSnapshot, orderBy } from 'https://www.gstatic.com/firebasejs/14.0.0/firebase-firestore.js';

auth.onAuthStateChanged(user=>{
    if(!user) return;
    const chatContainer = document.createElement('div'); chatContainer.id='chat';
    document.body.appendChild(chatContainer);

    // Example: basic messaging setup (expandable)
});
