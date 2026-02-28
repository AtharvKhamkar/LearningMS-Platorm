import { SetMetadata } from "@nestjs/common";

export const permissionsKey = 'permissions'

export const CheckPermissions = (...permissions: string[]) => SetMetadata(permissionsKey, permissions);