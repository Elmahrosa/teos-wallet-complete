from flask import Blueprint, jsonify, request
from models.chat import Chat

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/api/chat', methods=['GET'])
def get_chat_history():
    chat_history = Chat.get_all_messages()
    return jsonify(chat_history), 200

@chat_bp.route('/api/chat', methods=['POST'])
def send_message():
    data = request.json
    message = Chat.send_message(data['user_id'], data['message'])
    return jsonify(message), 201
