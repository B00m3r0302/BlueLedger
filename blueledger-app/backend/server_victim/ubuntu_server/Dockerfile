FROM docker.io/node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

# Expose both HTTP and HTTPS ports
EXPOSE 5000 5001

USER node

CMD ["node", "src/app.js"]