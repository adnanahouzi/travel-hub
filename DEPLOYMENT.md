# Deployment Guide for Scaleway

## Prerequisites
- Docker and Docker Compose installed on Scaleway instance
- Nuitee API credentials
- Scaleway instance with at least 2GB RAM

## Setup Steps

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd travel-hub
```

### 2. Configure Environment Variables
```bash
# Copy example environment file
cp .env.example .env

# Edit .env and add your credentials
nano .env
```

**Required variables:**
- `NUITEE_API_KEY`: Your Nuitee API key
- `NUITEE_BASE_URL`: Nuitee API base URL (default: https://api.nuitee.com)
- `SPRING_PROFILES_ACTIVE`: `prod` for production
- `SERVER_PORT`: Port to expose (default: 8080)

### 3. Build and Deploy
```bash
# Build the Docker image
docker-compose build

# Start the application
docker-compose up -d

# Check logs
docker logs -f travel-api
```

### 4. Verify Deployment
```bash
# Check health
curl http://localhost:8080/actuator/health

# Check API documentation
curl http://localhost:8080/swagger-ui.html
```

## Scaleway-Specific Configuration

### Instance Setup
1. **Create Instance**: Minimum DEV1-M (2GB RAM recommended)
2. **Security Group**: Open port 8080 or your configured `SERVER_PORT`
3. **Install Docker**:
   ```bash
   sudo apt-get update
   sudo apt-get install docker.io docker-compose -y
   sudo systemctl start docker
   sudo systemctl enable docker
   sudo usermod -aG docker $USER
   ```

### SSL/TLS (Production)
For production, use a reverse proxy like Nginx with Let's Encrypt:

```yaml
# Add to docker-compose.yml
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    depends_on:
      - travel-api
```

## Useful Commands

### Application Management
```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Restart
docker-compose restart

# View logs
docker-compose logs -f travel-api

# Update application
git pull
docker-compose build
docker-compose up -d
```

### Monitoring
```bash
# Check status
docker-compose ps

# Resource usage
docker stats travel-api

# Health check
curl http://localhost:8080/actuator/health
```

## Troubleshooting

### Application won't start
```bash
# Check logs
docker logs travel-api

# Check if port is available
sudo netstat -tlnp | grep 8080

# Rebuild without cache
docker-compose build --no-cache
docker-compose up -d
```

### Out of memory
```bash
# Increase container memory in docker-compose.yml
services:
  travel-api:
    mem_limit: 2g
    mem_reservation: 1g
```

### Connection issues
```bash
# Check if container is running
docker ps

# Test network connectivity
docker exec travel-api wget --spider http://localhost:8080/actuator/health
```

## Backup and Maintenance

### Backup Configuration
```bash
# Backup environment file
cp .env .env.backup

# Backup logs
docker logs travel-api > travel-api.log
```

### Update Application
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d
```

## Performance Tuning

### JVM Options (already configured in docker-compose.yml)
- `-XX:+UseContainerSupport`: Automatically detect container memory
- `-XX:MaxRAMPercentage=75.0`: Use up to 75% of available memory
- `-Djava.security.egd=file:/dev/./urandom`: Faster startup

### Resource Limits
Edit `docker-compose.yml` to add:
```yaml
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 2G
    reservations:
      memory: 1G
```

## Security Best Practices

1. **Never commit `.env` file** - it contains sensitive credentials
2. **Use strong API keys** - rotate them regularly
3. **Keep Docker images updated**:
   ```bash
   docker-compose pull
   docker-compose up -d
   ```
4. **Enable firewall** on Scaleway instance
5. **Use HTTPS** in production (see SSL/TLS section)

## Support

For issues related to:
- **Nuitee API**: Check [Nuitee Documentation](https://docs.nuitee.com)
- **Scaleway**: Visit [Scaleway Console](https://console.scaleway.com)
- **Docker**: See [Docker Documentation](https://docs.docker.com)
