FROM node:20-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --omit=dev
COPY server/dist/remote.mjs ./
EXPOSE 3000
CMD ["node", "remote.mjs"]
