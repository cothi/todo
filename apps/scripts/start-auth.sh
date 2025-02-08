#!/bin/sh

npx prisma generate --schema=./apps/auth/src/infrastructure/prisma/schema.prisma --generator auth
npx prisma migrate dev --schema=./apps/auth/src/infrastructure/prisma/schema.prisma --name init

npm run start:auth:dev
