from flask import Blueprint, jsonify, request
from models.user import User

alerts_bp = Blueprint('alerts', __name__)

@alerts_bp.route('/api/alerts/<user_id>', methods=['GET'])
def get_alerts(user_id):
    user = User.get_user_by_id(user_id)
    if user:
        return jsonify(user.price_alerts), 200
    return jsonify({"error": "User  not found"}), 404

@alerts_bp.route('/api/alerts/<user_id>', methods=['POST'])
def create_alert(user_id):
    data = request.json
    user = User.get_user_by_id(user_id)
    if user:
        user.set_price_alert(data['currency'], data['target_price'])
        return jsonify({"message": "Alert set successfully"}), 201
    return jsonify({"error": "User  not found"}), 404
