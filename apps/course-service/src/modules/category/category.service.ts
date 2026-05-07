import { ApiResponse, DatabaseService, IPgQuery, ResponseUtil, StorageService } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryService {

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly storageService: StorageService
    ) { }

    async getCategories(): Promise<ApiResponse> {

        const pgQuery: IPgQuery = {
            query: `SELECT * FROM fn_get_categories()`,
            params:[]
        }
        return ResponseUtil.success(
              ''
        
            )

    }



}
