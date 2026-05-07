import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { CheckPermissions, JwtAuthGuard, Permissions, PermissionsGuard } from '@app/common';
import { CategoryService } from './category.service';

@Controller('/category')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @CheckPermissions(Permissions.CATEGORY_VIEW)
    @Get()
    @ApiOkResponse({})
    async getCategories(
    ) {
      return this.categoryService.getCategories();
    }

}
