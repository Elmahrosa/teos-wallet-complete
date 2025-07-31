#!/bin/bash

# TEOS Wallet Deployment Script
# From Egypt to the World - Powering the Digital Pharaohs

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="TEOS Wallet"
DOMAIN="wallet.teosegypt.com"
BACKUP_DIR="/var/backups/teos-wallet"
LOG_FILE="/var/log/teos-wallet/deploy.log"

# Functions
log() {
    echo -e "${CYAN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$LOG_FILE"
}

# Banner
echo -e "${PURPLE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    TEOS Wallet Deployment                   ║"
echo "║                 From Egypt to the World                     ║"
echo "║              Powering the Digital Pharaohs                  ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root for security reasons"
fi

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        error "Python 3 is not installed"
    fi
    
    # Check pip
    if ! command -v pip3 &> /dev/null; then
        error "pip3 is not installed"
    fi
    
    # Check git
    if ! command -v git &> /dev/null; then
        error "Git is not installed"
    fi
    
    # Check nginx (optional)
    if ! command -v nginx &> /dev/null; then
        warning "Nginx is not installed - required for production deployment"
    fi
    
    success "Prerequisites check completed"
}

# Create necessary directories
create_directories() {
    log "Creating necessary directories..."
    
    sudo mkdir -p /var/log/teos-wallet
    sudo mkdir -p /var/backups/teos-wallet
    sudo mkdir -p /etc/teos-wallet
    
    # Set permissions
    sudo chown $USER:$USER /var/log/teos-wallet
    sudo chown $USER:$USER /var/backups/teos-wallet
    
    success "Directories created successfully"
}

# Backup existing installation
backup_existing() {
    if [ -d "/var/www/teos-wallet" ]; then
        log "Backing up existing installation..."
        
        BACKUP_NAME="teos-wallet-backup-$(date +%Y%m%d_%H%M%S)"
        sudo cp -r /var/www/teos-wallet "$BACKUP_DIR/$BACKUP_NAME"
        
        success "Backup created: $BACKUP_DIR/$BACKUP_NAME"
    else
        info "No existing installation found"
    fi
}

# Install Python dependencies
install_python_deps() {
    log "Installing Python dependencies..."
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "backend/venv" ]; then
        python3 -m venv backend/venv
    fi
    
    # Activate virtual environment and install dependencies
    source backend/venv/bin/activate
    pip install --upgrade pip
    pip install -r backend/requirements.txt
    
    success "Python dependencies installed"
}

# Configure environment
configure_environment() {
    log "Configuring environment..."
    
    # Create .env file if it doesn't exist
    if [ ! -f "backend/.env" ]; then
        cat > backend/.env << EOF
FLASK_ENV=production
SECRET_KEY=$(openssl rand -hex 32)
DATABASE_URL=sqlite:///teos_wallet.db
REDIS_URL=redis://localhost:6379/0
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
BITCOIN_RPC_URL=https://blockstream.info/api
CORS_ORIGINS=https://$DOMAIN
EOF
        warning "Created default .env file - please update with your configuration"
    fi
    
    success "Environment configured"
}

# Build frontend
build_frontend() {
    log "Building frontend..."
    
    cd frontend
    
    # Minify CSS and JavaScript
    if command -v minify &> /dev/null; then
        minify styles.css > styles.min.css
        minify wallet.js > wallet.min.js
        
        # Update HTML to use minified files
        sed -i.bak 's/styles\.css/styles.min.css/g' index.html
        sed -i.bak 's/wallet\.js/wallet.min.js/g' index.html
        
        success "Frontend assets minified"
    else
        warning "Minify tool not found - serving unminified assets"
    fi
    
    cd ..
}

# Setup systemd service
setup_systemd_service() {
    log "Setting up systemd service..."
    
    sudo tee /etc/systemd/system/teos-wallet.service > /dev/null << EOF
[Unit]
Description=TEOS Wallet Backend
After=network.target

[Service]
Type=simple
User=$USER
Group=$USER
WorkingDirectory=$(pwd)/backend
Environment=PATH=$(pwd)/backend/venv/bin
ExecStart=$(pwd)/backend/venv/bin/python app.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
    
    sudo systemctl daemon-reload
    sudo systemctl enable teos-wallet
    
    success "Systemd service configured"
}

# Configure nginx
configure_nginx() {
    if command -v nginx &> /dev/null; then
        log "Configuring Nginx..."
        
        sudo tee /etc/nginx/sites-available/teos-wallet > /dev/null << EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    # Redirect HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN;
    
    # SSL configuration (update paths as needed)
    ssl_certificate /etc/ssl/certs/teos-wallet.crt;
    ssl_certificate_key /etc/ssl/private/teos-wallet.key;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Frontend
    location / {
        root $(pwd)/frontend;
        index index.html;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Health check
    location /health {
        proxy_pass http://127.0.0.1:5000;
        access_log off;
    }
}
EOF
        
        # Enable site
        sudo ln -sf /etc/nginx/sites-available/teos-wallet /etc/nginx/sites-enabled/
        
        # Test nginx configuration
        if sudo nginx -t; then
            success "Nginx configured successfully"
        else
            error "Nginx configuration test failed"
        fi
    else
        warning "Nginx not installed - skipping web server configuration"
    fi
}

# Start services
start_services() {
    log "Starting services..."
    
    # Start backend service
    sudo systemctl start teos-wallet
    
    # Check if service started successfully
    if sudo systemctl is-active --quiet teos-wallet; then
        success "TEOS Wallet backend started successfully"
    else
        error "Failed to start TEOS Wallet backend"
    fi
    
    # Reload nginx if available
    if command -v nginx &> /dev/null; then
        sudo systemctl reload nginx
        success "Nginx reloaded"
    fi
}

# Health check
health_check() {
    log "Performing health check..."
    
    # Wait for service to start
    sleep 5
    
    # Check backend health
    if curl -f http://localhost:5000/health > /dev/null 2>&1; then
        success "Backend health check passed"
    else
        error "Backend health check failed"
    fi
    
    # Check if frontend is accessible
    if [ -f "frontend/index.html" ]; then
        success "Frontend files are accessible"
    else
        error "Frontend files not found"
    fi
}

# Setup monitoring
setup_monitoring() {
    log "Setting up monitoring..."
    
    # Create health check script
    sudo tee /usr/local/bin/teos-health-check.sh > /dev/null << 'EOF'
#!/bin/bash
HEALTH_URL="http://localhost:5000/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ $RESPONSE -eq 200 ]; then
    echo "$(date): Health check passed"
else
    echo "$(date): Health check failed with code $RESPONSE"
    systemctl restart teos-wallet
fi
EOF
    
    sudo chmod +x /usr/local/bin/teos-health-check.sh
    
    # Add to crontab
    (crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/teos-health-check.sh >> /var/log/teos-wallet/health.log") | crontab -
    
    success "Monitoring configured"
}

# Setup log rotation
setup_log_rotation() {
    log "Setting up log rotation..."
    
    sudo tee /etc/logrotate.d/teos-wallet > /dev/null << EOF
/var/log/teos-wallet/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        systemctl reload teos-wallet
    endscript
}
EOF
    
    success "Log rotation configured"
}

# Main deployment function
deploy() {
    log "Starting TEOS Wallet deployment..."
    
    check_prerequisites
    create_directories
    backup_existing
    install_python_deps
    configure_environment
    build_frontend
    setup_systemd_service
    configure_nginx
    start_services
    health_check
    setup_monitoring
    setup_log_rotation
    
    success "TEOS Wallet deployment completed successfully!"
    
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                 Deployment Successful! 🎉                   ║"
    echo "║                                                              ║"
    echo "║  Your TEOS Wallet is now running at:                        ║"
    echo "║  • Frontend: http://localhost:8000                          ║"
    echo "║  • Backend API: http://localhost:5000                       ║"
    echo "║  • Health Check: http://localhost:5000/health               ║"
    echo "║                                                              ║"
    echo "║  From Egypt to the World - Powering Digital Pharaohs! 🏛️    ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    info "Next steps:"
    echo "1. Update backend/.env with your configuration"
    echo "2. Configure SSL certificates for production"
    echo "3. Set up database backups"
    echo "4. Configure monitoring and alerting"
    echo "5. Test all wallet functionality"
    
    info "Useful commands:"
    echo "• Check service status: sudo systemctl status teos-wallet"
    echo "• View logs: sudo journalctl -u teos-wallet -f"
    echo "• Restart service: sudo systemctl restart teos-wallet"
    echo "• Health check: curl http://localhost:5000/health"
}

# Handle command line arguments
case "${1:-deploy}" in
    "deploy")
        deploy
        ;;
    "start")
        log "Starting TEOS Wallet services..."
        sudo systemctl start teos-wallet
        success "Services started"
        ;;
    "stop")
        log "Stopping TEOS Wallet services..."
        sudo systemctl stop teos-wallet
        success "Services stopped"
        ;;
    "restart")
        log "Restarting TEOS Wallet services..."
        sudo systemctl restart teos-wallet
        success "Services restarted"
        ;;
    "status")
        sudo systemctl status teos-wallet
        ;;
    "logs")
        sudo journalctl -u teos-wallet -f
        ;;
    "health")
        curl -f http://localhost:5000/health && echo "✅ Healthy" || echo "❌ Unhealthy"
        ;;
    "backup")
        backup_existing
        ;;
    "help")
        echo "TEOS Wallet Deployment Script"
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  deploy   - Full deployment (default)"
        echo "  start    - Start services"
        echo "  stop     - Stop services"
        echo "  restart  - Restart services"
        echo "  status   - Show service status"
        echo "  logs     - Show service logs"
        echo "  health   - Check service health"
        echo "  backup   - Backup current installation"
        echo "  help     - Show this help"
        ;;
    *)
        error "Unknown command: $1. Use '$0 help' for usage information."
        ;;
esac

