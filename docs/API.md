# TEOS Wallet API Documentation

## 🌟 Overview

The TEOS Wallet API provides comprehensive access to multi-chain wallet functionality, enabling developers to build applications that interact with the TEOS ecosystem. This RESTful API supports wallet management, transactions, DeFi operations, and Egyptian heritage features.

**Base URL**: `https://wallet.teosegypt.com/api`

## 🔐 Authentication

### API Key Authentication
```http
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

### Request Headers
```javascript
{
  "Authorization": "Bearer YOUR_API_KEY",
  "Content-Type": "application/json",
  "X-Client-Version": "1.0.0",
  "X-Request-ID": "unique-request-id"
}
```

## 📊 Response Format

### Success Response
```json
{
  "status": "success",
  "data": {
    // Response data
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "request_id": "req_123456789"
}
```

### Error Response
```json
{
  "status": "error",
  "error": {
    "code": "INVALID_ADDRESS",
    "message": "The provided wallet address is invalid",
    "details": "Address must be 32-44 characters for Solana network"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "request_id": "req_123456789"
}
```

## 🏛️ Core Endpoints

### 1. Wallet Management

#### Create Wallet
Creates a new wallet for the specified network.

```http
POST /api/wallet/create
```

**Request Body:**
```json
{
  "type": "mobile",
  "network": "solana",
  "name": "My TEOS Wallet",
  "metadata": {
    "device_id": "device_123",
    "app_version": "1.0.0"
  }
}
```

**Parameters:**
- `type` (string, required): Wallet type - `mobile`, `hardware`, `qr`
- `network` (string, required): Primary network - `solana`, `ethereum`, `bitcoin`, `teos`
- `name` (string, optional): Wallet display name
- `metadata` (object, optional): Additional wallet metadata

**Response:**
```json
{
  "status": "success",
  "data": {
    "wallet_id": "wallet_7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkv",
    "address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkv",
    "network": "solana",
    "type": "mobile",
    "created_at": "2024-01-15T10:30:00Z",
    "public_key": "0x1234567890abcdef...",
    "supported_networks": ["solana", "ethereum", "bitcoin", "teos"]
  }
}
```

#### Get Wallet Info
Retrieves detailed information about a specific wallet.

```http
GET /api/wallet/{wallet_id}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "wallet_id": "wallet_7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkv",
    "address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkv",
    "network": "solana",
    "type": "mobile",
    "name": "My TEOS Wallet",
    "created_at": "2024-01-15T10:30:00Z",
    "last_activity": "2024-01-15T15:45:00Z",
    "status": "active",
    "security_level": "high",
    "supported_features": [
      "multi_signature",
      "hardware_integration",
      "defi_protocols",
      "nft_support"
    ]
  }
}
```

### 2. Balance and Portfolio

#### Get Wallet Balance
Retrieves balance information for all supported assets.

```http
GET /api/wallet/{wallet_id}/balance
```

**Query Parameters:**
- `include_fiat` (boolean, optional): Include fiat value calculations
- `currency` (string, optional): Fiat currency for conversion (default: USD)

**Response:**
```json
{
  "status": "success",
  "data": {
    "wallet_id": "wallet_7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkv",
    "total_value": {
      "usd": 2847.52,
      "change_24h": 125.30,
      "change_percentage_24h": 4.58
    },
    "balances": [
      {
        "symbol": "SOL",
        "name": "Solana",
        "balance": "12.45000000",
        "decimals": 9,
        "network": "solana",
        "price_usd": 98.32,
        "value_usd": 1224.28,
        "change_24h": 5.2,
        "logo_url": "https://assets.teosegypt.com/tokens/sol.png"
      },
      {
        "symbol": "TEOS",
        "name": "TEOS Token",
        "balance": "15420.500000",
        "decimals": 6,
        "network": "solana",
        "price_usd": 0.0045,
        "value_usd": 69.39,
        "change_24h": 12.8,
        "logo_url": "https://assets.teosegypt.com/tokens/teos.png",
        "contract_address": "AhXBUQmbhv9dNoZCiMYmXF4Gyi1cjQthWHFhTL2CJaSo"
      }
    ],
    "last_updated": "2024-01-15T15:45:00Z"
  }
}
```

#### Get Portfolio Analytics
Provides detailed portfolio analytics and performance metrics.

```http
GET /api/wallet/{wallet_id}/analytics
```

**Query Parameters:**
- `period` (string, optional): Time period - `24h`, `7d`, `30d`, `90d`, `1y`
- `include_defi` (boolean, optional): Include DeFi positions

**Response:**
```json
{
  "status": "success",
  "data": {
    "portfolio_value": {
      "current": 2847.52,
      "previous": 2722.22,
      "change": 125.30,
      "change_percentage": 4.58
    },
    "asset_allocation": [
      {
        "symbol": "SOL",
        "percentage": 43.0,
        "value": 1224.28
      },
      {
        "symbol": "ETH",
        "percentage": 35.2,
        "value": 1002.33
      },
      {
        "symbol": "TEOS",
        "percentage": 21.8,
        "value": 620.91
      }
    ],
    "performance_metrics": {
      "total_return": 15.6,
      "annualized_return": 23.4,
      "volatility": 12.8,
      "sharpe_ratio": 1.83,
      "max_drawdown": -8.2
    },
    "defi_positions": [
      {
        "protocol": "TEOS Staking",
        "position_value": 500.00,
        "apy": 12.5,
        "rewards_earned": 15.62
      }
    ]
  }
}
```

### 3. Transactions

#### Send Transaction
Initiates a cryptocurrency transaction.

```http
POST /api/wallet/{wallet_id}/send
```

**Request Body:**
```json
{
  "to_address": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
  "amount": "1.5",
  "symbol": "SOL",
  "network": "solana",
  "memo": "Payment for services",
  "priority_fee": "auto",
  "metadata": {
    "category": "payment",
    "reference": "inv_123456"
  }
}
```

**Parameters:**
- `to_address` (string, required): Recipient wallet address
- `amount` (string, required): Amount to send (as string to preserve precision)
- `symbol` (string, required): Token symbol
- `network` (string, required): Blockchain network
- `memo` (string, optional): Transaction memo/note
- `priority_fee` (string, optional): Fee priority - `low`, `medium`, `high`, `auto`
- `metadata` (object, optional): Additional transaction metadata

**Response:**
```json
{
  "status": "success",
  "data": {
    "transaction_id": "tx_5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    "hash": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    "from_address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkv",
    "to_address": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    "amount": "1.5",
    "symbol": "SOL",
    "network": "solana",
    "status": "pending",
    "fee": "0.000005",
    "estimated_confirmation_time": 30,
    "created_at": "2024-01-15T15:45:00Z",
    "explorer_url": "https://explorer.solana.com/tx/5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
  }
}
```

#### Get Transaction History
Retrieves transaction history for a wallet.

```http
GET /api/wallet/{wallet_id}/transactions
```

**Query Parameters:**
- `limit` (integer, optional): Number of transactions to return (default: 50, max: 200)
- `offset` (integer, optional): Pagination offset
- `type` (string, optional): Transaction type filter - `send`, `receive`, `swap`, `stake`
- `symbol` (string, optional): Token symbol filter
- `status` (string, optional): Status filter - `pending`, `completed`, `failed`
- `from_date` (string, optional): Start date (ISO 8601)
- `to_date` (string, optional): End date (ISO 8601)

**Response:**
```json
{
  "status": "success",
  "data": {
    "transactions": [
      {
        "transaction_id": "tx_5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
        "hash": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
        "type": "send",
        "from_address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkv",
        "to_address": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
        "amount": "1.5",
        "symbol": "SOL",
        "network": "solana",
        "status": "completed",
        "fee": "0.000005",
        "confirmations": 32,
        "block_number": 123456789,
        "timestamp": "2024-01-15T15:45:00Z",
        "memo": "Payment for services",
        "explorer_url": "https://explorer.solana.com/tx/5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
      }
    ],
    "pagination": {
      "total": 150,
      "limit": 50,
      "offset": 0,
      "has_more": true
    }
  }
}
```

#### Get Transaction Details
Retrieves detailed information about a specific transaction.

```http
GET /api/transaction/{transaction_id}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "transaction_id": "tx_5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    "hash": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    "type": "send",
    "from_address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkv",
    "to_address": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    "amount": "1.5",
    "symbol": "SOL",
    "network": "solana",
    "status": "completed",
    "fee": "0.000005",
    "confirmations": 32,
    "block_number": 123456789,
    "timestamp": "2024-01-15T15:45:00Z",
    "memo": "Payment for services",
    "gas_used": "21000",
    "gas_price": "0.000000001",
    "nonce": 42,
    "raw_transaction": "0x...",
    "receipt": {
      "status": "success",
      "logs": []
    },
    "explorer_url": "https://explorer.solana.com/tx/5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
  }
}
```

### 4. DeFi Operations

#### Get Swap Quote
Retrieves a quote for swapping between tokens.

```http
POST /api/swap/quote
```

**Request Body:**
```json
{
  "from_token": "SOL",
  "to_token": "USDC",
  "amount": "10",
  "slippage": "0.5",
  "network": "solana"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "quote_id": "quote_123456789",
    "from_token": "SOL",
    "to_token": "USDC",
    "input_amount": "10",
    "output_amount": "982.45",
    "exchange_rate": "98.245",
    "price_impact": "0.12",
    "slippage": "0.5",
    "fee": "0.3",
    "route": [
      {
        "dex": "Jupiter",
        "percentage": 60
      },
      {
        "dex": "Orca",
        "percentage": 40
      }
    ],
    "estimated_gas": "0.000012",
    "valid_until": "2024-01-15T16:00:00Z"
  }
}
```

#### Execute Swap
Executes a token swap using a previously obtained quote.

```http
POST /api/wallet/{wallet_id}/swap
```

**Request Body:**
```json
{
  "quote_id": "quote_123456789",
  "slippage_tolerance": "0.5",
  "deadline": "2024-01-15T16:00:00Z"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "transaction_id": "tx_swap_123456789",
    "hash": "3FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    "from_token": "SOL",
    "to_token": "USDC",
    "input_amount": "10",
    "output_amount": "982.45",
    "status": "pending",
    "estimated_confirmation_time": 45
  }
}
```

#### Get Staking Opportunities
Retrieves available staking opportunities across supported networks.

```http
GET /api/staking/opportunities
```

**Query Parameters:**
- `network` (string, optional): Filter by network
- `min_apy` (number, optional): Minimum APY filter
- `risk_level` (string, optional): Risk level filter - `low`, `medium`, `high`

**Response:**
```json
{
  "status": "success",
  "data": {
    "opportunities": [
      {
        "protocol": "TEOS Staking",
        "token": "TEOS",
        "network": "solana",
        "apy": 12.5,
        "tvl": 2400000,
        "risk_level": "low",
        "min_stake": "100",
        "lock_period": 0,
        "rewards_frequency": "daily",
        "description": "Stake TEOS tokens to secure the network and earn rewards",
        "features": [
          "liquid_staking",
          "auto_compound",
          "governance_voting"
        ]
      },
      {
        "protocol": "Pharaoh Vault",
        "token": "TEOS",
        "network": "solana",
        "apy": 18.2,
        "tvl": 890000,
        "risk_level": "medium",
        "min_stake": "500",
        "lock_period": 30,
        "rewards_frequency": "weekly",
        "description": "High-yield vault with 30-day lock period"
      }
    ],
    "total_protocols": 15,
    "total_tvl": 45000000
  }
}
```

#### Stake Tokens
Stakes tokens in a specified protocol.

```http
POST /api/wallet/{wallet_id}/stake
```

**Request Body:**
```json
{
  "protocol": "TEOS Staking",
  "amount": "1000",
  "duration": 0,
  "auto_compound": true
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "stake_id": "stake_123456789",
    "transaction_id": "tx_stake_123456789",
    "protocol": "TEOS Staking",
    "amount": "1000",
    "apy": 12.5,
    "estimated_rewards": "125",
    "status": "pending",
    "start_date": "2024-01-15T16:00:00Z",
    "end_date": null,
    "auto_compound": true
  }
}
```

### 5. NFT Operations

#### Get NFT Collection
Retrieves NFT collection for a wallet.

```http
GET /api/wallet/{wallet_id}/nfts
```

**Query Parameters:**
- `collection` (string, optional): Filter by collection address
- `limit` (integer, optional): Number of NFTs to return
- `offset` (integer, optional): Pagination offset

**Response:**
```json
{
  "status": "success",
  "data": {
    "nfts": [
      {
        "mint_address": "nft_7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkv",
        "name": "Golden Pharaoh Mask #001",
        "description": "A legendary artifact from the digital pharaohs",
        "image": "https://assets.teosegypt.com/nfts/pharaoh_001.png",
        "collection": {
          "name": "Egyptian Artifacts",
          "address": "collection_123456789",
          "verified": true
        },
        "attributes": [
          {
            "trait_type": "Rarity",
            "value": "Legendary"
          },
          {
            "trait_type": "Dynasty",
            "value": "Digital Pharaohs"
          }
        ],
        "rarity_rank": 1,
        "floor_price": 2.5,
        "last_sale_price": 3.2,
        "owner": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkv"
      }
    ],
    "total_count": 25,
    "total_value": 45.8
  }
}
```

### 6. Market Data

#### Get Token Prices
Retrieves current prices for supported tokens.

```http
GET /api/prices
```

**Query Parameters:**
- `symbols` (string, optional): Comma-separated list of symbols
- `currency` (string, optional): Fiat currency (default: USD)
- `include_24h_change` (boolean, optional): Include 24h change data

**Response:**
```json
{
  "status": "success",
  "data": {
    "prices": {
      "SOL": {
        "price": 98.32,
        "change_24h": 5.2,
        "change_percentage_24h": 5.58,
        "volume_24h": 1250000000,
        "market_cap": 42500000000,
        "last_updated": "2024-01-15T15:45:00Z"
      },
      "TEOS": {
        "price": 0.0045,
        "change_24h": 12.8,
        "change_percentage_24h": 15.2,
        "volume_24h": 2500000,
        "market_cap": 4500000,
        "last_updated": "2024-01-15T15:45:00Z"
      }
    }
  }
}
```

#### Get Market Analytics
Provides comprehensive market analytics for the TEOS ecosystem.

```http
GET /api/market/analytics
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "teos_metrics": {
      "price": 0.0045,
      "market_cap": 4500000,
      "circulating_supply": 1000000000,
      "total_supply": 10000000000,
      "volume_24h": 2500000,
      "holders": 15420,
      "transactions_24h": 8750
    },
    "ecosystem_metrics": {
      "total_wallets": 25000,
      "active_wallets_24h": 3200,
      "total_transactions": 1250000,
      "total_volume": 125000000,
      "staking_ratio": 0.35,
      "defi_tvl": 15000000
    },
    "egyptian_pioneers": {
      "total_pioneers": 5420,
      "pioneer_percentage": 21.68,
      "pioneer_rewards_distributed": 125000,
      "pioneer_governance_power": 0.45
    }
  }
}
```

## 🏛️ Egyptian Heritage Features

### Get Pioneer Status
Retrieves Egyptian Pioneer status for a wallet.

```http
GET /api/wallet/{wallet_id}/pioneer-status
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "is_pioneer": true,
    "pioneer_tier": "Pharaoh",
    "registration_date": "2024-01-01T00:00:00Z",
    "pioneer_id": "pioneer_123456",
    "benefits": {
      "enhanced_rewards": 1.5,
      "governance_multiplier": 2.0,
      "early_access": true,
      "cultural_nfts": true
    },
    "achievements": [
      {
        "name": "First Pioneer",
        "description": "Among the first 1000 Egyptian pioneers",
        "earned_date": "2024-01-01T00:00:00Z"
      }
    ],
    "rewards_earned": {
      "total_teos": 2500,
      "cultural_nfts": 3,
      "governance_tokens": 150
    }
  }
}
```

### Get Cultural Events
Retrieves upcoming Egyptian cultural events and NFT drops.

```http
GET /api/cultural/events
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "events": [
      {
        "event_id": "event_123456",
        "name": "Pharaoh's Treasury Opening",
        "description": "Exclusive NFT collection launch for Egyptian pioneers",
        "start_date": "2024-02-01T18:00:00Z",
        "end_date": "2024-02-07T18:00:00Z",
        "type": "nft_drop",
        "eligibility": "egyptian_pioneers",
        "rewards": {
          "exclusive_nfts": 5,
          "bonus_teos": 1000
        }
      }
    ]
  }
}
```

## 📊 Webhooks

### Webhook Configuration
Configure webhooks to receive real-time notifications.

```http
POST /api/webhooks
```

**Request Body:**
```json
{
  "url": "https://your-app.com/webhooks/teos",
  "events": [
    "transaction.completed",
    "transaction.failed",
    "balance.updated",
    "stake.reward",
    "nft.received"
  ],
  "secret": "your_webhook_secret"
}
```

### Webhook Events

#### Transaction Completed
```json
{
  "event": "transaction.completed",
  "data": {
    "wallet_id": "wallet_123456",
    "transaction_id": "tx_123456",
    "hash": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    "type": "send",
    "amount": "1.5",
    "symbol": "SOL",
    "status": "completed"
  },
  "timestamp": "2024-01-15T15:45:00Z"
}
```

## 🚨 Error Codes

| Code | Description |
|------|-------------|
| `INVALID_API_KEY` | API key is missing or invalid |
| `WALLET_NOT_FOUND` | Specified wallet does not exist |
| `INSUFFICIENT_BALANCE` | Wallet has insufficient balance for transaction |
| `INVALID_ADDRESS` | Wallet address format is invalid |
| `NETWORK_NOT_SUPPORTED` | Specified network is not supported |
| `TRANSACTION_FAILED` | Transaction failed to execute |
| `RATE_LIMIT_EXCEEDED` | API rate limit exceeded |
| `INVALID_PARAMETERS` | Request parameters are invalid |
| `MAINTENANCE_MODE` | API is temporarily unavailable |

## 📈 Rate Limits

| Endpoint Category | Rate Limit | Window |
|------------------|------------|---------|
| Wallet Operations | 100 requests | 1 minute |
| Transaction Queries | 200 requests | 1 minute |
| Market Data | 500 requests | 1 minute |
| DeFi Operations | 50 requests | 1 minute |
| Webhook Management | 10 requests | 1 minute |

## 🔧 SDKs and Libraries

### JavaScript/TypeScript
```bash
npm install @teosegypt/wallet-sdk
```

```javascript
import { TeosWallet } from '@teosegypt/wallet-sdk';

const wallet = new TeosWallet({
  apiKey: 'your_api_key',
  network: 'mainnet'
});

// Create wallet
const newWallet = await wallet.create({
  type: 'mobile',
  network: 'solana'
});

// Get balance
const balance = await wallet.getBalance(newWallet.wallet_id);
```

### Python
```bash
pip install teos-wallet-python
```

```python
from teos_wallet import TeosWallet

wallet = TeosWallet(api_key='your_api_key')

# Create wallet
new_wallet = wallet.create_wallet(
    type='mobile',
    network='solana'
)

# Send transaction
transaction = wallet.send_transaction(
    wallet_id=new_wallet['wallet_id'],
    to_address='9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    amount='1.5',
    symbol='SOL'
)
```

## 🧪 Testing

### Testnet Endpoints
**Base URL**: `https://testnet-wallet.teosegypt.com/api`

### Test Tokens
Request test tokens for development:

```http
POST /api/testnet/faucet
```

**Request Body:**
```json
{
  "wallet_address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkv",
  "token": "SOL",
  "amount": "10"
}
```

## 📞 Support

### API Support
- **Email**: api-support@teosegypt.com
- **Discord**: [#api-support](https://discord.gg/teosegypt)
- **Documentation**: [docs.teosegypt.com/api](https://docs.teosegypt.com/api)

### Status Page
Monitor API status and uptime: [status.teosegypt.com](https://status.teosegypt.com)

---

**Built with ❤️ in Egypt for the World**

*Empowering developers to build the future of finance with Egyptian heritage and global innovation.*

