class Staking:
    def __init__(self, user_id, amount):
        self.user_id = user_id
        self.amount = amount
        self.timestamp = datetime.utcnow()

    def save(self):
        # Logic to save staking information to the database
        pass
