import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectModule } from '@project/project.module';
import { GraphQLTestHelper } from './graphql-helper/graphql.helper';
import { ProjectTestHelper } from './graphql-helper/operations/project.operations';
import { ProjectInvitationTestHelper } from './graphql-helper/operations/project-invitation.operations';
import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@user/user.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AuthTestHelper } from './graphql-helper/operations/auth.operations';
import { UserTestHelper } from './graphql-helper/operations/user.operations';
import { authGrpcTestServerOptions } from './options/auth-grpc-test-server.options';

describe('ProjectInviationResolver (e2e)', () => {
  let app: INestApplication;
  let graphQLTestHelper: GraphQLTestHelper;
  let projectTestHelper: ProjectTestHelper;
  let projectInvitationTestHelper: ProjectInvitationTestHelper;
  let authTestHelper: AuthTestHelper;
  let userTestHelper: UserTestHelper;
  let accessToken: string;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, UserModule, ProjectModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.connectMicroservice<MicroserviceOptions>(authGrpcTestServerOptions);
    await app.startAllMicroservices();
    await app.init();

    graphQLTestHelper = new GraphQLTestHelper(app);
    projectTestHelper = new ProjectTestHelper(graphQLTestHelper);
    projectInvitationTestHelper = new ProjectInvitationTestHelper(
      graphQLTestHelper,
    );
    authTestHelper = new AuthTestHelper(graphQLTestHelper);
    userTestHelper = new UserTestHelper(graphQLTestHelper);

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

  describe('Create project invitation ', () => {
    let projectId: string;
    beforeAll(async () => {
      const response = await projectTestHelper.createProject(
        {
          input: {
            name: 'test project name',
          },
        },
        accessToken,
      );
      projectId = response.data.id;
    });

    it('should create project invitation', async () => {
      const response =
        await projectInvitationTestHelper.createProjectInvitation(
          {
            input: {
              inviteeUserId: 'test2',
              projectId: projectId,
            },
          },
          accessToken,
        );

      expect(response.success).toBe(true);
    });
  });

  describe('Accept project invitation ', () => {
    let projectId: string;
    let projectInvitationId: string;
    let inviteeUserId: string;
    let inviteeAccessToken: string;

    beforeAll(async () => {
      const ivEmail = `ivitee_${Date.now()}@test.com`;
      const password = 'test!1234';
      const nickname = 'invitee';
      const createdUserResponse = await userTestHelper.createUser({
        input: {
          email: ivEmail,
          password: password,
          nickname: nickname,
        },
      });
      inviteeUserId = createdUserResponse.data.userId;
      const loginResponse = await authTestHelper.login({
        input: {
          email: ivEmail,
          password: password,
        },
      });
      inviteeAccessToken = loginResponse.data.accessToken;
      const createProjectResponse = await projectTestHelper.createProject(
        {
          input: {
            name: 'test project name',
          },
        },
        accessToken,
      );
      projectId = createProjectResponse.data.id;

      const createProjectInvitationResponse =
        await projectInvitationTestHelper.createProjectInvitation(
          {
            input: {
              inviteeUserId: inviteeUserId,
              projectId: projectId,
            },
          },
          accessToken,
        );
      projectInvitationId = createProjectInvitationResponse.data.id;
    });

    it('should accept project invitation', async () => {
      const response =
        await projectInvitationTestHelper.acceptProjectInvitation(
          {
            input: {
              id: projectInvitationId,
            },
          },
          inviteeAccessToken,
        );

      expect(response.success).toBe(true);
    });
  });

  describe('Reject project invitation ', () => {
    let projectId: string;
    let projectInvitationId: string;
    let inviteeUserId: string;
    let inviteeAccessToken: string;

    beforeAll(async () => {
      const ivEmail = `ivitee_${Date.now()}@test.com`;
      const password = 'test!1234';
      const nickname = 'invitee';
      const createdUserResponse = await userTestHelper.createUser({
        input: {
          email: ivEmail,
          password: password,
          nickname: nickname,
        },
      });
      inviteeUserId = createdUserResponse.data.userId;
      const loginResponse = await authTestHelper.login({
        input: {
          email: ivEmail,
          password: password,
        },
      });
      inviteeAccessToken = loginResponse.data.accessToken;
      const createProjectResponse = await projectTestHelper.createProject(
        {
          input: {
            name: 'test project name',
          },
        },
        accessToken,
      );
      projectId = createProjectResponse.data.id;

      const createProjectInvitationResponse =
        await projectInvitationTestHelper.createProjectInvitation(
          {
            input: {
              inviteeUserId: inviteeUserId,
              projectId: projectId,
            },
          },
          accessToken,
        );
      projectInvitationId = createProjectInvitationResponse.data.id;
    });

    it('should reject project invitation', async () => {
      const response =
        await projectInvitationTestHelper.rejectProjectInvitation(
          {
            input: {
              id: projectInvitationId,
            },
          },
          inviteeAccessToken,
        );

      expect(response.success).toBe(true);
    });
  });
});
