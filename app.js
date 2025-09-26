import { auth, db, storage } from './firebase.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/14.0.0/firebase-auth.js';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, arrayUnion } from 'https://www.gstatic.com/firebasejs/14.0.0/firebase-firestore.js';
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/14.0.0/firebase-storage.js';

const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const logoutBtn = document.getElementById('logoutBtn');
const postBtn = document.getElementById('postBtn');
const postContent = document.getElementById('postContent');
const postFile = document.getElementById('postFile');
const postTopic = document.getElementById('postTopic');
const postsContainer = document.getElementById('postsContainer');
const searchInput = document.getElementById('searchInput');
const adminPanelBtn = document.getElementById('adminPanelBtn');

let currentUser = null;
let isAdmin = false;

// Signup/Login
signupBtn.onclick = async () => {
    const email = prompt("Email:");
    const password = prompt("Password:");
    if(!email || !password) return;
    try { await createUserWithEmailAndPassword(auth,email,password); }
    catch(e){ alert(e.message); }
};

loginBtn.onclick = async () => {
    const email = prompt("Email:");
    const password = prompt("Password:");
    if(!email || !password) return;
    try { await signInWithEmailAndPassword(auth,email,password); }
    catch(e){ alert(e.message); }
};

logoutBtn.onclick = async () => { await signOut(auth); };

// Auth state
onAuthStateChanged(auth, async user => {
    currentUser = user;
    if(user){
        loginBtn.style.display='none';
        signupBtn.style.display='none';
        logoutBtn.style.display='inline-block';

        // Check admin
        const adminDoc = await db.collection('admins').doc(user.uid).get().catch(()=>null);
        isAdmin = adminDoc?.exists || false;
        adminPanelBtn.style.display = isAdmin?'inline-block':'none';
    } else {
        loginBtn.style.display='inline-block';
        signupBtn.style.display='inline-block';
        logoutBtn.style.display='none';
        adminPanelBtn.style.display='none';
    }
});

// Create Post
postBtn.onclick = async () => {
    if(!currentUser) return alert("Login first");
    let fileUrl='';
    if(postFile.files[0]){
        const fileRef = ref(storage, `posts/${Date.now()}_${postFile.files[0].name}`);
        await uploadBytes(fileRef, postFile.files[0]);
        fileUrl = await getDownloadURL(fileRef);
    }
    await addDoc(collection(db,'posts'),{
        uid: currentUser.uid,
        content: postContent.value,
        topic: postTopic.value,
        fileUrl,
        upvotes: [],
        downvotes: [],
        timestamp: serverTimestamp()
    });
    postContent.value=''; postFile.value='';
};

// Display posts
const q = query(collection(db,'posts'), orderBy('timestamp','desc'));
onSnapshot(q, snapshot => {
    postsContainer.innerHTML='';
    snapshot.forEach(docSnap=>{
        const post = docSnap.data();
        const div = document.createElement('div'); div.className='post';
        div.innerHTML=`
            <p>${post.content}</p>
            <small>Topic: ${post.topic}</small><br>
            ${post.fileUrl?`<img src="${post.fileUrl}">`:''}
            <br>
            <span class="upvote">👍 ${post.upvotes.length}</span>
            <span class="downvote">👎 ${post.downvotes.length}</span>
            <div class="comments"></div>
            <input type="text" class="commentInput" placeholder="Add comment...">
            <button class="commentBtn">Comment</button>
        `;
        // Upvote
        div.querySelector('.upvote').onclick=async()=>{
            if(!post.upvotes.includes(currentUser.uid)){
                await updateDoc(doc(db,'posts',docSnap.id), {upvotes: arrayUnion(currentUser.uid)});
            }
        };
        // Downvote
        div.querySelector('.downvote').onclick=async()=>{
            if(!post.downvotes.includes(currentUser.uid)){
                await updateDoc(doc(db,'posts',docSnap.id), {downvotes: arrayUnion(currentUser.uid)});
            }
        };
        // Comment
        div.querySelector('.commentBtn').onclick=async()=>{
            const input=div.querySelector('.commentInput');
            if(input.value.trim()==='') return;
            await addDoc(collection(db,'posts',docSnap.id,'comments'),{
                uid: currentUser.uid,
                content: input.value,
                timestamp: serverTimestamp()
            });
            input.value='';
        };

        // Load comments
        const commentsRef = collection(db,'posts',docSnap.id,'comments');
        onSnapshot(commentsRef,snap=>{
            const commentsDiv = div.querySelector('.comments'); commentsDiv.innerHTML='';
            snap.forEach(c=>{
                const cDiv = document.createElement('div'); cDiv.className='comment';
                cDiv.innerHTML=`<p>${c.data().content}</p>`;
                commentsDiv.appendChild(cDiv);
            });
        });

        postsContainer.appendChild(div);
    });
});

// Search posts
searchInput.oninput=()=>{
    const filter = searchInput.value.toLowerCase();
    document.querySelectorAll('.post').forEach(p=>{
        const text = p.querySelector('p').innerText.toLowerCase();
        p.style.display = text.includes(filter)?'block':'none';
    });
};
