async function generateTaxReport(userId, year) {
    const response = await fetch('/api/tax/report', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, year: year }),
    });
    const data = await response.json();
    alert(data.message);
}
