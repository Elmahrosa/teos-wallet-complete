async function lendTokens(userId, amount) {
    const response = await fetch('/api/defi/lend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, amount: amount }),
    });
    const data = await response.json();
    alert(data.message);
}

async function borrowTokens(userId, amount) {
    const response = await fetch('/api/defi/borrow', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, amount: amount }),
    });
    const data = await response.json();
    alert(data.message);
}
