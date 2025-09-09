FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    docker.io \
    docker-compose \
    python3 \
    python3-pip \
    net-tools \
    iputils-ping \
    vim \
    && rm -rf /var/lib/apt/lists/*

# Create working directory
WORKDIR /opt

# Clone BlueLedger repository
RUN git clone https://github.com/hwoomer/BlueLedger.git || \
    echo "Repository clone failed - will copy from host"

# Copy BlueLedger from build context if clone failed
COPY . /opt/BlueLedger/ 

# Create startup script
RUN cat > /opt/start_blueledger.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 Starting BlueLedger Server..."
echo "📍 Container IP: $(hostname -I | awk '{print $1}')"

# Navigate to BlueLedger directory
cd /opt/BlueLedger

# Generate SSL certificates if they don't exist
if [ ! -f backend/cert.pem ] || [ ! -f backend/key.pem ]; then
    echo "🔐 Generating SSL certificates..."
    cd backend
    openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=localhost"
    cd ..
fi

# Start Docker daemon in background
echo "🐳 Starting Docker daemon..."
dockerd > /var/log/dockerd.log 2>&1 &

# Wait for Docker to be ready
echo "⏳ Waiting for Docker daemon..."
until docker info > /dev/null 2>&1; do
    sleep 2
    echo "   Still waiting for Docker..."
done

echo "✅ Docker daemon ready!"

# Start BlueLedger services
echo "🌐 Starting BlueLedger services..."
docker-compose up --build -d

# Follow logs
echo "📋 BlueLedger started! Following logs..."
docker-compose logs -f
EOF

# Make script executable
RUN chmod +x /opt/start_blueledger.sh

# Expose ports
EXPOSE 3000 5000 5001 27017

# Start BlueLedger on container startup
CMD ["/opt/start_blueledger.sh"]