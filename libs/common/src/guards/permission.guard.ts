import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { permissionsKey } from "../decorators/permission.decorator";
import { JwtPayload } from "../jwt/jwt.types";

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
            permissionsKey,
            [context.getHandler(), context.getClass()]
        );

        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }


        const request = context.switchToHttp().getRequest();

        const user: JwtPayload = request.user;

        if (!user.permissions) {
            throw new ForbiddenException('Permissions Missing');
        }

        if (user.role === 'Admin') {
            return true;
        }

        const hasPermissions = requiredPermissions.every(
            (per) => user.permissions.includes(per)
        )

        if (!hasPermissions) {
            throw new ForbiddenException(
                'You do not have permission to perform this action.'
            )
        }

        return true;
    }
}