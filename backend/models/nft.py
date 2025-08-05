class NFT:
    nfts = []

    @classmethod
    def get_all_nfts(cls):
        return cls.nfts

    @classmethod
    def create_nft(cls, data):
        nft = {
            "id": len(cls.nfts) + 1,
            "name": data['name'],
            "owner": data['owner'],
            "metadata": data['metadata']
        }
        cls.nfts.append(nft)
        return nft
