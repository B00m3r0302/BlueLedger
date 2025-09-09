FROM ubuntu:22.04

# Install dependencies including Node.js
RUN apt-get update && apt-get install -y \
    curl \
    git \
    python3 \
    python3-pip \
    net-tools \
    iputils-ping \
    vim \
    ca-certificates \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x nodistro main" > /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Create working directory
WORKDIR /opt

# Clone BlueLedger repository
RUN git clone https://github.com/hwoomer/BlueLedger.git || \
    echo "Repository clone failed - will copy from host"

# Copy BlueLedger from build context if clone failed
COPY . /opt/BlueLedger/ 

# Create startup script
RUN echo '#!/bin/bash' > /opt/start_blueledger.sh && \
    echo 'set -e' >> /opt/start_blueledger.sh && \
    echo '' >> /opt/start_blueledger.sh && \
    echo 'echo "🚀 Starting BlueLedger Server..."' >> /opt/start_blueledger.sh && \
    echo 'echo "📍 Container IP: $(hostname -I | awk '"'"'{print $1}'"'"')"' >> /opt/start_blueledger.sh && \
    echo '' >> /opt/start_blueledger.sh && \
    echo '# Navigate to BlueLedger directory' >> /opt/start_blueledger.sh && \
    echo 'cd /opt/BlueLedger' >> /opt/start_blueledger.sh && \
    echo 'echo "📁 Directory contents:"' >> /opt/start_blueledger.sh && \
    echo 'ls -la' >> /opt/start_blueledger.sh && \
    echo '' >> /opt/start_blueledger.sh && \
    echo '# Generate SSL certificates if they do not exist' >> /opt/start_blueledger.sh && \
    echo 'if [ ! -f blueledger-app/backend/cert.pem ] || [ ! -f blueledger-app/backend/key.pem ]; then' >> /opt/start_blueledger.sh && \
    echo '    echo "🔐 Generating SSL certificates..."' >> /opt/start_blueledger.sh && \
    echo '    cd blueledger-app/backend' >> /opt/start_blueledger.sh && \
    echo '    openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=localhost"' >> /opt/start_blueledger.sh && \
    echo '    cd /opt/BlueLedger' >> /opt/start_blueledger.sh && \
    echo 'fi' >> /opt/start_blueledger.sh && \
    echo '' >> /opt/start_blueledger.sh && \
    echo '# Start simple backend in background' >> /opt/start_blueledger.sh && \
    echo 'echo "🚀 Starting BlueLedger backend..."' >> /opt/start_blueledger.sh && \
    echo 'cd blueledger-app/backend' >> /opt/start_blueledger.sh && \
    echo 'npm install' >> /opt/start_blueledger.sh && \
    echo 'node src/app.js &' >> /opt/start_blueledger.sh && \
    echo 'cd ../..' >> /opt/start_blueledger.sh && \
    echo '' >> /opt/start_blueledger.sh && \
    echo '# Build and serve frontend' >> /opt/start_blueledger.sh && \
    echo 'echo "🌐 Building and starting frontend..."' >> /opt/start_blueledger.sh && \
    echo 'cd blueledger-app/frontend' >> /opt/start_blueledger.sh && \
    echo 'npm install' >> /opt/start_blueledger.sh && \
    echo 'npm run build' >> /opt/start_blueledger.sh && \
    echo 'cd build' >> /opt/start_blueledger.sh && \
    echo 'echo "✅ BlueLedger ready at container IP on port 3000"' >> /opt/start_blueledger.sh && \
    echo 'python3 -m http.server 3000' >> /opt/start_blueledger.sh

# Make script executable
RUN chmod +x /opt/start_blueledger.sh

# Expose ports
EXPOSE 3000 5000 5001 27017

# Start BlueLedger on container startup
CMD ["/opt/start_blueledger.sh"]