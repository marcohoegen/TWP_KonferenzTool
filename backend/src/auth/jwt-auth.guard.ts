import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class JwtUserAuthGuard extends AuthGuard('userjwt') {}

@Injectable()
export class JwtEitherAuthGuard {
  constructor(
    private readonly adminGuard: JwtAuthGuard,
    private readonly userGuard: JwtUserAuthGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Versuch: Admin-JWT
      const admin = await this.adminGuard.canActivate(context);
      if (admin) return true;
    } catch (err) {
      // ignore admin guard errors and try user guard
    }

    try {
      // Versuch: User-JWT
      const user = await this.userGuard.canActivate(context);
      if (user) return true;
    } catch (err) {
      // ignore user guard errors and fail below
    }

    throw new UnauthorizedException('Admin or User token required');
  }
}
