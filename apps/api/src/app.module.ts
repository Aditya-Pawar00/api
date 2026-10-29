import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { EhrController } from './ehr.controller';
import { EhrService } from './ehr.service';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
  ],
  controllers: [AppointmentsController, EhrController, ChatController, AiController],
  providers: [PrismaService, AppointmentsService, EhrService, ChatService, AiService],
})
export class AppModule {}