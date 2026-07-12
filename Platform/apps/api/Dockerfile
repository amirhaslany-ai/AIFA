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
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY --from=pruner /repo/out/full/ .
RUN pnpm turbo run build --filter=api

FROM base AS runtime
ENV NODE_ENV=production
COPY --from=build /repo/apps/api/dist ./apps/api/dist
COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/apps/api/package.json ./apps/api/package.json
EXPOSE 3001
CMD ["node", "apps/api/dist/main.js"]
