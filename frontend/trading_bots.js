async function createTradingBot(userId, strategy, parameters) {
    const response = await fetch('/api/trading-bots/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, strategy: strategy, parameters: parameters }),
    });
    const data = await response.json();
    alert(data.message);
}

async function executeTradingBot(botId) {
    const response = await fetch(`/api/trading-bots/${botId}/execute`, {
        method: 'POST',
    });
    const data = await response.json();
    alert(data.message);
}

async function stopTradingBot(botId) {
    const response = await fetch(`/api/trading-bots/${botId}/stop`, {
        method: 'POST',
    });
    const data = await response.json();
    alert(data.message);
}
