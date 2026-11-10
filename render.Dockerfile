# Combined same-origin frontend and API for the free Render pilot.
FROM node:22.15.0-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm@10.22.0

WORKDIR /app

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm -w packages:build
RUN pnpm build --filter=api
RUN NODE_OPTIONS=--max-old-space-size=6144 pnpm --filter=web build
# TODO: Move pnpm deploy to turbo prune workflow
RUN pnpm deploy --filter=api pnpm-deploy-output --prod --legacy

FROM node:22.15.0-alpine
WORKDIR /app
COPY --from=base /app/pnpm-deploy-output /app
COPY --from=base /app/apps/web/build/client /app/public
COPY --from=base /app/deployment/certs/supabase-ca.crt /app/certs/supabase-ca.crt
# The Workflow builder's nested .gitignore excludes these bundles from pnpm deploy.
COPY --from=base /app/apps/api/dist/workflow /app/dist/workflow
RUN test -s /app/dist/workflow/manifest.json \
    && test -s /app/dist/workflow/steps.mjs \
    && test -s /app/dist/workflow/workflows.mjs

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto \
    xvfb \
    libc6-compat \
    ffmpeg \
    libreoffice \
    && rm -rf /var/cache/apk/*

ENV NODE_ENV=production \
    WEB_DIST_DIR=/app/public \
    NODE_EXTRA_CA_CERTS=/app/certs/supabase-ca.crt \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    UV_THREADPOOL_SIZE=16

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT [ "/app/entrypoint.sh" ]
