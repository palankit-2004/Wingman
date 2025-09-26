import { db, auth } from './firebase.js';
import { deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/14.0.0/firebase-firestore.js';

document.getElementById('adminPanelBtn').onclick=()=>{
    alert("Admin Panel: Delete any post/comment via Firestore Console or extend UI.");
};
