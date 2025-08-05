class Profile:
    profiles = {}

    @classmethod
    def create_profile(cls, user_id, data):
        cls.profiles[user_id] = data
        return data

    @classmethod
    def get_profile(cls, user_id):
        return cls.profiles.get(user_id, None)

    @classmethod
    def update_profile(cls, user_id, data):
        if user_id in cls.profiles:
            cls.profiles[user_id].update(data)
            return cls.profiles[user_id]
        return None
