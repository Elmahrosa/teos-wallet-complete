async function fetchCommunityPosts() {
    const response = await fetch('/api/community/posts');
    const posts = await response.json();
    // Logic to display posts on the frontend
}

async function createCommunityPost(userId, content) {
    const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, content: content }),
    });
    const data = await response.json();
    alert(data.message);
}
