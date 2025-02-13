#!/usr/bin/env bash

# 엄격한 에러 처리 설정
set -euo pipefail

# 가독성을 위한 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

export DATABASE_AUTH_URL=mysql://root:1234@localhost:6001/authdb
export DATABASE_USER_URL=mysql://root:1234@localhost:6001/userdb
export DATABASE_PROJECT_URL=mysql://root:1234@localhost:6001/projectdb


# 도움말 정보 출력 함수
print_help() {
    echo "데이터베이스 설정 스크립트"
    echo
    echo "사용법: $0 [명령어] [서비스] [옵션]"
    echo
    echo "명령어:"
    echo "  setup     Prisma 스키마 업데이트 (데이터베이스 컨테이너만 시작)"
    echo "  up        모든 서비스 컨테이너 시작"
    echo "  down      Docker 컨테이너 중지"
    echo "  restart   Docker 컨테이너 재시작"
    echo
    echo "서비스:"
    echo "  user      사용자 서비스 및 데이터베이스"
    echo "  auth      인증 서비스 및 데이터베이스"
    echo "  project   프로잭트 서비스 및 데이터베이스"
    echo "  all       모든 서비스"
    echo
    echo "옵션:"
    echo "  -d        백그라운드에서 실행 (detached 모드)"
    echo
    echo "예시:"
    echo "  $0 setup user -d   # 사용자 DB 백그라운드에서 시작 및 스키마 업데이트"
    echo "  $0 up auth         # 인증 서비스 포그라운드에서 시작"
    echo "  $0 up all -d       # 모든 서비스 백그라운드에서 시작"
}

# Docker compose 작업 처리 함수
docker_compose_operation() {
    local operation=$1
    local service=$2
    local detached=${3:-""}  # 세 번째 인자가 없으면 빈 문자열

    # detached 모드 옵션 설정
    local detach_opt=""
    if [ "$detached" = "-d" ]; then
        detach_opt="-d"
    fi

    case $service in
        user)
            if [ "$operation" = "setup" ]; then
                echo -e "${YELLOW}Starting user database container...${NC}"
                docker compose up $detach_opt mysql
            elif [ "$operation" = "up" ]; then
                echo -e "${YELLOW}Starting all user service containers...${NC}"
                docker compose up $detach_opt mysql user
            elif [ "$operation" = "down" ]; then
                docker compose rm -sf mysql user
            else
                docker compose restart mysql user
            fi
            ;;
        auth)
            if [ "$operation" = "setup" ]; then
                echo -e "${YELLOW}Starting auth database container...${NC}"
                docker compose up $detach_opt mysql
            elif [ "$operation" = "up" ]; then
                echo -e "${YELLOW}Starting all auth service containers...${NC}"
                docker compose up $detach_opt mysql auth
            elif [ "$operation" = "down" ]; then
                docker compose rm -sf mysql auth
            else
                docker compose restart mysql auth
            fi
            ;;
        project)
            if [ "$operation" = "setup" ]; then
                echo -e "${YELLOW}Starting project database container...${NC}"
                docker compose up $detach_opt mysql
            elif [ "$operation" = "up" ]; then
                echo -e "${YELLOW}Starting all project service containers...${NC}"
                docker compose up $detach_opt mysql project
            elif [ "$operation" = "down" ]; then
                docker compose rm -sf mysql project
            else
                docker compose restart mysql project
            fi
            ;;
        all)
            if [ "$operation" = "setup" ]; then
                echo -e "${YELLOW}Starting all database containers...${NC}"
                docker compose up $detach_opt mysql
            elif [ "$operation" = "up" ]; then
                echo -e "${YELLOW}Starting all service containers...${NC}"
                docker compose up $detach_opt
            elif [ "$operation" = "down" ]; then
                docker compose down
            else
                docker compose restart
            fi
            ;;
        *)
            echo -e "${RED}Error: Invalid service '${service}'${NC}"
            echo
            print_help
            exit 1
            ;;
    esac

    echo -e "${GREEN}Docker ${operation} operation completed!${NC}"
}

# Prisma 스키마 업데이트 함수 - 사용자 DB
update_user_schema() {
    echo -e "${GREEN}Updating user database schema...${NC}"

    echo "Cleaning up previous migrations..."
    rm -rf apps/user/src/infrastructure/prisma/migrations

    echo "Generating Prisma client..."
    npx prisma generate --schema=apps/user/src/infrastructure/prisma/schema.prisma

    echo "Creating and applying migrations..."
    npx prisma migrate dev --schema=apps/user/src/infrastructure/prisma/schema.prisma --name init

    echo -e "${GREEN}User database schema update completed!${NC}"
}

# Prisma 스키마 업데이트 함수 - 인증 DB
update_auth_schema() {
    echo -e "${GREEN}Updating auth database schema...${NC}"

    echo "Cleaning up previous migrations..."
    rm -rf apps/auth/src/infrastructure/prisma/migrations

    echo "Generating Prisma client..."
    npx prisma generate --schema=apps/auth/src/infrastructure/prisma/schema.prisma

    echo "Creating and applying migrations..."
    npx prisma migrate dev --schema=apps/auth/src/infrastructure/prisma/schema.prisma --name init

    echo -e "${GREEN}Auth database schema update completed!${NC}"
}

# Prisma 스키마 업데이트 함수 - 프로젝트 DB
update_project_schema() {
    echo -e "${GREEN}Updating project database schema...${NC}"

    echo "Cleaning up previous migrations..."
    rm -rf apps/project/src/infrastructure/prisma/migrations

    echo "Generating Prisma client..."
    npx prisma generate --schema=apps/project/src/infrastructure/prisma/schema.prisma

    echo "Creating and applying migrations..."
    npx prisma migrate dev --schema=apps/project/src/infrastructure/prisma/schema.prisma --name init

    echo -e "${GREEN}Project database schema update completed!${NC}"
}

# 모든 스키마 업데이트
update_all_schemas() {
    update_user_schema
    update_auth_schema
    update_project_schema
}


# 메인 실행 함수
main() {
    # 최소 인자 수 확인
    if [ $# -lt 1 ]; then
        print_help
        exit 1
    fi

    # 명령어와 서비스 파싱
    local command=$1
    local service=${2:-all}
    local detached=${3:-""}  # 세 번째 인자가 없으면 빈 문자열

    case $command in
        setup)
            # 데이터베이스 컨테이너만 시작하고 스키마 업데이트
            docker_compose_operation "setup" "$service" "$detached"

            # 데이터베이스 컨테이너가 완전히 시작될 때까지 대기
            echo "Waiting for database containers to be ready..."
            sleep 10

            # 서비스 파라미터에 따른 스키마 업데이트
            case $service in
                user)
                    update_user_schema
                    ;;
                auth)
                    update_auth_schema
                    ;;
                project)
                    update_project_schema
                    ;;
                all)
                    update_all_schemas
                    ;;
            esac
            ;;
        up|down|restart)
            docker_compose_operation "$command" "$service" "$detached"
            ;;
        help|--help|-h)
            print_help
            exit 0
            ;;
        *)
            echo -e "${RED}Error: Invalid command '${command}'${NC}"
            echo
            print_help
            exit 1
            ;;
    esac

    echo -e "${GREEN}All operations completed successfully!${NC}"
}

# 모든 스크립트 인자와 함께 메인 함수 실행
main "${@:-}"
