import { ProjectMembership } from '@project/domain/entity/project-membership.entity';
import { Project } from '@project/domain/entity/project.entity';

export type CreateProjectParams = Pick<Project, 'adminId' | 'name'>;

export type DeleteProjectParams = Pick<Project, 'adminId' | 'id'>;
// project Id , request user Id,

export type UpdateProjectParams = Pick<Project, 'adminId' | 'name' | 'id'>;

export type QueryProjectsByUserIdParams = Pick<ProjectMembership, 'userId'>;

export type QueryProjectParams = Pick<Project, 'id'> & { userId: string };

export type QueryProjectByTaskIdParams = {
  categoryId: string;
};

export type ValidateOwnerByCategoryIdParams = Pick<Project, 'id'> & {
  reqUserId: string;
};
