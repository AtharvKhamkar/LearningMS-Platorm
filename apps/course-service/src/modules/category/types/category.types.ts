import { ApiResponse } from "@app/common";

export interface ISqlFnResult<T> extends ApiResponse<T> { }


export type FnGetCategoriesResult = ISqlFnResult<CategoriesData>;

export interface CategoriesData {
    categories: CategoryDetails[];
}

export interface CategoryDetails {
    id: string;
    name: string;
    count: number;
    createdAt: string;
    updatedAt: string
}

export type FnCreateCategoryResult = ISqlFnResult<{
    categoryId: string
}>;

export type FnUpdateCategoryResult = ISqlFnResult<{
    categoryId: string
}>;

export type FnEnableDisableCategoryResult = ISqlFnResult<{
    categoryId: string;
    isDisabled: boolean
}>;
