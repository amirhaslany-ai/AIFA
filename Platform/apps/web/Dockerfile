# Foundation-milestone Dockerfile — builds and runs apps/web from the monorepo root context
# (docker build -f apps/web/Dockerfile . from Platform/). See infra/README.md and
# apps/api/Dockerfile's header comment for why `turbo prune` is used here.

FROM node:20.11-slim AS base
WORKDIR /repo
RUN corepack enable

FROM base AS pruner
RUN npm install -g turbo@2.1.0
COPY . .
RUN turbo prune web --docker

FROM base AS deps
COPY --from=pruner /repo/out/json/ .
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY --from=pruner /repo/out/full/ .
# See apps/api/Dockerfile's comment on the same line — turbo prune's out/full
# never includes root-level shared config (tsconfig.base.json), which every
# package's tsconfig.json extends via a relative path.
COPY --from=pruner /repo/tsconfig.base.json ./tsconfig.base.json
RUN pnpm turbo run build --filter=web

FROM base AS runtime
ENV NODE_ENV=production
# node:*-slim images ship a built-in unprivileged `node` user (uid/gid 1000) —
# the runtime stage previously had no USER directive at all, so the container
# ran as root by default.
COPY --from=build --chown=node:node /repo/apps/web/.next ./apps/web/.next
COPY --from=build --chown=node:node /repo/apps/web/public ./apps/web/public
COPY --from=build --chown=node:node /repo/node_modules ./node_modules
COPY --from=build --chown=node:node /repo/apps/web/package.json ./apps/web/package.json
USER node
EXPOSE 3000
CMD ["node_modules/.bin/next", "start", "apps/web", "-p", "3000"]
