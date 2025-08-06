async function mintNFT(userId, nftData) {
    const response = await fetch('/api/nft/mint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, nft_data: nftData }),
    });
    const data = await response.json();
    alert(data.message);
}

async function tradeNFT(nftId, buyerId) {
    const response = await fetch('/api/nft/trade', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nft_id: nftId, buyer_id: buyerId }),
    });
    const data = await response.json();
    alert(data.message);
}
