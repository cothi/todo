#!/bin/sh


npx prisma generate --schema=/usr/src/app/apps/user/src/infrastructure/prisma/schema.prisma --generator user
npx prisma migrate dev --schema=/usr/src/app/apps/user/src/infrastructure/prisma/schema.prisma --name init


npm run start:user:dev
