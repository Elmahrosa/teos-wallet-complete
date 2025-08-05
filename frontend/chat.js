async function fetchChatHistory() {
    const response = await fetch('/api/chat');
    const chatHistory = await response.json();
    document.getElementById('chat').innerHTML = JSON.stringify(chatHistory);
}

async function sendMessage(userId, message) {
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId, message: message })
    });
    const chatMessage = await response.json();
    console.log(chatMessage);
}

// Call this function to fetch chat history
fetchChatHistory();
