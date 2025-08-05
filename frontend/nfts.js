async function fetchNFTs() {
    const response = await fetch('/api/nfts');
    const nfts = await response.json();
    document.getElementById('nfts').innerHTML = JSON.stringify(nfts);
}

async function createNFT() {
    const nftData = {
        name: "New NFT",
        owner: "User 1",
        metadata: {}
    };
    const response = await fetch('/api/nfts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nftData)
    });
    const nft = await response.json();
    console.log(nft);
}

// Call this function to fetch NFTs
fetchNFTs();
