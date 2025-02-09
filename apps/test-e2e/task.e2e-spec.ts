import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectModule } from '@project/project.module';

import { GraphQLTestHelper } from './graphql-helper/graphql.helper';
import { ProjectTestHelper } from './graphql-helper/operations/project.operations';
import { CategoryTestHelper } from './graphql-helper/operations/category.operations';
import { TaskTestHelper } from './graphql-helper/operations/task.operations';
import { UserTestHelper } from './graphql-helper/operations/user.operations';
import { AuthTestHelper } from './graphql-helper/operations/auth.operations';
import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@user/user.module';
import { authGrpcTestServerOptions } from './options/auth-grpc-test-server.options';

describe('Task resolver (e2e)', () => {
  let app: INestApplication;
  let graphQLTestHelper: GraphQLTestHelper;
  let projectTestHelper: ProjectTestHelper;
  let categoryTestHelper: CategoryTestHelper;
  let taskTestHelper: TaskTestHelper;
  let userTestHelper: UserTestHelper;
  let authTestHelper: AuthTestHelper;
  let accessToken: string;
  let createdProjectId: string;
  let createdCategoryId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, UserModule, ProjectModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.connectMicroservice(authGrpcTestServerOptions);
    await app.startAllMicroservices();
    await app.init();

    graphQLTestHelper = new GraphQLTestHelper(app);
    projectTestHelper = new ProjectTestHelper(graphQLTestHelper);
    categoryTestHelper = new CategoryTestHelper(graphQLTestHelper);
    taskTestHelper = new TaskTestHelper(graphQLTestHelper);
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

    const createdProjectResponse = await projectTestHelper.createProject(
      {
        input: {
          name: 'create project name',
        },
      },
      accessToken,
    );
    createdProjectId = createdProjectResponse.data.id;

    const createdCategoryResponse = await categoryTestHelper.createCategory(
      {
        input: {
          name: 'create category name',
          projectId: createdProjectId,
        },
      },
      accessToken,
    );

    createdCategoryId = createdCategoryResponse.data.id;
  });
  afterAll(async () => {
    await app.close();
  });
  describe('Create Task (mutation)', () => {
    it('should create task', async () => {
      const response = await taskTestHelper.createTask(
        {
          input: {
            categoryId: createdCategoryId,
            startDate: new Date().toDateString(),
            endDate: new Date().toDateString(),
            title: 'test task name',
          },
        },
        accessToken,
      );

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('title', 'test task name');
    });
  });

  describe('Delete Task (mutation)', () => {
    let taskId: string;

    beforeEach(async () => {
      const taskResponse = await taskTestHelper.createTask(
        {
          input: {
            categoryId: createdCategoryId,
            endDate: new Date().toDateString(),
            startDate: new Date().toDateString(),
            title: 'test task name',
          },
        },
        accessToken,
      );

      taskId = taskResponse.data.id;
    });

    it('should delete task', async () => {
      const response = await taskTestHelper.deleteTask(
        {
          input: {
            id: taskId,
          },
        },
        accessToken,
      );

      expect(response.success).toBe(true);
    });
  });

  describe('Query task (mutation)', () => {
    let taskId: string;

    beforeEach(async () => {
      const taskResponse = await taskTestHelper.createTask(
        {
          input: {
            categoryId: createdCategoryId,
            endDate: new Date().toDateString(),
            startDate: new Date().toDateString(),
            title: 'test task name',
          },
        },
        accessToken,
      );

      taskId = taskResponse.data.id;
    });

    it('query task', async () => {
      const response = await taskTestHelper.queryTaskById(
        {
          input: {
            id: taskId,
          },
        },
        accessToken,
      );

      expect(response.data).toHaveProperty('id', taskId);
    });
  });

  describe('Update task (mutation)', () => {
    let taskId: string;

    beforeEach(async () => {
      const taskResponse = await taskTestHelper.createTask(
        {
          input: {
            categoryId: createdCategoryId,
            endDate: new Date().toDateString(),
            startDate: new Date().toDateString(),
            title: 'test task name',
          },
        },
        accessToken,
      );

      taskId = taskResponse.data.id;
    });

    it('should update task', async () => {
      const changeName = 'change name';
      const response = await taskTestHelper.updateTask(
        {
          input: {
            id: taskId,
            title: changeName,
          },
        },
        accessToken,
      );

      expect(response.data).toHaveProperty('title', changeName);
    });
  });
});
