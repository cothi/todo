FROM node:18 AS development

# 작업 디렉토리
WORKDIR /usr/src/app

# 기본 설정 파일 및 패키지 파일 가져오기
COPY package*.json ./
RUN npm install

COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json
COPY apps/scripts ./apps/scripts
COPY apps/auth ./apps/auth
COPY proto ./proto


RUN npx prisma generate --schema=./apps/auth/src/infrastructure/prisma/schema.prisma


CMD ["sh","apps/scripts/start-auth.sh"]