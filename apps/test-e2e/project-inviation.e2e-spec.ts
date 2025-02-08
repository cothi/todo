import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectModule } from '@project/project.module';
import { ProjectInvitationTestHelper } from '../project/test/graphql-helper/operations/project-invitation.operations';
import { ProjectTestHelper } from '../project/test/graphql-helper/operations/project.operations';
import { GraphQLTestHelper } from './graphql-helper/graphql.helper';

describe('ProjectInviationResolver (e2e)', () => {
  let app: INestApplication;
  let graphQLTestHelper: GraphQLTestHelper;
  let projectTestHelper: ProjectTestHelper;
  let projectInvitationTestHelper: ProjectInvitationTestHelper;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProjectModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    graphQLTestHelper = new GraphQLTestHelper(app);
    projectTestHelper = new ProjectTestHelper(graphQLTestHelper);
    projectInvitationTestHelper = new ProjectInvitationTestHelper(
      graphQLTestHelper,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Create project invitation ', () => {
    let projectId: string;
    beforeAll(async () => {
      const response = await projectTestHelper.createProject({
        input: {
          name: 'test project name',
        },
      });
      projectId = response.data.id;
    });

    it('should create project invitation', async () => {
      const response =
        await projectInvitationTestHelper.createProjectInvitation({
          input: {
            inviteeUserId: 'test2',
            projectId: projectId,
          },
        });

      expect(response.success).toBe(true);
    });
  });

  describe('Accept project invitation ', () => {
    let projectId: string;
    let projectInvitationId: string;
    beforeAll(async () => {
      const createProjectResponse = await projectTestHelper.createProject({
        input: {
          name: 'test project name',
        },
      });
      projectId = createProjectResponse.data.id;

      const createProjectInvitationResponse =
        await projectInvitationTestHelper.createProjectInvitation({
          input: {
            inviteeUserId: 'test2',
            projectId: projectId,
          },
        });

      projectInvitationId = createProjectInvitationResponse.data.id;
    });

    it('should accept project invitation', async () => {
      const response =
        await projectInvitationTestHelper.acceptProjectInvitation({
          input: {
            id: projectInvitationId,
          },
        });

      expect(response.success).toBe(true);
    });
  });

  describe('Reject project invitation ', () => {
    let projectId: string;
    let projectInvitationId: string;
    beforeAll(async () => {
      const createProjectResponse = await projectTestHelper.createProject({
        input: {
          name: 'test project name',
        },
      });
      projectId = createProjectResponse.data.id;

      const createProjectInvitationResponse =
        await projectInvitationTestHelper.createProjectInvitation({
          input: {
            inviteeUserId: 'test2',
            projectId: projectId,
          },
        });

      projectInvitationId = createProjectInvitationResponse.data.id;
    });

    it('should reject project invitation', async () => {
      const response =
        await projectInvitationTestHelper.rejectProjectInvitation({
          input: {
            id: projectInvitationId,
          },
        });

      expect(response.success).toBe(true);
    });
  });
});
