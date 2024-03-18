# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

ARG NODE_VERSION=18
ARG PNPM_VERSION=8.12.1
ARG ROOT=/usr/src/app

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR ${ROOT}

# Install pnpm.
RUN npm install -g pnpm@${PNPM_VERSION}

FROM base as build

# Download additional development dependencies before building, as some projects require
# "devDependencies" to be installed to build. If you don't need this, remove this step.
RUN pnpm install --frozen-lockfile

# Copy the rest of the source files into the image.
COPY . .

# Run the build script.
RUN pnpm run build --filter=web

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base as final

# Use production node environment by default.
ENV NODE_ENV production

# Run the application as a non-root user.
USER node

# Copy package.json so that package manager commands can be used.
COPY --from=build ${ROOT}/apps/web/next.config.js .
COPY --from=build ${ROOT}/apps/web/package.json .

# the built application from the build stage into the image.
COPY --from=build ${ROOT}/apps/web/.next/standalone ./
COPY --from=build ${ROOT}/apps/web/.next/static ./apps/web/.next/static
COPY --from=build ${ROOT}/apps/web/public ./apps/web/public

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD node apps/web/server.js
