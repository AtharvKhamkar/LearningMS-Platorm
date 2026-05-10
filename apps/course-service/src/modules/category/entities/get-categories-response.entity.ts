import { ApiProperty } from "@nestjs/swagger";
import { CategoryDetails } from "../types/category.types";

export class GetCategoryEntity {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    count: number;

    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    updatedAt: string;

    constructor(partial: Partial<GetCategoryEntity>) {
        Object.assign(this, partial);
    }
}

export class GetCategoryResponseEntity{
    @ApiProperty({ type: GetCategoryEntity })
    categories: CategoryDetails[];

    constructor(partial: Partial<GetCategoryResponseEntity>){
        Object.assign(this,partial)
    }
}