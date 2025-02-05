import { JwtAuthGuard } from '@libs/jwt';
import { ResponseManager } from '@libs/response';
import { UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoryPresentationMapper } from '@project/presentation/mapper/category.presentation.mapper';
import {
  ChangeCategoryNameInput,
  CreateCategoryInput,
  DeleteCategoryInput,
  QueryCategoryByIdInput,
} from '@project/presentation/resolver/input/category.input';
import {
  ChangeCategoryNameResponse,
  CreateCategoryResponse,
  DeleteCategoryResponse,
  QueryCategoryByIdResponse,
} from '@project/presentation/resolver/response/category.response';

@Resolver('category')
export class CategoryResolver {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Mutation(() => CreateCategoryResponse)
  @UseGuards(JwtAuthGuard)
  async createCategory(
    @Args('input') input: CreateCategoryInput,
  ): Promise<CreateCategoryResponse> {
    const command =
      CategoryPresentationMapper.createCategoryInputToCreateCategoryCommand(
        input,
      );
    const result = await this.commandBus.execute(command);
    const output =
      CategoryPresentationMapper.entityToCreateCategoryOutput(result);
    return ResponseManager.success(output);
  }

  @Mutation(() => DeleteCategoryResponse)
  @UseGuards(JwtAuthGuard)
  async deleteCategory(
    @Args('input') input: DeleteCategoryInput,
  ): Promise<DeleteCategoryResponse> {
    const command =
      CategoryPresentationMapper.deleteCategoryInputToDeleteCategoryCommand(
        input,
        'test',
      );
    const result = await this.commandBus.execute(command);
    const output =
      CategoryPresentationMapper.entityToDeleteCategoryOutput(result);
    return ResponseManager.success(output);
  }

  @Mutation(() => ChangeCategoryNameResponse)
  @UseGuards(JwtAuthGuard)
  async changeCategoryName(
    @Args('input') input: ChangeCategoryNameInput,
  ): Promise<ChangeCategoryNameResponse> {
    const command =
      CategoryPresentationMapper.changeCategoryNameInputToUpdateCategoryCommand(
        input,
        'test',
      );
    const result = await this.commandBus.execute(command);
    const output =
      CategoryPresentationMapper.entityToUpdateCategoryOutput(result);
    return ResponseManager.success(output);
  }

  @Query(() => QueryCategoryByIdResponse)
  @UseGuards(JwtAuthGuard)
  async queryCategoryById(
    @Args('input') input: QueryCategoryByIdInput,
  ): Promise<QueryCategoryByIdResponse> {
    const query =
      CategoryPresentationMapper.queryCategoryByIdInputToQueryCategory(
        input,
        'test',
      );
    const result = await this.queryBus.execute(query);
    const output =
      CategoryPresentationMapper.entityToQueryCategoryByIdOutput(result);
    return ResponseManager.success(output);
  }
}
