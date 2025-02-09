import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { GraphQLTestHelper } from './graphql-helper/graphql.helper';
import { CategoryTestHelper } from './graphql-helper/operations/category.operations';
import { AuthTestHelper } from './graphql-helper/operations/auth.operations';
import { ProjectTestHelper } from './graphql-helper/operations/project.operations';
import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@user/user.module';
import { ProjectModule } from '@project/project.module';
import { authGrpcTestServerOptions } from './options/auth-grpc-test-server.options';
import { UserTestHelper } from './graphql-helper/operations/user.operations';

describe('Category Resolver (e2e)', () => {
  let app: INestApplication;
  let graphQLTestHelper: GraphQLTestHelper;
  let categoryTestHelper: CategoryTestHelper;
  let userTestHelper: UserTestHelper;
  let authTestHelper: AuthTestHelper;
  let projectTestHelper: ProjectTestHelper;
  let accessToken: string;
  let projectId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        // 필요한 모듈들 import
        AuthModule,
        UserModule,
        ProjectModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.connectMicroservice(authGrpcTestServerOptions);
    await app.startAllMicroservices();
    await app.init();

    graphQLTestHelper = new GraphQLTestHelper(app);
    categoryTestHelper = new CategoryTestHelper(graphQLTestHelper);
    authTestHelper = new AuthTestHelper(graphQLTestHelper);
    userTestHelper = new UserTestHelper(graphQLTestHelper);
    projectTestHelper = new ProjectTestHelper(graphQLTestHelper);

    const ownerEmail = `test${Date.now()}@test.com`;
    const password = `testpassword@!`;
    const nicknane = `testnickname`;

    const userResponse = await userTestHelper.createUser({
      input: {
        email: ownerEmail,
        nickname: nicknane,
        password: password,
      },
    });

    // 테스트 사용자 로그인
    const loginResponse = await authTestHelper.login({
      input: {
        email: ownerEmail,
        password: password,
      },
    });

    accessToken = loginResponse.data.accessToken;

    // 테스트용 프로젝트 생성
    const projectResponse = await projectTestHelper.createProject(
      {
        input: {
          name: 'Test Project',
        },
      },
      accessToken,
    );
    projectId = projectResponse.data.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Create Category (Mutation)', () => {
    it('should create category successfully', async () => {
      const response = await categoryTestHelper.createCategory(
        {
          input: {
            projectId,
            name: 'Test Category',
          },
        },
        accessToken,
      );

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('id');
      expect(response.data.name).toBe('Test Category');
      expect(response.data.projectId).toBe(projectId);
    });
  });

  describe('Query Category (Query)', () => {
    let createdCategoryId: string;
    beforeEach(async () => {
      const categoryName = 'test category name';

      const categoryResponse = await categoryTestHelper.createCategory(
        {
          input: {
            projectId,
            name: categoryName,
          },
        },
        accessToken,
      );

      createdCategoryId = categoryResponse.data.id;
    });
    it('should return categories for project', async () => {
      const response = await categoryTestHelper.queryCategory(
        {
          input: {
            id: createdCategoryId,
          },
        },
        accessToken,
      );

      expect(response.success).toBe(true);
    });
  });

  describe('Delete Category (Mutation)', () => {
    let createdCategoryId: string;
    beforeEach(async () => {
      const categoryName = 'test category name';
      const categoryResponse = await categoryTestHelper.createCategory(
        {
          input: {
            name: categoryName,
            projectId,
          },
        },
        accessToken,
      );

      createdCategoryId = categoryResponse.data.id;
    });

    it('should delete category', async () => {
      const deleteCategoryResponse = await categoryTestHelper.deleteCategory(
        {
          input: {
            id: createdCategoryId,
          },
        },
        accessToken,
      );

      expect(deleteCategoryResponse.success).toBe(true);
    });
  });

  describe('Update Category (Mutation)', () => {
    let createdCategoryId: string;
    beforeEach(async () => {
      const categoryName = 'test category name';
      const categoryResponse = await categoryTestHelper.createCategory(
        {
          input: {
            name: categoryName,
            projectId,
          },
        },
        accessToken,
      );
      createdCategoryId = categoryResponse.data.id;
    });

    it('should update category', async () => {
      const categoryName = 'updated category name';
      const updateCategoryResponse =
        await categoryTestHelper.changeCategoryName(
          {
            input: {
              id: createdCategoryId,
              name: categoryName,
            },
          },
          accessToken,
        );

      expect(updateCategoryResponse.data).toHaveProperty('name', categoryName);
    });
  });
});
