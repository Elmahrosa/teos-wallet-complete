async function fetchMarketData() {
    const response = await fetch('/api/market-data');
    const marketData = await response.json();
    // Render market data in the UI
}

fetchMarketData(); // Call this function to fetch market data on page load
