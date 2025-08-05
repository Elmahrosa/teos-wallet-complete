from flask import Blueprint, jsonify, request
from models.nft import NFT

nfts_bp = Blueprint('nfts', __name__)

@nfts_bp.route('/api/nfts', methods=['GET'])
def get_nfts():
    nfts = NFT.get_all_nfts()
    return jsonify(nfts), 200

@nfts_bp.route('/api/nfts', methods=['POST'])
def create_nft():
    data = request.json
    nft = NFT.create_nft(data)
    return jsonify(nft), 201
