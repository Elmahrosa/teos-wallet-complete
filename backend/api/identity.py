from flask import Blueprint, jsonify, request
from models.user import User

identity_bp = Blueprint('identity', __name__)

@identity_bp.route('/api/identity/<user_id>', methods=['POST'])
def create_identity(user_id):
    data = request.json
    user = User.get_user_by_id(user_id)
    if user:
        # Logic to create decentralized identity
        return jsonify({"message": "Identity created successfully"}), 201
    return jsonify({"error": "User  not found"}), 404
