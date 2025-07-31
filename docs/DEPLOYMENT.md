# TEOS Wallet Deployment Guide

## 🚀 Production Deployment for wallet.teosegypt.com

This comprehensive guide covers deploying TEOS Wallet to production environments with high availability, security, and performance optimization.

## 📋 Prerequisites

### System Requirements
- **Operating System**: Ubuntu 20.04 LTS or CentOS 8+
- **Memory**: Minimum 4GB RAM (8GB recommended)
- **Storage**: 50GB SSD storage minimum
- **CPU**: 2+ cores (4+ cores recommended)
- **Network**: High-speed internet connection with low latency

### Software Dependencies
- **Python 3.8+** with pip package manager
- **Node.js 16+** with npm/yarn
- **Nginx** for reverse proxy and load balancing
- **PostgreSQL 13+** for production database
- **Redis** for caching and session management
- **Docker** (optional) for containerized deployment

## 🏗️ Infrastructure Setup

### 1. Server Configuration

#### Initial Server Setup
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y python3 python3-pip nodejs npm nginx postgresql redis-server

# Configure firewall
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

#### SSL Certificate Setup
```bash
# Install Certbot for Let's Encrypt
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d wallet.teosegypt.com
```

### 2. Database Configuration

#### PostgreSQL Setup
```bash
# Create database and user
sudo -u postgres psql
CREATE DATABASE teos_wallet;
CREATE USER teos_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE teos_wallet TO teos_user;
\q
```

#### Redis Configuration
```bash
# Configure Redis for production
sudo nano /etc/redis/redis.conf

# Key settings:
# maxmemory 1gb
# maxmemory-policy allkeys-lru
# save 900 1
# save 300 10

sudo systemctl restart redis
```

## 🔧 Application Deployment

### 1. Backend Deployment

#### Environment Setup
```bash
# Create application directory
sudo mkdir -p /var/www/teos-wallet
sudo chown $USER:$USER /var/www/teos-wallet

# Clone repository
cd /var/www/teos-wallet
git clone https://github.com/Elmahrosa/Teos-Wallet.git .

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt
pip install gunicorn psycopg2-binary
```

#### Production Configuration
Create `/var/www/teos-wallet/backend/.env`:
```env
FLASK_ENV=production
SECRET_KEY=your_super_secure_secret_key_here
DATABASE_URL=postgresql://teos_user:secure_password@localhost/teos_wallet
REDIS_URL=redis://localhost:6379/0
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
BITCOIN_RPC_URL=https://blockstream.info/api
CORS_ORIGINS=https://wallet.teosegypt.com
```

#### Gunicorn Configuration
Create `/var/www/teos-wallet/backend/gunicorn.conf.py`:
```python
bind = "127.0.0.1:5000"
workers = 4
worker_class = "sync"
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 100
timeout = 30
keepalive = 2
preload_app = True
```

#### Systemd Service
Create `/etc/systemd/system/teos-wallet.service`:
```ini
[Unit]
Description=TEOS Wallet Backend
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/teos-wallet/backend
Environment=PATH=/var/www/teos-wallet/venv/bin
ExecStart=/var/www/teos-wallet/venv/bin/gunicorn -c gunicorn.conf.py app:app
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable teos-wallet
sudo systemctl start teos-wallet
```

### 2. Frontend Deployment

#### Build Process
```bash
# Navigate to frontend directory
cd /var/www/teos-wallet/frontend

# Optimize assets
# Minify CSS
sudo apt install -y minify
minify styles.css > styles.min.css

# Minify JavaScript
minify wallet.js > wallet.min.js

# Update HTML to use minified files
sed -i 's/styles.css/styles.min.css/g' index.html
sed -i 's/wallet.js/wallet.min.js/g' index.html
```

#### Nginx Configuration
Create `/etc/nginx/sites-available/wallet.teosegypt.com`:
```nginx
server {
    listen 80;
    server_name wallet.teosegypt.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name wallet.teosegypt.com;

    ssl_certificate /etc/letsencrypt/live/wallet.teosegypt.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/wallet.teosegypt.com/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; img-src 'self' data: https:; font-src 'self' https://cdnjs.cloudflare.com;";

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Frontend
    location / {
        root /var/www/teos-wallet/frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    # Health check
    location /health {
        proxy_pass http://127.0.0.1:5000;
        access_log off;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/wallet.teosegypt.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 Security Configuration

### 1. Firewall Setup
```bash
# Configure UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 2. Fail2Ban Configuration
```bash
# Install Fail2Ban
sudo apt install fail2ban

# Configure for Nginx
sudo nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[nginx-http-auth]
enabled = true

[nginx-noscript]
enabled = true

[nginx-badbots]
enabled = true

[nginx-noproxy]
enabled = true
```

### 3. Database Security
```bash
# Secure PostgreSQL
sudo nano /etc/postgresql/13/main/postgresql.conf
# listen_addresses = 'localhost'

sudo nano /etc/postgresql/13/main/pg_hba.conf
# local   all             all                                     md5
# host    all             all             127.0.0.1/32            md5
```

## 📊 Monitoring and Logging

### 1. Application Monitoring
```bash
# Install monitoring tools
pip install prometheus-flask-exporter

# Add to Flask app
from prometheus_flask_exporter import PrometheusMetrics
metrics = PrometheusMetrics(app)
```

### 2. Log Configuration
```bash
# Configure log rotation
sudo nano /etc/logrotate.d/teos-wallet
```

```
/var/log/teos-wallet/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload teos-wallet
    endscript
}
```

### 3. Health Checks
Create monitoring script `/usr/local/bin/teos-health-check.sh`:
```bash
#!/bin/bash
HEALTH_URL="https://wallet.teosegypt.com/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ $RESPONSE -eq 200 ]; then
    echo "$(date): Health check passed"
else
    echo "$(date): Health check failed with code $RESPONSE"
    systemctl restart teos-wallet
fi
```

## 🚀 Performance Optimization

### 1. Database Optimization
```sql
-- PostgreSQL performance tuning
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
SELECT pg_reload_conf();
```

### 2. Redis Optimization
```bash
# Redis performance tuning
echo 'vm.overcommit_memory = 1' >> /etc/sysctl.conf
echo never > /sys/kernel/mm/transparent_hugepage/enabled
```

### 3. Nginx Optimization
```nginx
# Add to nginx.conf
worker_processes auto;
worker_connections 1024;
keepalive_timeout 65;
client_max_body_size 10M;
```

## 🔄 Backup and Recovery

### 1. Database Backup
```bash
# Create backup script
sudo nano /usr/local/bin/backup-teos-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/teos-wallet"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump -U teos_user -h localhost teos_wallet | gzip > $BACKUP_DIR/teos_wallet_$DATE.sql.gz

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
```

### 2. Application Backup
```bash
# Backup application files
rsync -av /var/www/teos-wallet/ /var/backups/teos-wallet-app/
```

### 3. Automated Backups
```bash
# Add to crontab
crontab -e
```

```
# Daily database backup at 2 AM
0 2 * * * /usr/local/bin/backup-teos-db.sh

# Weekly application backup on Sunday at 3 AM
0 3 * * 0 rsync -av /var/www/teos-wallet/ /var/backups/teos-wallet-app/
```

## 🔧 Maintenance

### 1. Update Process
```bash
# Create update script
sudo nano /usr/local/bin/update-teos-wallet.sh
```

```bash
#!/bin/bash
cd /var/www/teos-wallet

# Backup current version
cp -r . /var/backups/teos-wallet-pre-update/

# Pull latest changes
git pull origin main

# Update backend dependencies
source venv/bin/activate
pip install -r backend/requirements.txt

# Restart services
systemctl restart teos-wallet
systemctl reload nginx

echo "Update completed successfully"
```

### 2. Health Monitoring
```bash
# Add health check to crontab
*/5 * * * * /usr/local/bin/teos-health-check.sh >> /var/log/teos-wallet/health.log
```

## 🐳 Docker Deployment (Alternative)

### 1. Docker Compose Configuration
Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - DATABASE_URL=postgresql://teos_user:password@db:5432/teos_wallet
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

  frontend:
    build: ./frontend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/ssl/certs
    depends_on:
      - backend

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=teos_wallet
      - POSTGRES_USER=teos_user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 2. Docker Deployment
```bash
# Deploy with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Update deployment
docker-compose pull
docker-compose up -d
```

## 📈 Scaling Considerations

### 1. Load Balancing
```nginx
upstream teos_backend {
    server 127.0.0.1:5000;
    server 127.0.0.1:5001;
    server 127.0.0.1:5002;
}

server {
    location /api/ {
        proxy_pass http://teos_backend;
    }
}
```

### 2. Database Scaling
- **Read Replicas**: Configure PostgreSQL streaming replication
- **Connection Pooling**: Use PgBouncer for connection management
- **Partitioning**: Implement table partitioning for large datasets

### 3. CDN Integration
```nginx
# CloudFlare or AWS CloudFront configuration
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    add_header Cache-Control "public, max-age=31536000";
    add_header X-CDN-Cache "HIT";
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Service Won't Start**
```bash
# Check service status
systemctl status teos-wallet
journalctl -u teos-wallet -f
```

2. **Database Connection Issues**
```bash
# Test database connection
sudo -u postgres psql -c "SELECT version();"
```

3. **SSL Certificate Issues**
```bash
# Renew SSL certificate
sudo certbot renew --dry-run
```

4. **High Memory Usage**
```bash
# Monitor memory usage
htop
free -h
```

### Performance Issues
```bash
# Monitor application performance
curl -w "@curl-format.txt" -o /dev/null -s "https://wallet.teosegypt.com/health"
```

## 📞 Support

For deployment support and technical assistance:
- **Email**: devops@teosegypt.com
- **Documentation**: [docs.teosegypt.com/deployment](https://docs.teosegypt.com/deployment)
- **Emergency Support**: +20-XXX-XXX-XXXX

---

**Deployment completed successfully! 🎉**

Your TEOS Wallet is now live at https://wallet.teosegypt.com

