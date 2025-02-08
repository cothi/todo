import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectModule } from '@project/project.module';
import { ProjectTestHelper } from '../project/test/graphql-helper/operations/project.operations';
import { CategoryTestHelper } from '../project/test/graphql-helper/operations/category.operations';
import { TaskTestHelper } from '../project/test/graphql-helper/operations/task.operations';
import { GraphQLTestHelper } from './graphql-helper/graphql.helper';

describe('Task resolver (e2e)', () => {
  let app: INestApplication;
  let graphQLTestHelper: GraphQLTestHelper;
  let projectTestHelper: ProjectTestHelper;
  let categoryTestHelper: CategoryTestHelper;
  let taskTestHelper: TaskTestHelper;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProjectModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    graphQLTestHelper = new GraphQLTestHelper(app);
    projectTestHelper = new ProjectTestHelper(graphQLTestHelper);
    categoryTestHelper = new CategoryTestHelper(graphQLTestHelper);
    taskTestHelper = new TaskTestHelper(graphQLTestHelper);
  });
  afterAll(async () => {
    await app.close();
  });

  describe('Create Task', () => {
    let projectId: string;
    let categoryId: string;

    beforeEach(async () => {
      const projectResponse = await projectTestHelper.createProject({
        input: {
          name: 'test project name',
        },
      });
      projectId = projectResponse.data.id;

      const categoryResponse = await categoryTestHelper.createCategory({
        input: {
          name: 'test category name',
          projectId: projectId,
        },
      });

      categoryId = categoryResponse.data.id;
    });

    it('should create task', async () => {
      const response = await taskTestHelper.createTask({
        input: {
          categoryId: categoryId,
          startDate: new Date().toDateString(),
          endDate: new Date().toDateString(),
          title: 'test task name',
        },
      });

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('title', 'test task name');
    });
  });

  describe('Delete Task', () => {
    let projectId: string;
    let categoryId: string;
    let taskId: string;

    beforeEach(async () => {
      const projectResponse = await projectTestHelper.createProject({
        input: {
          name: 'test project name',
        },
      });
      projectId = projectResponse.data.id;

      const categoryResponse = await categoryTestHelper.createCategory({
        input: {
          name: 'test category name',
          projectId: projectId,
        },
      });

      categoryId = categoryResponse.data.id;

      const taskResponse = await taskTestHelper.createTask({
        input: {
          categoryId,
          endDate: new Date().toDateString(),
          startDate: new Date().toDateString(),
          title: 'test task name',
        },
      });

      taskId = taskResponse.data.id;
    });

    it('should delete task', async () => {
      const response = await taskTestHelper.deleteTask({
        input: {
          id: taskId,
        },
      });

      expect(response.success).toBe(true);
    });
  });

  describe('Query task', () => {
    let projectId: string;
    let categoryId: string;
    let taskId: string;

    beforeEach(async () => {
      const projectResponse = await projectTestHelper.createProject({
        input: {
          name: 'test project name',
        },
      });
      projectId = projectResponse.data.id;

      const categoryResponse = await categoryTestHelper.createCategory({
        input: {
          name: 'test category name',
          projectId: projectId,
        },
      });

      categoryId = categoryResponse.data.id;

      const taskResponse = await taskTestHelper.createTask({
        input: {
          categoryId,
          endDate: new Date().toDateString(),
          startDate: new Date().toDateString(),
          title: 'test task name',
        },
      });

      taskId = taskResponse.data.id;
    });

    it('query task', async () => {
      const response = await taskTestHelper.queryTask({
        input: {
          id: taskId,
        },
      });

      expect(response.data).toHaveProperty('id', taskId);
    });
  });

  describe('Update task', () => {
    let projectId: string;
    let categoryId: string;
    let taskId: string;

    beforeEach(async () => {
      const projectResponse = await projectTestHelper.createProject({
        input: {
          name: 'test project name',
        },
      });
      projectId = projectResponse.data.id;

      const categoryResponse = await categoryTestHelper.createCategory({
        input: {
          name: 'test category name',
          projectId: projectId,
        },
      });

      categoryId = categoryResponse.data.id;

      const taskResponse = await taskTestHelper.createTask({
        input: {
          categoryId,
          endDate: new Date().toDateString(),
          startDate: new Date().toDateString(),
          title: 'test task name',
        },
      });

      taskId = taskResponse.data.id;
    });

    it('should update task', async () => {
      const changeName = 'change name';
      const response = await taskTestHelper.updateTask({
        input: {
          id: taskId,
          title: changeName,
        },
      });

      expect(response.data).toHaveProperty('title', changeName);
    });
  });
});
