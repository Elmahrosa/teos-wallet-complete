class Community:
    @staticmethod
    def get_all_posts():
        # Logic to fetch all community posts from the database
        return []

    @staticmethod
    def create_post(user_id, content):
        # Logic to save a new post to the database
        return {
            "user_id": user_id,
            "content": content,
            "post_id": 1  # Example post ID
        }
