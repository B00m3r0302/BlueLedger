FROM docker.io/node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

# Generate SSL certificates
RUN apk add --no-cache openssl && \
    openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=localhost" && \
    chown node:node *.pem

# Expose both HTTP and HTTPS ports  
EXPOSE 5000 5001

USER node

CMD ["node", "src/app.js"]