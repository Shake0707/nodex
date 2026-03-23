import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const session = request.session;

        if (!session || !session.isAuthenticated) {
            throw new UnauthorizedException('Tizimga kiring');
        }

        return true;
    }
}
