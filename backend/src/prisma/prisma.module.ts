// filepath: /home/s2mahoeg/confeed/TWP_KonferenzTool/backend/src/prisma/prisma.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Exportiere PrismaService für andere Module
})
export class PrismaModule {}
