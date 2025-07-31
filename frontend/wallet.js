// TEOS Wallet JavaScript - Advanced Multi-Chain Wallet
class TeosWallet {
    constructor() {
        this.isConnected = false;
        this.showBalance = true;
        this.currentNetwork = 'solana';
        this.walletAddress = '';
        this.networks = [
            { id: 'solana', name: 'Solana', symbol: 'SOL', balance: 12.45, price: 98.32, icon: 'S' },
            { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', balance: 0.85, price: 2847.52, icon: 'E' },
            { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', balance: 0.0234, price: 43250.00, icon: 'B' },
            { id: 'teos', name: 'TEOS', symbol: 'TEOS', balance: 15420.50, price: 0.0045, icon: 'T' }
        ];
        this.transactions = [
            { id: 1, type: 'receive', amount: '+50 TEOS', from: 'Mining Rewards', time: '2 min ago', status: 'completed', hash: '0x1234...5678' },
            { id: 2, type: 'send', amount: '-0.1 SOL', to: 'DeFi Staking', time: '1 hour ago', status: 'completed', hash: '0x2345...6789' },
            { id: 3, type: 'swap', amount: '100 USDC → 0.035 ETH', to: 'DEX Swap', time: '3 hours ago', status: 'completed', hash: '0x3456...7890' },
            { id: 4, type: 'receive', amount: '+25 TEOS', from: 'Pharaoh Rewards', time: '1 day ago', status: 'completed', hash: '0x4567...8901' }
        ];
        this.init();
    }

    init() {
        this.updateNetworkBalances();
        this.updateAssetList();
        this.updateTransactionList();
        this.updateTotalBalance();
        
        // Auto-refresh data every 30 seconds
        setInterval(() => {
            if (this.isConnected) {
                this.refreshData();
            }
        }, 30000);
    }

    // Wallet Connection Methods
    async connectWallet(type) {
        this.showMessage('Connecting wallet...', 'info');
        
        // Simulate connection process
        await this.delay(2000);
        
        try {
            switch (type) {
                case 'mobile':
                    this.walletAddress = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkv';
                    break;
                case 'hardware':
                    this.walletAddress = 'HW9xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkv';
                    break;
                case 'qr':
                    this.walletAddress = 'QR8xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkv';
                    break;
            }
            
            this.isConnected = true;
            document.getElementById('connect-section').classList.add('hidden');
            document.getElementById('wallet-dashboard').classList.remove('hidden');
            document.getElementById('wallet-address').textContent = this.walletAddress;
            
            this.showMessage('Wallet connected successfully!', 'success');
            this.refreshData();
            
        } catch (error) {
            this.showMessage('Failed to connect wallet. Please try again.', 'error');
        }
    }

    // Balance and Display Methods
    toggleBalance() {
        this.showBalance = !this.showBalance;
        const icon = document.getElementById('balance-toggle');
        icon.className = this.showBalance ? 'fas fa-eye' : 'fas fa-eye-slash';
        this.updateTotalBalance();
        this.updateNetworkBalances();
        this.updateAssetList();
    }

    updateTotalBalance() {
        const total = this.networks.reduce((sum, network) => sum + (network.balance * network.price), 0);
        const balanceElement = document.getElementById('total-balance');
        balanceElement.textContent = this.showBalance ? `$${total.toLocaleString()}` : '••••••';
    }

    updateNetworkBalances() {
        const container = document.getElementById('network-balances');
        container.innerHTML = '';
        
        this.networks.forEach(network => {
            const div = document.createElement('div');
            div.className = 'text-center p-3 rounded-lg bg-gray-50 hover-lift cursor-pointer';
            div.onclick = () => this.selectNetwork(network.id);
            div.innerHTML = `
                <div class="font-semibold text-sm">${network.symbol}</div>
                <div class="text-xs text-gray-600">
                    ${this.showBalance ? network.balance.toFixed(4) : '••••'}
                </div>
                <div class="text-xs text-green-600">
                    $${network.price.toLocaleString()}
                </div>
                <div class="network-status ${this.getNetworkStatus(network.id)}"></div>
            `;
            container.appendChild(div);
        });
    }

    updateAssetList() {
        const container = document.getElementById('asset-list');
        container.innerHTML = '';
        
        this.networks.forEach(network => {
            const div = document.createElement('div');
            div.className = 'flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer hover-lift';
            div.onclick = () => this.showAssetDetails(network);
            div.innerHTML = `
                <div class="flex items-center space-x-3">
                    <div class="network-badge">${network.icon}</div>
                    <div>
                        <div class="font-semibold">${network.name}</div>
                        <div class="text-sm text-gray-600">${network.symbol}</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-semibold">
                        ${this.showBalance ? network.balance.toFixed(4) : '••••'}
                    </div>
                    <div class="text-sm text-gray-600">
                        $${this.showBalance ? (network.balance * network.price).toFixed(2) : '••••'}
                    </div>
                </div>
            `;
            container.appendChild(div);
        });
    }

    updateTransactionList() {
        const container = document.getElementById('transaction-list');
        container.innerHTML = '';
        
        this.transactions.forEach(tx => {
            const div = document.createElement('div');
            div.className = 'flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer hover-lift';
            div.onclick = () => this.showTransactionDetails(tx);
            
            const iconClass = tx.type === 'receive' ? 'tx-receive' : 
                             tx.type === 'send' ? 'tx-send' : 'tx-swap';
            const icon = tx.type === 'receive' ? '↓' : 
                        tx.type === 'send' ? '↑' : '↔';
            
            div.innerHTML = `
                <div class="flex items-center space-x-3">
                    <div class="tx-icon ${iconClass}">${icon}</div>
                    <div>
                        <div class="font-semibold">${tx.amount}</div>
                        <div class="text-sm text-gray-600">
                            ${tx.type === 'receive' ? `From ${tx.from}` : 
                              tx.type === 'send' ? `To ${tx.to}` : tx.to}
                        </div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-sm text-gray-600">${tx.time}</div>
                    <div class="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                        ${tx.status}
                    </div>
                </div>
            `;
            container.appendChild(div);
        });
    }

    // Transaction Methods
    async sendCrypto() {
        const modal = this.createModal('Send Cryptocurrency', `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">To Address</label>
                    <input type="text" id="send-address" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Enter recipient address">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <input type="number" id="send-amount" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="0.00">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Asset</label>
                    <select id="send-asset" class="w-full p-3 border border-gray-300 rounded-lg">
                        ${this.networks.map(n => `<option value="${n.id}">${n.symbol}</option>`).join('')}
                    </select>
                </div>
                <button onclick="wallet.executeSend()" class="w-full btn-primary">Send Transaction</button>
            </div>
        `);
        this.showModal(modal);
    }

    async executeSend() {
        const address = document.getElementById('send-address').value;
        const amount = document.getElementById('send-amount').value;
        const asset = document.getElementById('send-asset').value;
        
        if (!address || !amount) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }
        
        this.showMessage('Processing transaction...', 'info');
        await this.delay(3000);
        
        // Simulate transaction
        const network = this.networks.find(n => n.id === asset);
        if (network && network.balance >= parseFloat(amount)) {
            network.balance -= parseFloat(amount);
            this.addTransaction('send', `-${amount} ${network.symbol}`, address, 'just now', 'pending');
            this.showMessage('Transaction sent successfully!', 'success');
            this.updateTotalBalance();
            this.updateNetworkBalances();
            this.updateAssetList();
            this.updateTransactionList();
        } else {
            this.showMessage('Insufficient balance', 'error');
        }
        
        this.hideModal();
    }

    receiveCrypto() {
        const modal = this.createModal('Receive Cryptocurrency', `
            <div class="text-center space-y-4">
                <div class="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                    <i class="fas fa-qrcode text-6xl text-gray-400"></i>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg">
                    <div class="font-mono text-sm break-all">${this.walletAddress}</div>
                </div>
                <button onclick="wallet.copyAddress()" class="btn-primary">
                    <i class="fas fa-copy mr-2"></i>Copy Address
                </button>
                <p class="text-sm text-gray-600">
                    Share this address to receive payments on all supported networks
                </p>
            </div>
        `);
        this.showModal(modal);
    }

    swapCrypto() {
        const modal = this.createModal('Swap Cryptocurrency', `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">From</label>
                    <select id="swap-from" class="w-full p-3 border border-gray-300 rounded-lg">
                        ${this.networks.map(n => `<option value="${n.id}">${n.symbol} (${n.balance.toFixed(4)})</option>`).join('')}
                    </select>
                </div>
                <div class="text-center">
                    <button class="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                        <i class="fas fa-exchange-alt"></i>
                    </button>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">To</label>
                    <select id="swap-to" class="w-full p-3 border border-gray-300 rounded-lg">
                        ${this.networks.map(n => `<option value="${n.id}">${n.symbol}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <input type="number" id="swap-amount" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="0.00">
                </div>
                <button onclick="wallet.executeSwap()" class="w-full btn-primary">Swap Tokens</button>
            </div>
        `);
        this.showModal(modal);
    }

    async executeSwap() {
        this.showMessage('Processing swap...', 'info');
        await this.delay(3000);
        this.showMessage('Swap completed successfully!', 'success');
        this.hideModal();
    }

    stakeCrypto() {
        const modal = this.createModal('Stake Cryptocurrency', `
            <div class="space-y-4">
                <div class="text-center">
                    <i class="fas fa-coins text-4xl text-amber-600 mb-4"></i>
                    <h3 class="text-lg font-semibold mb-2">Staking Opportunities</h3>
                </div>
                <div class="space-y-3">
                    <div class="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div class="flex justify-between items-center">
                            <div>
                                <div class="font-semibold">TEOS Staking</div>
                                <div class="text-sm text-gray-600">Earn 12.5% APY</div>
                            </div>
                            <div class="text-green-600 font-semibold">12.5%</div>
                        </div>
                    </div>
                    <div class="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div class="flex justify-between items-center">
                            <div>
                                <div class="font-semibold">SOL Staking</div>
                                <div class="text-sm text-gray-600">Earn 7.2% APY</div>
                            </div>
                            <div class="text-green-600 font-semibold">7.2%</div>
                        </div>
                    </div>
                    <div class="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div class="flex justify-between items-center">
                            <div>
                                <div class="font-semibold">ETH Staking</div>
                                <div class="text-sm text-gray-600">Earn 5.8% APY</div>
                            </div>
                            <div class="text-green-600 font-semibold">5.8%</div>
                        </div>
                    </div>
                </div>
            </div>
        `);
        this.showModal(modal);
    }

    // Utility Methods
    copyAddress() {
        navigator.clipboard.writeText(this.walletAddress).then(() => {
            this.showMessage('Address copied to clipboard!', 'success');
        });
    }

    showQR() {
        const modal = this.createModal('QR Code', `
            <div class="text-center">
                <div class="w-64 h-64 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <i class="fas fa-qrcode text-8xl text-gray-400"></i>
                </div>
                <p class="text-sm text-gray-600">Scan this QR code to send payments</p>
            </div>
        `);
        this.showModal(modal);
    }

    showTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.add('hidden');
        });
        
        // Remove active class from all buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
            btn.classList.remove('border-amber-500', 'text-amber-600');
            btn.classList.add('border-transparent', 'text-gray-500');
        });
        
        // Show selected tab
        document.getElementById(`${tabName}-tab`).classList.remove('hidden');
        
        // Add active class to selected button
        event.target.classList.add('active');
        event.target.classList.add('border-amber-500', 'text-amber-600');
        event.target.classList.remove('border-transparent', 'text-gray-500');
    }

    selectNetwork(networkId) {
        this.currentNetwork = networkId;
        this.showMessage(`Switched to ${this.networks.find(n => n.id === networkId).name}`, 'info');
    }

    getNetworkStatus(networkId) {
        // Simulate network status
        const statuses = ['online', 'online', 'online', 'pending'];
        return statuses[Math.floor(Math.random() * statuses.length)];
    }

    addTransaction(type, amount, address, time, status) {
        const newTx = {
            id: this.transactions.length + 1,
            type,
            amount,
            [type === 'receive' ? 'from' : 'to']: address,
            time,
            status,
            hash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`
        };
        this.transactions.unshift(newTx);
    }

    async refreshData() {
        // Simulate data refresh
        this.showMessage('Refreshing data...', 'info');
        await this.delay(1000);
        
        // Update prices (simulate market changes)
        this.networks.forEach(network => {
            const change = (Math.random() - 0.5) * 0.1; // ±5% change
            network.price *= (1 + change);
        });
        
        this.updateTotalBalance();
        this.updateNetworkBalances();
        this.updateAssetList();
    }

    // Modal Methods
    createModal(title, content) {
        return `
            <div id="modal" class="modal" style="display: block;">
                <div class="modal-content">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">${title}</h3>
                        <span class="close" onclick="wallet.hideModal()">&times;</span>
                    </div>
                    ${content}
                </div>
            </div>
        `;
    }

    showModal(modalHTML) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    hideModal() {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.remove();
        }
    }

    // Message System
    showMessage(text, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type} fixed top-4 right-4 z-50 max-w-sm`;
        messageDiv.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} mr-2"></i>
                ${text}
            </div>
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showAssetDetails(network) {
        const modal = this.createModal(`${network.name} Details`, `
            <div class="space-y-4">
                <div class="text-center">
                    <div class="network-badge w-16 h-16 text-2xl mx-auto mb-4">${network.icon}</div>
                    <h3 class="text-xl font-semibold">${network.name}</h3>
                    <p class="text-gray-600">${network.symbol}</p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="text-center p-3 bg-gray-50 rounded-lg">
                        <div class="text-sm text-gray-600">Balance</div>
                        <div class="font-semibold">${network.balance.toFixed(4)} ${network.symbol}</div>
                    </div>
                    <div class="text-center p-3 bg-gray-50 rounded-lg">
                        <div class="text-sm text-gray-600">Value</div>
                        <div class="font-semibold">$${(network.balance * network.price).toFixed(2)}</div>
                    </div>
                    <div class="text-center p-3 bg-gray-50 rounded-lg">
                        <div class="text-sm text-gray-600">Price</div>
                        <div class="font-semibold">$${network.price.toFixed(2)}</div>
                    </div>
                    <div class="text-center p-3 bg-gray-50 rounded-lg">
                        <div class="text-sm text-gray-600">24h Change</div>
                        <div class="font-semibold text-green-600">+5.2%</div>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button onclick="wallet.sendCrypto()" class="flex-1 btn-primary">Send</button>
                    <button onclick="wallet.receiveCrypto()" class="flex-1 btn-secondary">Receive</button>
                </div>
            </div>
        `);
        this.showModal(modal);
    }

    showTransactionDetails(tx) {
        const modal = this.createModal('Transaction Details', `
            <div class="space-y-4">
                <div class="text-center">
                    <div class="tx-icon ${tx.type === 'receive' ? 'tx-receive' : tx.type === 'send' ? 'tx-send' : 'tx-swap'} w-16 h-16 text-2xl mx-auto mb-4">
                        ${tx.type === 'receive' ? '↓' : tx.type === 'send' ? '↑' : '↔'}
                    </div>
                    <h3 class="text-xl font-semibold">${tx.amount}</h3>
                    <p class="text-gray-600">${tx.time}</p>
                </div>
                <div class="space-y-2">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Status:</span>
                        <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">${tx.status}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Hash:</span>
                        <span class="font-mono text-sm">${tx.hash}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">${tx.type === 'receive' ? 'From:' : 'To:'}</span>
                        <span class="text-sm">${tx.from || tx.to}</span>
                    </div>
                </div>
                <button onclick="wallet.copyTransactionHash('${tx.hash}')" class="w-full btn-secondary">
                    <i class="fas fa-copy mr-2"></i>Copy Transaction Hash
                </button>
            </div>
        `);
        this.showModal(modal);
    }

    copyTransactionHash(hash) {
        navigator.clipboard.writeText(hash).then(() => {
            this.showMessage('Transaction hash copied!', 'success');
        });
    }
}

// Global wallet instance
const wallet = new TeosWallet();

// Global functions for HTML onclick events
function connectWallet(type) {
    wallet.connectWallet(type);
}

function toggleBalance() {
    wallet.toggleBalance();
}

function sendCrypto() {
    wallet.sendCrypto();
}

function receiveCrypto() {
    wallet.receiveCrypto();
}

function swapCrypto() {
    wallet.swapCrypto();
}

function stakeCrypto() {
    wallet.stakeCrypto();
}

function showTab(tabName) {
    wallet.showTab(tabName);
}

function copyAddress() {
    wallet.copyAddress();
}

function showQR() {
    wallet.showQR();
}

// Initialize wallet when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('TEOS Wallet initialized - From Egypt to the World! 🏛️');
});

