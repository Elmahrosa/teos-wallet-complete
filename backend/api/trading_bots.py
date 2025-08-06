from flask import Blueprint, jsonify, request
from models.trading_bot import TradingBot

trading_bots_bp = Blueprint('trading_bots', __name__)

@trading_bots_bp.route('/api/trading-bots/create', methods=['POST'])
def create_trading_bot():
    data = request.json
    user_id = data.get('user_id')
    strategy = data.get('strategy')
    parameters = data.get('parameters')
    
    # Logic to create a trading bot
    trading_bot = TradingBot(user_id=user_id, strategy=strategy, parameters=parameters)
    trading_bot.save()
    
    return jsonify({"message": "Trading bot created successfully", "bot_id": trading_bot.id}), 201

@trading_bots_bp.route('/api/trading-bots/<int:bot_id>/execute', methods=['POST'])
def execute_trading_bot(bot_id):
    # Logic to execute the trading bot
    trading_bot = TradingBot.get_by_id(bot_id)
    if trading_bot:
        trading_bot.execute()
        return jsonify({"message": "Trading bot executed successfully"}), 200
    return jsonify({"message": "Trading bot not found"}), 404

@trading_bots_bp.route('/api/trading-bots/<int:bot_id>/stop', methods=['POST'])
def stop_trading_bot(bot_id):
    # Logic to stop the trading bot
    trading_bot = TradingBot.get_by_id(bot_id)
    if trading_bot:
        trading_bot.stop()
        return jsonify({"message": "Trading bot stopped successfully"}), 200
    return jsonify({"message": "Trading bot not found"}), 404
