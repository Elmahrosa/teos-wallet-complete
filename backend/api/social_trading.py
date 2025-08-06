from flask import Blueprint, jsonify, request
from models.user import User

social_trading_bp = Blueprint('social_trading', __name__)

@social_trading_bp.route('/api/social-trading/follow', methods=['POST'])
def follow_user():
    data = request.json
    follower_id = data.get('follower_id')
    followed_id = data.get('followed_id')
    # Logic to follow another user
    User.follow(follower_id, followed_id)
    return jsonify({"message": "Now following user"}), 200
