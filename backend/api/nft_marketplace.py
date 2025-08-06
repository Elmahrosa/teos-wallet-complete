from flask import Blueprint, jsonify, request
from models.nft import NFT

nft_marketplace_bp = Blueprint('nft_marketplace', __name__)

@nft_marketplace_bp.route('/api/nft/mint', methods=['POST'])
def mint_nft():
    data = request.json
    user_id = data.get('user_id')
    nft_data = data.get('nft_data')
    # Logic to mint NFT
    nft = NFT(user_id=user_id, **nft_data)
    nft.save()
    return jsonify({"message": "NFT minted successfully", "nft_id": nft.id}), 201

@nft_marketplace_bp.route('/api/nft/trade', methods=['POST'])
def trade_nft():
    data = request.json
    nft_id = data.get('nft_id')
    buyer_id = data.get('buyer_id')
    # Logic to trade NFT
    return jsonify({"message": "NFT traded successfully"}), 200
