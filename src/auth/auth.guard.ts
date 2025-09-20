import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const authorization = request.headers.authorization; // 'Bearer <token>'
      const token = authorization?.split(' ')[1];
  
      if (!token) {
        throw new UnauthorizedException('No token provided');
      }
  
      try {
        const tokenPayload = await this.jwtService.verifyAsync(token);
        request.user = {
          userId: tokenPayload.sub,
          username: tokenPayload.username,
        };
        return true;
      } catch (error) {
        throw new UnauthorizedException('Invalid or expired token');
      }
    }
  }
  