import { AuthModule } from '@auth/auth.module';
import { INestApplication } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectModule } from '@project/project.module';
import { UserModule } from '@user/user.module';
import { GraphQLTestHelper } from './graphql-helper/graphql.helper';
import { AuthTestHelper } from './graphql-helper/operations/auth.operations';
import { ProjectTestHelper } from './graphql-helper/operations/project.operations';
import { UserTestHelper } from './graphql-helper/operations/user.operations';

import { authGrpcServerOptions } from '@auth/infrastructure/adapter/grpc/options/auth-server-grpc.option';

describe('project resolver (e2e)', () => {
  let app: INestApplication;
  let graphQLTestHelper: GraphQLTestHelper;
  let projectTestHelper: ProjectTestHelper;
  let userTestHelper: UserTestHelper;
  let authTestHelper: AuthTestHelper;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, ProjectModule, UserModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.connectMicroservice<MicroserviceOptions>(authGrpcServerOptions);
    await app.startAllMicroservices();
    await app.init();

    graphQLTestHelper = new GraphQLTestHelper(app);
    projectTestHelper = new ProjectTestHelper(graphQLTestHelper);
    userTestHelper = new UserTestHelper(graphQLTestHelper);
    authTestHelper = new AuthTestHelper(graphQLTestHelper);

    const email = `create_test${Date.now()}@test.com`;
    const password = 'test1234!';
    const nickname = `test${Date.now()}`;

    await userTestHelper.createUser({
      input: {
        email,
        nickname,
        password,
      },
    });

    const loginReponse = await authTestHelper.login({
      input: {
        email,
        password,
      },
    });

    accessToken = loginReponse.data.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Create project', () => {
    it('should create project', async () => {
      const response = await projectTestHelper.createProject(
        {
          input: {
            name: 'test name',
          },
        },
        accessToken,
      );
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('name', 'test name');
    });
  });

  describe('Delete project', () => {
    let createdProjectId: string;
    beforeEach(async () => {
      const response = await projectTestHelper.createProject(
        {
          input: {
            name: 'test name',
          },
        },
        accessToken,
      );
      createdProjectId = response.data.id;
    });

    it('should delete project', async () => {
      const response = await projectTestHelper.deleteProject(
        {
          input: {
            projectId: createdProjectId,
          },
        },
        accessToken,
      );

      expect(response.success).toBe(true);
    });

    it('should fail to retry that delete project after delete project', async () => {
      const response = await projectTestHelper.deleteProject(
        {
          input: {
            projectId: createdProjectId,
          },
        },
        accessToken,
      );

      try {
        await projectTestHelper.deleteProject(
          {
            input: {
              projectId: createdProjectId,
            },
          },
          accessToken,
        );

        fail('should fail');
      } catch (error) {
        expect(error.success).toBe(false);
      }
    });
  });

  describe('Query project', () => {
    let createdProjectId: string;

    beforeAll(async () => {
      const response = await projectTestHelper.createProject(
        {
          input: {
            name: 'test name',
          },
        },
        accessToken,
      );
      createdProjectId = response.data.id;
    });
    it('should query project', async () => {
      const response = await projectTestHelper.queryProject(
        {
          input: {
            projectId: createdProjectId,
          },
        },
        accessToken,
      );

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('id', createdProjectId);
    });
  });

  describe('Update project', () => {
    let createdProjectId: string;
    beforeAll(async () => {
      const response = await projectTestHelper.createProject(
        {
          input: {
            name: 'test name',
          },
        },
        accessToken,
      );
      createdProjectId = response.data.id;
    });
    it('should update project', async () => {
      const response = await projectTestHelper.updateProject(
        {
          input: {
            projectId: createdProjectId,
            name: 'test name2',
          },
        },
        accessToken,
      );
      expect(response.data).toHaveProperty('name', 'test name2');
    });
  });
});
