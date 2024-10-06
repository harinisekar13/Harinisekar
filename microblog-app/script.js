// script.js

let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || [];
let posts = JSON.parse(localStorage.getItem('posts')) || [];

function signup() {
    const username = document.getElementById('username').value;
    if (username) {
        currentUser = users.find(user => user.username === username);
        if (!currentUser) {
            currentUser = { id: Date.now(), username: username, following: [], likedPosts: [] };
            users.push(currentUser);
            localStorage.setItem('users', JSON.stringify(users));
        }
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('home-page').style.display = 'block';
        document.getElementById('user-id').innerText = username;
        displayFeed();
        displayOtherUsers();
    }
}

function logout() {
    currentUser = null;
    document.getElementById('login-page').style.display = 'block';
    document.getElementById('home-page').style.display = 'none';
}

function createPost() {
    const postText = document.getElementById('post-text').value;
    const postImage = document.getElementById('post-image').files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const post = {
            id: Date.now(),
            userId: currentUser.id,
            username: currentUser.username,
            text: postText,
            image: e.target.result,
            likes: 0,
            comments: [],
            date: new Date().toLocaleString() // Add the date when the post is created
        };
        posts.push(post);
        localStorage.setItem('posts', JSON.stringify(posts));
        displayFeed();
    };
    
    if (postImage) {
        reader.readAsDataURL(postImage);
    } else {
        const post = {
            id: Date.now(),
            userId: currentUser.id,
            username: currentUser.username,
            text: postText,
            image: null,
            likes: 0,
            comments: [],
            date: new Date().toLocaleString() // Add the date when the post is created
        };
        posts.push(post);
        localStorage.setItem('posts', JSON.stringify(posts));
        displayFeed();
    }
}

function displayFeed() {
    const feedDiv = document.getElementById('feed');
    feedDiv.innerHTML = '';

    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        
        postDiv.innerHTML = `
            <p><strong>${post.username}</strong> (${post.date})</p>
            <p>${post.text}</p>
            ${post.image ? `<img src="${post.image}" alt="Post Image" style="max-width: 100%;">` : ''}
            <p>Likes: ${post.likes}</p>
            <button onclick="likePost(${post.id})">Like</button>
            <div class="comments-section">
                <h4>Comments</h4>
                <input type="text" id="comment-${post.id}" placeholder="Add a comment">
                <button onclick="addComment(${post.id})">Comment</button>
                <div id="comments-${post.id}">
                    ${post.comments.map(comment => `<p>${comment.text} - <em>${comment.username}</em> (${comment.date})</p>`).join('')}
                </div>
            </div>
        `;
        
        feedDiv.appendChild(postDiv);
    });
}

function likePost(postId) {
    const post = posts.find(p => p.id === postId);
    if (!currentUser.likedPosts.includes(postId)) {
        post.likes++;
        currentUser.likedPosts.push(postId);
        localStorage.setItem('posts', JSON.stringify(posts));
        localStorage.setItem('users', JSON.stringify(users));
        displayFeed();
    }
}

function addComment(postId) {
    const commentText = document.getElementById(`comment-${postId}`).value;
    if (commentText) {
        const post = posts.find(p => p.id === postId);
        post.comments.push({
            text: commentText,
            username: currentUser.username,
            date: new Date().toLocaleString()
        });
        localStorage.setItem('posts', JSON.stringify(posts));
        displayFeed();
    }
}

function displayOtherUsers() {
    const otherUsersDiv = document.getElementById('other-users');
    otherUsersDiv.innerHTML = '';

    users.forEach(user => {
        if (user.id !== currentUser.id) {
            const userDiv = document.createElement('div');
            userDiv.classList.add('other-user');
            userDiv.innerHTML = `
                <span>${user.username}</span>
                <button onclick="followUser(${user.id})">${currentUser.following.includes(user.id) ? 'Unfollow' : 'Follow'}</button>
            `;
            otherUsersDiv.appendChild(userDiv);
        }
    });
}

function followUser(userId) {
    if (currentUser.following.includes(userId)) {
        currentUser.following = currentUser.following.filter(followedId => followedId !== userId);
    } else {
        currentUser.following.push(userId);
    }
    localStorage.setItem('users', JSON.stringify(users));
    displayOtherUsers();
}
