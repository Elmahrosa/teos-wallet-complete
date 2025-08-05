from flask import Blueprint, jsonify
from models.user import User

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/api/user/<user_id>/analytics', methods=['GET'])
def get_user_analytics(user_id):
    user = User.get_user_by_id(user_id)
    if user:
        # Example analytics data
        analytics_data = {
            "total_transactions": user.get_total_transactions(),
            "total_balance": user.get_total_balance(),
            "transaction_history": user.get_transaction_history()
        }
        return jsonify(analytics_data), 200
    return jsonify({"error": "User  not found"}), 404
