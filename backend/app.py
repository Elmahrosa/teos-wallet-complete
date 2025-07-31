#!/usr/bin/env python3
"""
TEOS Wallet Backend API
Advanced multi-chain wallet backend with Egyptian heritage
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import time
import hashlib
import secrets
import os
from datetime import datetime, timedelta
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
app.config['SECRET_KEY'] = secrets.token_hex(32)
app.config['UPLOAD_FOLDER'] = 'uploads'

# In-memory storage (use database in production)
wallets = {}
transactions = {}
networks = {
    'solana': {
        'name': 'Solana',
        'symbol': 'SOL',
        'rpc_url': 'https://api.mainnet-beta.solana.com',
        'explorer': 'https://explorer.solana.com',
        'decimals': 9
    },
    'ethereum': {
        'name': 'Ethereum',
        'symbol': 'ETH',
        'rpc_url': 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
        'explorer': 'https://etherscan.io',
        'decimals': 18
    },
    'bitcoin': {
        'name': 'Bitcoin',
        'symbol': 'BTC',
        'rpc_url': 'https://blockstream.info/api',
        'explorer': 'https://blockstream.info',
        'decimals': 8
    },
    'teos': {
        'name': 'TEOS',
        'symbol': 'TEOS',
        'rpc_url': 'https://api.mainnet-beta.solana.com',
        'explorer': 'https://explorer.solana.com',
        'decimals': 6,
        'contract': 'AhXBUQmbhv9dNoZCiMYmXF4Gyi1cjQthWHFhTL2CJaSo'
    }
}

# Utility Functions
def generate_wallet_address(network='solana'):
    """Generate a mock wallet address for testing"""
    if network == 'solana' or network == 'teos':
        return secrets.token_urlsafe(32)[:44]
    elif network == 'ethereum':
        return '0x' + secrets.token_hex(20)
    elif network == 'bitcoin':
        return 'bc1' + secrets.token_urlsafe(32)[:39]
    return secrets.token_hex(32)

def generate_transaction_hash():
    """Generate a mock transaction hash"""
    return '0x' + secrets.token_hex(32)

def get_current_prices():
    """Get current cryptocurrency prices (mock data)"""
    return {
        'SOL': 98.32,
        'ETH': 2847.52,
        'BTC': 43250.00,
        'TEOS': 0.0045
    }

def validate_address(address, network):
    """Validate wallet address format"""
    if network in ['solana', 'teos']:
        return len(address) >= 32 and len(address) <= 44
    elif network == 'ethereum':
        return address.startswith('0x') and len(address) == 42
    elif network == 'bitcoin':
        return len(address) >= 26 and len(address) <= 62
    return False

# API Routes

@app.route('/')
def index():
    """API status endpoint"""
    return jsonify({
        'status': 'success',
        'message': 'TEOS Wallet API - From Egypt to the World',
        'version': '1.0.0',
        'networks': list(networks.keys()),
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/wallet/create', methods=['POST'])
def create_wallet():
    """Create a new wallet"""
    try:
        data = request.get_json()
        wallet_type = data.get('type', 'mobile')
        network = data.get('network', 'solana')
        
        if network not in networks:
            return jsonify({'error': 'Unsupported network'}), 400
        
        # Generate wallet
        wallet_id = secrets.token_hex(16)
        address = generate_wallet_address(network)
        private_key = secrets.token_hex(32)  # In production, use proper key generation
        
        wallet_data = {
            'id': wallet_id,
            'address': address,
            'network': network,
            'type': wallet_type,
            'created_at': datetime.now().isoformat(),
            'balance': {
                'SOL': 12.45,
                'ETH': 0.85,
                'BTC': 0.0234,
                'TEOS': 15420.50
            }
        }
        
        wallets[wallet_id] = wallet_data
        
        return jsonify({
            'status': 'success',
            'wallet': {
                'id': wallet_id,
                'address': address,
                'network': network,
                'type': wallet_type
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/wallet/<wallet_id>/balance', methods=['GET'])
def get_wallet_balance(wallet_id):
    """Get wallet balance for all networks"""
    try:
        if wallet_id not in wallets:
            return jsonify({'error': 'Wallet not found'}), 404
        
        wallet = wallets[wallet_id]
        prices = get_current_prices()
        
        balances = []
        total_value = 0
        
        for symbol, balance in wallet['balance'].items():
            price = prices.get(symbol, 0)
            value = balance * price
            total_value += value
            
            balances.append({
                'symbol': symbol,
                'balance': balance,
                'price': price,
                'value': value,
                'network': 'solana' if symbol in ['SOL', 'TEOS'] else symbol.lower()
            })
        
        return jsonify({
            'status': 'success',
            'wallet_id': wallet_id,
            'total_value': total_value,
            'balances': balances,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/wallet/<wallet_id>/send', methods=['POST'])
def send_transaction(wallet_id):
    """Send cryptocurrency transaction"""
    try:
        if wallet_id not in wallets:
            return jsonify({'error': 'Wallet not found'}), 404
        
        data = request.get_json()
        to_address = data.get('to_address')
        amount = float(data.get('amount', 0))
        symbol = data.get('symbol', 'SOL')
        network = data.get('network', 'solana')
        
        if not validate_address(to_address, network):
            return jsonify({'error': 'Invalid recipient address'}), 400
        
        wallet = wallets[wallet_id]
        
        if symbol not in wallet['balance']:
            return jsonify({'error': 'Unsupported asset'}), 400
        
        if wallet['balance'][symbol] < amount:
            return jsonify({'error': 'Insufficient balance'}), 400
        
        # Create transaction
        tx_hash = generate_transaction_hash()
        transaction = {
            'hash': tx_hash,
            'from_address': wallet['address'],
            'to_address': to_address,
            'amount': amount,
            'symbol': symbol,
            'network': network,
            'status': 'pending',
            'timestamp': datetime.now().isoformat(),
            'fee': 0.001  # Mock fee
        }
        
        # Update balance
        wallet['balance'][symbol] -= amount
        transactions[tx_hash] = transaction
        
        # Simulate transaction processing
        return jsonify({
            'status': 'success',
            'transaction': transaction,
            'message': 'Transaction submitted successfully'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/wallet/<wallet_id>/receive', methods=['GET'])
def get_receive_address(wallet_id):
    """Get wallet receive address and QR code"""
    try:
        if wallet_id not in wallets:
            return jsonify({'error': 'Wallet not found'}), 404
        
        wallet = wallets[wallet_id]
        
        return jsonify({
            'status': 'success',
            'address': wallet['address'],
            'network': wallet['network'],
            'qr_code_url': f'/api/qr/{wallet["address"]}',
            'message': 'Share this address to receive payments'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/wallet/<wallet_id>/transactions', methods=['GET'])
def get_transactions(wallet_id):
    """Get wallet transaction history"""
    try:
        if wallet_id not in wallets:
            return jsonify({'error': 'Wallet not found'}), 404
        
        wallet = wallets[wallet_id]
        wallet_address = wallet['address']
        
        # Mock transaction history
        mock_transactions = [
            {
                'hash': '0x1234567890abcdef1234567890abcdef12345678',
                'type': 'receive',
                'amount': 50,
                'symbol': 'TEOS',
                'from_address': 'Mining Pool',
                'to_address': wallet_address,
                'status': 'completed',
                'timestamp': (datetime.now() - timedelta(minutes=2)).isoformat(),
                'network': 'solana'
            },
            {
                'hash': '0x2345678901bcdef12345678901bcdef123456789',
                'type': 'send',
                'amount': 0.1,
                'symbol': 'SOL',
                'from_address': wallet_address,
                'to_address': 'DeFi Protocol',
                'status': 'completed',
                'timestamp': (datetime.now() - timedelta(hours=1)).isoformat(),
                'network': 'solana'
            },
            {
                'hash': '0x3456789012cdef123456789012cdef1234567890',
                'type': 'swap',
                'amount': 100,
                'symbol': 'USDC',
                'from_address': wallet_address,
                'to_address': 'DEX',
                'status': 'completed',
                'timestamp': (datetime.now() - timedelta(hours=3)).isoformat(),
                'network': 'ethereum'
            }
        ]
        
        return jsonify({
            'status': 'success',
            'transactions': mock_transactions,
            'count': len(mock_transactions)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/swap/quote', methods=['POST'])
def get_swap_quote():
    """Get swap quote between tokens"""
    try:
        data = request.get_json()
        from_token = data.get('from_token')
        to_token = data.get('to_token')
        amount = float(data.get('amount', 0))
        
        prices = get_current_prices()
        
        if from_token not in prices or to_token not in prices:
            return jsonify({'error': 'Unsupported token pair'}), 400
        
        from_price = prices[from_token]
        to_price = prices[to_token]
        
        # Calculate swap rate with 0.3% fee
        rate = (from_price / to_price) * 0.997
        output_amount = amount * rate
        
        return jsonify({
            'status': 'success',
            'quote': {
                'from_token': from_token,
                'to_token': to_token,
                'input_amount': amount,
                'output_amount': output_amount,
                'rate': rate,
                'fee_percentage': 0.3,
                'price_impact': 0.1,
                'valid_until': (datetime.now() + timedelta(minutes=5)).isoformat()
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/staking/opportunities', methods=['GET'])
def get_staking_opportunities():
    """Get available staking opportunities"""
    try:
        opportunities = [
            {
                'protocol': 'TEOS Staking',
                'token': 'TEOS',
                'apy': 12.5,
                'tvl': 2400000,
                'risk_level': 'low',
                'min_stake': 100,
                'lock_period': 0,
                'description': 'Stake TEOS tokens to secure the network and earn rewards'
            },
            {
                'protocol': 'Pharaoh Vault',
                'token': 'TEOS',
                'apy': 18.2,
                'tvl': 890000,
                'risk_level': 'medium',
                'min_stake': 500,
                'lock_period': 30,
                'description': 'High-yield vault with 30-day lock period'
            },
            {
                'protocol': 'SOL Staking',
                'token': 'SOL',
                'apy': 7.2,
                'tvl': 15000000,
                'risk_level': 'low',
                'min_stake': 1,
                'lock_period': 0,
                'description': 'Native Solana staking with validator rewards'
            },
            {
                'protocol': 'ETH 2.0 Staking',
                'token': 'ETH',
                'apy': 5.8,
                'tvl': 45000000,
                'risk_level': 'low',
                'min_stake': 0.1,
                'lock_period': 0,
                'description': 'Ethereum 2.0 proof-of-stake rewards'
            }
        ]
        
        return jsonify({
            'status': 'success',
            'opportunities': opportunities,
            'total_protocols': len(opportunities)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/prices', methods=['GET'])
def get_prices():
    """Get current cryptocurrency prices"""
    try:
        prices = get_current_prices()
        
        # Add 24h change simulation
        price_data = {}
        for symbol, price in prices.items():
            change_24h = (hash(symbol) % 20 - 10) / 100  # -10% to +10%
            price_data[symbol] = {
                'price': price,
                'change_24h': change_24h,
                'volume_24h': price * 1000000 * (1 + abs(change_24h))
            }
        
        return jsonify({
            'status': 'success',
            'prices': price_data,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/networks', methods=['GET'])
def get_networks():
    """Get supported networks"""
    try:
        return jsonify({
            'status': 'success',
            'networks': networks,
            'count': len(networks)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/transaction/<tx_hash>', methods=['GET'])
def get_transaction(tx_hash):
    """Get transaction details"""
    try:
        if tx_hash in transactions:
            transaction = transactions[tx_hash]
            # Simulate transaction confirmation
            if transaction['status'] == 'pending':
                transaction['status'] = 'completed'
                transaction['confirmations'] = 12
            
            return jsonify({
                'status': 'success',
                'transaction': transaction
            })
        else:
            return jsonify({'error': 'Transaction not found'}), 404
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/mining/rewards/<wallet_id>', methods=['GET'])
def get_mining_rewards(wallet_id):
    """Get mining rewards for TEOS"""
    try:
        if wallet_id not in wallets:
            return jsonify({'error': 'Wallet not found'}), 404
        
        # Mock mining rewards
        rewards = {
            'daily_reward': 75,
            'total_mined': 2450,
            'mining_power': 125.5,
            'next_reward_in': '2h 15m',
            'tier': 'Pharaoh',
            'multiplier': 1.5
        }
        
        return jsonify({
            'status': 'success',
            'rewards': rewards
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/nft/collection/<wallet_id>', methods=['GET'])
def get_nft_collection(wallet_id):
    """Get NFT collection for wallet"""
    try:
        if wallet_id not in wallets:
            return jsonify({'error': 'Wallet not found'}), 404
        
        # Mock NFT collection
        nfts = [
            {
                'id': 'pharaoh_001',
                'name': 'Golden Pharaoh Mask',
                'collection': 'Egyptian Artifacts',
                'image': '/api/nft/image/pharaoh_001',
                'rarity': 'Legendary',
                'value': 2.5
            },
            {
                'id': 'pyramid_042',
                'name': 'Great Pyramid Blueprint',
                'collection': 'Ancient Architecture',
                'image': '/api/nft/image/pyramid_042',
                'rarity': 'Epic',
                'value': 1.2
            }
        ]
        
        return jsonify({
            'status': 'success',
            'nfts': nfts,
            'count': len(nfts)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Error Handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# Health Check
@app.route('/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

if __name__ == '__main__':
    # Create upload directory
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    print("🏛️ TEOS Wallet Backend Starting...")
    print("From Egypt to the World - Powering the Digital Pharaohs")
    print(f"API Documentation: http://localhost:5000/")
    
    app.run(host='0.0.0.0', port=5000, debug=True)

