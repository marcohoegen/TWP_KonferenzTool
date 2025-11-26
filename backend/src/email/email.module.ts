import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [EmailController],
  imports: [UserModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
