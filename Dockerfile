FROM node:20-alpine

WORKDIR /app

# Create and use a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy dependency files first for Docker layer caching
COPY app/package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev && npm cache clean --force

# Copy application source
COPY --chown=appuser:appgroup app/ .

# Use non-root user
USER appuser

EXPOSE 3000

# Container-level health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/health || exit 1

CMD ["node", "server.js"]
