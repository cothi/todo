# Base Stage - 공통 종속성
FROM node:18-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

# Dependencies Stage - 개발 종속성 설치
FROM base AS dependencies
RUN npm install
COPY proto ./proto
COPY apps/user/src/infrastructure/prisma ./apps/user/src/infrastructure/prisma
RUN npx prisma generate --schema=./apps/user/src/infrastructure/prisma/schema.prisma

# Development Stage
FROM dependencies AS development
COPY apps/scripts ./apps/scripts
COPY apps/user ./apps/user
COPY libs ./libs
CMD ["sh","apps/scripts/start-user.sh"]

# Build Stage - 프로덕션 빌드
FROM dependencies AS builder
COPY apps/user ./apps/user
COPY libs ./libs
RUN npx nest build user

# Production Stage
FROM base AS production
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY proto ./proto
COPY --from=builder /usr/src/app/dist/apps/user ./dist
ENV NODE_ENV=production
CMD ["node", "/usr/src/app/dist/apps/user/src/main.js"]