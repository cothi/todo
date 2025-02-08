import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from '../user/src/user.module';
import { GraphQLTestHelper } from './graphql-helper/graphql.helper';
import { UserTestHelper } from './graphql-helper/operations/user.operations';
import { AuthModule } from '../auth/src/auth.module';
import {
  GrpcOptions,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME } from '@libs/grpc';
import { join } from 'path';
import { AuthTestHelper } from './graphql-helper/operations/auth.operations';

describe('User Resolver e2e', () => {
  let app: INestApplication;
  let graphQLTestHelper: GraphQLTestHelper;
  let userTestHelper: UserTestHelper;
  let authTestHelper: AuthTestHelper;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, UserModule],
    }).compile();
    const authGrpcServerOptions: GrpcOptions = {
      transport: Transport.GRPC,
      options: {
        package: AUTH_PACKAGE_NAME,
        protoPath: join(__dirname, '../../proto/auth.proto'),
        url: '0.0.0.0:50052',
      },
    };

    app = moduleFixture.createNestApplication();
    app.connectMicroservice<MicroserviceOptions>(authGrpcServerOptions);
    await app.startAllMicroservices();
    await app.init();

    graphQLTestHelper = new GraphQLTestHelper(app);
    userTestHelper = new UserTestHelper(graphQLTestHelper);
    authTestHelper = new AuthTestHelper(graphQLTestHelper);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Create User (Mutation)', () => {
    it('should create user successfully', async () => {
      const testUser = {
        email: `create_test${Date.now()}@test.com`,
        nickname: 'testnickname',
        password: 'Test1234!',
      };

      const response = await userTestHelper.createUser({
        input: testUser,
      });

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('userId');
      expect(response.data.email).toBe(testUser.email);
      expect(response.data.nickname).toBe(testUser.nickname);
    });
  });

  describe('Update User (Mutation)', () => {
    const email = `update_test${Date.now()}@test.com`;
    const password = '1234!';
    const nickname = 'test nicname';
    let createdUserId: string;
    let refreshToken: string;
    let accessToken: string;

    beforeEach(async () => {
      await userTestHelper.createUser({
        input: {
          email: email,
          nickname: nickname,
          password: password,
        },
      });

      const response = await authTestHelper.login({
        input: {
          email: email,
          password: password,
        },
      });

      expect(response.data).toHaveProperty('refreshToken');
      expect(response.data).toHaveProperty('accessToken');

      refreshToken = response.data.refreshToken;
      accessToken = response.data.accessToken;
    });

    it('should update user', async () => {
      const changedName = 'changed nickname';
      const response = await userTestHelper.updateUser(
        {
          input: {
            nickname: changedName,
          },
        },
        accessToken,
      );

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('nickname', changedName);
    });
  });

  describe('Delete User (Mutation)', () => {
    const email = `delete_test${Date.now()}@test.com`;
    const password = '1234!';
    const nickname = 'test nicname';
    let createdUserId: string;
    let refreshToken: string;
    let accessToken: string;
    beforeEach(async () => {
      await userTestHelper.createUser({
        input: {
          email: email,
          nickname: nickname,
          password: password,
        },
      });

      const response = await authTestHelper.login({
        input: {
          email: email,
          password: password,
        },
      });

      expect(response.data).toHaveProperty('refreshToken');
      expect(response.data).toHaveProperty('accessToken');

      refreshToken = response.data.refreshToken;
      accessToken = response.data.accessToken;
    });

    it('should delete user', async () => {
      const response = await userTestHelper.deleteUser(accessToken);

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('userId');
    });
  });
});
