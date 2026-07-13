# Foundation-milestone Dockerfile — builds and runs apps/api from the monorepo root context
# (docker build -f apps/api/Dockerfile . from Platform/). See infra/README.md.
#
# Uses `turbo prune`, Turborepo's documented pattern for Docker builds: it computes
# the exact subset of package.json files + a pruned lockfile needed for this one
# app's dependency closure, so `pnpm install --frozen-lockfile` sees a consistent
# workspace instead of a hand-picked, easy-to-drift set of copied files.

FROM node:20.11-slim AS base
WORKDIR /repo
RUN corepack enable

FROM base AS pruner
RUN npm install -g turbo@2.1.0
COPY . .
RUN turbo prune api --docker

FROM base AS deps
COPY --from=pruner /repo/out/json/ .
# turbo prune's install-stage output (out/json) is package.json files only — it
# does NOT include packages/database/prisma/schema.prisma, but @aifa/database's
# postinstall (`prisma generate`) requires it to exist at install time. Without
# this, `pnpm install` fails here (verified: reproduces exactly this way).
COPY --from=pruner /repo/out/full/packages/database/prisma ./packages/database/prisma
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY --from=pruner /repo/out/full/ .
# turbo prune's out/full does NOT include shared root config files like
# tsconfig.base.json (only apps/, packages/, package.json, pnpm-workspace.yaml,
# turbo.json) — but every package/app's tsconfig.json extends it via a relative
# path. Without this, every `tsc` build in this stage fails with TS5083
# (verified: reproduces exactly this way in a clean pruned install).
COPY --from=pruner /repo/tsconfig.base.json ./tsconfig.base.json
RUN pnpm turbo run build --filter=api

FROM base AS runtime
ENV NODE_ENV=production
# node:*-slim images ship a built-in unprivileged `node` user (uid/gid 1000) —
# the runtime stage previously had no USER directive at all, so the container
# ran as root by default.
COPY --from=build --chown=node:node /repo/apps/api/dist ./apps/api/dist
COPY --from=build --chown=node:node /repo/node_modules ./node_modules
COPY --from=build --chown=node:node /repo/apps/api/package.json ./apps/api/package.json
USER node
EXPOSE 3001
CMD ["node", "apps/api/dist/main.js"]
