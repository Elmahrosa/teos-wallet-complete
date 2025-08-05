async function fetchAlerts(userId) {
    const response = await fetch(`/api/alerts/${userId}`);
    const alerts = await response.json();
    // Render alerts in the UI
}

async function createAlert(userId, currency, targetPrice) {
    const response = await fetch(`/api/alerts/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currency, target_price: targetPrice })
    });
    const result = await response.json();
    // Handle the result
}
