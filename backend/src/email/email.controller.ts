import {
  Controller,
  Post,
  Body,
  NotFoundException,
  ParseIntPipe,
  Param,
  UseGuards,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { UserService } from 'src/user/user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly userService: UserService,
  ) {}

  //send a code-mail to a specific user
  @UseGuards(JwtAuthGuard)
  @Post('send-code')
  async sendCodeEmail(@Body('email') email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    await this.emailService.sendOneCodeByEmail(user);
    return { message: `Code email sent to ${email}` };
  }
  @UseGuards(JwtAuthGuard)
  @Post('send-code/:userId')
  async sendOneCodeByUserId(@Param('userId', ParseIntPipe) userId: number) {
    await this.emailService.sendOneCodeByUserId(userId);
    return {
      success: true,
      message: `Code email sent to user with ID ${userId}`,
    };
  }
}
