import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { CheckPermissions, CurrentUser, JwtAuthGuard, Permissions, PermissionsGuard } from '@app/common';
import type { JwtPayload } from '@app/common';
import { CategoryService } from './category.service';
import { GetCategoryResponseEntity } from './entities/get-categories-response.entity';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CreateCategoryResponseEntity } from './entities/create-category-response.entity';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { UpdateCategoryResponseDto } from './entities/update-category-response-entity';

@Controller('/category')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @CheckPermissions(Permissions.CATEGORY_VIEW)
  @Get()
  @ApiOkResponse({ type: GetCategoryResponseEntity })
  async getCategories(
  ) {
    return this.categoryService.getCategories();
  }

  @CheckPermissions(Permissions.CATEGORY_CREATE)
  @Post()
  @ApiBody({ type: CreateCategoryDto })
  @ApiOkResponse({ type: CreateCategoryResponseEntity })
  async createCategory(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateCategoryDto,

  ) {
    const userId = user.sub;
    return this.categoryService.createCategory(userId, dto);
  }

  @CheckPermissions(Permissions.CATEGORY_UPDATE)
  @Put(':id')
  @ApiBody({ type: UpdateCategoryDto })
  @ApiOkResponse({ type: UpdateCategoryResponseDto })
  async updateCategory(
    @CurrentUser() user: JwtPayload,
    @Param('id') categoryId: string,
    @Body() dto: UpdateCategoryDto,

  ) {
    const userId = user.sub;
    return this.categoryService.updateCategory(userId, categoryId, dto);
  }
}
