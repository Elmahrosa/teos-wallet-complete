from flask import Blueprint, jsonify, request
from models.staking import Staking

staking_bp = Blueprint('staking', __name__)

@staking_bp.route('/api/staking', methods=['POST'])
def stake_tokens():
    data = request.json
    user_id = data.get('user_id')
    amount = data.get('amount')
    # Logic to stake tokens
    staking = Staking(user_id=user_id, amount=amount)
    staking.save()
    return jsonify({"message": "Tokens staked successfully"}), 201
