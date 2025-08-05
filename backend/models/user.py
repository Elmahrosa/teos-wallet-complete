class User:
    users = []

    @classmethod
    def get_user_by_id(cls, user_id):
        for user in cls.users:
            if user['id'] == user_id:
                return user
        return None

    @classmethod
    def get_total_transactions(cls):
        # Placeholder for total transactions logic
        return 10

    @classmethod
    def get_total_balance(cls):
        # Placeholder for total balance logic
        return 1000

    @classmethod
    def get_transaction_history(cls):
        # Placeholder for transaction history logic
        return []
