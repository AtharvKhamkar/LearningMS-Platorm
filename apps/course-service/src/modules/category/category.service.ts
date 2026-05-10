import { ApiResponse, DatabaseService, IPgQuery, ResponseUtil, StorageService } from '@app/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryDetails, FnCreateCategoryResult, FnGetCategoriesResult } from './types/category.types';
import { GetCategoryResponseEntity } from './entities/get-categories-response.entity';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CreateCategoryResponseEntity } from './entities/create-category-response.entity';

@Injectable()
export class CategoryService {

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly storageService: StorageService
    ) { }

    async getCategories(): Promise<ApiResponse> {

        const pgQuery: IPgQuery = {
            query: `SELECT * FROM fn_get_categories()`,
            params: []
        }

        const queryResult = await this.databaseService.queryOne<FnGetCategoriesResult>(pgQuery);

        if (!queryResult?.success) {
            throw new BadRequestException(
                queryResult?.message || "Failed to fetch categories"
            );
        }

        const resultData = queryResult?.data;
        const categoryData = resultData?.categories || [];


        return ResponseUtil.success(
            queryResult.message,
            new GetCategoryResponseEntity({
                categories: categoryData
            })

        )

    }

    async createCategory(userId: string, dto: CreateCategoryDto): Promise<ApiResponse> {

        const pgQuery: IPgQuery = {
            query: `SELECT * FROM fn_create_category($1, $2, $3)`,
            params: [
                dto.name,
                dto.description,
                userId
            ]
        }

        const queryResult = await this.databaseService.queryOne<FnCreateCategoryResult>(pgQuery);

        if (!queryResult?.success) {
            throw new BadRequestException(
                queryResult?.message || "Failed to create categories"
            );
        }


        return ResponseUtil.success(
            queryResult.message,
            new CreateCategoryResponseEntity({
                categoryId: queryResult?.data?.categoryId
            })

        )

    }



}
