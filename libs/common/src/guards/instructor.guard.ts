// import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
// import { AppJwtService } from "../jwt/jwt.service";
// import { Request } from "express";


// @Injectable()
// export class JwtAuthGuard implements CanActivate {
//     constructor(private readonly jwtService: AppJwtService) { }

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const request = context.switchToHttp().getRequest<Request>();

//         const user = request.user;

//         if(user?.role === 'Instructor'){
//             return true
//         }

//         return false;

//         const token = this.jwtService.extractToken(request);

//         if (!token) {
//             throw new UnauthorizedException('Authorization token missing');
//         }

//         try {
//             const payload = await this.jwtService.verifyAccessToken(token);

//             request.user = payload;


//             return true;
//         } catch (error) {
//             throw new UnauthorizedException('Invalid or expired token');
//         }
//     }
// }