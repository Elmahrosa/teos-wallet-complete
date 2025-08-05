from flask import Blueprint, jsonify
from models.user import User

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('/api/notifications/<user_id>', methods=['GET'])
def get_notifications(user_id):
    user = User.get_user_by_id(user_id)
    if user:
        return jsonify(user.notifications), 200
    return jsonify({"error": "User  not found"}), 404
