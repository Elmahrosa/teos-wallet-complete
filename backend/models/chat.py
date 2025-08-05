class Chat:
    messages = []

    @classmethod
    def get_all_messages(cls):
        return cls.messages

    @classmethod
    def send_message(cls, user_id, message):
        chat_message = {
            "user_id": user_id,
            "message": message
        }
        cls.messages.append(chat_message)
        return chat_message
