import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { ConferenceModule } from './conference/conference.module';
import { PresentationModule } from './presentation/presentation.module';
import { UserModule } from './user/user.module';
import { RatingModule } from './rating/rating.module';

@Module({
  imports: [
    AdminModule,
    UserModule,
    RatingModule,
    ConferenceModule,
    PresentationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
