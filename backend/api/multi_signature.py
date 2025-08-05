from flask import Blueprint, jsonify, request
from models.transaction import Transaction

multi_sig_bp = Blueprint('multi_signature', __name__)

@multi_sig_bp.route('/api/multi-signature/transaction', methods=['POST'])
def create_multi_signature_transaction():
    data = request.json
    # Logic to create a multi-signature transaction
    return jsonify({"message": "Multi-signature transaction created successfully"}), 201
