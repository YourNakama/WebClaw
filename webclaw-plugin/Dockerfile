FROM node:20-alpine AS builder
WORKDIR /app
COPY server/package*.json ./
RUN npm ci
COPY server/tsconfig.json ./
COPY server/src/ ./src/
RUN npx tsc
RUN npx esbuild dist/remote.js --bundle --platform=node --target=node20 --format=esm --outfile=dist/remote.mjs

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist/remote.mjs ./remote.mjs
EXPOSE 3000
CMD ["node", "remote.mjs"]
