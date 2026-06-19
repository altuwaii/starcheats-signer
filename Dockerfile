FROM node:18-slim
RUN apt-get update && apt-get install -y git g++ libssl-dev zlib1g-dev
RUN git clone https://github.com/zhlynn/zsign.git /tmp/zsign
RUN cd /tmp/zsign && g++ *.cpp common/*.cpp -lcrypto -lzip -o zsign && mv zsign /usr/local/bin/
WORKDIR /app
COPY package.json .
RUN npm install
COPY server.js .
CMD ["node", "server.js"]
