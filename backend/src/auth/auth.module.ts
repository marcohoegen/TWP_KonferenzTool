import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { AdminController } from 'src/admin/admin.controller';
import { AdminModule } from 'src/admin/admin.module';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { JwtUserStrategy } from './jwt-user.strategy';
import { UserModule } from 'src/user/user.module';
import { UserController } from 'src/user/user.controller';

@Module({
  imports: [
    AdminModule,
    UserModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: parseInt(process.env.JWT_EXPIRES_IN ?? '86400') || '86400',
      },
    }),
  ],
  controllers: [AdminController, UserController],
  providers: [AuthService, JwtStrategy, JwtUserStrategy],
  exports: [AuthService],
})
export class AuthModule {}
