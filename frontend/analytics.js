async function fetchUser Analytics(userId) {
    const response = await fetch(`/api/user/${userId}/analytics`);
    const analytics = await response.json();
    document.getElementById('analytics').innerHTML = JSON.stringify(analytics);
}

// Call this function with the appropriate user ID
fetchUser Analytics(1);
