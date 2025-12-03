import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class JwtUserAuthGuard extends AuthGuard('userjwt') {}

@Injectable()
export class JwtEitherAuthGuard implements CanActivate {
  constructor(
    private readonly adminGuard: JwtAuthGuard,
    private readonly userGuard: JwtUserAuthGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Normalize possible boolean or Promise<boolean> returns from inner guards
    try {
      const adminResult = this.adminGuard.canActivate(context);
      const admin = await Promise.resolve(
        adminResult as boolean | Promise<boolean>,
      );
      if (admin) return true;
    } catch (err) {
      // ignore admin guard errors and try user guard
    }

    try {
      const userResult = this.userGuard.canActivate(context);
      const user = await Promise.resolve(
        userResult as boolean | Promise<boolean>,
      );
      if (user) return true;
    } catch (err) {
      // ignore user guard errors and fail below
    }

    throw new UnauthorizedException('Admin or User token required');
  }
}
