import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { AdminController } from 'src/admin/admin.controller';
import { AdminModule } from 'src/admin/admin.module';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [
    AdminModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: parseInt(process.env.JWT_EXPIRES_IN ?? '86400') || '86400',
      },
    }),
  ],
  controllers: [AdminController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
