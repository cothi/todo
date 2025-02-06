import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectModule } from '@project/project.module';
import { UserModule } from '../../user/src/user.module';
import { GraphQLTestHelper } from './graphql-helper/graphql.helper';
import { ProjectTestHelper } from './graphql-helper/operations/project.operations';

describe('project resolver (e2e)', () => {
  let app: INestApplication;
  let graphQLTestHelper: GraphQLTestHelper;
  let projectTestHelper: ProjectTestHelper;
  let createdProjectId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProjectModule, UserModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    graphQLTestHelper = new GraphQLTestHelper(app);
    projectTestHelper = new ProjectTestHelper(graphQLTestHelper);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Create project', () => {
    it('should create project', async () => {
      const response = await projectTestHelper.createProject({
        input: {
          name: 'test name',
        },
      });

      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('name', 'test name');
    });
  });

  describe('Delete project', () => {
    let createdProjectId: string;
    beforeEach(async () => {
      const response = await projectTestHelper.createProject({
        input: {
          name: 'test name',
        },
      });
      createdProjectId = response.data.id;
    });

    it('should delete project', async () => {
      const response = await projectTestHelper.deleteProject({
        input: {
          projectId: createdProjectId,
        },
      });

      expect(response.success).toBe(true);
    });

    it('should fail to retry that delete project after delete project', async () => {
      const response = await projectTestHelper.deleteProject({
        input: {
          projectId: createdProjectId,
        },
      });

      try {
        await projectTestHelper.deleteProject({
          input: {
            projectId: createdProjectId,
          },
        });

        fail('should fail');
      } catch (error) {
        expect(error.success).toBe(false);
      }
    });
  });

  describe('Query project', () => {
    let createdProjectId: string;

    beforeAll(async () => {
      const response = await projectTestHelper.createProject({
        input: {
          name: 'test name',
        },
      });
      createdProjectId = response.data.id;
    });
    it('should query project', async () => {
      const response = await projectTestHelper.queryProject({
        input: {
          projectId: createdProjectId,
        },
      });

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('id', createdProjectId);
    });
  });

  describe('Update project', () => {
    let createdProjectId: string;
    beforeAll(async () => {
      const response = await projectTestHelper.createProject({
        input: {
          name: 'test name',
        },
      });
      createdProjectId = response.data.id;
    });
    it('should update project', async () => {
      const response = await projectTestHelper.updateProject({
        input: {
          projectId: createdProjectId,
          name: 'test name2',
        },
      });
      expect(response.data).toHaveProperty('name', 'test name2');
    });
  });
});
