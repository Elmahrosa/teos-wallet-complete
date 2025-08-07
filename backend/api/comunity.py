from flask import Blueprint, jsonify, request
from models.community import Community

community_bp = Blueprint('community', __name__)

@community_bp.route('/api/community/posts', methods=['GET'])
def get_posts():
    # Logic to retrieve community posts
    posts = Community.get_all_posts()
    return jsonify(posts), 200

@community_bp.route('/api/community/posts', methods=['POST'])
def create_post():
    data = request.json
    user_id = data.get('user_id')
    content = data.get('content')
    # Logic to create a new community post
    post = Community.create_post(user_id, content)
    return jsonify({"message": "Post created successfully", "post": post}), 201
