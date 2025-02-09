import { INestApplication } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../auth/src/auth.module';
import { UserModule } from '../user/src/user.module';
import { GraphQLTestHelper } from './graphql-helper/graphql.helper';
import { AuthTestHelper } from './graphql-helper/operations/auth.operations';
import { UserTestHelper } from './graphql-helper/operations/user.operations';
import { authGrpcTestServerOptions } from './options/auth-grpc-test-server.options';

describe('User Resolver e2e', () => {
  let app: INestApplication;
  let graphQLTestHelper: GraphQLTestHelper;
  let userTestHelper: UserTestHelper;
  let authTestHelper: AuthTestHelper;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, UserModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.connectMicroservice<MicroserviceOptions>(authGrpcTestServerOptions);
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
      console.log(response.data);

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('userId');
    });
  });
});
