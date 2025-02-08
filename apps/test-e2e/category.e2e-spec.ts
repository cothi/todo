import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { GraphQLTestHelper } from './graphql-helper/graphql.helper';
import { CategoryTestHelper } from './graphql-helper/operations/category.operations';
import { AuthTestHelper } from './graphql-helper/operations/auth.operations';
import { ProjectTestHelper } from './graphql-helper/operations/project.operations';

describe('Category Resolver (e2e)', () => {
  let app: INestApplication;
  let graphQLTestHelper: GraphQLTestHelper;
  let categoryTestHelper: CategoryTestHelper;
  let authTestHelper: AuthTestHelper;
  let projectTestHelper: ProjectTestHelper;
  let accessToken: string;
  let projectId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        // 필요한 모듈들 import
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    graphQLTestHelper = new GraphQLTestHelper(app);
    categoryTestHelper = new CategoryTestHelper(graphQLTestHelper);
    authTestHelper = new AuthTestHelper(graphQLTestHelper);
    projectTestHelper = new ProjectTestHelper(graphQLTestHelper);

    // 테스트 사용자 로그인
    const loginResponse = await authTestHelper.login({
      input: {
        email: 'test@example.com',
        password: 'password123',
      },
    });
    accessToken = loginResponse.data.accessToken;

    // 테스트용 프로젝트 생성
    const projectResponse = await projectTestHelper.createProject({
      input: {
        name: 'Test Project',
      },
    });
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
            color: '#FF0000',
          },
        },
        accessToken,
      );

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('id');
      expect(response.data.name).toBe('Test Category');
      expect(response.data.projectId).toBe(projectId);
      expect(response.data.color).toBe('#FF0000');
    });
  });

  describe('Query Categories (Query)', () => {
    it('should return categories for project', async () => {
      const response = await categoryTestHelper.queryCategories(
        {
          input: {
            projectId,
          },
        },
        accessToken,
      );

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data.categories)).toBe(true);
    });
  });

  // 추가 테스트 케이스들...
});
