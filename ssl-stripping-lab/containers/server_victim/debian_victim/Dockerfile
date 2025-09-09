FROM debian:12-slim

# Install dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-requests \
    python3-urllib3 \
    curl \
    iputils-ping \
    net-tools \
    nmap \
    && rm -rf /var/lib/apt/lists/*

# Copy victim simulator script
COPY victim_simulator.py /opt/victim_simulator.py

# Make script executable
RUN chmod +x /opt/victim_simulator.py

# Copy startup info script
COPY startup_info.py /opt/startup_info.py

RUN chmod +x /opt/startup_info.py

# Copy startup script
COPY start_victim.sh /opt/start_victim.sh

RUN chmod +x /opt/start_victim.sh

# Default command
CMD ["/opt/start_victim.sh"]