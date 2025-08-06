async function stakeTokens(userId, amount) {
    const response = await fetch('/api/staking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, amount: amount }),
    });
    const data = await response.json();
    alert(data.message);
}
