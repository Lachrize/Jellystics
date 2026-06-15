# Stage 1: Build the application
FROM node:22.21.1-bookworm-slim AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY backend/package*.json ./backend/
RUN npm cache clean --force
RUN npm install --prefix backend

COPY frontend/package.json frontend/pnpm-lock.yaml frontend/pnpm-workspace.yaml frontend/.npmrc ./frontend/
RUN pnpm install --dir frontend --frozen-lockfile

COPY ./ ./
COPY entry.sh ./

# Build the application
RUN pnpm --dir frontend build

# Stage 2: Create the production image
FROM node:22.21.1-bookworm-slim

RUN apt-get update && \
    apt-get install -yqq --no-install-recommends wget && \
    apt-get autoremove && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app .
COPY --chmod=755 entry.sh /entry.sh

HEALTHCHECK --interval=30s \
            --timeout=5s \
            --start-period=10s \
            --retries=3 \
            CMD [ "/usr/bin/wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/auth/isconfigured" ]

EXPOSE 3000

CMD ["/entry.sh"]
